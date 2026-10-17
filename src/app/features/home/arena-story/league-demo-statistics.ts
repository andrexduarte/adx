import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-league-demo-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './league-demo-statistics.html',
  styleUrl: './league-demo-statistics.scss',
})
export class LeagueDemoStatistics {
  readonly summary = [
    { icon: 'trophy', label: 'Torneios realizados', value: '48' },
    { icon: 'users', label: 'Traders premiados', value: '36' },
    { icon: 'crown', label: 'Campeões diferentes', value: '18' },
    { icon: 'banknote', label: 'Prêmios concedidos', value: 'R$ 24.000,00' },
    { icon: 'activity', label: 'Operações encerradas', value: '9.840' },
  ];
  readonly records = [
    { title: 'Maior resultado em um único dia', value: 'R$ 1.840,00', holder: 'Trader Aurora', picture: 'sniper1-1', icon: 'trend', date: '16/10/2026' },
    { title: 'Mais operações em um único dia', value: '86', holder: 'Trader Horizonte', picture: 'analista2', icon: 'bolt', date: '15/10/2026' },
    { title: 'Maior prêmio em um só torneio', value: 'R$ 1.200,00', holder: 'Trader Serra', picture: 'analista1', icon: 'prize', date: '14/10/2026' },
  ];
}
