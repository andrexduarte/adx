import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-monitor-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monitor-demo.html',
  styleUrl: './monitor-demo.scss',
})
export class MonitorDemo {
  readonly progress = input(0);
  readonly detached = computed(() => phase(this.progress(), .05, .45));
  readonly started = computed(() => this.progress() >= .35);
  readonly ended = computed(() => this.progress() >= .88);
  readonly position = computed(() => this.progress() < .65 ? '04' : '02');
  readonly caption = computed(() => this.ended() ? 'Resultado final. A consulta periódica pode parar.' :
    this.started() ? 'O painel acompanha a disputa fora da página.' : 'O desenho vira vídeo e ganha sua própria janela.');
}
