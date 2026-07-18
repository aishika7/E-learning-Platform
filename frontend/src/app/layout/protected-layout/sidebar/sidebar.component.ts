import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NAV_CONFIG } from '../nav-config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background-color: var(--sidebar-bg);
      color: var(--sidebar-fg);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 40;
      border-right: 1px solid var(--sidebar-border);
      transition: transform 0.3s ease;
    }
    
    .sidebar-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary-light);
      border-bottom: 1px solid var(--sidebar-border);
    }
    
    .role-badge {
      font-size: 0.7rem;
      background-color: var(--sidebar-active);
      color: var(--sidebar-active-fg);
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: auto;
      text-transform: uppercase;
      font-weight: 600;
    }

    .nav-list {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: var(--sidebar-fg);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background-color: var(--sidebar-hover);
    }

    .nav-item.active {
      background-color: var(--sidebar-active);
      color: var(--sidebar-active-fg);
    }
    
    .nav-item.active .material-icons-round {
      color: var(--sidebar-active-fg);
    }

    .material-icons-round {
      font-size: 20px;
      color: var(--sidebar-fg);
      opacity: 0.8;
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  
  // Marketpulse pattern: filter nav config by role
  navItems = computed(() => {
    const role = this.authService.getRole();
    return NAV_CONFIG.filter(item => item.roles.includes(role as any));
  });

  roleLabel = computed(() => this.authService.getRole());
}
