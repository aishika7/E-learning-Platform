import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // using same styles as login basically
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['student', Validators.required]
  });

  errorMsg = '';

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMsg = '';
    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => this.authService.redirectToDashboard(),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
