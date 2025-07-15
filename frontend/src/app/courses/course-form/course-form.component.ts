import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      thumbnail: [''],
      level: ['', Validators.required],
      category: ['', Validators.required],
      duration: [''],
      language: [''],
      price: ['']
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      console.log('Course Submitted:', this.courseForm.value);
      // Later we’ll POST this to backend
    } else {
      console.log('Invalid form');
    }
  }
}
