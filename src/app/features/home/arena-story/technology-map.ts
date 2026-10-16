import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

interface Technology { name: string; detail: string; icon?: string; symbol?: string; }
const angular = { name: 'Angular', detail: 'Componentes', icon: 'angular' };
const typescript = { name: 'TypeScript', detail: 'Estrutura', icon: 'typescript' };
const rxjs = { name: 'RxJS', detail: 'Fluxos de dados', icon: 'reactivex' };
const scss = { name: 'SCSS', detail: 'Forma e adaptação', icon: 'sass' };
const viewmodel = { name: 'ViewModel', detail: 'Dados para a interface', symbol: 'VM' };
const technologies: Record<'chat' | 'tournaments' | 'dashboard' | 'league', readonly Technology[]> = {
  chat: [angular, typescript, { name: 'WebSocket', detail: 'Mensagens em tempo real', symbol: '⇄' }, { ...rxjs, detail: 'Fluxos de mensagens' }, scss, { name: 'STOMP', detail: 'Canais e conexão', symbol: '↳' }],
  tournaments: [angular, typescript, viewmodel, rxjs, scss, { name: 'OnPush', detail: 'Atualização dos componentes', symbol: '↗' }],
  dashboard: [angular, typescript, viewmodel, rxjs, scss, { name: 'HTTP', detail: 'Operações e métricas', symbol: '⇄' }],
  league: [angular, typescript, { name: 'Router', detail: 'Áreas e permissões', symbol: '↳' }, rxjs, scss, { name: 'Signals', detail: 'Estado de apresentação', symbol: '◉' }],
};
const positions = [[20, 22], [78, 21], [9, 61], [89, 61], [30, 88], [70, 88]] as const;

@Component({
  selector: 'app-technology-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="constellation" [attr.aria-label]="'Ferramentas de ' + title()">
      <svg viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
        @for (tool of tools(); track tool.name; let i = $index) {
          <path [attr.d]="'M400 184 Q' + tool.x * 8 + ' 184 ' + tool.x * 8 + ' ' + tool.y * 4" pathLength="1" [style.stroke-dashoffset]="1 - reveal(i)" />
          <circle r="3" [attr.cx]="400 + (tool.x * 8 - 400) * reveal(i)" [attr.cy]="184 + (tool.y * 4 - 184) * reveal(i)" [style.opacity]="reveal(i)" />
        }
      </svg>
      <div class="core"><span aria-hidden="true">↗</span><strong>{{ title() }}</strong><small>{{ subtitle() }}</small></div>
      @for (tool of tools(); track tool.name; let i = $index) {
        <div class="technology" [style.left.%]="tool.x" [style.top.%]="tool.y" [style.opacity]="reveal(i)" [style.--reveal]="reveal(i)" [attr.aria-hidden]="reveal(i) === 0 ? true : null">
          @if (tool.icon) { <img [src]="'/images/technology/' + tool.icon + '.svg'" width="38" height="38" alt="" loading="lazy" /> }
          @else { <span class="symbol" aria-hidden="true">{{ tool.symbol }}</span> }
          <strong>{{ tool.name }}</strong><small>{{ tool.detail }}</small>
        </div>
      }
    </div>
  `,
  styleUrl: './technology-map.scss',
  host: { '[class.chat]': 'kind() === "chat"' },
})
export class TechnologyMap {
  readonly kind = input<'chat' | 'tournaments' | 'dashboard' | 'league'>('chat');
  readonly progress = input(1);
  readonly title = computed(() => ({ chat: 'chat', tournaments: 'torneios', dashboard: 'dashboard', league: 'league' })[this.kind()]);
  readonly subtitle = computed(() => ({ chat: 'da ideia à interface', tournaments: 'dados, estados e interface', dashboard: 'dos dados aos gráficos', league: 'uma comunidade conectada' })[this.kind()]);
  readonly tools = computed(() => technologies[this.kind()].map((tool, index) => ({ ...tool, x: positions[index][0], y: positions[index][1] })));
  reveal(index: number) { return phase(this.progress(), index * .138, index * .138 + .23); }
}
