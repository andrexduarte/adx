import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-dashboard-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-demo.html',
  styleUrl: './dashboard-demo.scss',
})
export class DashboardDemo {
  readonly progress = input(0);
  readonly draw = computed(() => phase(this.progress(), .04, .75));
  readonly hovered = signal<number | null>(null);
  // Recorte da branch feat/dashboad-torneios, cf0ad43cc4, dashboard/v2.
  // Reproduz as quatro visualizações; os valores são demonstrativos.
  readonly hours = [3, 8, 17, 24, 15, 11, 8, 6, 5, 3].map((value, index) => ({
    hour: `${String(index + 9).padStart(2, '0')}h`, value, height: value / 24 * 100,
  }));
  readonly slices = [
    { label: 'Negativos', value: 20, color: '#FF1744', offset: 0 },
    { label: 'Stopados', value: 5, color: '#FF7817', offset: 20 },
    { label: 'Positivos', value: 67, color: '#00C853', offset: 25 },
    { label: 'Zerados', value: 8, color: '#6B7280', offset: 92 },
  ];
  readonly assets = [
    { label: 'WDO', total: 62, pnl: 1480, totalWidth: 100, pnlWidth: 100, formatted: '+ R$ 1.480' },
    { label: 'WIN', total: 38, pnl: -320, totalWidth: 38 / 62 * 100, pnlWidth: 320 / 1480 * 100, formatted: '- R$ 320' },
  ];
  readonly histogram = [
    { label: '-2k', value: 12, tone: 'loss' },
    { label: '-1k', value: 13, tone: 'loss' },
    { label: '0', value: 8, tone: 'neutral' },
    { label: '1k', value: 42, tone: 'profit' },
    { label: '2k', value: 25, tone: 'profit' },
  ].map(item => ({ ...item, height: item.value / 42 * 100, opacity: Math.max(.2, item.value / 42) }));
}
