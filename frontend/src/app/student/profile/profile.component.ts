import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="page-header">
      <h2>My Profile</h2>
      <p class="text-muted">Manage your personal information</p>
    </div>

    <div class="profile-container">
      <div class="profile-card">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          
          <div class="avatar-section">
            <img [src]="profileForm.get('avatar')?.value || 'https://via.placeholder.com/150'" alt="Avatar" class="avatar-preview" />
            <div class="form-group w-100">
              <label for="avatar">Avatar URL</label>
              <input id="avatar" type="text" formControlName="avatar" placeholder="https://..." />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input id="name" type="text" formControlName="name" />
            </div>
            
            <div class="form-group">
              <label for="email">Email Address</label>
              <input id="email" type="email" formControlName="email" readonly class="readonly-input" title="Email cannot be changed" />
            </div>
          </div>

          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" formControlName="bio" rows="4" placeholder="Tell us a bit about yourself..."></textarea>
          </div>

          <div class="alert success" *ngIf="isSuccess">
            Profile updated successfully!
          </div>

          <div class="alert error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="form-actions mt-4">
            <button type="submit" class="btn-primary" [disabled]="profileForm.invalid || isLoading">
              <span *ngIf="isLoading" class="material-icons-round spinner">sync</span>
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    h2 { font-size: 1.75rem; color: var(--foreground); margin-bottom: 0.25rem; }
    .text-muted { color: var(--muted-fg); }

    .profile-container { max-width: 800px; }
    .profile-card {
      background-color: var(--card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      padding: 2.5rem;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .avatar-preview {
      width: 100px; height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--muted);
    }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .w-100 { width: 100%; }

    label { font-size: 0.85rem; font-weight: 500; color: var(--card-fg); }
    input, textarea {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background-color: var(--input);
      color: var(--foreground);
      font-size: 0.95rem;
      outline: none;
      font-family: inherit;
    }
    input:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
    .readonly-input { background-color: var(--muted); opacity: 0.7; cursor: not-allowed; }

    .alert { padding: 1rem; border-radius: var(--radius-md); margin-top: 1.5rem; font-size: 0.9rem; font-weight: 500; }
    .alert.success { background-color: oklch(from var(--success) l c h / 0.15); color: var(--success); border: 1px solid var(--success); }
    .alert.error { background-color: oklch(from var(--destructive) l c h / 0.15); color: var(--destructive); border: 1px solid var(--destructive); }

    .form-actions { display: flex; justify-content: flex-end; }
    .mt-4 { margin-top: 2rem; }

    .btn-primary {
      background-color: var(--primary); color: var(--primary-fg);
      border: none; border-radius: var(--radius-md); padding: 0.75rem 2rem;
      font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;
    }
    .btn-primary:hover:not([disabled]) { background-color: var(--primary-dark); }
    .btn-primary[disabled] { opacity: 0.6; cursor: not-allowed; }

    .spinner { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: [''],
    avatar: [''],
    bio: ['']
  });

  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  ngOnInit() {
    const user = this.authService.user();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.isSuccess = false;
    this.errorMessage = '';

    const data = this.profileForm.value;

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        setTimeout(() => this.isSuccess = false, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update profile.';
      }
    });
  }
}
