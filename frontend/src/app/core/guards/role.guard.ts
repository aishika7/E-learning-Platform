import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const allowedRoles = route.data['roles'] as Array<'admin' | 'instructor' | 'student'>;
  const userRole = authService.getRole();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // Wrong role — redirect to their correct dashboard or login
  if (userRole === 'admin') return router.createUrlTree(['/app/admin/dashboard']);
  if (userRole === 'instructor') return router.createUrlTree(['/app/instructor/dashboard']);
  if (userRole === 'student') return router.createUrlTree(['/app/student/dashboard']);
  
  return router.createUrlTree(['/auth/login']);
};
