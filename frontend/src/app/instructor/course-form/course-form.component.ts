import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courseId = this.route.snapshot.paramMap.get('id');
  isEditMode = !!this.courseId;
  isLoading = false;

  courseForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['Technology', Validators.required],
    thumbnail: [''],
    isPublished: [false],
    modules: this.fb.array([])
  });

  get modules() {
    return this.courseForm.get('modules') as FormArray;
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.loadCourse();
    } else {
      this.addModule(); // Add one empty module by default
    }
  }

  loadCourse() {
    this.isLoading = true;
    this.courseService.getMyCourses().subscribe({
      next: (courses) => {
        const course = courses.find(c => c._id === this.courseId);
        if (course) {
          this.courseForm.patchValue({
            title: course.title,
            description: course.description,
            price: course.price,
            category: course.category,
            thumbnail: course.thumbnail,
            isPublished: course.isPublished
          });
          course.modules.forEach(m => {
            this.modules.push(this.fb.group({
              title: [m.title, Validators.required],
              videoUrl: [m.videoUrl],
              duration: [m.duration]
            }));
          });
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  addModule() {
    this.modules.push(this.fb.group({
      title: ['', Validators.required],
      videoUrl: [''],
      duration: [0]
    }));
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const data = this.courseForm.value;

    if (this.isEditMode) {
      this.courseService.updateCourse(this.courseId!, data).subscribe({
        next: () => {
          this.router.navigate(['/app/instructor/courses']);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.courseService.createCourse(data).subscribe({
        next: () => {
          this.router.navigate(['/app/instructor/courses']);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }
}
