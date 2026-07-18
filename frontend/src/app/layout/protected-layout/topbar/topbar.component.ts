import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styles: [`
    .topbar {
      height: 64px;
      background-color: var(--card);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--foreground);
    }

    .user-email {
      font-size: 0.75rem;
      color: var(--muted-fg);
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-light);
      color: var(--primary-fg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .logout-btn {
      background: none;
      border: none;
      color: var(--muted-fg);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: var(--radius-sm);
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background-color: var(--muted);
      color: var(--destructive);
    }
    .theme-toggle {
      background: none; border: none; color: var(--muted-fg);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      padding: 8px; border-radius: var(--radius-full); transition: all 0.2s;
      margin-right: 1rem;
    }
    .theme-toggle:hover { background-color: var(--muted); color: var(--foreground); }
    
    .avatar-img {
      width: 36px; height: 36px; border-radius: 50%;
      object-fit: cover; border: 2px solid var(--border);
    }
  `]
})
export class TopbarComponent {
  private authService = inject(AuthService);
  user = this.authService.user;
  isDark = false;

  constructor() {
    this.isDark = document.documentElement.classList.contains('dark');
  }

  getInitials(): string {
    const name = this.user()?.name || '?';
    return name.charAt(0).toUpperCase();
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  logout() {
    this.authService.logout();
  }
}
