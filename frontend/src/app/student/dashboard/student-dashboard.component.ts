import { Component, inject, OnInit } from '@angular/core';
import { EnrollmentService, Enrollment } from '../../core/services/enrollment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  template: `
    <div class="dashboard-header">
      <h2>My Learning Dashboard</h2>
      <p class="text-muted">Welcome back! Pick up where you left off.</p>
    </div>

    <div class="metrics-grid">
      <app-metric-card title="Enrolled Courses" [value]="enrollments.length" icon="school" color="var(--primary)"></app-metric-card>
      <app-metric-card title="Completed" [value]="completedCount" icon="emoji_events" color="var(--success)"></app-metric-card>
      <app-metric-card title="In Progress" [value]="enrollments.length - completedCount" icon="hourglass_empty" color="var(--accent)"></app-metric-card>
    </div>

    <div class="section-header">
      <h3>Continue Learning</h3>
      <a routerLink="/app/student/courses" class="btn-text">Browse More</a>
    </div>

    <div class="courses-grid" *ngIf="enrollments.length > 0; else emptyState">
      <app-course-card 
        *ngFor="let enrollment of enrollments" 
        [course]="enrollment.course"
        [progress]="calculateProgress(enrollment)"
        (cardClick)="resumeCourse(enrollment.course._id)">
      </app-course-card>
    </div>

    <ng-template #emptyState>
      <div class="empty-state">
        <span class="material-icons-round empty-icon">menu_book</span>
        <h3>You are not enrolled in any courses</h3>
        <p class="text-muted">Discover our catalog and start learning today.</p>
        <button class="btn-primary mt-3" routerLink="/app/student/courses">
          <span class="material-icons-round">explore</span>
          Browse Catalog
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .dashboard-header { margin-bottom: 2rem; }
    h2 { font-size: 1.75rem; color: var(--foreground); margin-bottom: 0.25rem; }
    .text-muted { color: var(--muted-fg); }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .section-header h3 { font-size: 1.25rem; }

    .btn-text {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .btn-text:hover { text-decoration: underline; }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background-color: var(--card);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border);
    }
    .empty-icon {
      font-size: 48px;
      color: var(--muted-fg);
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    .mt-3 { margin-top: 1.5rem; }
    .btn-primary {
      background-color: var(--primary);
      color: var(--primary-fg);
      border: none;
      border-radius: var(--radius-md);
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-primary:hover { background-color: var(--primary-dark); }
  `]
})
export class StudentDashboardComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private router = inject(Router);
  
  enrollments: Enrollment[] = [];
  
  get completedCount() { return this.enrollments.filter(e => e.status === 'completed').length; }

  ngOnInit() {
    this.enrollmentService.getMyEnrollments().subscribe(data => {
      this.enrollments = data;
    });
  }

  calculateProgress(enrollment: Enrollment): number {
    if (!enrollment.course.modules || enrollment.course.modules.length === 0) return 0;
    const completedModules = enrollment.progress.filter(p => p.completed).length;
    return Math.round((completedModules / enrollment.course.modules.length) * 100);
  }

  resumeCourse(courseId: string) {
    this.router.navigate(['/app/student/player', courseId]);
  }
}
