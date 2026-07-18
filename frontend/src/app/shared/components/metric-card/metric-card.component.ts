import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  template: `
    <div class="metric-card">
      <div class="header">
        <h4 class="title">{{ title }}</h4>
        <div class="icon-wrapper" [style.color]="color" [style.background-color]="color + '20'">
          <span class="material-icons-round">{{ icon }}</span>
        </div>
      </div>
      <div class="value">{{ value }}</div>
      <div class="footer" *ngIf="trend">
        <span class="trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
          <span class="material-icons-round">{{ trend > 0 ? 'trending_up' : 'trending_down' }}</span>
          {{ Math.abs(trend) }}%
        </span>
        <span class="trend-label">vs last month</span>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background-color: var(--card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--muted-fg);
      margin: 0;
    }
    .icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--foreground);
      line-height: 1;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
    }
    .trend {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      font-weight: 600;
    }
    .trend .material-icons-round { font-size: 16px; }
    .trend.positive { color: var(--success); }
    .trend.negative { color: var(--destructive); }
    .trend-label { color: var(--muted-fg); }
  `]
})
export class MetricCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() icon!: string;
  @Input() color: string = 'var(--primary)'; // CSS color var or hex
  @Input() trend?: number;
  
  Math = Math; // for template
}
