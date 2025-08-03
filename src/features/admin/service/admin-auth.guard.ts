import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { LayoutService } from 'shared/services/layout.service';

export const adminGuard: CanActivateFn = (route, state) => {
  console.log('🛡️ Admin Guard được gọi!');
  console.log('Route:', route.url);
  console.log('State:', state.url);

  const authService = inject(AuthService);
  const layoutService = inject(LayoutService);
  const router = inject(Router);

  // Check auth status from localStorage
  const isLogined = authService.isLogined();
  const isAdmin = authService.isAdmin();
  const user = authService.user();

  console.log('=== Admin Guard Check ===');
  console.log('isLogined:', isLogined);
  console.log('isAdmin:', isAdmin);
  console.log('User:', user);
  console.log('User roles:', user?.roles);

  if (isLogined && isAdmin) {
    console.log('✅ Admin access granted');
    layoutService.setAdminMode(true);
    layoutService.hideClientLayout();
    return true;
  } else {
    console.log('❌ Admin access denied');
    console.log('isLogined:', isLogined);
    console.log('isAdmin:', isAdmin);
    router.navigate(['/login']);
    return false;
  }
};
