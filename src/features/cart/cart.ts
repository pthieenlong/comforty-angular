import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';
import { ICartItem } from 'types/interface/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui/cart.html',
  styleUrl: './ui/cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  public cart = this.cartService.cart;

  remove(slug: string) {
    this.cartService.removeFromCart(slug);
  }
  increase(item: ICartItem) {
    this.cartService.updateQuantity(item.slug, item.quantity + 1);
  }
  decrease(item: ICartItem) {
    this.cartService.updateQuantity(item.slug, item.quantity - 1);
  }
  total() {
    return this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  public getCart() {
    return this.cartService.getCart();
  }
  public moneyFormat(price: number) {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;

  }
}
