import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LEAGUE_DEMO_TRADERS } from './league-demo-data';

@Component({
  selector: 'app-league-demo-ranking',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './league-demo-ranking.html',
  styleUrl: './league-demo-ranking.scss',
})
export class LeagueDemoRanking {
  readonly traders = LEAGUE_DEMO_TRADERS;
}
