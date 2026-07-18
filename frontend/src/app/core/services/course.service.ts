import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CourseModule {
  title: string;
  videoUrl?: string;
  duration?: number; // in minutes
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  createdBy: { _id: string; name: string; avatar?: string };
  price: number;
  category: string;
  modules: CourseModule[];
  thumbnail: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: any;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  // Public catalog (published only)
  getPublicCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}/`).pipe(
      map(res => res.data)
    );
  }

  getPublicCourse(id: string): Observable<Course> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  // Instructor endpoints
  getMyCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}/my`).pipe(
      map(res => res.data)
    );
  }

  createCourse(data: Partial<Course>): Observable<Course> {
    return this.http.post<ApiResponse<Course>>(`${this.apiUrl}`, data).pipe(
      map(res => res.data)
    );
  }

  updateCourse(id: string, data: Partial<Course>): Observable<Course> {
    return this.http.put<ApiResponse<Course>>(`${this.apiUrl}/${id}`, data).pipe(
      map(res => res.data)
    );
  }

  deleteCourse(id: string): Observable<{ message: string }> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map(res => ({ message: res.message || 'Deleted' }))
    );
  }

  // Admin endpoints
  getAllCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}`).pipe(
      map(res => res.data)
    );
  }
}
