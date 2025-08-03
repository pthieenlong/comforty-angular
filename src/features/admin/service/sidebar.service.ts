import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _sidebarToggle = signal(false);

  sidebarToggle = this._sidebarToggle.asReadonly();

  toggleSidebar() {
    this._sidebarToggle.update((value) => !value);
  }

  setSidebarState(isOpen: boolean) {
    this._sidebarToggle.set(isOpen);
  }
}
