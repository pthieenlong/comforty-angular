import { Routes } from '@angular/router';
import { Home, Login, Register, Product, ProductDetail, Cart, Checkout } from 'features';
import {
  AddProduct,
  Admin,
  Dashboard,
  Orders,
  Products,
  Users,
} from 'features/admin';
import {
  User
} from 'features/user';
import { adminGuard } from 'features/admin/service/admin-auth.guard';
import { authGuard } from 'features/authenticate/guard/auth-guard';

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
    component: Register,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'checkout',
    component: Checkout,
  },
  {
    path: 'user',
    component: User,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'products',
        component: Products,
      },
      {
        path: 'products/add',
        component: AddProduct,
      },
      {
        path: 'users',
        component: Users,
      },
      {
        path: 'orders',
        component: Orders,
      },
    ],
  },
];
