import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { clamp } from './story-timing';

@Component({
  selector: 'app-responsive-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ruler" aria-hidden="true"><span [class.active]="compact() < .05">Desktop</span><i></i><span class="width">{{ width() }} px</span><i></i><span [class.active]="compact() > .95">Celular</span></div>
    <div class="viewport-stage" [style.height.px]="staticMode() ? null : height()" role="group" [attr.aria-label]="label()">
      <div class="viewport" [style.width.px]="staticMode() ? null : width()" [style.height.px]="staticMode() ? null : height()" [style.transform]="staticMode() ? null : 'translate(-50%, -50%) scale(' + scale() + ')'" tabindex="0" aria-label="Interface demonstrativa; role dentro dela para ver todo o conteúdo">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './responsive-preview.scss',
  host: { '[class.static]': 'staticMode()', '[class.light]': 'light()' },
})
export class ResponsivePreview {
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly compact = input(0);
  readonly height = input(410);
  readonly staticMode = input(false);
  readonly light = input(false);
  readonly label = input('A mesma interface se adapta de desktop para celular');
  readonly available = signal(900);
  readonly width = computed(() => Math.round(900 - 540 * clamp(this.compact())));
  readonly scale = computed(() => Math.min(1, this.available() / this.width()));
  constructor() {
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) => this.available.set(entry.contentRect.width));
      observer.observe(this.root.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
