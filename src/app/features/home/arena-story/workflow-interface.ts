import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-workflow-interface',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="interface-drawing" [class.tournaments]="kind() === 'tournaments'" [class.league]="kind() === 'league'" aria-hidden="true">
      <div class="browser">
        <div class="browser-top"><i></i><i></i><i></i><span>{{ kind() === 'tournaments' ? '/tournaments' : kind() === 'league' ? '/league' : 'localhost' }}</span></div>
        @if (kind() === 'tournaments') {
          <div class="mini-tournaments"><span></span><span></span></div>
          <div class="mini-table"><i></i><i></i><i></i></div>
        } @else if (kind() === 'league') {
          <div class="mini-league-hero"><i></i><span></span></div>
          <div class="mini-league-tabs"><span>Feed</span><span>Ranking</span><span>Equipes</span></div>
          <div class="mini-league-content"><i></i><i></i></div>
        } @else {
          <div class="mini-chat"><span></span><span></span><span></span></div><div class="mini-input"></div>
        }
      </div>
      <div class="phone"><i></i><span></span><span></span><span></span></div>
    </div>
  `,
  styleUrl: './workflow-interface.scss',
})
export class WorkflowInterface {
  readonly kind = input<'chat' | 'tournaments' | 'league'>('chat');
}
