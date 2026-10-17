import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LEAGUE_DEMO_TRADERS } from './league-demo-data';

@Component({
  selector: 'app-league-demo-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './league-demo-feed.html',
  styleUrl: './league-demo-feed.scss',
})
export class LeagueDemoFeed {
  readonly winners = LEAGUE_DEMO_TRADERS;
}
