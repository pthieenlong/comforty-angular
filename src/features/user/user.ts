import { NgClass, NgIf, NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import { UserService } from './user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [NgIf, NgFor, NgClass],
  providers: [DatePipe],
  templateUrl: './ui/user.html',
  styleUrl: './ui/user.css'
})
export class User {
  tabs = [
    { label: 'Thông tin', id: 'info' },
    { label: 'Lịch sử đơn hàng', id: 'order' },
    { label: 'Wishlist', id: 'wishlist' }
  ];
  activeTab = signal('info');
  constructor(private userService: UserService, private datePipe: DatePipe) {
    this.userService.getUser();
  }
  selectTab(tabId: string) {
    this.activeTab.set(tabId);
  }
  getUser() {
    return this.userService.getUser();
  }

  getCheckoutHistories() {
    return this.userService.getCheckoutHistories();
  }

  formatDate(isoString: string) {
    return this.datePipe.transform(isoString, 'dd, MM, yyyy')
  }
  public moneyFormat(price: number) {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
  }
}
