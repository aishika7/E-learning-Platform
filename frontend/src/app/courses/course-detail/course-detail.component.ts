import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentService } from '../../core/payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  courseId: string = '';
  course: any;
  noteText: string = '';
  showQuiz: boolean = false;
  isEnrolled: boolean = false;
  progress: any;

  dummyCourses = [
    {
      _id: '1',
      title: 'Intro to Python',
      description: 'Learn Python basics including syntax, variables, and data structures.',
      price: 499,
      thumbnail: 'https://via.placeholder.com/300',
      modules: [
        {
          title: 'Getting Started',
          lessons: ['Introduction to Python', 'Installing Python', 'Hello World']
        },
        {
          title: 'Data Structures',
          lessons: ['Lists', 'Tuples', 'Dictionaries']
        }
      ]
    },
    {
      _id: '2',
      title: 'Web Development Bootcamp',
      description: 'HTML, CSS, JS, and React in one powerful course.',
      price: 799,
      thumbnail: 'https://via.placeholder.com/300',
      modules: [
        {
          title: 'Frontend Basics',
          lessons: ['HTML', 'CSS', 'JavaScript']
        },
        {
          title: 'React',
          lessons: ['JSX', 'Components', 'Hooks']
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.course = this.dummyCourses.find(c => c._id === this.courseId);

    if (this.courseId) {
      this.checkEnrollment();
      this.fetchProgress();
    }
  }

  toggleQuiz(): void {
    this.showQuiz = !this.showQuiz;
  }

  saveNote(): void {
    console.log('Note saved:', this.noteText);
    alert('Note saved!');
  }

  checkEnrollment(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any[]>(`${environment.apiUrl}/enrollments`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(enrollments => {
      this.isEnrolled = enrollments.some(e => e.course._id === this.courseId);
    });
  }

  enrollInCourse(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to enroll.');
      return;
    }

    // Call backend to create Razorpay order
    this.http.post(`${environment.apiUrl}/payment/create-order`, {
      amount: this.course.price * 100,
      courseId: this.courseId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((order: any) => {
      const options = {
        key: 'rzp_test_YourKeyHere', // 🔁 Replace with real Razorpay key
        amount: order.amount,
        currency: 'INR',
        name: 'E-Learning Platform',
        description: this.course.title,
        order_id: order.id,
        handler: (response: any) => {
          this.verifyPayment(response);
        },
        prefill: {
          name: 'Student',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#007bff'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    }, err => {
      alert('Error creating payment order');
    });
  }

  verifyPayment(response: any): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const body = {
      payment: response,
      courseId: this.courseId
    };

    this.http.post(`${environment.apiUrl}/payment/verify`, body, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (res: any) => {
        alert(res.message || 'Payment successful!');
        this.isEnrolled = true;
        this.fetchProgress();
      },
      err => {
        alert(err.error.message || 'Error verifying payment.');
      }
    );
  }

  markAsComplete(lesson: string): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.put(`${environment.apiUrl}/enrollments/progress/${this.courseId}`, {
      lessonTitle: lesson
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        alert('Marked complete!');
        this.fetchProgress();
      },
      () => {
        alert('Error updating progress');
      }
    );
  }

  fetchProgress(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any[]>(`${environment.apiUrl}/enrollments`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(enrollments => {
      const match = enrollments.find(e => e.course._id === this.courseId);
      this.progress = match?.progress || { percentage: 0 };
    });
  }
}
