import {
  Component,
  inject,
  computed,
  signal,
  afterNextRender,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../core/content/content-store';
import { Seo } from '../../core/seo/seo';
import { Timeline } from '../timeline/timeline';
import { InterfaceWorkshop } from './interface-workshop/interface-workshop';

@Component({
  imports: [RouterLink, DatePipe, Timeline, InterfaceWorkshop],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly content = inject(ContentStore);
  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly activeSection = signal<string | null>(null);
  readonly readingMoment = signal('Do presente ao começo');
  readonly currentWork = computed(() =>
    this.content
      .entries()
      .find(
        (entry) =>
          entry.kind === 'moment' &&
          entry.status === 'published' &&
          entry.company === 'Trade Arena',
      ),
  );
  readonly hasJourney = computed(() =>
    this.content
      .entries()
      .some(
        (entry) =>
          entry.kind === 'moment' && entry.status === 'published' && entry.slug !== 'agora',
      ),
  );
  readonly featuredArticle = computed(
    () =>
      this.content.articles().find((article) => article.category === 'Código') ??
      this.content.articles()[0],
  );
  readonly otherArticles = computed(() => {
    const remaining = this.content
      .articles()
      .filter((article) => article.id !== this.featuredArticle()?.id);
    const selection = ['Vida', 'Roça'].flatMap((category) => {
      const article = remaining.find((item) => item.category === category);
      return article ? [article] : [];
    });
    return [...selection, ...remaining.filter((article) => !selection.includes(article))].slice(
      0,
      2,
    );
  });

  constructor() {
    inject(Seo).set(
      'André Duarte',
      'Desenvolvedor Front-end. Angular, TypeScript e RxJS. Interfaces acessíveis, performáticas e código sustentável.',
    );
    afterNextRender(() => {
      let frame = 0;
      const updateSection = () => {
        frame = 0;
        const navigation = this.root.nativeElement.querySelector('.crossing');
        const readingLine = (navigation?.getBoundingClientRect().bottom ?? 160) + 48;
        const sections = Array.from(
          this.root.nativeElement.querySelectorAll('.hero-scroll, .stop'),
        );
        const current = sections
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= readingLine);
        this.activeSection.set(current && current.id !== 'apresentacao' ? current.id : null);
      };
      const scheduleUpdate = () => {
        if (!frame) frame = window.requestAnimationFrame(updateSection);
      };
      const resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(this.root.nativeElement);
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      window.addEventListener('resize', scheduleUpdate);
      updateSection();
      this.destroyRef.onDestroy(() => {
        window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        window.removeEventListener('scroll', scheduleUpdate);
        window.removeEventListener('resize', scheduleUpdate);
      });
    });
  }
}
