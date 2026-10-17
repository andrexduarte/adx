import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, afterRenderEffect, computed, inject, input, signal, viewChild } from '@angular/core';
import { clamp } from './story-timing';

@Component({
  selector: 'app-responsive-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ruler" aria-hidden="true"><span [class.active]="compact() < .05">Desktop</span><i></i><span class="width">{{ width() }} px</span><i></i><span [class.active]="compact() > .95">Celular</span></div>
    <div class="viewport-stage" [style.height.px]="staticMode() ? null : height() * (fitHeight() ? scale() : 1)" role="group" [attr.aria-label]="label()">
      <div #viewport class="viewport" [style.width.px]="staticMode() ? null : width()" [style.height.px]="staticMode() ? null : height()" [style.transform]="staticMode() ? null : 'translate(-50%, -50%) scale(' + scale() + ')'" [attr.tabindex]="pan() === null && !staticMode() ? 0 : null" [attr.aria-label]="staticMode() ? 'Interface demonstrativa' : pan() === null ? 'Interface demonstrativa; role dentro dela para ver todo o conteúdo' : 'Interface demonstrativa acompanhando a rolagem da página'">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './responsive-preview.scss',
  host: { '[class.static]': 'staticMode()', '[class.light]': 'light()', '[class.controlled]': '!staticMode() && pan() !== null' },
})
export class ResponsivePreview {
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  readonly compact = input(0);
  readonly height = input(410);
  readonly desktopWidth = input(900);
  readonly pan = input<number | null>(null);
  readonly fitHeight = input(false);
  readonly staticMode = input(false);
  readonly light = input(false);
  readonly label = input('A mesma interface se adapta de desktop para celular');
  readonly available = signal(900);
  readonly width = computed(() => Math.round(this.desktopWidth() - (this.desktopWidth() - 360) * clamp(this.compact())));
  readonly scale = computed(() => Math.min(1, this.available() / this.width()));
  constructor() {
    afterRenderEffect(() => {
      const pan = this.pan();
      const viewport = this.viewport()?.nativeElement;
      this.width(); this.height(); this.available();
      if (this.staticMode() || pan === null || !viewport) return;
      viewport.scrollTop = clamp(pan) * Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    });
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) => this.available.set(entry.contentRect.width));
      observer.observe(this.root.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
