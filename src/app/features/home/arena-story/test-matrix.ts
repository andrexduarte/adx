import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-test-matrix',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `@for (cell of cells; track cell) {
    <span [class.converted]="progress() * 62 > cell">{{ progress() * 62 > cell ? '✓' : '·' }}</span>
  }`,
  styleUrl: './test-matrix.scss',
})
export class TestMatrix {
  readonly progress = input(0);
  readonly cells = Array.from({ length: 48 }, (_, i) => i);
}
