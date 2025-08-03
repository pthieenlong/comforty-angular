import { JsonPipe, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'features/authenticate/service/auth';

@Component({
  selector: 'app-header',
  imports: [NgIf, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  searchQuery = '';
  isCategoriesDropdownOpen = false;
  isCartDropdownOpen = false;
  isProfileDropdownOpen = false;

  isSticky = false;

  constructor(public auth: AuthService) {}

  toggleDropdown(event: MouseEvent, type: 'categories' | 'cart' | 'profile') {
    event.stopPropagation();
    this.isCategoriesDropdownOpen =
      type === 'categories' ? !this.isCategoriesDropdownOpen : false;
    this.isCartDropdownOpen =
      type === 'cart' ? !this.isCartDropdownOpen : false;
    this.isProfileDropdownOpen =
      type === 'profile' ? !this.isProfileDropdownOpen : false;
  }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.isCategoriesDropdownOpen = false;
    this.isCartDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky = window.scrollY >= 500;
  }

  onSearch() {
    console.log('Searching: ', this.searchQuery);
  }
}
