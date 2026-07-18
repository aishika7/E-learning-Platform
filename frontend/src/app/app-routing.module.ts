import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { ProtectedLayoutComponent } from './layout/protected-layout/protected-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // ── PUBLIC routes (no auth required) ──────────────────────────────
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
      {
        path: 'auth',
        canActivate: [noAuthGuard],
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },

  // ── PROTECTED routes (requires auth) ──────────────────────────────
  {
    path: 'app',
    component: ProtectedLayoutComponent, // The single shell (sidebar + topbar)
    canActivate: [authGuard],
    children: [
      // Admin section
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      },
      // Instructor section
      {
        path: 'instructor',
        canActivate: [roleGuard],
        data: { roles: ['instructor'] },
        loadChildren: () => import('./instructor/instructor.module').then(m => m.InstructorModule)
      },
      // Student section
      {
        path: 'student',
        canActivate: [roleGuard],
        data: { roles: ['student'] },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
      }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
