import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  instructor: { _id: string; name: string; email: string };
  price: number;
  category: string;
  modules: CourseModule[];
  thumbnail: string;
  isPublished: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  // Public catalog (published only)
  getPublicCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/public`);
  }

  getPublicCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/public/${id}`);
  }

  // Instructor endpoints
  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/instructor`);
  }

  createCourse(data: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}`, data);
  }

  updateCourse(id: string, data: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, data);
  }

  deleteCourse(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Admin endpoints
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}`);
  }
}
