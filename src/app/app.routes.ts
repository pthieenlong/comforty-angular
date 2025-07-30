import { Routes } from '@angular/router';
import { Home, Login, Product, ProductDetail, Cart } from 'features';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    component: Product,
  },
  {
    path: 'product/:slug',
    component: ProductDetail,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cart',
    component: Cart,
  },
];
