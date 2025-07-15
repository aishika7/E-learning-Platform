import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './dashboard.component.html'
})
export class InstructorDashboardComponent implements OnInit {
  metrics: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.http.get(`${environment.apiUrl}/dashboard/instructor`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((res: any) => this.metrics = res.metrics);
  }
}
