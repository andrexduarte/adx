import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, afterRenderEffect, computed, inject, input, signal, viewChild } from '@angular/core';
import { LeagueDemoFeed } from './league-demo-feed';
import { LeagueDemoRanking } from './league-demo-ranking';
import { LeagueDemoStatistics } from './league-demo-statistics';

type LeagueView = 'feed' | 'ranking' | 'statistics';
const clamp = (value: number) => Math.min(1, Math.max(0, value));

@Component({
  selector: 'app-league-demo',
  imports: [LeagueDemoFeed, LeagueDemoRanking, LeagueDemoStatistics],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './league-demo.html',
  styleUrl: './league-demo.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class LeagueDemo {
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigation = viewChild<ElementRef<HTMLElement>>('navigation');
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private readonly availableWidth = signal(900);
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly view = computed<LeagueView>(() => this.progress() < .34 ? 'feed' : this.progress() < .67 ? 'ranking' : 'statistics');
  readonly localProgress = computed(() => {
    const start = this.view() === 'feed' ? 0 : this.view() === 'ranking' ? .34 : .67;
    return clamp((this.progress() - start) / (this.view() === 'feed' ? .34 : .33));
  });
  readonly tabs = [
    { id: 'feed', label: 'Feed de Atividade' },
    { id: 'tournaments', label: 'Torneios' },
    { id: 'ranking', label: 'Ranking' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'learn', label: 'Aprenda' },
    { id: 'statistics', label: 'Estatísticas' },
  ];

  constructor() {
    afterRenderEffect(() => {
      if (this.staticMode()) return;
      this.view();
      this.availableWidth();
      const progress = this.localProgress();
      const viewport = this.viewport()?.nativeElement;
      const content = this.content()?.nativeElement;
      if (viewport && content) {
        // Portfolio scroll moves the camera while the product keeps its native layout.
        const pan = clamp((progress - .24) / .64);
        viewport.scrollTop = pan * Math.max(0, content.scrollHeight - viewport.clientHeight);
      }
      const nav = this.navigation()?.nativeElement;
      const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
      if (nav && active) {
        nav.scrollLeft = Math.max(0, active.offsetLeft + active.offsetWidth / 2 - nav.clientWidth / 2);
      }
    });
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) => this.availableWidth.set(entry.contentRect.width));
      observer.observe(this.root.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
