import { Component, inject, OnInit } from '@angular/core';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <div class="dashboard-header">
      <h2>Instructor Dashboard</h2>
      <p class="text-muted">Welcome to your teaching hub.</p>
    </div>

    <div class="metrics-grid">
      <app-metric-card title="Total Courses" [value]="courses.length" icon="menu_book" color="var(--primary)"></app-metric-card>
      <app-metric-card title="Published" [value]="publishedCount" icon="check_circle" color="var(--success)"></app-metric-card>
      <app-metric-card title="Drafts" [value]="draftCount" icon="edit_document" color="var(--accent)"></app-metric-card>
    </div>

    <div class="section-header">
      <h3>Recent Courses</h3>
      <a routerLink="/app/instructor/courses" class="btn-text">View All</a>
    </div>

    <div class="courses-grid" *ngIf="courses.length > 0; else emptyState">
      <app-course-card 
        *ngFor="let course of courses.slice(0, 4)" 
        [course]="course"
        [showStatus]="true"
        (cardClick)="onCourseClick($event)">
      </app-course-card>
    </div>

    <ng-template #emptyState>
      <div class="empty-state">
        <span class="material-icons-round empty-icon">school</span>
        <h3>No courses yet</h3>
        <p class="text-muted">Start sharing your knowledge with the world.</p>
        <button class="btn-primary mt-3" routerLink="/app/instructor/courses/new">
          <span class="material-icons-round">add</span>
          Create First Course
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
export class InstructorDashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  
  courses: Course[] = [];
  
  get publishedCount() { return this.courses.filter(c => c.isPublished).length; }
  get draftCount() { return this.courses.length - this.publishedCount; }

  ngOnInit() {
    this.courseService.getMyCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onCourseClick(course: Course) {
    // Navigate to edit or view
    console.log('Course clicked', course);
  }
}
