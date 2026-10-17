import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TournamentDemoState } from './tournaments-playback';
import { TournamentsPreviewFilters } from './tournaments-preview-filters';

@Component({
  selector: 'app-tournaments-preview',
  imports: [TournamentsPreviewFilters],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tournaments-preview.html',
  styleUrl: './tournaments-preview.scss',
})
export class TournamentsPreview {
  readonly state = input<TournamentDemoState>('ready');
  // Recorte de tournaments-table.component / TournamentTableRowVm.
  // Valores fictícios; rótulos, colunas e composição seguem o componente real.
  readonly rows = [
    { id: 'demo-wdo', name: 'Diário WDO', entry: 'R$ 10,00', money: 'money', asset: '1 WDO', participants: '48/100', balance: 'R$ 1.000,00', start: '16/10/2026 09:00', end: '16/10/2026 18:00', status: 'Em andamento', tone: 'active' },
    { id: 'demo-win', name: 'Diário WIN', entry: 'T$ 100', money: 'coin', asset: '5 WIN', participants: '24/100', balance: 'T$ 5.000', start: '17/10/2026 09:00', end: '17/10/2026 18:00', status: 'Aguardando', tone: 'waiting' },
  ] as const;
}
