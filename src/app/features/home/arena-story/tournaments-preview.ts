import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TournamentDemoState } from './tournaments-playback';

@Component({
  selector: 'app-tournaments-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tournaments-preview.html',
  styleUrl: './tournaments-preview.scss',
})
export class TournamentsPreview {
  readonly state = input<TournamentDemoState>('ready');
  readonly recover = output<void>();
  readonly rows = [
    { name: 'Diário WDO', asset: 'WDO', status: 'Em andamento', live: true, date: 'Hoje · 09:00' },
    { name: 'Diário WIN', asset: 'WIN', status: 'Inscrições abertas', live: false, date: 'Amanhã · 09:00' },
  ];
}
