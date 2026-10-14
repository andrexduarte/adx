import { SEED_ENTRIES } from './app/core/content/seed';
import { siteConfig } from './app/core/config/site-config';
interface FeedEntry {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export async function createFeed() {
  let articles: FeedEntry[] = SEED_ENTRIES.filter((e) => e.kind === 'article');
  if (siteConfig.supabaseUrl && siteConfig.publishableKey) {
    const response = await fetch(
      siteConfig.supabaseUrl +
        '/rest/v1/content?select=slug,title,excerpt,published_at&kind=eq.article&status=eq.published&order=published_at.desc',
      {
        headers: { apikey: siteConfig.publishableKey },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) throw new Error('Could not load the published feed.');
    const remote = (
      (await response.json()) as {
        slug: string;
        title: string;
        excerpt: string;
        published_at: string;
      }[]
    ).map((e) => ({ ...e, publishedAt: e.published_at }));
    articles = remote;
  }
  articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Caderno de André Duarte</title><link>https://andre.is-a.dev/caderno</link><description>Textos sobre código, vida e roça.</description><language>pt-br</language>' +
    articles
      .map(
        (a) =>
          '<item><title>' +
          escape(a.title) +
          '</title><link>https://andre.is-a.dev/caderno/' +
          a.slug +
          '</link><guid>https://andre.is-a.dev/caderno/' +
          a.slug +
          '</guid><pubDate>' +
          new Date(a.publishedAt).toUTCString() +
          '</pubDate><description>' +
          escape(a.excerpt) +
          '</description></item>',
      )
      .join('') +
    '</channel></rss>'
  );
}
