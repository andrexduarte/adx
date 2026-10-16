import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-handoff-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './handoff-demo.html',
  styleUrl: './handoff-demo.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class HandoffDemo {
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly ticket = computed(() => this.staticMode() ? 1 : 1 - phase(this.progress(), .56, .7));
  readonly result = computed(() => phase(this.progress(), .56, .7));
  readonly notification = computed(() => phase(this.progress(), .23, .4));
  readonly photos = computed(() => phase(this.progress(), .72, .92));
  readonly avatarCode = '[src]="winner.picture || avatarFallback"';
  readonly contract = '{ picture: string | null }';
  readonly winners = [{position:2,name:'Participante B',hasPicture:true}, {position:1,name:'Participante A',hasPicture:true}, {position:3,name:'Participante C',hasPicture:false}];
}
