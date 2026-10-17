import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, signal } from '@angular/core';
import { timelineFrame, timelineIndex, timelinePosition } from '../../timeline/timeline-playback';
import { PromptComposer } from '../arena-story/prompt-composer';
import { BuildPlan } from '../arena-story/build-plan';
import { visibleProjectScenes } from './project-timing';
import { clamp, phase } from '../arena-story/story-timing';
import { NosDemo } from './nos-demo';
import { WakawaDemo } from './wakawa-demo';
import { PersonalProject } from './project-data';
import { ProjectDetails } from './project-details';
import { PageChrome } from '../../../core/ui/page-chrome';

@Component({
  selector: 'app-project-story',
  imports: [PromptComposer, BuildPlan, NosDemo, WakawaDemo, ProjectDetails],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-story.html',
  styleUrl: './project-story.scss',
  host: {
    '[class.animated]': 'animated()', '[class.nos]': 'project().id === "nos"',
    '[class.wakawa]': 'project().id === "wakawa"', '[style.--project-inset]': 'inset()',
    '[style.--intro-reveal]': 'introReveal()',
    '[style.--scene-count]': 'visibleScenes().length',
    '[attr.id]': '"projeto-" + project().id', '[attr.data-scene]': 'active()',
  },
})
export class ProjectStory {
  readonly project = input.required<PersonalProject>();
  readonly scenes = ['O projeto', 'A ideia', 'O plano', 'As ferramentas', 'O código', 'Na prática'];
  readonly visibleScenes = computed(() => visibleProjectScenes(this.project().id));
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly chrome = inject(PageChrome);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private view: Window | null = null;
  private readonly canAnimate = signal(false);
  private readonly motionChoice = signal<boolean | null>(null);
  readonly animated = computed(() => this.motionChoice() ?? this.canAnimate());
  readonly inset = signal('90px');
  readonly position = signal(0);
  readonly introReveal = computed(() => this.animated() && this.project().id === 'nos' ? phase(this.position(), .18, .58) : 1);
  readonly introductionOpacity = computed(() => this.animated() ? 1 - phase(this.position(), .25, .43) : 1);
  readonly projectIntroOpacity = computed(() => this.animated() && this.project().id === 'nos' ? phase(this.position(), .42, .64) : 1);
  readonly active = computed(() => this.visibleScenes()[timelineIndex(this.position(), this.visibleScenes().length)]);
  readonly states = computed(() => this.scenes.map((_, i) => timelineFrame(this.position(), this.visibleScenes().indexOf(i), this.visibleScenes().length)));
  readonly demoProgress = computed(() => this.animated() ? clamp((this.position() - this.visibleScenes().indexOf(5) - .1) / .75) : 1);
  readonly prompt = computed(() => this.animated()
    ? this.project().prompt.slice(0, Math.ceil(this.project().prompt.length * phase(this.position(), 1.08, 1.7)))
    : this.project().prompt);
  readonly planProgress = computed(() => this.animated() ? phase(this.position(), 2.03, 2.85) : 1);
  readonly toolsProgress = computed(() => this.animated() ? phase(this.position(), 3.02, 3.7) : 1);

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      this.view = view;
      const media = view.matchMedia('(prefers-reduced-motion: reduce), (max-height: 620px)');
      this.canAnimate.set(!media.matches);
      let frame = 0;
      const update = () => {
        frame = 0;
        const inset = this.headerHeight();
        this.inset.set(`${inset}px`);
        const rect = this.root.nativeElement.getBoundingClientRect();
        const page = this.document.documentElement;
        const focusLine = inset + (view.innerHeight - inset) * .4;
        if (rect.top <= focusLine && rect.bottom > focusLine) {
          page.dataset['showcase'] = this.project().id;
          this.chrome.personalProject.set({ id: this.project().id, name: this.project().name });
        } else {
          if (page.dataset['showcase'] === this.project().id) delete page.dataset['showcase'];
          if (this.chrome.personalProject()?.id === this.project().id) this.chrome.personalProject.set(null);
        }
        if (!this.animated()) {
          if (this.project().id === 'nos') page.style.setProperty('--nos-intro-reveal', '1');
          return;
        }
        this.position.set(timelinePosition(rect.top, rect.height, view.innerHeight, inset, this.visibleScenes().length));
        if (this.project().id === 'nos') page.style.setProperty('--nos-intro-reveal', String(this.introReveal()));
      };
      const schedule = () => { if (!frame) frame = view.requestAnimationFrame(update); };
      const motionChanged = () => { this.canAnimate.set(!media.matches); schedule(); };
      const observer = new ResizeObserver(schedule);
      observer.observe(this.root.nativeElement);
      const header = this.document.querySelector('app-site-header');
      if (header) observer.observe(header);
      view.addEventListener('scroll', schedule, { passive: true });
      view.addEventListener('resize', schedule);
      media.addEventListener('change', motionChanged);
      schedule();
      this.destroyRef.onDestroy(() => {
        view.cancelAnimationFrame(frame);
        observer.disconnect();
        view.removeEventListener('scroll', schedule);
        view.removeEventListener('resize', schedule);
        media.removeEventListener('change', motionChanged);
        if (this.document.documentElement.dataset['showcase'] === this.project().id) delete this.document.documentElement.dataset['showcase'];
        if (this.chrome.personalProject()?.id === this.project().id) this.chrome.personalProject.set(null);
        if (this.project().id === 'nos') this.document.documentElement.style.removeProperty('--nos-intro-reveal');
      });
    });
  }
  private headerHeight() { return this.document.querySelector('app-site-header')?.getBoundingClientRect().height ?? 90; }
  goTo(index: number) {
    const step = this.visibleScenes().indexOf(index);
    if (!this.view || step < 0) return;
    const root = this.root.nativeElement;
    const inset = this.headerHeight();
    if (this.animated()) {
      const distance = (root.offsetHeight - this.view.innerHeight + inset) / this.visibleScenes().length;
      const point = index === 0 && this.project().id === 'nos' ? .1 : step + .35;
      this.view.scrollTo({ top: this.view.scrollY + root.getBoundingClientRect().top - inset + distance * point, behavior: 'instant' });
    } else {
      const scene = root.querySelector<HTMLElement>(`[data-project-scene="${index}"]`);
      if (scene) this.view.scrollTo({ top: this.view.scrollY + scene.getBoundingClientRect().top - inset - 20, behavior: 'instant' });
    }
  }
  toggleMotion() {
    let index = this.active();
    if (!this.animated()) {
      const center = (this.headerHeight() + (this.view?.innerHeight ?? 800)) / 2;
      const scenes = [...this.root.nativeElement.querySelectorAll<HTMLElement>('[data-project-scene]')];
      const nearest = scenes.reduce<HTMLElement | null>((best, item) => {
        const distance = (node: HTMLElement) => { const rect = node.getBoundingClientRect(); return Math.abs(rect.top + rect.height / 2 - center); };
        return !best || distance(item) < distance(best) ? item : best;
      }, null);
      index = Number(nearest?.dataset['projectScene'] ?? 0);
    }
    this.motionChoice.set(!this.animated());
    this.view?.requestAnimationFrame(() => { if (!this.destroyRef.destroyed) this.goTo(index); });
  }
}
