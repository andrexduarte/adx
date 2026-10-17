import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';
import { WorkflowInterface } from './workflow-interface';

interface WorkflowTechnology { name: string; detail: string; icon?: string; symbol?: string; }
type WorkflowKind = 'chat' | 'tournaments' | 'league';

const stacks: Record<WorkflowKind, readonly WorkflowTechnology[]> = {
  chat: [
    { name: 'Angular', detail: 'componentes', icon: 'angular' },
    { name: 'TypeScript', detail: 'tipos e contratos', icon: 'typescript' },
    { name: 'SCSS', detail: 'layout responsivo', icon: 'sass' },
    { name: 'RxJS', detail: 'fluxos de eventos', icon: 'reactivex' },
    { name: 'WebSocket', detail: 'tempo real', symbol: '⇄' },
    { name: 'STOMP', detail: 'canais e mensagens', symbol: '↳' },
  ],
  // tournaments.component.ts: combineLatest → buildTournamentsPageVm → vm$ | async.
  tournaments: [
    { name: 'Angular', detail: 'standalone · TypeScript', icon: 'angular' },
    { name: 'RxJS', detail: 'combineLatest', icon: 'reactivex' },
    { name: 'ViewModel', detail: 'dados e estados', symbol: 'VM' },
    { name: 'AsyncPipe', detail: 'vm$ | async', symbol: '|' },
    { name: 'OnPush', detail: 'detecção de mudanças', symbol: '↗' },
    { name: 'WebSocket', detail: 'preparado · desativado', symbol: '⇄' },
  ],
  // league.routes.ts; league.component.ts; league-feed.component.ts and responsive SCSS.
  league: [
    { name: 'Angular', detail: 'componentes · OnPush', icon: 'angular' },
    { name: 'TypeScript', detail: 'contratos tipados', icon: 'typescript' },
    { name: 'Router', detail: 'rotas lazy e guards', symbol: '↳' },
    { name: 'RxJS', detail: 'recursos assíncronos', icon: 'reactivex' },
    { name: 'SCSS', detail: 'layout responsivo', icon: 'sass' },
    { name: 'Signals', detail: 'signal · toSignal', symbol: '◉' },
  ],
};

const copy = {
  chat: { name: 'chat', figma: 'layout e componentes', result: 'O chat em uso.', layout: 'desktop e celular', verification: 'Revisão do código' },
  tournaments: { name: 'Torneios', figma: 'seções desktop e mobile', result: 'Torneios em uso.', layout: 'uma árvore, dois layouts', verification: 'Filtros, estados e recuperação' },
  league: { name: 'League', figma: 'Feed, Ranking e Equipes', result: 'A League em uso.', layout: 'Feed, Ranking e Equipes', verification: 'Acesso, estados e responsividade' },
} satisfies Record<WorkflowKind, { name: string; figma: string; result: string; layout: string; verification: string }>;

@Component({
  selector: 'app-workflow-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WorkflowInterface],
  templateUrl: './workflow-map.html',
  styleUrl: './workflow-map.scss',
})
export class WorkflowMap {
  readonly kind = input<WorkflowKind>('chat');
  readonly progress = input(1);
  readonly stack = computed(() => stacks[this.kind()]);
  readonly copy = computed(() => copy[this.kind()]);
  reveal(start: number) { return phase(this.progress(), start, start + .18); }
}
