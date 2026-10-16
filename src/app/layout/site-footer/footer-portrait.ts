import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { PortraitDot, PORTRAIT_TITLE, portraitDotPosition, portraitFrame, portraitNoise, portraitProgress, samplePortrait } from './portrait-playback';
import { PageChrome } from '../../core/ui/page-chrome';

@Component({
  selector: 'app-footer-portrait',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer-portrait.html',
  styleUrl: './footer-portrait.scss',
  host: {
    id: 'encerramento', '[class.animated]': 'animated()', '[class.ready]': 'ready()',
    '[attr.data-progress]': 'progress().toFixed(3)',
  },
})
export class FooterPortrait {
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly chrome = inject(PageChrome);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly portrait = viewChild.required<ElementRef<HTMLImageElement>>('portrait');
  private readonly portraitTarget = viewChild.required<ElementRef<HTMLElement>>('portraitTarget');
  private readonly composition = viewChild.required<ElementRef<HTMLElement>>('composition');
  private view: Window | null = null;
  private schedule = () => {};
  private readonly canAnimate = signal(false);
  private readonly choice = signal<boolean | null>(null);
  readonly animated = computed(() => this.choice() ?? this.canAnimate());
  readonly ready = signal(false);
  private readonly centerOffset = signal(0);
  readonly progress = signal(0);
  readonly frame = computed(() => portraitFrame(this.animated() ? this.progress() : 1));
  readonly portraitShift = computed(() => this.centerOffset() * (1 - this.frame().lift));
  readonly title = PORTRAIT_TITLE;
  readonly technologies = [
    { name: 'Codex', icon: 'codex' },
    { name: 'Angular', icon: 'angular' }, { name: 'TypeScript', icon: 'typescript' },
    { name: 'SCSS', icon: 'sass' }, { name: 'RxJS', icon: 'reactivex' },
    { name: 'Supabase', icon: 'supabase' }, { name: 'Git', icon: 'git' },
  ];

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      this.view = view;
      const canvas = this.canvas().nativeElement;
      const context = canvas.getContext('2d');
      const media = view.matchMedia('(prefers-reduced-motion: reduce), (max-height: 560px)');
      this.canAnimate.set(!media.matches && !!context);
      const image = this.portrait().nativeElement;
      let dots: PortraitDot[] = [];
      let frameId = 0, near = false, width = 0, height = 0;
      let box = { x: 0, y: 0, size: 300 };

      const measure = () => {
        const rect = this.stage().nativeElement.getBoundingClientRect();
        width = rect.width; height = rect.height;
        const portrait = this.portraitTarget().nativeElement.getBoundingClientRect();
        box = { x: portrait.left - rect.left, y: portrait.top - rect.top, size: portrait.width };
        this.centerOffset.set((height - box.size) / 2 - box.y);
        const ratio = Math.min(view.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      };
      const draw = () => {
        if (!context || !this.ready()) return;
        context.clearRect(0, 0, width, height);
        const state = this.frame();
        const colors = ['#ede4cf', '#aaa08c', '#bd5d3f'];
        // Quiet background points remain after the portrait has assembled.
        context.fillStyle = '#e7dfce';
        context.globalAlpha = .16 - state.formation * .07;
        context.beginPath();
        for (let i = 0; i < 250; i++) {
          const x = portraitNoise(i, 20) * width, y = portraitNoise(i, 21) * height;
          context.moveTo(x + .65, y); context.arc(x, y, .65, 0, Math.PI * 2);
        }
        context.fill();
        const target = { ...box, y: box.y + this.portraitShift() };
        for (let color = 0; color < colors.length; color++) {
            context.fillStyle = colors[color];
            context.globalAlpha = .38 + .62 * state.formation;
            context.beginPath();
            for (const dot of dots) {
              if (dot.color !== color) continue;
              const point = portraitDotPosition(dot, state.formation, width, height, target);
              const radius = dot.radius * (.75 + .25 * state.formation) * Math.min(1, box.size / 280);
              context.moveTo(point.x + radius, point.y); context.arc(point.x, point.y, radius, 0, Math.PI * 2);
            }
            context.fill();
        }
        context.globalAlpha = 1;
      };
      const update = () => {
        frameId = 0;
        const rect = this.root.nativeElement.getBoundingClientRect();
        const theme = this.document.documentElement;
        const closingVisible = rect.top < view.innerHeight * .2 && rect.bottom > 0;
        this.chrome.hideHeader.set(closingVisible);
        if (closingVisible) theme.dataset['showcase'] = 'footer';
        else if (theme.dataset['showcase'] === 'footer') delete theme.dataset['showcase'];
        this.progress.set(portraitProgress(rect.top, rect.height, view.innerHeight, 0));
        if (near) draw();
      };
      this.schedule = () => { if (!frameId) frameId = view.requestAnimationFrame(update); };
      const prepare = () => {
        if (this.ready() || !image.naturalWidth || !context) return;
        const sample = this.document.createElement('canvas');
        sample.width = sample.height = 224;
        const sampleContext = sample.getContext('2d', { willReadFrequently: true });
        if (!sampleContext) return;
        try {
          sampleContext.drawImage(image, 0, 0, 224, 224);
          dots = samplePortrait(sampleContext.getImageData(0, 0, 224, 224).data, 224, 224);
          measure(); this.ready.set(true); this.schedule();
        } catch { this.canAnimate.set(false); }
      };
      const imageError = () => this.canAnimate.set(false);
      const observe = new IntersectionObserver(([entry]) => {
        near = entry.isIntersecting;
        if (near) { prepare(); this.schedule(); }
      }, { rootMargin: '1000px 0px' });
      observe.observe(this.root.nativeElement);
      image.addEventListener('load', prepare);
      image.addEventListener('error', imageError);
      const resized = () => { measure(); this.schedule(); };
      const resize = new ResizeObserver(resized);
      resize.observe(this.stage().nativeElement);
      resize.observe(image);
      resize.observe(this.composition().nativeElement);
      const motionChanged = () => { this.canAnimate.set(!media.matches && !!context); this.schedule(); };
      view.addEventListener('scroll', this.schedule, { passive: true });
      view.addEventListener('resize', resized);
      media.addEventListener('change', motionChanged);
      measure(); this.schedule();
      this.destroyRef.onDestroy(() => {
        view.cancelAnimationFrame(frameId);
        view.removeEventListener('scroll', this.schedule);
        view.removeEventListener('resize', resized);
        media.removeEventListener('change', motionChanged);
        image.removeEventListener('load', prepare);
        image.removeEventListener('error', imageError);
        resize.disconnect(); observe.disconnect();
        this.chrome.hideHeader.set(false);
        if (this.document.documentElement.dataset['showcase'] === 'footer') delete this.document.documentElement.dataset['showcase'];
      });
    });
  }
  seek(progress: number) {
    if (!this.view) return;
    const rect = this.root.nativeElement.getBoundingClientRect();
    this.view.scrollTo({ top: this.view.scrollY + rect.top + progress * Math.max(0, rect.height - this.view.innerHeight), behavior: 'instant' });
    this.schedule();
  }
  toggleMotion() {
    this.choice.set(!this.animated());
    this.view?.requestAnimationFrame(() => { if (!this.destroyRef.destroyed) { this.seek(this.animated() ? .01 : 0); this.schedule(); } });
  }
}
