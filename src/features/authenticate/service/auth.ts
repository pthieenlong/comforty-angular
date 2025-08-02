import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLogined = signal<boolean>(false);
  private _user = signal<any>(null);

  readonly isLogined = computed(() => this._isLogined());
  readonly user = computed(() => this._user());
  readonly isAdmin = computed(() => this._user()?.roles[0] === 'ADMIN');  
  
  login(user: any) {
    this._isLogined.set(true);
    this._user.set(user.data);
    console.log(this.isAdmin());
    
  }

  logout() {
    this._isLogined.set(false);
    this._user.set(null);
  }
}
