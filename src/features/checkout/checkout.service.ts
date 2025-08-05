import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { CartService } from 'features/cart/cart.service';
import { API_URL } from 'types/const';
import { ICartItem } from 'types/interface/models';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private httpClient = inject(HttpClient);
  private cartService = inject(CartService);
  constructor(public auth: AuthService) {}
  onCheckout(formValue: any, items: ICartItem[], total: number) {
    const username = this.auth.checkAuthStatus() ? this.auth.getUser().username : undefined

    this.httpClient.post(`${API_URL}/order/checkout`, {
      ...formValue, items, username, total
    }).subscribe({
      next: (res: any) => {
        if(res.success) {
          this.cartService.clearCart();
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    })
  }

  
}
