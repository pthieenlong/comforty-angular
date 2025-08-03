import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'features/authenticate/service/auth';
import { SidebarService } from 'features/admin/service/sidebar.service';
import { LayoutService } from 'shared/services/layout.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  public sidebarService = inject(SidebarService);
  searchQuery = '';
  // Notifications
  notifications = signal([
    { id: 1, message: 'New order received', time: '2 min ago', read: false },
    { id: 2, message: 'Product stock low', time: '1 hour ago', read: false },
    { id: 3, message: 'Payment successful', time: '3 hours ago', read: true },
  ]);

  unreadCount = signal(this.notifications().filter((n) => !n.read).length);

  // User dropdown
  showUserDropdown = signal(false);
  showNotifications = signal(false);

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleUserDropdown() {
    this.showUserDropdown.update((value) => !value);
    this.showNotifications.set(false);
  }

  toggleNotifications() {
    this.showNotifications.update((value) => !value);
    this.showUserDropdown.set(false);
  }

  markAsRead(notificationId: number) {
    this.notifications.update((notifications) =>
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    this.unreadCount.update(
      () => this.notifications().filter((n) => !n.read).length
    );
  }

  markAllAsRead() {
    this.notifications.update((notifications) =>
      notifications.map((n) => ({ ...n, read: true }))
    );
    this.unreadCount.set(0);
  }

  logout() {
    this.authService.logout();
    this.layoutService.showClientLayout();
    this.router.navigate(['/']);
  }

  // Close dropdowns when clicking outside
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.user-dropdown') &&
      !target.closest('.notification-dropdown')
    ) {
      this.showUserDropdown.set(false);
      this.showNotifications.set(false);
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
  }
}
