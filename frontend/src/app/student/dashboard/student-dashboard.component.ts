import { Component } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  template: `
    <div class="dashboard-header">
      <h2>My Learning Dashboard</h2>
      <p class="text-muted">Welcome back! Pick up where you left off. Phase 2 implementation.</p>
    </div>
  `,
  styles: [`
    .dashboard-header { margin-bottom: 2rem; }
    h2 { font-size: 1.75rem; color: var(--foreground); }
    .text-muted { color: var(--muted-fg); margin-top: 0.5rem; }
  `]
})
export class StudentDashboardComponent {}
