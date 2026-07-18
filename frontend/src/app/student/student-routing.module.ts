import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { CourseCatalogComponent } from './catalog/course-catalog.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'courses', component: CourseCatalogComponent },
  { path: 'player/:courseId', component: CoursePlayerComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
