import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogined = signal<boolean>(false);
  user = signal<any>(null);

  login(user: any) {
    this.isLogined.set(true);
    this.user.set(user);
  }

  logout() {
    this.isLogined.set(false);
    this.user.set(null);
  }
}
