import type { Entry, Media } from './models';

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const PRIVATE_MEDIA = /^draft-media:\/\/([a-f0-9-]+\/[a-f0-9-]+\.(?:jpg|png|webp))$/i;
export function privateImagePath(url: string, supabaseUrl: string, savedPath?: string) {
  if (savedPath) return savedPath;
  const reference = PRIVATE_MEDIA.exec(url)?.[1];
  if (reference) return reference;
  try {
    const parsed = new URL(url);
    if (parsed.origin !== supabaseUrl) return undefined;
    const prefix = '/storage/v1/object/sign/editor-media/';
    if (!parsed.pathname.startsWith(prefix)) return undefined;
    const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
    return PRIVATE_MEDIA.test('draft-media://' + path) ? path : undefined;
  } catch {
    return undefined;
  }
}
export function newMediumEntries(incoming: Entry[], existing: Entry[]) {
  const ids = new Set(existing.map((e) => e.id));
  const urls = new Set(existing.map((e) => e.sourceUrl));
  return incoming.filter((e) => {
    if (ids.has(e.id) || (e.sourceUrl && urls.has(e.sourceUrl))) return false;
    ids.add(e.id);
    if (e.sourceUrl) urls.add(e.sourceUrl);
    return true;
  });
}
export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
    .replace(/-$/, '');
}
export function safeMediaUrl(value: string) {
  if (/^\/images\/[a-z0-9._/-]+$/i.test(value) && !value.includes('..')) return true;
  if (/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(value)) return true;
  if (PRIVATE_MEDIA.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
export function validateDraft(value: unknown): Entry {
  if (!value || typeof value !== 'object') throw new Error('Arquivo de rascunho inválido.');
  const e = value as Record<string, unknown>;
  const text = (key: string, max: number, optional = false): string => {
    const v = e[key];
    if (optional && v == null) return '';
    if (typeof v !== 'string' || v.length > max)
      throw new Error('O rascunho contém um campo inválido: ' + key + '.');
    return v;
  };
  const id = text('id', 36);
  const slug = text('slug', 120);
  if (!UUID.test(id) || (slug && !SLUG.test(slug)))
    throw new Error('O endereço ou identificador do rascunho é inválido.');
  if (
    !['article', 'moment', 'story'].includes(String(e['kind'])) ||
    !['Código', 'Vida', 'Roça'].includes(String(e['category']))
  )
    throw new Error('O formato ou assunto do rascunho é inválido.');
  if (!Array.isArray(e['images']) || e['images'].length > 50)
    throw new Error('A lista de imagens é inválida.');
  const images: Media[] = e['images'].map((v: unknown) => {
    if (!v || typeof v !== 'object') throw new Error('Imagem inválida.');
    const m = v as Record<string, unknown>;
    if (
      typeof m['url'] !== 'string' ||
      !safeMediaUrl(m['url']) ||
      typeof m['caption'] !== 'string' ||
      m['caption'].length > 1000
    )
      throw new Error('A imagem contém um endereço ou legenda inválidos.');
    if (m['alt'] != null && (typeof m['alt'] !== 'string' || m['alt'].length > 1000))
      throw new Error('Descrição de imagem inválida.');
    if (
      m['storagePath'] != null &&
      (typeof m['storagePath'] !== 'string' ||
        !PRIVATE_MEDIA.test('draft-media://' + m['storagePath']))
    )
      throw new Error('Referência de imagem inválida.');
    return {
      url: m['url'],
      caption: m['caption'],
      alt: m['alt'] as string | undefined,
      storagePath: m['storagePath'] as string | undefined,
    };
  });
  const publishedAt = text('publishedAt', 50, true);
  if (publishedAt && !Number.isFinite(Date.parse(publishedAt)))
    throw new Error('Data de publicação inválida.');
  const sourceUrl = text('sourceUrl', 2000, true);
  if (sourceUrl && !/^https:\/\/medium\.com\//.test(sourceUrl))
    throw new Error('Origem do texto inválida.');
  const articleSlug = text('articleSlug', 120, true);
  if (articleSlug && !SLUG.test(articleSlug)) throw new Error('Texto relacionado inválido.');
  return {
    id,
    slug,
    kind: e['kind'] as Entry['kind'],
    category: e['category'] as Entry['category'],
    title: text('title', 180),
    excerpt: text('excerpt', 400),
    html: text('html', 32 * 1024 * 1024),
    status: 'draft',
    images,
    publishedAt,
    sourceUrl: sourceUrl || undefined,
    year: text('year', 80, true),
    place: text('place', 180, true),
    company: text('company', 180, true),
    reflection: text('reflection', 400, true),
    articleSlug: articleSlug || undefined,
  };
}
export function mergeDrafts(remote: Entry[], local: Entry[]) {
  const result = new Map(remote.map((e) => [e.id, e]));
  for (const e of local) {
    const other = result.get(e.id);
    if (!other || (e.savedAt || '') > (other.updatedAt || ''))
      result.set(e.id, { ...e, updatedAt: other?.updatedAt });
  }
  return [...result.values()].sort((a, b) =>
    (b.savedAt || b.updatedAt || '').localeCompare(a.savedAt || a.updatedAt || ''),
  );
}
export function rowToEntry(row: Record<string, any>): Entry {
  return {
    id: row['id'],
    slug: row['slug'],
    kind: row['kind'],
    title: row['title'],
    excerpt: row['excerpt'],
    category: row['category'],
    html: row['body_html'],
    status: row['status'],
    publishedAt: row['published_at'],
    images: row['images'] || [],
    year: row['year'],
    place: row['place'],
    company: row['company'],
    sourceUrl: row['source_url'] || undefined,
    reflection: row['reflection'] || undefined,
    articleSlug: row['article_slug'] || undefined,
    updatedAt: row['updated_at'],
    baseRevision: row['base_revision'] || undefined,
  };
}
