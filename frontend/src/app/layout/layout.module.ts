import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ProtectedLayoutComponent } from './protected-layout/protected-layout.component';
import { SidebarComponent } from './protected-layout/sidebar/sidebar.component';
import { TopbarComponent } from './protected-layout/topbar/topbar.component';

@NgModule({
  declarations: [
    PublicLayoutComponent,
    ProtectedLayoutComponent,
    SidebarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PublicLayoutComponent,
    ProtectedLayoutComponent
  ]
})
export class LayoutModule { }
