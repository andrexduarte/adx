import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ContentStore } from '../../core/content/content-store';
import { newestCareerFirst } from '../../core/content/career-order';
import { careerFrames, careerAgendaFrame, timelinePosition } from './timeline-playback';
import { PageChrome } from '../../core/ui/page-chrome';

@Component({
  selector: 'app-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  host: { '[class.is-animated]': 'animated()', '[style.--timeline-inset]': 'inset()', '[attr.data-frame]': 'active()' },
})
export class Timeline {
  readonly chrome = inject(PageChrome);
  private readonly content = inject(ContentStore);
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private view: Window | null = null;
  private readonly canAnimate = signal(false);
  private readonly motionChoice = signal<boolean | null>(null);
  readonly animated = computed(() => this.motionChoice() ?? this.canAnimate());
  readonly inset = signal<string | null>(null);
  readonly position = signal(0);
  readonly moments = computed(() => this.content.entries()
    .filter(entry => entry.kind === 'moment' && entry.status === 'published' &&
      entry.slug !== 'agora')
    .sort(newestCareerFirst));
  readonly frames = computed(() => careerFrames(this.moments()));
  readonly active = computed(() => Math.max(0, Math.min(this.frames().length - 1, Math.round(this.position() - .25))));
  readonly closing = computed(() => Math.max(0, Math.min(1, (this.position() - this.frames().length + .7) / .45)));
  readonly states = computed(() => this.frames().map((_, index) => {
    const state = careerAgendaFrame(this.position(), index, this.frames().length);
    const last = index === this.frames().length - 1;
    return { ...state, offset: state.offset - this.closing() * (last ? .7 : 1), opacity: state.opacity * (last ? 1 : 1 - this.closing()) };
  }));
  readonly counter = computed(() => `${String(this.active() + 1).padStart(2, '0')} / ${String(this.frames().length).padStart(2, '0')}`);

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      this.view = view;
      const reduced = view.matchMedia('(prefers-reduced-motion: reduce), (max-height: 560px)');
      this.canAnimate.set(!reduced.matches);
      let frame = 0;
      const update = () => {
        frame = 0;
        const inset = this.headerHeight();
        this.inset.set(`${inset}px`);
        const rect = this.root.nativeElement.getBoundingClientRect();
        if (this.animated()) this.position.set(timelinePosition(rect.top, rect.height, view.innerHeight, inset, this.frames().length));
        const focusLine = inset + (view.innerHeight - inset) * .4;
        this.chrome.careerContext.set(this.frames().length && rect.top <= focusLine && rect.bottom > focusLine
          ? { counter: this.animated() ? this.counter() : null }
          : null);
      };
      const schedule = () => { if (!frame) frame = view.requestAnimationFrame(update); };
      const motionChanged = () => { this.canAnimate.set(!reduced.matches); schedule(); };
      const resize = new ResizeObserver(schedule);
      resize.observe(this.root.nativeElement);
      const header = this.document.querySelector('app-site-header');
      if (header) resize.observe(header);
      view.addEventListener('scroll', schedule, { passive: true });
      view.addEventListener('resize', schedule);
      reduced.addEventListener('change', motionChanged);
      schedule();
      // Real anchor stops keep links from the editor and old /trajetoria URLs usable.
      const anchorFrame = view.requestAnimationFrame(() => {
        const anchor = view.location.hash.slice(1);
        const index = this.frames().findIndex(item => item.anchor === anchor);
        if (index >= 0 && this.animated()) this.goTo(index);
      });
      this.destroyRef.onDestroy(() => {
        view.cancelAnimationFrame(frame);
        view.cancelAnimationFrame(anchorFrame);
        view.removeEventListener('scroll', schedule);
        view.removeEventListener('resize', schedule);
        reduced.removeEventListener('change', motionChanged);
        resize.disconnect();
        this.chrome.careerContext.set(null);
      });
    });
  }
  private headerHeight() {
    return this.document.querySelector('app-site-header')?.getBoundingClientRect().height ?? 90;
  }
  goTo(index: number) {
    const target = this.frames()[index];
    if (!target || !this.view) return;
    const anchor = this.document.getElementById(target.anchor);
    if (!anchor) return;
    this.view.scrollTo({ top: this.view.scrollY + anchor.getBoundingClientRect().top - this.headerHeight(), behavior: 'instant' });
  }
  toggleMotion() {
    let index = this.active();
    if (!this.animated()) {
      const center = (this.headerHeight() + (this.view?.innerHeight ?? 800)) / 2;
      const visible = [...this.root.nativeElement.querySelectorAll<HTMLElement>('[data-frame-index]')];
      const nearest = visible.reduce<HTMLElement | null>((best, item) => {
        const distance = (node: HTMLElement) => { const rect = node.getBoundingClientRect(); return Math.abs(rect.top + rect.height / 2 - center); };
        return !best || distance(item) < distance(best) ? item : best;
      }, null);
      index = Number(nearest?.dataset['frameIndex'] ?? 0);
    }
    this.motionChoice.set(!this.animated());
    this.view?.requestAnimationFrame(() => { if (!this.destroyRef.destroyed) this.goTo(index); });
  }
}
