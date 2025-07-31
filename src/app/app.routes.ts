import { Routes } from '@angular/router';
import { Home, Login, Register, Product, ProductDetail, Cart } from 'features';

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
    path: 'register',
    component: Register
  },
  {
    path: 'cart',
    component: Cart,
  },
];
