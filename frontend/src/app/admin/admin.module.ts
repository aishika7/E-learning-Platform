import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './courses/admin-courses.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminCoursesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
