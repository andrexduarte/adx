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
import { clamp, phase, PRODUCT_STAGE_STARTS, PRODUCT_MAP_STAGE_STARTS } from './story-timing';

@Component({
  selector: 'app-product-insight',
  imports: [PromptComposer, DashboardDemo, MonitorDemo, HandoffDemo, BuildPlan, AvatarDemo, LeagueDemo, DomainDemo, AngularUpgradeDemo, TechnologyMap, ResponsivePreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-insight.html',
  styleUrl: './product-insight.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class ProductInsight {
  readonly kind = input.required<'dashboard' | 'monitor' | 'handoff' | 'avatar' | 'league' | 'domains' | 'upgrade'>();
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly mapKind = computed<'dashboard' | 'league' | null>(() => this.kind() === 'dashboard' ? 'dashboard' : this.kind() === 'league' ? 'league' : null);
  readonly starts = computed(() => this.mapKind() ? PRODUCT_MAP_STAGE_STARTS : PRODUCT_STAGE_STARTS);
  readonly stage = computed(() => Math.max(0, this.starts().filter(start => start <= this.progress()).length - 1));
  readonly codeStage = computed(() => this.mapKind() ? 3 : 2);
  readonly resultStage = computed(() => this.codeStage() + 1);
  readonly plan = computed(() => this.staticMode() ? 1 : this.mapKind() ? clamp((this.progress() - .14) / .14) : clamp((this.progress() - .18) / .18));
  readonly mapProgress = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .31) / .13));
  readonly demo = computed(() => this.staticMode() ? 1 : clamp((this.progress() - (this.mapKind() ? .65 : .64)) / (this.mapKind() ? .33 : .34)));
  readonly demoContent = computed(() => this.staticMode() ? 1 : clamp(this.demo() / .52));
  readonly compact = computed(() => this.staticMode() ? 0 : phase(this.demo(), .57, .93));
  readonly promptEnd = computed(() => this.mapKind() ? .10 : .14);
  readonly codeLabel = computed(() => ({
    dashboard: 'dados → ViewModel', monitor: 'canvas → janela', avatar: 'seleção → prévia',
    league: 'rotas → componentes', domains: 'domínios → fronteiras', upgrade: 'versões → compatibilidade',
    handoff: 'contrato → interface',
  })[this.kind()]);
  readonly content = computed(() => this.kind() === 'dashboard' ? {
    title: 'Dar forma aos dados.',
    label: 'DASHBOARD / TORNEIOS',
    prompt: 'Vamos transformar operações em um dashboard.',
    steps: ['Ler os estados e as métricas disponíveis.', 'Organizar os dados em ViewModels.', 'Compor gráficos e comparativos por ativo.', 'Tratar carregamento, ausência de dados e falhas.'],
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
    title: 'Dar rosto a uma escolha.',
    label: 'AVATAR / PERSONALIZAÇÃO',
    prompt: 'Vamos criar a escolha de classe e avatar.',
    steps: ['Organizar classes, níveis e avatares disponíveis.', 'Distinguir a seleção do avatar já salvo.', 'Pré-carregar a imagem e fazer a transição.', 'Salvar a escolha e atualizar o perfil.'],
    folder: 'shared / change-avatar-modal / v2',
    files: ['change-avatar-modal.component.ts', 'change-avatar-modal.model.ts', 'change-avatar-modal.service.ts'],
    code: `this.previousAvatarImage = this.currentAvatarImage;
this.isImageFading = true;
const img = new Image();
img.src = imageSrc;

img.onload = () => {
  this.currentAvatarImage = imageSrc;
  this.updateSelectedAvatarState();
  this.refreshView();
};`,
    note: 'Componente real · trecho reduzido da seleção de avatar',
    result: '',
  } : this.kind() === 'league' ? {
    title: 'Uma comunidade ganha forma.',
    label: 'LEAGUE V3 / EXPERIÊNCIA',
    prompt: 'Vamos construir a nova experiência da League.',
    steps: ['Compor a identidade e a navegação da liga.', 'Carregar cada área por sua própria rota.', 'Separar dados, estados e permissões.', 'Adaptar Feed, Ranking e Equipes para cada tela.'],
    folder: 'domains / league / v3',
    files: ['league.routes.ts', 'league.component.html', 'league-teams.component.html'],
    code: `{
  path: 'teams',
  data: { tabLabel: 'Equipes' },
  canActivate: [canEnterLeagueTeams],
  loadComponent: () =>
    import('./feature-teams/v3').then(
      ({ LeagueTeamsComponent }) =>
        LeagueTeamsComponent
    )
}`,
    note: 'League V3 · trecho real das rotas com lazy loading',
    result: '',
  } : this.kind() === 'domains' ? {
    title: 'Dar lugar a cada responsabilidade.',
    label: 'ARQUITETURA / DOMÍNIOS',
    prompt: 'Vamos organizar a League como um domínio.',
    steps: ['Mapear o que pertence ao domínio League.', 'Separar features, dados, contratos e recursos.', 'Definir entradas públicas e ajustar imports.', 'Expressar as fronteiras com regras do Sheriff.'],
    folder: 'workspace / arquitetura',
    files: ['domains/league/index.ts', 'domains/league/routes.ts', 'sheriff.config.ts'],
    code: `// sheriff.config.ts — recorte da regra
'data:league-teams': [
  'data:league-teams',
  'league:contracts',
  'league:resources',
  'layer:shared',
  'layer:util',
  'noTag',
  'root'
]`,
    note: 'Regras de dependência do projeto · adoção incremental',
    result: '',
  } : this.kind() === 'upgrade' ? {
    title: 'Evoluir sem perder o caminho.',
    label: 'ANGULAR / 16 → 21',
    prompt: 'Vamos evoluir a base do Angular 16 ao 21.',
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
    Math.ceil(this.content().prompt.length * phase(this.progress(), 0, this.promptEnd()))));
  opacity(index: number) {
    if (this.staticMode()) return 1;
    const starts = this.starts();
    return (index === 0 ? 1 : phase(this.progress(), starts[index] - .015, starts[index] + .015)) *
      (index === starts.length - 1 ? 1 : 1 - phase(this.progress(), starts[index + 1] - .015, starts[index + 1] + .015));
  }
}
