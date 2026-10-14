import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Wordmark } from '../../shared/wordmark/wordmark';
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, Wordmark],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  private readonly destroyRef = inject(DestroyRef);
  readonly compactBrand = signal(false);

  constructor() {
    afterNextRender(() => {
      let frame = 0;
      const update = () => {
        frame = 0;
        // Separate thresholds avoid flickering when scrolling near the boundary.
        this.compactBrand.set(window.scrollY > (this.compactBrand() ? 32 : 88));
      };
      const scheduleUpdate = () => {
        if (!frame) frame = window.requestAnimationFrame(update);
      };

      update();
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', scheduleUpdate);
        window.cancelAnimationFrame(frame);
      });
    });
  }
}
