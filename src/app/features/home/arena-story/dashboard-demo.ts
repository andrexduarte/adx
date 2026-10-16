import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-dashboard-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-demo.html',
  styleUrl: './dashboard-demo.scss',
})
export class DashboardDemo {
  readonly Math = Math;
  readonly progress = input(0);
  readonly draw = computed(() => phase(this.progress(), .04, .75));
  readonly bars = [22, 51, 35, 76, 92, 65, 48, 30];
  readonly histogram = [12, 27, 48, 85, 70, 46, 20];
  readonly assets = [{ name: 'WDO', value: 78 }, { name: 'WIN', value: 56 }, { name: 'BIT', value: 31 }];
}
