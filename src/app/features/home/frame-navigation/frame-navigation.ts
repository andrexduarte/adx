import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, signal } from '@angular/core';
import { ContentStore } from '../../../core/content/content-store';
import { newestCareerFirst } from '../../../core/content/career-order';
import { careerFrames } from '../../timeline/timeline-playback';
import { activePageFrame, pageFrames, PageFrame } from './frame-catalog';

@Component({
  selector: 'app-frame-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './frame-navigation.html',
  styleUrl: './frame-navigation.scss',
  host: { '[class.ready]': 'ready()', '[class.expanded]': 'expanded()' },
})
export class FrameNavigation {
  private readonly document = inject(DOCUMENT);
  private readonly content = inject(ContentStore);
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private view: Window | null = null;
  private layoutChanged = () => {};
  private pendingAnchor: string | null = null;
  readonly ready = signal(false);
  readonly expanded = signal(false);
  readonly active = signal(0);
  readonly frames = computed(() => {
    const moments = this.content.entries().filter(entry => entry.kind === 'moment' && entry.status === 'published' && entry.slug !== 'agora');
    const career = careerFrames(moments.sort(newestCareerFirst));
    const frames = pageFrames(career);
    return moments.length ? frames : frames.filter(frame => frame.region === 'hero' || frame.region === 'closing');
  });
  readonly current = computed(() => this.frames()[this.active()] ?? this.frames()[0]);

  constructor() {
    effect(() => { this.frames(); this.layoutChanged(); });
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      this.view = view;
      this.ready.set(true);
      let raf = 0;
      let restore = true;
      this.pendingAnchor = view.location.hash.slice(1);
      const sync = () => {
        raf = 0;
        const positions = this.measure();
        if (restore && this.pendingAnchor) {
          const index = this.frames().findIndex(frame => frame.id === this.pendingAnchor);
          const target = positions[index];
          if (target && Number.isFinite(target.at)) view.scrollTo({ top: target.at, behavior: 'instant' });
        }
        restore = false;
        this.active.set(activePageFrame(positions.map(position => position.start), view.scrollY));
      };
      const schedule = () => { if (!raf) raf = view.requestAnimationFrame(sync); };
      this.layoutChanged = () => { restore = true; schedule(); };
      const clearRestore = () => { this.pendingAnchor = null; };
      const hashChanged = () => { this.pendingAnchor = view.location.hash.slice(1); this.layoutChanged(); };
      const resize = new ResizeObserver(this.layoutChanged);
      for (const selector of ['main', 'app-site-header', 'app-site-footer']) {
        const element = this.document.querySelector(selector);
        if (element) resize.observe(element);
      }
      view.addEventListener('scroll', schedule, { passive: true });
      view.addEventListener('resize', this.layoutChanged);
      view.addEventListener('hashchange', hashChanged);
      view.addEventListener('wheel', clearRestore, { passive: true });
      view.addEventListener('touchstart', clearRestore, { passive: true });
      view.addEventListener('keydown', clearRestore);
      view.addEventListener('pointerdown', clearRestore, { passive: true });
      this.document.fonts.ready.then(() => { if (!this.destroyRef.destroyed) this.layoutChanged(); });
      schedule();
      this.destroyRef.onDestroy(() => {
        view.cancelAnimationFrame(raf);
        resize.disconnect();
        view.removeEventListener('scroll', schedule);
        view.removeEventListener('resize', this.layoutChanged);
        view.removeEventListener('hashchange', hashChanged);
        view.removeEventListener('wheel', clearRestore);
        view.removeEventListener('touchstart', clearRestore);
        view.removeEventListener('keydown', clearRestore);
        view.removeEventListener('pointerdown', clearRestore);
      });
    });
  }

  private measure() {
    const view = this.view;
    if (!view) return [];
    const inset = this.document.querySelector('app-site-header')?.getBoundingClientRect().height ?? 90;
    const selectors = { hero: '#apresentacao', arena: 'app-arena-story', nos: '#projeto-nos', wakawa: '#projeto-wakawa', career: 'app-timeline', closing: 'app-footer-portrait' };
    const regions = new Map<string, { root: HTMLElement; top: number; height: number; animated: boolean }>();
    for (const [name, selector] of Object.entries(selectors)) {
      const root = this.document.querySelector<HTMLElement>(selector);
      if (!root) continue;
      const rect = root.getBoundingClientRect();
      const animated = name === 'arena' ? !root.classList.contains('is-static') : root.classList.contains(name === 'career' ? 'is-animated' : 'animated');
      regions.set(name, { root, top: rect.top + view.scrollY, height: rect.height, animated });
    }
    return this.frames().map(frame => {
      if (frame.region === 'hero') return { start: 0, at: 0 };
      const region = regions.get(frame.region);
      if (!region) return { start: Infinity, at: Infinity };
      const offset = frame.region === 'closing' ? 0 : inset;
      if (region.animated) {
        const distance = Math.max(0, region.height - view.innerHeight + offset);
        const origin = region.top - offset;
        return { start: Math.max(0, origin + frame.start * distance), at: Math.max(0, origin + frame.at * distance) };
      }
      let element: Element | null | undefined = region.root;
      if (frame.region === 'arena') {
        element = region.root.querySelector(`[data-arena-scene="${frame.scene ?? 0}"]`);
        if (frame.evidence) element = element?.querySelector('.evidence') ?? element;
        else if (frame.panel !== undefined) element = element?.querySelectorAll('.panel')[frame.panel] ?? element;
      } else if (frame.region === 'nos' || frame.region === 'wakawa') {
        element = region.root.querySelector(`[data-project-scene="${frame.scene}"]`);
      } else if (frame.region === 'career') element = region.root.querySelector(`[data-frame-index="${frame.scene}"]`);
      const at = Math.max(0, (element?.getBoundingClientRect().top ?? 0) + view.scrollY - offset - 16);
      return { start: at, at };
    });
  }

  navigate(event: MouseEvent, frame: PageFrame, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.seek(frame, index);
  }
  private seek(frame: PageFrame, index: number) {
    const view = this.view;
    if (!view) return;
    const target = this.measure()[index];
    if (!target || !Number.isFinite(target.at)) return;
    this.pendingAnchor = null;
    const hash = '#' + frame.id;
    if (view.location.hash !== hash) view.history.pushState(view.history.state, '', view.location.pathname + view.location.search + hash);
    view.scrollTo({ top: target.at, behavior: 'instant' });
    this.active.set(index);
    this.expanded.set(false);
  }
  key(event: KeyboardEvent, index: number) {
    const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? this.frames().length - 1 : Math.max(0, Math.min(this.frames().length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
    this.seek(this.frames()[next], next);
    this.root.nativeElement.querySelector<HTMLAnchorElement>(`a[href="#${this.frames()[next].id}"]`)?.focus({ preventScroll: true });
  }
}
