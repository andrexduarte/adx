import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-avatar-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-demo.html',
  styleUrl: './avatar-demo.scss',
})
export class AvatarDemo {
  readonly progress = input(0);
  readonly avatars = [
    { image: 'analista1', label: 'Analista Gráfico', number: '01' },
    { image: 'analista2', label: 'Analista Gráfico', number: '02' },
    { image: 'sniper1-1', label: 'Sniper', number: '01' },
    { image: 'sniper1-2', label: 'Sniper', number: '02' },
  ];
  readonly selected = computed(() => this.progress() < .24 ? 0 : this.progress() < .49 ? 1 : this.progress() < .73 ? 2 : 3);
  readonly saved = computed(() => this.progress() >= .91);
  readonly avatar = computed(() => this.avatars[this.selected()]);
  readonly className = computed(() => this.selected() < 2 ? 'Analista Gráfico' : 'Sniper');
  imageOpacity(index: number) {
    const starts = [0, .24, .49, .73];
    return (index === 0 ? 1 : phase(this.progress(), starts[index], starts[index] + .06)) *
      (index === 3 ? 1 : 1 - phase(this.progress(), starts[index + 1], starts[index + 1] + .06));
  }
}
