import { Component, computed, effect, inject, RESPONSE_INIT } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentStore } from '../../../core/content/content-store';
import { Seo } from '../../../core/seo/seo';
@Component({
  imports: [DatePipe, RouterLink],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentStore);
  private readonly seo = inject(Seo);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly article = computed(() =>
    this.content.articles().find((e) => e.slug === this.params().get('slug')),
  );
  readonly unavailable = computed(() => this.content.connectionError());
  constructor() {
    effect(() => {
      const article = this.article();
      if (article)
        this.seo.set(
          article.title,
          article.excerpt,
          '/caderno/' + article.slug,
          article.sourceUrl,
          article.publishedAt,
        );
      else {
        if (this.response) this.response.status = this.content.connectionError() ? 503 : 404;
        this.seo.set(
          this.unavailable() ? 'Texto temporariamente indisponível' : 'Texto não encontrado',
          'Este texto ainda não está disponível.',
          '/caderno',
        );
      }
    });
  }
}
