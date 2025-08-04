import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { API_URL } from 'types/const';
import { ICart, ICartItem } from 'types/interface/models';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storageKey = 'guest_cart';
  private auth = inject(AuthService);
  private _cart = signal<ICartItem[]>(this.loadFromStorage());
  cart = computed(() => this._cart());

  constructor(private httpClient: HttpClient) {
    effect(() => {
      if (!this.auth.isLogined()) {
        this.saveToStorage(this._cart());
      } else {
        this.syncCartToServer();
      }
    });
  }
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
      this.addCartItemOnServer(item.slug);
    }
  }
  updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) return this.removeFromCart(slug);
    this._cart.update((items) =>
      items.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );
  }
  removeFromCart(slug: string) {
    this._cart.update((items) => items.filter((i) => i.slug !== slug));
    if (this.auth.isLogined()) {
      this.removeCartItemFromServer(slug);
    }
  }
  clearCart() {
    this._cart.set([]);
    this.clearStorage();
    if (this.auth.isLogined()) {
      this.syncCartToServer();
    }
  }
  replaceCart(items: ICartItem[]) {
    this._cart.set(items);
  }
  getCart() {
    return this._cart();
  }
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
  public syncCartToServer() {
    this.httpClient
      .post(`${API_URL}/cart/${this.auth.getUser()?.username}/sync`, {
        products: this.cart(),
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private addCartItemOnServer(slug: string) {
    this.httpClient
      .post(`${API_URL}/cart/${this.auth.getUser()?.username}/product`, {
        slug,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private decreaseCartItemOnServer(slug: string) {
    this.httpClient
      .patch(`${API_URL}/cart/${this.auth.getUser()?.username}/product`, {
        slug,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private removeCartItemFromServer(slug: string) {
    this.httpClient
      .delete(`${API_URL}/cart/${this.auth.getUser()?.username}/product`, {
        body: { slug },
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private clearCartOnServer() {}
}
