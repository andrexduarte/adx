import { SEED_ENTRIES } from './app/core/content/seed';
import { siteConfig } from './app/core/config/site-config';
export async function createSitemap() {
  let slugs = SEED_ENTRIES.filter((e) => e.kind === 'article').map((e) => e.slug);
  if (siteConfig.supabaseUrl && siteConfig.publishableKey) {
    const response = await fetch(
      siteConfig.supabaseUrl + '/rest/v1/content?select=slug&kind=eq.article&status=eq.published',
      {
        headers: { apikey: siteConfig.publishableKey },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) throw new Error('Could not load sitemap.');
    slugs = ((await response.json()) as { slug: string }[]).map((e) => e.slug);
  }
  return (
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    ['/', '/caderno', ...slugs.map((slug) => '/caderno/' + encodeURIComponent(slug))]
      .map((path) => '<url><loc>https://andre.is-a.dev' + path + '</loc></url>')
      .join('') +
    '</urlset>'
  );
}
