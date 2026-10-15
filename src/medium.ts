import { XMLParser } from 'fast-xml-parser';
import { createHash } from 'node:crypto';
import type { Entry } from './app/core/content/models';
import { slugify } from './app/core/content/content-utils';

export function parseMediumFeed(xml: string): Entry[] {
  if (xml.length > 2 * 1024 * 1024 || /<!DOCTYPE|<!ENTITY/i.test(xml))
    throw new Error('Invalid Medium feed.');
  const parsed = new XMLParser({ parseTagValue: false, trimValues: false }).parse(xml);
  const items = parsed?.rss?.channel?.item;
  if (!items) throw new Error('Invalid Medium feed.');
  return (Array.isArray(items) ? items : [items]).slice(0, 20).map((item) => {
    if (
      typeof item.title !== 'string' ||
      typeof item.link !== 'string' ||
      typeof item['content:encoded'] !== 'string'
    )
      throw new Error('Invalid Medium post.');
    const sourceUrl = item.link.split('?')[0];
    const postId = /^https:\/\/medium\.com\/@andre_amaral\/[^/]+-([a-f0-9]{12})$/.exec(
      sourceUrl,
    )?.[1];
    if (!postId || !Number.isFinite(Date.parse(item.pubDate)))
      throw new Error('Invalid Medium post.');
    const hex = createHash('sha256')
      .update('andre.is-a.dev:medium:' + postId)
      .digest('hex');
    const id = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      '5' + hex.slice(13, 16),
      'a' + hex.slice(17, 20),
      hex.slice(20, 32),
    ].join('-');
    const html = item['content:encoded'].replace(/<img\b[^>]*>/gi, (tag: string) =>
      /medium\.com\/_\/stat/i.test(tag) ? '' : tag,
    );
    const text = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      id,
      slug: slugify(item.title),
      kind: 'article',
      title: item.title.slice(0, 180),
      excerpt: text.slice(0, 165).replace(/\s+\S*$/, '') + (text.length > 165 ? '…' : ''),
      category: 'Vida',
      html,
      status: 'draft',
      publishedAt: new Date(item.pubDate).toISOString(),
      images: [],
      sourceUrl,
    };
  });
}
let cache: { entries: Entry[]; until: number } | undefined;
let pending: Promise<Entry[]> | undefined;
export async function readMediumFeed() {
  if (cache && cache.until > Date.now()) return cache.entries;
  pending ||= (async () => {
    const response = await fetch('https://medium.com/feed/@andre_amaral', {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok || !response.body) throw new Error('Medium unavailable.');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 2 * 1024 * 1024) throw new Error('Medium feed too large.');
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
    }
    const entries = parseMediumFeed(Buffer.concat(chunks).toString('utf8'));
    cache = { entries, until: Date.now() + 10 * 60 * 1000 };
    return entries;
  })().finally(() => {
    pending = undefined;
  });
  return pending;
}
