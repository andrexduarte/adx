import { newestCareerFirst } from '../.test-output/app/core/content/career-order.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  slugify,
  validateDraft,
  safeMediaUrl,
  mergeDrafts,
  UUID,
  privateImagePath,
  newMediumEntries,
} from '../.test-output/app/core/content/content-utils.mjs';
test('private signed images retain their storage identity even when copied without custom attributes', () => {
  const path = '11111111-1111-4111-a111-111111111111/22222222-2222-4222-a222-222222222222.jpg';
  const url =
    'https://fixture.supabase.co/storage/v1/object/sign/editor-media/' + path + '?token=temporary';
  assert.equal(privateImagePath(url, 'https://fixture.supabase.co'), path);
  assert.equal(privateImagePath(url, 'https://other.supabase.co'), undefined);
  assert.equal(
    privateImagePath(url.replace('/sign/', '/public/'), 'https://fixture.supabase.co'),
    undefined,
  );
});
test('a renamed Medium post and repeated feed items cannot overwrite an existing draft', () => {
  const existing = { ...SEED_ENTRIES[0], status: 'draft', title: 'My edited draft' };
  const renamed = {
    ...existing,
    title: 'New title',
    sourceUrl: 'https://medium.com/@andre_amaral/new-title-027fe7a61221',
  };
  assert.equal(newMediumEntries([renamed], [existing]).length, 0);
  assert.equal(newMediumEntries([renamed, renamed], []).length, 1);
});
import { SEED_ENTRIES } from '../.test-output/app/core/content/seed.mjs';
import { parseMediumFeed } from '../.test-output/medium.mjs';
import { siteConfig } from '../.test-output/app/core/config/site-config.mjs';
import { createFeed } from '../.test-output/rss.mjs';
import { createSitemap } from '../.test-output/sitemap.mjs';

test('the initial content has unique stable IDs and preserves all eleven chapters', () => {
  assert.equal(SEED_ENTRIES.filter((e) => e.kind === 'moment').length, 11);
  assert.equal(SEED_ENTRIES.filter((e) => e.kind === 'article').length, 10);
  assert.equal(new Set(SEED_ENTRIES.map((e) => e.id)).size, 24);
  assert.equal(new Set(SEED_ENTRIES.map((e) => e.slug)).size, 24);
  for (const e of SEED_ENTRIES) {
    assert.ok(UUID.test(e.id));
    assert.doesNotThrow(() => validateDraft(e));
  }
  assert.match(SEED_ENTRIES.find((e) => e.slug === '2011').excerpt, /agosto de 2012/);
  assert.match(SEED_ENTRIES.find((e) => e.slug === 'agora').html, /Acauã/);
});
test('draft imports reject malformed metadata, scripts in media URLs and oversized fields', () => {
  const entry = structuredClone(SEED_ENTRIES[0]);
  assert.throws(() => validateDraft({ ...entry, id: 'not-an-id' }));
  assert.throws(() => validateDraft({ ...entry, kind: 'unknown' }));
  assert.throws(() => validateDraft({ ...entry, title: 'a'.repeat(181) }));
  assert.throws(() =>
    validateDraft({ ...entry, images: [{ url: 'javascript:alert(1)', caption: '' }] }),
  );
  assert.throws(() =>
    validateDraft({ ...entry, sourceUrl: 'https://medium.com.evil.test/article' }),
  );
  assert.equal(validateDraft(entry).status, 'draft');
  assert.ok(!safeMediaUrl('//evil.test/photo.png'));
  assert.ok(!safeMediaUrl('/images/../secret.png'));
  assert.ok(!safeMediaUrl('data:image/svg+xml;base64,AAAA'));
  assert.ok(safeMediaUrl('data:image/png;base64,AAAA'));
  assert.equal(slugify('Realização, Acauã & front-end!'), 'realizacao-acaua-front-end');
});
test('newer local edits survive cloud refresh while newer cloud edits remain available', () => {
  const base = SEED_ENTRIES[0];
  const remote = { ...base, title: 'Cloud', updatedAt: '2026-10-14T12:00:00Z' };
  const newer = { ...base, title: 'Local', savedAt: '2026-10-14T13:00:00Z', baseRevision: 'old' };
  assert.equal(mergeDrafts([remote], [newer])[0].title, 'Local');
  assert.equal(mergeDrafts([remote], [newer])[0].baseRevision, 'old');
  assert.equal(
    mergeDrafts([remote], [{ ...newer, savedAt: '2026-10-14T11:00:00Z' }])[0].title,
    'Cloud',
  );
});
const xml = (title) =>
  `<?xml version="1.0"?><rss><channel><item><title>${title}</title><link>https://medium.com/@andre_amaral/post-027fe7a61221?source=rss</link><pubDate>Mon, 26 May 2025 18:16:22 GMT</pubDate><content:encoded><![CDATA[<p>Um texto meu.</p><img src="https://cdn-images-1.medium.com/a.jpg" alt="Cerrado"><img src="https://medium.com/_/stat?event=view">]]></content:encoded></item></channel></rss>`;
test('Medium import retains real images, removes tracking and identifies posts independently of title', () => {
  const entry = parseMediumFeed(xml('Título'))[0];
  assert.match(entry.html, /a.jpg/);
  assert.doesNotMatch(entry.html, /_\/stat/);
  assert.equal(entry.id, parseMediumFeed(xml('Outro título'))[0].id);
  assert.equal(entry.id, SEED_ENTRIES[0].id);
  assert.equal(entry.status, 'draft');
  assert.throws(() => parseMediumFeed('<!DOCTYPE rss [<!ENTITY x "hello">]>' + xml('Title')));
  assert.throws(() => parseMediumFeed(xml('Title').replace('@andre_amaral', '@other-author')));
});
test('RSS and sitemap use authoritative remote content; unpublishing cannot restore seed articles', async () => {
  const originalFetch = globalThis.fetch;
  Object.assign(siteConfig, {
    supabaseUrl: 'https://fixture.supabase.co',
    publishableKey: 'sb_publishable_test',
  });
  try {
    globalThis.fetch = async () => new Response('[]', { status: 200 });
    assert.doesNotMatch(await createFeed(), /<item>/);
    const sitemap = await createSitemap();
    assert.doesNotMatch(sitemap, /\/caderno\/penar/);
    assert.doesNotMatch(sitemap, /admin/);
    globalThis.fetch = async () => new Response('', { status: 503 });
    await assert.rejects(createFeed);
    await assert.rejects(createSitemap);
  } finally {
    globalThis.fetch = originalFetch;
    Object.assign(siteConfig, { supabaseUrl: '', publishableKey: '' });
  }
});

test('career starts with the present and orders same-year jobs by their confirmed start month', () => {
  const ordered = SEED_ENTRIES.filter((e) => e.kind === 'moment').sort(newestCareerFirst);
  assert.deepEqual(
    ordered.map((e) => e.slug),
    ['agora', '2025', '2023', '2022', '2015', '2012', '2011', '2011-hollo', '2010', '2009', '2008'],
  );
  assert.equal(
    ordered.find((e) => e.company === 'Lápis Raro').excerpt,
    'Fevereiro de 2012 — agosto de 2012',
  );
  assert.equal(
    ordered.find((e) => e.company === 'hollo interact').excerpt,
    'Abril de 2011 — fevereiro de 2012',
  );
});
