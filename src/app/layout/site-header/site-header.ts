import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { Wordmark } from '../../shared/wordmark/wordmark';
import { PageChrome } from '../../core/ui/page-chrome';
@Component({
  selector: 'app-site-header',
  imports: [Wordmark],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: {
    '[class.hidden-for-closing]': 'chrome.hideHeader()',
    '[attr.inert]': 'chrome.hideHeader() ? "" : null',
    '[attr.aria-hidden]': 'chrome.hideHeader() ? "true" : null',
  },
})
export class SiteHeader {
  readonly chrome = inject(PageChrome);
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
