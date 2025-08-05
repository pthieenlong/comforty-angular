import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from 'features/cart/cart.service';
import { CheckoutService } from './checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ui/checkout.html',
  styleUrl: './ui/checkout.css'
})
export class Checkout {
  public cartService = inject(CartService);
  public checkoutSerice = inject(CheckoutService);
  public cart = this.cartService.cart;
  checkoutForm: FormGroup;
  isSuccess = false;
  countdown = signal(5);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      paymentMethod: ['payment'],
    });
  }
  public getCart() {
    return this.cartService.getCart();
  }

  public getCartTotal() {
    return this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  public moneyFormat(price: number) {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
  }
  onSubmit() {
    if (this.checkoutForm.valid) {
      this.checkoutSerice.onCheckout(this.checkoutForm.value, this.getCart(), this.getCartTotal());

      setTimeout(() => {
        this.isSuccess = true;
        this.startCountdown();
      }, 500);
    } else {
      this.checkoutForm.markAllAsTouched();
      
    }
  }
  isInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  startCountdown() {
    const interval = setInterval(() => {
      const value = this.countdown();
      if (value <= 1) {
        clearInterval(interval);
        this.router.navigate(['/']);
      } else {
        this.countdown.set(value - 1);
      }
    }, 1000);
  }
}
