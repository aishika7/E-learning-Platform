import { Component } from '@angular/core';

@Component({
  selector: 'app-protected-layout',
  templateUrl: './protected-layout.component.html',
  styles: [`
    .app-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: var(--background);
    }
    
    .main-content {
      flex: 1;
      margin-left: 260px; /* matches sidebar width */
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .page-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
  `]
})
export class ProtectedLayoutComponent {}
