import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedInSync()) {
    // If already logged in, redirect to their role's dashboard
    const role = authService.getRole();
    if (role === 'admin') return router.createUrlTree(['/app/admin/dashboard']);
    if (role === 'instructor') return router.createUrlTree(['/app/instructor/dashboard']);
    if (role === 'student') return router.createUrlTree(['/app/student/dashboard']);
    return router.createUrlTree(['/']);
  }

  return true;
};
