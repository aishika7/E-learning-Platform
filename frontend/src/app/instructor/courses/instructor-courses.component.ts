import { Component, inject, OnInit } from '@angular/core';
import { CourseService, Course } from '../../core/services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-courses',
  template: `
    <div class="page-header">
      <div>
        <h2>My Courses</h2>
        <p class="text-muted">Manage your created courses</p>
      </div>
      <button class="btn-primary" routerLink="/app/instructor/courses/new">
        <span class="material-icons-round">add</span> Create Course
      </button>
    </div>

    <div class="courses-grid" *ngIf="courses.length > 0; else emptyState">
      <app-course-card 
        *ngFor="let course of courses" 
        [course]="course"
        [showStatus]="true"
        (cardClick)="editCourse(course._id)">
      </app-course-card>
    </div>

    <ng-template #emptyState>
      <div class="empty-state">
        <span class="material-icons-round empty-icon">menu_book</span>
        <h3>No courses found</h3>
        <p class="text-muted">You haven't created any courses yet.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    h2 { font-size: 1.75rem; color: var(--foreground); margin-bottom: 0.25rem; }
    .text-muted { color: var(--muted-fg); }

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
      text-decoration: none;
    }
    .btn-primary:hover { background-color: var(--primary-dark); }

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
export class InstructorCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  
  courses: Course[] = [];

  ngOnInit() {
    this.courseService.getMyCourses().subscribe(data => {
      this.courses = data;
    });
  }

  editCourse(id: string) {
    this.router.navigate(['/app/instructor/courses', id, 'edit']);
  }
}
