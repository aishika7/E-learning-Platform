import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from './course.service';

export interface Progress {
  moduleIndex: number;
  completed: boolean;
}

export interface Enrollment {
  _id: string;
  student: string | { _id: string; name: string };
  course: Course;
  progress: Progress[];
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollments`;

  // Student endpoints
  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/me`);
  }

  enrollInCourse(courseId: string, paymentMethod = 'demo'): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/enroll`, { courseId, paymentMethod });
  }

  updateProgress(enrollmentId: string, moduleIndex: number, completed: boolean): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/${enrollmentId}/progress`, { moduleIndex, completed });
  }

  // Admin/Instructor endpoints (can be expanded later)
}
