import { Component } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styles: [`
    .public-layout-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--background);
      color: var(--foreground);
    }
  `]
})
export class PublicLayoutComponent {}
