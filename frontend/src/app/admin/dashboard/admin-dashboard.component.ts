import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-header">
      <h2>Admin Dashboard</h2>
      <p class="text-muted">Welcome to the admin control panel. Phase 2 implementation.</p>
    </div>
  `,
  styles: [`
    .dashboard-header { margin-bottom: 2rem; }
    h2 { font-size: 1.75rem; color: var(--foreground); }
    .text-muted { color: var(--muted-fg); margin-top: 0.5rem; }
  `]
})
export class AdminDashboardComponent {}
