import {
  Component,
  computed,
  inject,
  signal,
  afterNextRender,
  DestroyRef,
  ElementRef,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../core/content/content-store';
import { newestCareerFirst } from '../../core/content/career-order';

@Component({
  selector: 'app-timeline',
  imports: [RouterLink],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  private readonly content = inject(ContentStore);
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly activeId = signal('');
  readonly progress = signal(0);
  readonly readingChange = output<string>();
  readonly moments = computed(() =>
    this.content
      .entries()
      .filter(
        (entry) =>
          entry.kind === 'moment' && entry.status === 'published' && entry.slug !== 'agora',
      )
      .map((entry) => ({
        ...entry,
        article: this.content.articles().find((article) => article.slug === entry.articleSlug),
      }))
      .sort(newestCareerFirst),
  );

  constructor() {
    afterNextRender(() => {
      let frame = 0;
      let lastReadingLabel = '';
      const update = () => {
        frame = 0;
        const chapters = Array.from(
          this.root.nativeElement.querySelectorAll<HTMLElement>('.moment'),
        );
        const navigationBottom =
          document.querySelector('.crossing')?.getBoundingClientRect().bottom ?? 160;
        const readingLine = Math.max(navigationBottom + 48, window.innerHeight * 0.38);
        const current = [...chapters]
          .reverse()
          .find((chapter) => chapter.getBoundingClientRect().top < readingLine);
        const currentId = current?.id || 'momento-' + (this.moments()[0]?.slug ?? '');
        this.activeId.set(currentId);
        const moment = this.moments().find((item) => 'momento-' + item.slug === currentId);
        const readingLabel = moment ? `${moment.year} · ${moment.company}` : 'Trajetória';
        if (readingLabel !== lastReadingLabel) {
          lastReadingLabel = readingLabel;
          this.readingChange.emit(readingLabel);
        }
        const region = this.root.nativeElement.getBoundingClientRect();
        this.progress.set(
          region.height > 0
            ? Math.min(1, Math.max(0, (readingLine - region.top) / region.height))
            : 0,
        );
      };
      const scheduleUpdate = () => {
        if (!frame) frame = window.requestAnimationFrame(update);
      };
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      window.addEventListener('resize', scheduleUpdate);
      const resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(this.root.nativeElement);
      update();
      this.destroyRef.onDestroy(() => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scheduleUpdate);
        window.removeEventListener('resize', scheduleUpdate);
        resizeObserver.disconnect();
      });
    });
  }
}
