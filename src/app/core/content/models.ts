export type ContentKind = 'article' | 'moment' | 'story';
export type Category = 'Código' | 'Vida' | 'Roça';
export interface Media {
  url: string;
  caption: string;
  alt?: string;
  storagePath?: string;
}
export interface Entry {
  id: string;
  slug: string;
  kind: ContentKind;
  title: string;
  excerpt: string;
  category: Category;
  html: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  images: Media[];
  sourceUrl?: string;
  year?: string;
  place?: string;
  company?: string;
  reflection?: string;
  articleSlug?: string;
  updatedAt?: string;
  savedAt?: string;
  baseRevision?: string;
}
export interface Moment {
  id: string;
  year: string;
  place: string;
  title: string;
  company: string;
  period: string;
  paragraphs: string[];
  highlights?: string[];
  reflection?: string;
  articleSlug?: string;
  html?: string;
}
