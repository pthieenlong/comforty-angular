import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private _isAdminMode = signal<boolean>(false);
  private _showClientHeader = signal<boolean>(true);
  private _showClientFooter = signal<boolean>(true);

  readonly isAdminMode = this._isAdminMode.asReadonly();
  readonly showClientHeader = this._showClientHeader.asReadonly();
  readonly showClientFooter = this._showClientFooter.asReadonly();

  setAdminMode(isAdmin: boolean) {
    this._isAdminMode.set(isAdmin);
    this._showClientHeader.set(!isAdmin);
    this._showClientFooter.set(!isAdmin);
  }

  hideClientLayout() {
    this._showClientHeader.set(false);
    this._showClientFooter.set(false);
  }

  showClientLayout() {
    this._showClientHeader.set(true);
    this._showClientFooter.set(true);
  }
}
