import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { API_URL } from 'types/const';
import { ICartItem } from 'types/interface/models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storageKey = 'guest_cart';
  private auth = inject(AuthService);
  private _cart = signal<ICartItem[]>(this.loadFromStorage());
  cart = computed(() => this._cart());

  constructor(private httpClient: HttpClient) {
    const isLoggedIn = this.auth.isLogined();

    if (isLoggedIn) {
      if (this._cart().length > 0) {
        // Đợi sync xong mới get cart
        this.syncCartToServer().add(() => {
          this.getCartFromServer();
        });
      } else {
        this.getCartFromServer();
      }
    }

    // Chỉ lưu local nếu chưa đăng nhập
    effect(() => {
      if (!this.auth.isLogined()) {
        this.saveToStorage(this._cart());
      }
    });
  }

  // Thêm sản phẩm
  addToCart(item: ICartItem) {
    console.log(`Add ${item.title} to cart.`);

    const existing = this._cart().find((product) => product.slug === item.slug);

    if (existing) {
      this._cart.update((items) =>
        items.map((product) =>
          product.slug === item.slug
            ? { ...product, quantity: product.quantity + item.quantity }
            : product
        )
      );
    } else {
      this._cart.update((items) => [...items, item]);
    }

    console.log(this._cart());

    if (this.auth.isLogined()) {
      this.addCartItemToServer(item.slug);
      // Không gọi getCartFromServer ở đây tránh ghi đè cart vừa update
    }
  }

  // Cập nhật số lượng
  updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) return this.removeFromCart(slug);

    this._cart.update((items) =>
      items.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );

    if (this.auth.isLogined()) {
      this.decreaseCartItemOnServer(slug);
    }
  }

  // Xoá sản phẩm
  removeFromCart(slug: string) {
    this._cart.update((items) => items.filter((i) => i.slug !== slug));

    if (this.auth.isLogined()) {
      this.removeCartItemFromServer(slug);
    }
  }

  // Xoá toàn bộ giỏ hàng
  public clearCart() {
    this._cart.set([]);
    if (!this.auth.isLogined()) {
      this.clearStorage();
    }
  }

  // Thay toàn bộ giỏ hàng
  replaceCart(items: ICartItem[]) {
    this._cart.set(items);
    if (!this.auth.isLogined()) {
      this.saveToStorage(items);
    }
  }

  getCart() {
    return this._cart();
  }

  // ========== Local Storage ==========
  private saveToStorage(items: ICartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load cart from storage: ', error);
      return [];
    }
  }

  private clearStorage() {
    localStorage.removeItem(this.storageKey);
  }

  // ========== Server API ==========
  public syncCartToServer() {
    const username = this.auth.getUser()?.username;
    return this.httpClient
      .post(`${API_URL}/cart/${username}/sync`, {
        products: this.cart(),
      })
      .subscribe({
        next: (res) => {
          console.log('Synced cart to server:', res);
        },
        error: (err) => {
          console.error('Sync cart error:', err);
        },
      });
  }

  private addCartItemToServer(slug: string) {
    const username = this.auth.getUser()?.username;
    this.httpClient
      .post(`${API_URL}/cart/${username}/product`, { slug })
      .subscribe({
        next: (res) => console.log('Add to server:', res),
        error: (err) => console.error('Add to server error:', err),
      });
  }

  private decreaseCartItemOnServer(slug: string) {
    const username = this.auth.getUser()?.username;
    this.httpClient
      .patch(`${API_URL}/cart/${username}/product`, { slug })
      .subscribe({
        next: (res) => console.log('Update quantity on server:', res),
        error: (err) => console.error('Update quantity error:', err),
      });
  }

  private removeCartItemFromServer(slug: string) {
    const username = this.auth.getUser()?.username;
    this.httpClient
      .delete(`${API_URL}/cart/${username}/product`, {
        body: { slug },
      })
      .subscribe({
        next: (res) => console.log('Removed from server:', res),
        error: (err) => console.error('Remove error:', err),
      });
  }

  private clearCartOnServer() {
    // Nếu có API clear toàn bộ giỏ hàng thì gọi tại đây
  }

  private getCartFromServer() {
    if (!this.auth.isLogined()) return;
    this.httpClient
      .get(`${API_URL}/cart/${this.auth.getUser()?.username}`)
      .subscribe({
        next: (res: any) => {
          console.log('Cart from server:', res.data); 
          this._cart.set(res.data.items);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
