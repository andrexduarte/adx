import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PromptComposer } from './prompt-composer';
import { DashboardDemo } from './dashboard-demo';
import { MonitorDemo } from './monitor-demo';
import { HandoffDemo } from './handoff-demo';
import { BuildPlan } from './build-plan';
import { AvatarDemo } from './avatar-demo';
import { LeagueDemo } from './league-demo';
import { DomainDemo } from './domain-demo';
import { AngularUpgradeDemo } from './angular-upgrade-demo';
import { TechnologyMap } from './technology-map';
import { ResponsivePreview } from './responsive-preview';
import { clamp, phase, PRODUCT_STAGE_STARTS, DASHBOARD_STAGE_STARTS, DASHBOARD_CONTENT_FRACTION, dashboardContentProgress, LEAGUE_STAGE_STARTS, LEAGUE_CONTENT_FRACTION, leagueContentProgress, UPGRADE_STAGE_STARTS, UPGRADE_CONTENT_FRACTION, upgradeContentProgress } from './story-timing';

@Component({
  selector: 'app-product-insight',
  imports: [PromptComposer, DashboardDemo, MonitorDemo, HandoffDemo, BuildPlan, AvatarDemo, LeagueDemo, DomainDemo, AngularUpgradeDemo, TechnologyMap, ResponsivePreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-insight.html',
  styleUrl: './product-insight.scss',
  host: { '[class.static]': 'staticMode()', '[class.dashboard]': 'kind() === "dashboard"', '[class.league]': 'kind() === "league"', '[class.upgrade]': 'kind() === "upgrade"' },
})
export class ProductInsight {
  readonly kind = input.required<'dashboard' | 'monitor' | 'handoff' | 'avatar' | 'league' | 'domains' | 'upgrade'>();
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly mapKind = computed<'dashboard' | 'league' | null>(() => this.kind() === 'dashboard' ? 'dashboard' : this.kind() === 'league' ? 'league' : null);
  readonly showCode = computed(() => this.kind() !== 'dashboard' && this.kind() !== 'league' && this.kind() !== 'upgrade');
  readonly contentProgress = computed(() => this.kind() === 'dashboard' ? dashboardContentProgress(this.progress()) : this.kind() === 'league' ? leagueContentProgress(this.progress()) : this.kind() === 'upgrade' ? upgradeContentProgress(this.progress()) : this.progress());
  readonly starts = computed(() => this.kind() === 'dashboard' ? DASHBOARD_STAGE_STARTS : this.kind() === 'league' ? LEAGUE_STAGE_STARTS : this.kind() === 'upgrade' ? UPGRADE_STAGE_STARTS : PRODUCT_STAGE_STARTS);
  readonly stage = computed(() => Math.max(0, this.starts().filter(start => start <= this.progress()).length - 1));
  readonly codeStage = computed(() => this.mapKind() ? 3 : 2);
  readonly resultStage = computed(() => this.codeStage() + (this.showCode() ? 1 : 0));
  readonly plan = computed(() => this.staticMode() ? 1 : this.mapKind() ? clamp((this.contentProgress() - .14) / .14) : clamp((this.contentProgress() - .18) / .18));
  readonly mapProgress = computed(() => this.staticMode() ? 1 : clamp((this.contentProgress() - .31) / .13));
  readonly demo = computed(() => this.staticMode() ? 1 : clamp((this.contentProgress() - (this.mapKind() ? .65 : .64)) / (this.mapKind() ? .33 : .34)));
  readonly demoContent = computed(() => this.staticMode() ? 1 : clamp(this.demo() / .52));
  readonly compact = computed(() => this.staticMode() ? 0 : this.kind() === 'dashboard' ? phase(this.demo(), .54, .70) : this.kind() === 'league' ? phase(this.demo(), .25, .85) : phase(this.demo(), .57, .93));
  readonly dashboardPan = computed(() => {
    const progress = this.demo();
    if (progress < .42) return phase(progress, .16, .38);
    if (progress < .52) return 1 - phase(progress, .42, .52);
    return phase(progress, .72, .98);
  });
  readonly promptEnd = computed(() => this.mapKind() ? .10 : .14);
  readonly codeLabel = computed(() => ({
    dashboard: 'dados → ViewModel', monitor: 'canvas → janela', avatar: 'nível → desbloqueio',
    league: 'rotas → componentes', domains: 'inspecionar → proteger fronteiras', upgrade: 'versões → compatibilidade',
    handoff: 'contrato → interface',
  })[this.kind()]);
  readonly content = computed(() => this.kind() === 'dashboard' ? {
    title: 'As operações, em perspectiva.',
    label: 'DASHBOARD / TORNEIOS',
    prompt: 'Vamos mostrar resultados, operações por horário e desempenho por ativo.',
    steps: ['Organizar operações e resultados em ViewModels.', 'Mostrar gráficos por horário e desempenho por ativo.', 'Definir estados iniciais e mensagens de erro.'],
    folder: 'dashboard / v2',
    files: ['dashboard.component.ts', 'dashboard.viewmodel.ts', 'dashboard.service.ts'],
    code: `operationsVm$ = this.dashboardService
  .dashboardOperationsState$.pipe(
    map(state => ({
      barData: buildDashboardBarChartItems(
        state.data?.operationsPerHour ?? []
      ),
      error: state.error
    })),
    startWith(OPERATIONS_VM_INITIAL),
    shareReplay(1)
  );`,
    note: 'Branch feat/dashboad-torneios · dados demonstrativos',
    result: 'Um fluxo de dados. Diferentes formas de enxergar.',
  } : this.kind() === 'monitor' ? {
    title: 'Levar a interface junto.',
    label: 'MONITOR / PICTURE-IN-PICTURE',
    prompt: 'Vamos acompanhar o torneio fora da página.',
    steps: ['Definir o estado que o painel precisa acompanhar.', 'Desenhar a visão compacta em Canvas.', 'Abrir o vídeo em Picture-in-Picture.', 'Controlar atualização, falhas e encerramento.'],
    folder: 'domains / floating-monitor / v1',
    files: ['floating-monitor.session.ts', 'floating-monitor-video.ts', 'floating-monitor-polling.ts'],
    code: `this.stream = this.canvas.captureStream(1);
const metadata = this.waitForMetadata();
this.video.srcObject = this.stream;
const playing = this.video.play();
await Promise.all([metadata, playing]);

await this.video.requestPictureInPicture();`,
    note: 'Arquivos do domínio floating-monitor · trechos reduzidos',
    result: '',
  } : this.kind() === 'avatar' ? {
    title: 'Um avatar, do seu jeito.',
    label: 'AVATAR / PERSONALIZAÇÃO',
    prompt: 'Vamos criar um modal para escolher a classe e trocar o avatar.',
    steps: ['Escolher a classe e um avatar liberado pelo nível.', 'Pré-carregar a imagem e mostrar a prévia com transição.', 'Confirmar a escolha e atualizar o avatar e a classe do perfil.'],
    folder: 'shared / _modals / change-avatar-modal / v2',
    files: ['component/change-avatar-modal.component.ts', 'change-avatar-modal.model.ts', 'change-avatar-modal.service.ts'],
    code: `const processedLevels = (sourceClass.levels || [])
  .map((level) => {
    let isLocked = true;
    if (
      sourceClass.userLevel !== null &&
      sourceClass.userLevel !== undefined
    ) {
      isLocked = level.level > sourceClass.userLevel;
    }
    return { ...level, isLocked };
  });`,
    note: 'Regra real de desbloqueio por nível · recorte do componente',
    result: '',
  } : this.kind() === 'league' ? {
    title: 'Feed, ranking e equipes.',
    label: 'LEAGUE / EXPERIÊNCIA',
    prompt: 'Vamos construir o feed, o ranking e as equipes da League.',
    steps: ['Compor a identidade e a navegação da liga.', 'Carregar cada área por sua própria rota.', 'Separar dados, estados e permissões.', 'Adaptar Feed, Ranking e Equipes para cada tela.'],
    folder: 'domains / league / v3',
    files: ['league.routes.ts', 'league.component.html', 'league-feed.component.ts'],
    code: `{
  path: '',
  pathMatch: 'full',
  loadComponent: () =>
    import('./components/league-feed/v3').then(
      ({ LeagueFeedComponent }) =>
        LeagueFeedComponent
    )
}`,
    note: 'Feed da League · rota inicial real com lazy loading',
    result: '',
  } : this.kind() === 'domains' ? {
    title: 'A League além da página.',
    label: 'ARQUITETURA / DOMÍNIOS',
    prompt: 'A League cresceu além de uma página e tem recursos usados por outras áreas. Vamos organizar suas responsabilidades em um domínio, com entradas públicas e limites de dependência.',
    steps: ['Mapear o que pertence ao domínio League.', 'Separar features, dados, contratos e recursos.', 'Definir entradas públicas e ajustar imports.', 'Expressar as fronteiras com regras do Sheriff.'],
    folder: 'workspace / arquitetura',
    files: ['package.json', 'sheriff.config.ts', '.detective/config.json', 'eslint.config.js'],
    code: `// package.json — recorte dos scripts
"architecture:verify": "sheriff verify",
"architecture:inspect": "detective --open false"

// eslint.config.js — escopo da integração
{
  files: ['src/app/domains/league/**/*.ts'],
  extends: [sheriff.configs.all]
}`,
    note: 'Detective visualiza dependências; Sheriff verifica as regras. Adoção incremental na League.',
    result: '',
  } : this.kind() === 'upgrade' ? {
    title: 'Do Angular 16 ao 21.',
    label: 'ANGULAR / 16 → 21',
    prompt: 'Vamos atualizar o Angular e suas dependências, preservando os fluxos existentes.',
    steps: ['Conferir versões e dependências compatíveis.', 'Atualizar a base em etapas.', 'Ajustar configuração, tipos e integrações.', 'Validar os fluxos a cada avanço da migração.'],
    folder: 'workspace / configuração',
    files: ['package.json', 'angular.json', 'tsconfig.json'],
    code: `// package.json — origem e destino
// @angular/core: ^16.2.0 → ^21.2.15
// typescript:    ~5.1.3  → ~5.9.3

// angular.json — builder na evolução
"builder": "@angular/build:application"`,
    note: 'Histórico real · etapas de André e da equipe',
    result: '',
  } : {
    title: 'Da evidência ao acordo.',
    label: 'CLICKUP / COLABORAÇÃO',
    prompt: 'Vamos registrar o que falta no pódio do Feed.',
    steps: ['Reproduzir o problema e registrar a evidência.', 'Descrever o contrato necessário para o backend.', 'Combinar critérios com e sem foto.', 'Acompanhar a tarefa e validar na interface.'],
    folder: 'league / v3 / feed',
    files: ['league-feed-api.interface.ts', 'league-feed-api.mapper.ts', 'league-activity-feed.component.html'],
    code: `// Contrato esperado para cada vencedor
picture: string | null;

// A interface mantém o fallback
[src]="winner.picture || avatarFallback"`,
    note: 'Relato real de André · contrato de dados do Feed',
    result: '',
  });
  readonly prompt = computed(() => this.content().prompt.slice(0, this.staticMode() ? undefined :
    Math.ceil(this.content().prompt.length * phase(this.contentProgress(), 0, this.promptEnd()))));
  opacity(index: number) {
    if (this.staticMode()) return 1;
    const starts = this.starts();
    const fade = .015 / (this.kind() === 'dashboard' ? DASHBOARD_CONTENT_FRACTION : this.kind() === 'league' ? LEAGUE_CONTENT_FRACTION : this.kind() === 'upgrade' ? UPGRADE_CONTENT_FRACTION : 1);
    return (index === 0 ? 1 : phase(this.progress(), starts[index] - fade, starts[index] + fade)) *
      (index === starts.length - 1 ? 1 : 1 - phase(this.progress(), starts[index + 1] - fade, starts[index + 1] + fade));
  }
}
