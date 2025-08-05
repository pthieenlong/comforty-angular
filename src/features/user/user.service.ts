import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { CartService } from 'features/cart/cart.service';
import { CheckoutService } from 'features/checkout/checkout.service';
import { API_URL } from 'types/const';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  public checkoutService = inject(CheckoutService);
  public cart = this.cartService.cart;
  user = signal({} as any);
  orderHistories = signal({} as any);
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${API_URL}/user/${this.getUsername()}`).subscribe({
      next: (res: any) => {
        if(res.success) 
          this.user.set(res.data);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    this.httpClient.get(`${API_URL}/order/${this.getUsername()}`).subscribe({
      next: (res: any) => {
        if(res.success) 
          this.orderHistories.set(res.data);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  private getUsername() {
    return this.authService.getUser().username;
  }
  public getUser() {
    return this.user();
  }
  getCheckoutHistories() {
    return this.orderHistories();
  }
}
