import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() progress?: number; // 0 to 100
  @Input() showPrice = true;
  @Input() showStatus = false;
  
  @Output() cardClick = new EventEmitter<Course>();

  onClick() {
    this.cardClick.emit(this.course);
  }
}
