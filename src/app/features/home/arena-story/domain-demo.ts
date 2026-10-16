import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-domain-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './domain-demo.html',
  styleUrl: './domain-demo.scss',
})
export class DomainDemo {
  readonly progress = input(0);
  readonly moved = computed(() => this.progress() > .35);
  readonly bounded = computed(() => this.progress() > .72);
  readonly folders = ['components /', 'context / v3', 'interfaces / v3', 'feature-teams / v3', 'data / teams / v3', 'resources / v3'];
  reveal(index: number) { return phase(this.progress(), .08 + index * .075, .20 + index * .075); }
}
