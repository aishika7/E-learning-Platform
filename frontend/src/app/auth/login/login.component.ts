import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService); // Public for template binding

  loginForm = this.fb.nonNullable.group({
    email: ['student@elearn.com', [Validators.required, Validators.email]],
    password: ['Student@123', Validators.required]
  });

  errorMsg = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.errorMsg = '';
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.authService.redirectToDashboard(),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
