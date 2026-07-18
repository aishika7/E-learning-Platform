import { Component, inject, OnInit } from '@angular/core';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-header">
      <h2>Platform Overview</h2>
      <p class="text-muted">High-level metrics and platform health.</p>
    </div>

    <div class="metrics-grid">
      <app-metric-card title="Total Courses" [value]="courses.length" icon="library_books" color="var(--primary)"></app-metric-card>
      <app-metric-card title="Active Instructors" [value]="uniqueInstructors" icon="school" color="var(--accent)"></app-metric-card>
      <app-metric-card title="Platform Revenue" [value]="'₹' + totalValue" icon="payments" color="var(--success)"></app-metric-card>
    </div>

    <div class="section-header">
      <h3>Recently Added Courses</h3>
      <a routerLink="/app/admin/courses" class="btn-text">Manage Catalog</a>
    </div>

    <div class="courses-grid" *ngIf="courses.length > 0; else emptyState">
      <app-course-card 
        *ngFor="let course of courses.slice(0, 4)" 
        [course]="course"
        [showStatus]="true">
      </app-course-card>
    </div>

    <ng-template #emptyState>
      <div class="empty-state">
        <span class="material-icons-round empty-icon">analytics</span>
        <h3>No courses found on the platform</h3>
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
  `]
})
export class AdminDashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  
  courses: Course[] = [];
  
  get uniqueInstructors() { 
    return new Set(this.courses.map(c => c.createdBy?._id)).size; 
  }
  
  get totalValue() { 
    return this.courses.reduce((sum, c) => sum + c.price, 0); 
  }

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(data => {
      this.courses = data;
    });
  }
}
