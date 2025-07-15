import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  userName = 'Aishika';
  role = 'admin';
  userEmail = 'aishika@example.com';

   enrolledCourses = [
    { name: 'Angular Basics', progress: 60 },
    { name: 'Machine Learning', progress: 80 },
    { name: 'UI/UX Design', progress: 45 }
  ];
  constructor(){}
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userName = payload.name || 'User';
      this.role = payload.role;
    }
  }

  logout() {
    localStorage.removeItem('token');
    location.reload(); // force reload to go to login
  }
}
