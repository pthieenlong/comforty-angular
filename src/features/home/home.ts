import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor],
  templateUrl: './ui/home.html',
  styleUrls: ['./ui/home.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  banners = [
    {
      sub: 'Welcome to Comforty',
      title: 'Best Furniture Collection for your interior.',
      image: 'assets/images/all-img/chair.png',
      discountImage: 'assets/images/all-img/discount.png',
      discountPercent: '15%',
      discountText: 'Discount'
    },
    {
      sub: 'Welcome to Chairy',
      title: 'Best Furniture Collection for your interior.',
      image: 'assets/images/all-img/chair.png',
      discountImage: 'assets/images/all-img/discount.png',
      discountPercent: '15%',
      discountText: 'Discount'
    },
    {
      sub: 'Welcome to Chairy',
      title: 'Best Furniture Collection for your interior.',
      image: 'assets/images/all-img/chair.png',
      discountImage: 'assets/images/all-img/discount.png',
      discountPercent: '15%',
      discountText: 'Discount'
    }
  ];
  

}
