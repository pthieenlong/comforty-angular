import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { API_URL } from 'types/const';
import { IProduct } from 'types/interface/models';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor],
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

  newProducts = signal<IProduct[]>([]);
  bestProducts = signal<IProduct[]>([]);
  allProducts = signal<IProduct[]>([]);
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get(`${API_URL}/product/new`).subscribe({
      next: (data: any) => {
        this.newProducts.set(data.data);
      },
      error: (data: any) => {
        console.error('HTTP Error: ', data);
      },
    });
    this.httpClient.get(`${API_URL}/product/best`).subscribe({
      next: (data: any) => {
        this.bestProducts.set(data.data);
      },
      error: (error: any) => {
        console.error('HTTP Error: ', error);
      },
    });
    this.httpClient.get(`${API_URL}/product`).subscribe({
      next: (data: any) => {
        this.allProducts.set(data.data);
      },
      error: (error: any) => {
        console.error("HTTP Error: ", error)
      }
    })
  }

  get filteredProducts() {
    if (this.activeFilter === 'all') {
      return this.allProducts();
    }
    return this.allProducts().filter(
      (product) => product.category[0] === this.activeFilter
    );
  }

  filterProducts(category: string) {
    this.activeFilter = category;
  }

  isProductVisible(product: IProduct): boolean {
    return (
      this.activeFilter === 'all' || product.category[0] === this.activeFilter
    );
  }

  moneyFormat = (price: number) => {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
  };
}
