import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';
import { WorkflowMap } from './workflow-map';
import { PERSONAL_PROJECTS } from '../personal-projects/project-data';

interface Technology { name: string; detail: string; icon?: string; symbol?: string; }
const angular = { name: 'Angular', detail: 'Componentes', icon: 'angular' };
const typescript = { name: 'TypeScript', detail: 'Estrutura', icon: 'typescript' };
const rxjs = { name: 'RxJS', detail: 'Fluxos de dados', icon: 'reactivex' };
const scss = { name: 'SCSS', detail: 'Forma e adaptação', icon: 'sass' };
const viewmodel = { name: 'ViewModel', detail: 'Dados para a interface', symbol: 'VM' };
const technologies: Record<'chat' | 'tournaments' | 'dashboard' | 'league' | 'nos' | 'wakawa', readonly Technology[]> = {
  wakawa: PERSONAL_PROJECTS.find(project => project.id === 'wakawa')!.tools.map(tool => ({ name: tool.name, detail: tool.use, icon: tool.icon })),
  nos: PERSONAL_PROJECTS.find(project => project.id === 'nos')!.tools.map(tool => ({ name: tool.name, detail: tool.use, icon: tool.icon })),
  chat: [angular, typescript, { name: 'WebSocket', detail: 'Mensagens em tempo real', symbol: '⇄' }, { ...rxjs, detail: 'Fluxos de mensagens' }, scss, { name: 'STOMP', detail: 'Canais e conexão', symbol: '↳' }],
  tournaments: [angular, typescript, viewmodel, rxjs, scss, { name: 'OnPush', detail: 'Atualização dos componentes', symbol: '↗' }],
  dashboard: [angular, typescript, viewmodel, rxjs, scss, { name: 'HTTP', detail: 'Operações e métricas', symbol: '⇄' }, { name: 'SVG', detail: 'Gráfico de distribuição', symbol: '◉' }],
  league: [angular, typescript, { name: 'Router', detail: 'Áreas e permissões', symbol: '↳' }, rxjs, scss, { name: 'Signals', detail: 'Estado de apresentação', symbol: '◉' }],
};
const positions = [[20, 22], [78, 21], [9, 61], [89, 61], [30, 88], [70, 88]] as const;
const sevenPositions = [[20, 22], [50, 10], [80, 22], [90, 62], [70, 88], [30, 88], [10, 62]] as const;

@Component({
  selector: 'app-technology-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WorkflowMap],
  template: `
    @if (workflowKind(); as workflow) {
      <app-workflow-map [kind]="workflow" [progress]="progress()" />
    } @else {
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
    }
  `,
  styleUrl: './technology-map.scss',
  host: { '[class.chat]': 'kind() === "chat"', '[class.nos]': 'kind() === "nos"' },
})
export class TechnologyMap {
  readonly kind = input<'chat' | 'tournaments' | 'dashboard' | 'league' | 'nos' | 'wakawa'>('chat');
  readonly progress = input(1);
  readonly workflowKind = computed(() => {
    const kind = this.kind();
    return kind === 'dashboard' || kind === 'nos' || kind === 'wakawa' ? null : kind;
  });
  readonly title = computed(() => ({ chat: 'chat', tournaments: 'torneios', dashboard: 'dashboard', league: 'league', nos: 'Nós', wakawa: 'waka’wã' })[this.kind()]);
  readonly subtitle = computed(() => ({ chat: 'da ideia à interface', tournaments: 'dados, estados e interface', dashboard: 'dos dados aos gráficos', league: 'uma comunidade conectada', nos: 'da ideia à interface', wakawa: 'navegador de trabalho' })[this.kind()]);
  readonly tools = computed(() => technologies[this.kind()].map((tool, index) => {
    const [x, y] = (technologies[this.kind()].length === 7 ? sevenPositions : positions)[index];
    return { ...tool, x, y };
  }));
  reveal(index: number) {
    const start = index * .69 / (this.tools().length - 1);
    return phase(this.progress(), start, start + .23);
  }
}
