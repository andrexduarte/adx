import { Component, computed, input } from '@angular/core';
import { clamp, phase, ENGINEERING_STAGE_STARTS } from './story-timing';
import { PromptComposer } from './prompt-composer';
import { BuildPlan } from './build-plan';

@Component({
  selector: 'app-engineering-insight',
  imports: [PromptComposer, BuildPlan],
  templateUrl: './engineering-insight.html',
  styleUrl: './engineering-insight.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class EngineeringInsight {
  readonly kind = input.required<'ranking' | 'signals' | 'tests'>();
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly stage = computed(() => Math.max(0, ENGINEERING_STAGE_STARTS.filter(start => start <= this.progress()).length - 1));
  readonly plan = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .21) / .26));
  readonly work = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .52) / .45));
  readonly changed = computed(() => this.work() > .48);
  readonly steps = computed(() => this.kind() === 'tests'
    ? ['Mapear o runner e os specs existentes.', 'Converter configuração, mocks e assertions.', 'Preservar os cenários já cobertos.', 'Executar a suíte e conferir a migração.']
    : ['Mapear os estados consumidos pelo template.', 'Manter RxJS no fluxo de dados.', 'Expor Signals para a apresentação.', 'Revisar o template e os componentes afetados.']);
  readonly cells = Array.from({ length: 48 }, (_, i) => i);
  readonly prompts = {
    ranking: 'Vamos refinar os filtros do ranking.',
    signals: 'Vamos levar o estado da League para Signals.',
    tests: 'Vamos migrar os testes para Vitest.',
  };
  readonly typedPrompt = computed(() => this.prompts[this.kind()].slice(0,
    this.staticMode() ? undefined : Math.ceil(this.prompts[this.kind()].length * phase(this.progress(), 0, .16))));
  opacity(index: number) {
    if (this.staticMode()) return 1;
    const starts = ENGINEERING_STAGE_STARTS;
    return (index === 0 ? 1 : phase(this.progress(), starts[index] - .015, starts[index] + .015)) *
      (index === 2 ? 1 : 1 - phase(this.progress(), starts[index + 1] - .015, starts[index + 1] + .015));
  }
  readonly ranking = computed(() => this.changed()
    ? [{ name: 'Participante B', score: '2.480', letter: 'B' }, { name: 'Participante A', score: '2.310', letter: 'A' }, { name: 'Participante C', score: '2.170', letter: 'C' }]
    : [{ name: 'Participante A', score: '840', letter: 'A' }, { name: 'Participante C', score: '720', letter: 'C' }, { name: 'Participante B', score: '650', letter: 'B' }]);
  readonly signalBefore = 'identityState$ | async';
  readonly signalAfter = 'identityState()';
  readonly signalCode = 'toSignal(this.identityStateSource$, {\n  initialValue: LEAGUE_IDENTITY_STATE_INITIAL\n})';
}
