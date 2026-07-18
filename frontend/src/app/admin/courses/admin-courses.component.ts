import { Component, inject, OnInit } from '@angular/core';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-admin-courses',
  template: `
    <div class="page-header">
      <h2>Platform Catalog</h2>
      <p class="text-muted">Manage all courses on the platform</p>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Instructor</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let course of courses">
            <td>
              <div class="course-cell">
                <img [src]="course.thumbnail || 'https://via.placeholder.com/40'" class="mini-thumb" />
                <span>{{ course.title }}</span>
              </div>
            </td>
            <td>{{ course.instructor?.name || 'Unknown' }}</td>
            <td>{{ course.price === 0 ? 'Free' : (course.price | currency:'INR') }}</td>
            <td>
              <span class="badge" [class.published]="course.isPublished">{{ course.isPublished ? 'Published' : 'Draft' }}</span>
            </td>
            <td>
              <button class="btn-icon destructive" (click)="deleteCourse(course._id)" title="Delete Course">
                <span class="material-icons-round">delete</span>
              </button>
            </td>
          </tr>
          <tr *ngIf="courses.length === 0">
            <td colspan="5" class="empty-cell">No courses found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    h2 { font-size: 1.75rem; color: var(--foreground); margin-bottom: 0.25rem; }
    .text-muted { color: var(--muted-fg); }

    .table-container {
      background-color: var(--card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th, .data-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .data-table th {
      font-weight: 600;
      color: var(--muted-fg);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background-color: var(--muted);
    }
    .data-table tbody tr:hover { background-color: oklch(from var(--muted) l c h / 0.5); }
    
    .course-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: 500;
    }
    .mini-thumb {
      width: 40px; height: 40px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }

    .badge {
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      background-color: var(--muted);
      color: var(--muted-fg);
    }
    .badge.published { background-color: oklch(from var(--success) l c h / 0.15); color: var(--success); }

    .btn-icon {
      background: none; border: none; cursor: pointer;
      padding: 6px; border-radius: var(--radius-sm);
      color: var(--muted-fg);
    }
    .btn-icon:hover { background-color: var(--muted); }
    .btn-icon.destructive:hover { color: var(--destructive); background-color: oklch(from var(--destructive) l c h / 0.1); }

    .empty-cell { text-align: center; color: var(--muted-fg); padding: 3rem !important; }
  `]
})
export class AdminCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  courses: Course[] = [];

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe(data => this.courses = data);
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course? This cannot be undone.')) {
      this.courseService.deleteCourse(id).subscribe(() => {
        this.loadCourses();
      });
    }
  }
}
