import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:5000/api/courses';

  constructor(private http: HttpClient) {}

  getAllCourses() {
    return this.http.get(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  createCourse(courseData: any) {
    return this.http.post(this.baseUrl, courseData, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }
}
