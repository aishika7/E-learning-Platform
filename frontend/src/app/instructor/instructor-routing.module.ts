import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './dashboard/instructor-dashboard.component';
import { InstructorCoursesComponent } from './courses/instructor-courses.component';
import { CourseFormComponent } from './course-form/course-form.component';

const routes: Routes = [
  { path: 'dashboard', component: InstructorDashboardComponent },
  { path: 'courses', component: InstructorCoursesComponent },
  { path: 'courses/new', component: CourseFormComponent },
  { path: 'courses/:id/edit', component: CourseFormComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
