import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  role = '';

  allCourses = [
    {
      _id: '1',
      title: 'Intro to Python',
      description: 'Learn Python basics.',
      thumbnail: 'https://via.placeholder.com/150',
      createdBy: 'instructor1',
      enrolled: true
    },
    {
      _id: '2',
      title: 'Web Dev Bootcamp',
      description: 'HTML, CSS, JS, React.',
      thumbnail: 'https://via.placeholder.com/150',
      createdBy: 'instructor2',
      enrolled: false
    },
    {
      _id: '3',
      title: 'AI for Beginners',
      description: 'ML basics & projects.',
      thumbnail: 'https://via.placeholder.com/150',
      createdBy: 'instructor1',
      enrolled: true
    }
  ];

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.role = payload.role;

      const userId = payload.id;

      if (this.role === 'instructor') {
        this.courses = this.allCourses.filter(c => c.createdBy === userId);
      } else if (this.role === 'student') {
        this.courses = this.allCourses.filter(c => c.enrolled);
      } else {
        this.courses = this.allCourses; // admin or guest
      }
    }
  }
}
