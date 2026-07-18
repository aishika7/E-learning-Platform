import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../core/services/enrollment.service';
import { CourseModule } from '../../core/services/course.service';

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private enrollmentService = inject(EnrollmentService);

  courseId = this.route.snapshot.paramMap.get('courseId')!;
  enrollment: Enrollment | null = null;
  
  activeModuleIndex = 0;
  isLoading = true;

  ngOnInit() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollment = enrollments.find(e => e.course._id === this.courseId) || null;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  get currentModule(): CourseModule | null {
    if (!this.enrollment || !this.enrollment.course.modules) return null;
    return this.enrollment.course.modules[this.activeModuleIndex];
  }

  isModuleCompleted(index: number): boolean {
    if (!this.enrollment) return false;
    const prog = this.enrollment.progress.find(p => p.moduleIndex === index);
    return prog ? prog.completed : false;
  }

  selectModule(index: number) {
    this.activeModuleIndex = index;
  }

  toggleComplete() {
    if (!this.enrollment) return;
    const completed = !this.isModuleCompleted(this.activeModuleIndex);
    
    this.enrollmentService.updateProgress(this.enrollment._id, this.activeModuleIndex, completed).subscribe(updated => {
      this.enrollment = updated;
    });
  }
}
