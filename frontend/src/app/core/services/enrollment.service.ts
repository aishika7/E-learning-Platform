import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, ApiResponse } from './course.service';

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
    return this.http.get<ApiResponse<Enrollment[]>>(`${this.apiUrl}/me`).pipe(
      map(res => res.data)
    );
  }

  enrollInCourse(courseId: string, paymentMethod = 'demo'): Observable<Enrollment> {
    return this.http.post<ApiResponse<Enrollment>>(`${this.apiUrl}/enroll`, { courseId, paymentMethod }).pipe(
      map(res => res.data)
    );
  }

  updateProgress(enrollmentId: string, moduleIndex: number, completed: boolean): Observable<Enrollment> {
    return this.http.put<ApiResponse<Enrollment>>(`${this.apiUrl}/${enrollmentId}/progress`, { moduleIndex, completed }).pipe(
      map(res => res.data)
    );
  }

  // Admin/Instructor endpoints (can be expanded later)
}
