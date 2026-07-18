import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './directives/has-role.directive';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { MetricCardComponent } from './components/metric-card/metric-card.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    CourseCardComponent,
    MetricCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HasRoleDirective,
    CourseCardComponent,
    MetricCardComponent,
    CommonModule
  ]
})
export class SharedModule { }
