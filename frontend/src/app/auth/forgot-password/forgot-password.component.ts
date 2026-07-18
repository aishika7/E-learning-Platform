import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Forgot Password</h2>
          <p class="text-muted">Enter your email and we'll send you a reset link.</p>
        </div>

        <div class="alert success" *ngIf="isSuccess">
          Password reset link sent! Check your inbox.
        </div>

        <div class="alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" *ngIf="!isSuccess">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" formControlName="email" placeholder="john@example.com" />
            <div class="error-msg" *ngIf="forgotForm.get('email')?.touched && forgotForm.get('email')?.invalid">
              Please enter a valid email.
            </div>
          </div>

          <button type="submit" class="btn-primary w-100 mt-4" [disabled]="forgotForm.invalid || isLoading">
            <span *ngIf="isLoading" class="material-icons-round spinner">sync</span>
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <div class="auth-footer mt-4">
          <p>Remembered your password? <a routerLink="/auth/login" class="link">Log in</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.css']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send reset email.';
      }
    });
  }
}
