import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const blend = (start: number, end: number, progress: number) => start + (end - start) * progress;
const phase = (value: number, start: number, end: number) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};

@Component({
  selector: 'app-interface-workshop',
  templateUrl: './interface-workshop.html',
  styleUrl: './interface-workshop.scss',
  host: { '[class.in-view]': 'inView()' },
})
export class InterfaceWorkshop {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly progress = signal(0);
  readonly inView = signal(false);
  readonly scene = computed(() => {
    const progress = this.progress();
    const frame = phase(progress, 0.08, 0.83);
    const content = phase(progress, 0.2, 0.92);
    const button = phase(progress, 0.12, 0.86);
    const left = blend(260, 422, frame);
    const right = blend(840, 686, frame);
    const buttonLeft = blend(302, 444, button);
    const buttonRight = blend(798, 664, button);
    const footstep = Math.sin(button * Math.PI * 6) * Math.sin(button * Math.PI) * 7;
    const lean = Math.sin(frame * Math.PI * 4) * Math.sin(frame * Math.PI) * 4;
    const featureBottom = blend(330, 262, content);

    return {
      left,
      right,
      top: blend(80, 45, frame),
      width: right - left,
      height: blend(550, 585, frame),
      barHeight: blend(50, 40, frame),
      sidebarOpacity: 1 - phase(progress, 0.03, 0.35),
      menuOpacity: phase(progress, 0.58, 0.9),
      platformY: featureBottom + 8,
      braceLength: Math.hypot(right - left + 76, 330),
      braceAngle: (-Math.atan2(330, right - left + 76) * 180) / Math.PI,
      feature: {
        x: blend(434, 444, content),
        y: blend(150, 130, content),
        width: blend(382, 220, content),
        height: blend(180, 132, content),
      },
      cards: [0, 1, 2].map((index) => {
        const movement = phase(progress, 0.18 + index * 0.07, 0.78 + index * 0.07);
        return {
          id: index,
          x: blend(434 + index * 133, 444, movement),
          y: blend(358, 284 + index * 84, movement),
          width: blend(116, 220, movement),
          height: blend(138, 66, movement),
          imageWidth: blend(88, 42, movement),
          imageHeight: blend(58, 40, movement),
          lineX: blend(14, 70, movement),
          lineY: blend(94, 24, movement),
          lineWidth: blend(86, 132, movement),
        };
      }),
      button: { x: buttonLeft, width: buttonRight - buttonLeft },
      workers: [
        {
          id: 'rigger',
          offsetX: 0,
          offsetY: 0,
          x: left - 204,
          y: blend(54, 19, frame),
          size: 260,
          rotation: lean,
        },
        {
          id: 'assembler',
          offsetX: -512,
          offsetY: 0,
          x: right - 222,
          y: featureBottom - 206,
          size: 220,
          rotation: -lean,
        },
        {
          id: 'fitter',
          offsetX: -1024,
          offsetY: 0,
          x: right - 44,
          y: 207,
          size: 250,
          rotation: lean * 0.5,
        },
        {
          id: 'carrier-left',
          offsetX: 0,
          offsetY: -512,
          x: buttonLeft - 224,
          y: 440 + footstep,
          size: 250,
          rotation: -lean * 0.6,
        },
        {
          id: 'carrier-right',
          offsetX: -512,
          offsetY: -512,
          x: buttonRight - 61,
          y: 436 - footstep,
          size: 250,
          rotation: lean * 0.6,
        },
        {
          id: 'planner',
          offsetX: -1024,
          offsetY: -512,
          x: left - 285,
          y: 493,
          size: 190,
          rotation: -lean * 0.3,
        },
      ],
    };
  });

  constructor() {
    // SVG image references are discovered late by the preload scanner.
    const document = inject(DOCUMENT);
    const preloads = ['engraving-atlas', 'workers-atlas-v2'].map((atlas) => {
      const href = '/images/workshop/' + atlas + '.webp';
      const existing = document.head.querySelector<HTMLLinkElement>(
        'link[rel="preload"][href="' + href + '"]',
      );
      if (existing) return existing;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.setAttribute('as', 'image');
      link.type = 'image/webp';
      link.href = href;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      return link;
    });
    this.destroyRef.onDestroy(() => preloads.forEach((link) => link.remove()));

    afterNextRender(() => {
      const host = this.element.nativeElement;
      const track = host.closest<HTMLElement>('.hero-scroll');
      const art = host.closest<HTMLElement>('.hero-art');
      if (!track || !art) return;

      const visibility = new IntersectionObserver(([entry]) =>
        this.inView.set(entry.isIntersecting),
      );
      visibility.observe(host);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const compactViewport = window.matchMedia('(max-width: 760px)');
      let frame = 0;
      const update = () => {
        frame = 0;
        if (reducedMotion.matches) {
          this.progress.set(0);
          return;
        }
        const mobile = compactViewport.matches;
        const region = mobile ? art : track;
        const pinned = mobile ? host : track.querySelector<HTMLElement>('.hero');
        if (!pinned) return;
        const pinTop = Number.parseFloat(getComputedStyle(pinned).top) || 0;
        const distance = Math.max(1, region.offsetHeight - pinned.offsetHeight);
        this.progress.set(clamp((pinTop - region.getBoundingClientRect().top) / distance));
      };
      const scheduleUpdate = () => {
        if (!frame) frame = window.requestAnimationFrame(update);
      };
      const resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(track);
      resizeObserver.observe(host);
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      window.addEventListener('resize', scheduleUpdate);
      reducedMotion.addEventListener('change', scheduleUpdate);
      update();

      this.destroyRef.onDestroy(() => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scheduleUpdate);
        window.removeEventListener('resize', scheduleUpdate);
        reducedMotion.removeEventListener('change', scheduleUpdate);
        resizeObserver.disconnect();
        visibility.disconnect();
      });
    });
  }
}
