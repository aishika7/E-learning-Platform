import { Component, inject, OnInit } from '@angular/core';
import { CourseService, Course } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-catalog',
  template: `
    <div class="page-header">
      <h2>Course Catalog</h2>
      <p class="text-muted">Discover and enroll in our premium courses</p>
    </div>

    <div *ngIf="isLoading" class="loading-state">
      <span class="material-icons-round spinner">sync</span>
      <p>Loading courses...</p>
    </div>

    <div class="courses-grid" *ngIf="!isLoading && courses.length > 0">
      <app-course-card 
        *ngFor="let course of courses" 
        [course]="course"
        [showPrice]="true"
        (cardClick)="enrollCourse(course._id)">
      </app-course-card>
    </div>

    <div class="empty-state" *ngIf="!isLoading && courses.length === 0">
      <span class="material-icons-round empty-icon">explore_off</span>
      <h3>No courses available</h3>
      <p class="text-muted">Check back later for new content.</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    h2 { font-size: 1.75rem; color: var(--foreground); margin-bottom: 0.25rem; }
    .text-muted { color: var(--muted-fg); }
    
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }
    .spinner { font-size: 32px; color: var(--primary); animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .empty-state {
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
export class CourseCatalogComponent implements OnInit {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private router = inject(Router);
  
  courses: Course[] = [];
  isLoading = true;

  ngOnInit() {
    this.courseService.getPublicCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  enrollCourse(courseId: string) {
    if (confirm('Do you want to enroll in this course? (Demo Payment)')) {
      this.enrollmentService.enrollInCourse(courseId).subscribe({
        next: () => {
          alert('Successfully enrolled!');
          this.router.navigate(['/app/student/player', courseId]);
        },
        error: (err) => alert(err.error?.message || 'Enrollment failed')
      });
    }
  }
}
