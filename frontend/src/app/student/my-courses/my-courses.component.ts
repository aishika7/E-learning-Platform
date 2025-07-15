import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html'
})
export class MyCoursesComponent implements OnInit {
  courses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any[]>(`${environment.apiUrl}/enrollments`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(enrollments => {
      this.courses = enrollments.map(e => e.course);
    });
  }
}
