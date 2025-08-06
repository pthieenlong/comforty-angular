import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'features/authenticate/service/auth';
import { LayoutService } from 'shared/services/layout.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const layoutService = inject(LayoutService);
  const router = inject(Router);

  // Check auth status from localStorage
  const isLogined = authService.isLogined();
  const isAdmin = authService.isAdmin();
  const user = authService.user();

  if (isLogined && isAdmin) {
    layoutService.setAdminMode(true);
    layoutService.hideClientLayout();
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
