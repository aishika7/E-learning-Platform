import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InstructorRoutingModule } from './instructor-routing.module';
import { SharedModule } from '../shared/shared.module';

import { InstructorDashboardComponent } from './dashboard/instructor-dashboard.component';
import { InstructorCoursesComponent } from './courses/instructor-courses.component';
import { CourseFormComponent } from './course-form/course-form.component';

@NgModule({
  declarations: [
    InstructorDashboardComponent,
    InstructorCoursesComponent,
    CourseFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    InstructorRoutingModule
  ]
})
export class InstructorModule { }
