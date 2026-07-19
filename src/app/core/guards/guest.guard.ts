import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const HOME_BY_ROLE = {
  Admin: '/admin/dashboard',
  Student: '/student/dashboard',
} as const;

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser();

  if (!user) {
    return true;
  }
  return router.createUrlTree([HOME_BY_ROLE[user.role]]);
};
