import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Reset Password</h2>
          <p class="text-muted">Enter your new password.</p>
        </div>

        <div class="alert success" *ngIf="isSuccess">
          Password has been reset successfully! Redirecting to login...
        </div>

        <div class="alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" *ngIf="!isSuccess">
          <div class="form-group">
            <label for="password">New Password</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••" />
            <div class="error-msg" *ngIf="resetForm.get('password')?.touched && resetForm.get('password')?.invalid">
              Password must be at least 6 characters.
            </div>
          </div>

          <button type="submit" class="btn-primary w-100 mt-4" [disabled]="resetForm.invalid || isLoading || !token">
            <span *ngIf="isLoading" class="material-icons-round spinner">sync</span>
            {{ isLoading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  token: string | null = null;

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token.';
    }
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.token, this.resetForm.value.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password. The link might be expired.';
      }
    });
  }
}
