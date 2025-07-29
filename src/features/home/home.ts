import { NgFor, NgIf } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './ui/home.html',
  styleUrls: ['./ui/home.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home {
  banners = [
    {
      sub: 'Welcome to Comforty',
      title: 'Best Furniture Collection for your interior.',
      image: 'assets/images/all-img/chair.png',
      discountImage: 'assets/images/all-img/discount.png',
      discountPercent: '15%',
      discountText: 'Discount',
    },
    {
      sub: 'Welcome to Chairy',
      title: 'Best Furniture Collection for your interior.',
      image: 'assets/images/all-img/chair.png',
      discountImage: 'assets/images/all-img/discount.png',
      discountPercent: '15%',
      discountText: 'Discount',
    },
    {
      sub: 'Welcome to Chairy',
      title: 'Best Furniture Collection for your interior.',
      image: 'assets/images/all-img/chair.png',
      discountImage: 'assets/images/all-img/discount.png',
      discountPercent: '15%',
      discountText: 'Discount',
    },
  ];

  activeFilter = 'all';
  products = [
    {
      id: 1,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-01.png',
      category: 'featured',
      isNew: true,
    },
    {
      id: 2,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-02.png',
      category: 'trending',
      isNew: true,
    },
    {
      id: 3,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-03.png',
      category: 'featured',
      isNew: true,
    },
    {
      id: 4,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-04.png',
      category: 'best-sellers',
      isNew: true,
    },
    {
      id: 5,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-04.png',
      category: 'trending',
      isNew: true,
    },
    {
      id: 6,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-03.png',
      category: 'trending',
      isNew: true,
    },
    {
      id: 7,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-02.png',
      category: 'best-sellers',
      isNew: true,
    },
    {
      id: 8,
      name: 'Library Stool Chair',
      price: 20,
      image: './assets/images/all-img/f-product-01.png',
      category: 'newest',
      isNew: true,
    },
  ];

  get filteredProducts() {
    if (this.activeFilter === 'all') {
      return this.products;
    }
    return this.products.filter(
      (product) => product.category === this.activeFilter
    );
  }

  filterProducts(category: string) {
    this.activeFilter = category;
  }

  isProductVisible(product: any): boolean {
    return (
      this.activeFilter === 'all' || product.category === this.activeFilter
    );
  }
}
