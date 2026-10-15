import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  set(title: string, description: string, path = '/', canonicalUrl?: string, publishedAt?: string) {
    this.title.setTitle(title === 'André Duarte' ? title : title + ' · André Duarte');
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({
      property: 'og:type',
      content: path.startsWith('/caderno/') ? 'article' : 'website',
    });
    this.meta.updateTag({ property: 'og:url', content: 'https://andre.is-a.dev' + path });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://andre.is-a.dev/images/cerrado-xilogravura.jpg',
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({
      name: 'robots',
      content: path.startsWith('/admin') ? 'noindex, nofollow' : 'index, follow',
    });
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl || 'https://andre.is-a.dev' + path;
    let schema = this.document.querySelector<HTMLScriptElement>('script[data-seo]');
    schema?.remove();
    if (path === '/' || path.startsWith('/caderno/')) {
      schema = this.document.createElement('script');
      schema.type = 'application/ld+json';
      schema.setAttribute('data-seo', '');
      const person = {
        '@type': 'Person',
        name: 'André Duarte',
        url: 'https://andre.is-a.dev',
        sameAs: [
          'https://github.com/andrexduarte',
          'https://www.linkedin.com/in/andrexdev/',
          'https://medium.com/@andre_amaral',
        ],
      };
      const structured =
        path === '/'
          ? { '@context': 'https://schema.org', ...person }
          : {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: title,
              description,
              author: person,
              mainEntityOfPage: canonical.href,
              datePublished: publishedAt,
              inLanguage: 'pt-BR',
            };
      schema.textContent = JSON.stringify(structured).replace(/</g, '\\u003c');
      this.document.head.appendChild(schema);
    }
  }
}
