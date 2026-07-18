import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { SharedModule } from '../shared/shared.module';

import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { CourseCatalogComponent } from './catalog/course-catalog.component';
import { CoursePlayerComponent } from './course-player/course-player.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    CourseCatalogComponent,
    CoursePlayerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
