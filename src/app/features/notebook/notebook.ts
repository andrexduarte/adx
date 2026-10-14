import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../core/content/content-store';
import { Seo } from '../../core/seo/seo';
@Component({
  imports: [RouterLink, DatePipe],
  templateUrl: './notebook.html',
  styleUrl: './notebook.scss',
})
export class Notebook {
  readonly content = inject(ContentStore);
  readonly category = signal('Todos');
  readonly search = signal('');
  readonly categories = ['Todos', 'Código', 'Vida', 'Roça'];
  readonly articles = computed(() =>
    this.content
      .articles()
      .filter((e) => this.category() === 'Todos' || e.category === this.category())
      .filter(
        (e) =>
          !this.search() ||
          [e.title, e.excerpt, e.html.replace(/<[^>]*>/g, ' ')]
            .join(' ')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(
              this.search()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim(),
            ),
      ),
  );
  constructor() {
    inject(Seo).set(
      'Caderno aberto',
      'Textos sobre front-end, vida na roça e pensamentos em movimento.',
      '/caderno',
    );
  }
  searched(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
