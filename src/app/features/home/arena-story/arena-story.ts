import { Component, ElementRef, DestroyRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageChrome } from '../../../core/ui/page-chrome';
import { ChatCode } from './chat-code';
import { EngineeringInsight } from './engineering-insight';
import { ChatPreview } from './chat-preview';
import { PromptComposer } from './prompt-composer';
import { TournamentsStory } from './tournaments-story';
import { ProductInsight } from './product-insight';
import { CodexPlan } from './codex-plan';
import { WorkChapter } from './work-chapter';
import { WORK_EVIDENCE } from './work-evidence';
import { TechnologyMap } from './technology-map';
import { GithubActivity } from './github-activity';
import { chapterProgress, contentRange, clamp, phase, sceneIndex, sceneOpacity, storyProgress, STORY_END, STORY_SCENES, STORY_SCROLL_SCALE } from './story-timing';

@Component({
  selector: 'app-arena-story',
  imports: [ChatPreview, ChatCode, EngineeringInsight, PromptComposer, TournamentsStory, ProductInsight, CodexPlan, WorkChapter, TechnologyMap, GithubActivity],
  templateUrl: './arena-story.html',
  styleUrl: './arena-story.scss',
  host: { '[class.is-static]': 'staticMode()', '[attr.data-scene]': 'active()', '[style.--story-scroll-scale]': 'scrollScale' },
})
export class ArenaStory {
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly chrome = inject(PageChrome);
  private readonly logoOrigin = viewChild.required<ElementRef<HTMLElement>>('logoOrigin');
  private view: Window | null = null;
  private update = () => {};
  readonly progress = signal(0);
  readonly scrollScale = STORY_SCROLL_SCALE;
  readonly staticMode = signal(false);
  readonly logoPositioned = signal(false);
  readonly active = computed(() => sceneIndex(this.progress()));
  readonly evidence = WORK_EVIDENCE;
  readonly chapter = computed(() => Math.max(0, this.active() - 5));
  readonly caseTitles = ['task: chat', 'DADOS QUE VIRAM INTERFACE', 'DAR FORMA AOS DADOS', 'ACOMPANHAR DE PERTO', 'UMA IDENTIDADE NO JOGO', 'UMA COMUNIDADE GANHA FORMA', 'ORGANIZAR PARA EVOLUIR', 'ANGULAR 16 → 21', 'RELATAR E ACOMPANHAR', 'ESTADO E APRESENTAÇÃO', 'CUIDAR DAS ENTREGAS', 'ATIVIDADE NO GITHUB'];
  readonly productCases = [
    { kind: 'dashboard', label: 'Dashboard: operações transformadas em gráficos' },
    { kind: 'monitor', label: 'Monitor: acompanhar o torneio em Picture-in-Picture' },
    { kind: 'avatar', label: 'Avatar: seleção de classe, prévia e atualização do perfil' },
    { kind: 'league', label: 'League: identidade, Feed, Ranking e Equipes' },
    { kind: 'domains', label: 'Domínios: organização, entradas públicas e regras de dependência' },
    { kind: 'upgrade', label: 'Angular 16 ao 21: evolução da base em etapas' },
    { kind: 'handoff', label: 'ClickUp: relatar e acompanhar problemas com o backend' },
  ] as const;
  readonly chatPlan = ['Definir o canal e o ciclo de conexão.', 'Tratar envio, recebimento e histórico.', 'Atualizar mensagens sem duplicar IDs.', 'Adaptar a conversa ao desktop e ao celular.'];
  readonly plan = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .35) / .16));
  readonly prompt = computed(() => this.staticMode() ? 'Vamos construir um chat.' :
    'Vamos construir um chat.'.slice(0, Math.ceil(24 * phase(this.progress(), .16, .265))));
  readonly sent = computed(() => this.staticMode() || this.progress() >= .28);
  readonly conversation = computed(() => this.localProgress(5));
  readonly tournaments = computed(() => this.localProgress(6));
  readonly build = computed(() => this.staticMode() ? 1 : phase(this.progress(), .75, .90));
  readonly toolProgress = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .55) / .13));
  opacity(index: number) { return this.staticMode() ? 1 : sceneOpacity(this.progress(), index); }
  shift(index: number) { return this.staticMode() ? 0 : (1 - this.opacity(index)) * 24; }
  localProgress(scene: number) {
    return this.staticMode() ? 1 : chapterProgress(this.progress(), scene).content;
  }
  evidenceProgress(scene: number) { return this.staticMode() ? 1 : chapterProgress(this.progress(), scene).evidence; }

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      this.view = view;
      const reduced = view.matchMedia('(prefers-reduced-motion: reduce), (max-height: 700px)');
      this.staticMode.set(reduced.matches);
      const logoDock = this.document.querySelector<HTMLElement>('.project-logo-dock');
      let frame = 0;
      this.update = () => {
        frame = 0;
        const rect = this.root.nativeElement.getBoundingClientRect();
        const inset = this.document.querySelector('app-site-header')?.getBoundingClientRect().height ?? 90;
        this.progress.set(storyProgress(rect.top, rect.height, view.innerHeight, inset) * STORY_END);
        const entry = phase(view.innerHeight - rect.top, view.innerHeight * .15, view.innerHeight * .85);
        const exit = clamp(rect.bottom / (view.innerHeight * .75));
        this.document.documentElement.style.setProperty('--arena-depth', (entry * exit).toFixed(4));
        this.chrome.arenaContext.set(rect.top < view.innerHeight * .5 && rect.bottom > inset ? {
          project: this.chapter() === 11 ? 'ANDRÉ DUARTE' : 'TRADE ARENA',
          task: this.caseTitles[this.chapter()],
          opacity: entry * exit,
        } : null);
        // Render above the page stacking context so the mark can reach the header.
        const showLogo = !this.staticMode() && !!logoDock && rect.top < view.innerHeight && rect.bottom > inset;
        this.logoPositioned.set(showLogo);
        if (showLogo && logoDock) {
          const origin = this.logoOrigin().nativeElement.getBoundingClientRect();
          const dock = logoDock.getBoundingClientRect();
          const travel = phase(this.progress(), .07, .21);
          const x = origin.left + (dock.left - origin.left) * travel;
          const y = origin.top + (dock.top - origin.top) * travel;
          const scale = (origin.width + (dock.width - origin.width) * travel) / 76;
          this.chrome.arenaLogo.set({
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
            opacity: 1 - sceneOpacity(this.progress(), STORY_SCENES.length - 1),
          });
        } else {
          this.chrome.arenaLogo.set(null);
        }
      };
      const schedule = () => { if (!frame) frame = view.requestAnimationFrame(this.update); };
      const motionChanged = () => { this.staticMode.set(reduced.matches); schedule(); };
      const resize = new ResizeObserver(schedule);
      resize.observe(this.root.nativeElement);
      resize.observe(this.logoOrigin().nativeElement.parentElement!);
      if (logoDock) resize.observe(logoDock);
      this.document.fonts.ready.then(() => { if (!this.destroyRef.destroyed) schedule(); });
      view.addEventListener('scroll', schedule, { passive: true });
      view.addEventListener('resize', schedule);
      reduced.addEventListener('change', motionChanged);
      this.update();
      this.destroyRef.onDestroy(() => {
        view.cancelAnimationFrame(frame);
        view.removeEventListener('scroll', schedule);
        view.removeEventListener('resize', schedule);
        reduced.removeEventListener('change', motionChanged);
        resize.disconnect();
        this.chrome.arenaLogo.set(null);
        this.chrome.arenaContext.set(null);
        this.document.documentElement.style.removeProperty('--arena-depth');
      });
    });
  }
  seekTournaments(progress: number) {
    const [start, end] = contentRange(6);
    this.seekProgress(start + clamp(progress) * (end - start));
  }
  private seekProgress(progress: number) {
    const view = this.view;
    if (!view) return;
    const rect = this.root.nativeElement.getBoundingClientRect();
    const inset = this.document.querySelector('app-site-header')?.getBoundingClientRect().height ?? 90;
    view.scrollTo({ top: view.scrollY + rect.top - inset + progress / STORY_END * (rect.height - view.innerHeight + inset), behavior: 'instant' });
  }
}
