import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentRoutingModule } from './student-routing.module';
import { SharedModule } from '../shared/shared.module';

import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { CourseCatalogComponent } from './catalog/course-catalog.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    CourseCatalogComponent,
    CoursePlayerComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
