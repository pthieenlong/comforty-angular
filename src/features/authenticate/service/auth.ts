import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLogined = signal<boolean>(this.getStoredLoginState());
  private _user = signal<any>(this.getStoredUser());

  readonly isLogined = computed(() => this._isLogined());
  readonly user = computed(() => this._user());
  readonly isAdmin = computed(() => {
    const user = this._user();
    console.log('Checking admin - User:', user);
    console.log('User roles:', user?.roles);
    console.log('First role:', user?.roles?.[0]);
    return user?.roles?.[0] === 'ADMIN';
  });

  private getStoredLoginState(): boolean {
    try {
      return localStorage.getItem('isLogined') === 'true';
    } catch {
      return false;
    }
  }

  private getStoredUser(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private setStoredLoginState(isLogined: boolean): void {
    try {
      localStorage.setItem('isLogined', isLogined.toString());
    } catch (error) {
      console.error('Error storing login state:', error);
    }
  }

  private setStoredUser(user: any): void {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  login(user: any) {
    console.log('AuthService.login called with:', user);
    this._isLogined.set(true);
    this._user.set(user);

    // Persist to localStorage
    this.setStoredLoginState(true);
    this.setStoredUser(user);

    console.log('After login - isLogined:', this._isLogined());
    console.log('After login - user:', this._user());
    console.log('After login - isAdmin:', this.isAdmin());
  }

  logout() {
    this._isLogined.set(false);
    this._user.set(null);

    // Clear localStorage
    this.setStoredLoginState(false);
    this.setStoredUser(null);

    // Clear localStorage completely
    try {
      localStorage.removeItem('isLogined');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Method to check if user is still valid (optional)
  checkAuthStatus(): boolean {
    const isLogined = this.getStoredLoginState();
    const user = this.getStoredUser();

    if (isLogined && user) {
      this._isLogined.set(true);
      this._user.set(user);
      return true;
    } else {
      this.logout();
      return false;
    }
  }
}
