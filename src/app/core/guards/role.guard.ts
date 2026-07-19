import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models';

const HOME_BY_ROLE: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  student: '/student/dashboard',
};

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as UserRole | undefined;
  const user = auth.currentUser();

  if (!user) {
    return router.createUrlTree(['/login']);
  }
  if (!requiredRole || user.role === requiredRole) {
    return true;
  }
  return router.createUrlTree([HOME_BY_ROLE[user.role]]);
};
