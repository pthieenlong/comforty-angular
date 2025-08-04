import { Inject, Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { ICart, ICartItem } from 'types/interface/models';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'guest_cart';
  private auth = inject(AuthService);
  private _cart = signal<ICartItem[]>(this.loadFromStorage());
  cart = computed(() => this._cart());

  constructor() {
    effect(() => {
      if(!this.auth.isLogined())
      this.saveToStorage(this._cart());
    })
  }
  addToCart(item: ICartItem) {
    console.log(`Add ${item.title} to cart.`);
    
    const existing = this._cart().find(product => product.slug === item.slug);

    if(existing) {
      this._cart.update(items => items.map(product => product.slug === item.slug ? { ...product, quantity: product.quantity + item.quantity} : product));
    } else {
      this._cart.update(items => [...items, item]);
    }
    console.log(this._cart())
    if(this.auth.isLogined()) {
      // gọi api lưu vào db
    }
  }
  updateQuantity(slug: string, quantity: number) {
    if(quantity <= 0) return this.removeFromCart(slug);
    this._cart.update(items => items.map(item => (item.slug === slug ? { ...item, quantity} : item)));
  }
  removeFromCart(slug: string) {
    this._cart.update(items => items.filter(i => i.slug !== slug))
  }
  clearCart() {
    this._cart.set([]);
    this.clearStorage();
    if(this.auth.isLogined()) {
      //gọi api clear cart
    }
  }
  replaceCart(items: ICartItem[]) {
    this._cart.set(items);
  }
  getCart() {
    return this._cart()
  }
  private saveToStorage(items: ICartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load cart from storage: ", error);
      return [];
    }
  }
  private clearStorage() {
    localStorage.removeItem(this.storageKey);
  }
}
