import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import { siteConfig } from '../config/site-config';
import { Entry } from './models';
import { rowToEntry, PRIVATE_MEDIA, privateImagePath } from './content-utils';
@Injectable({ providedIn: 'root' })
export class Gateway {
  readonly configured = !!(siteConfig.supabaseUrl && siteConfig.publishableKey);
  readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  client: SupabaseClient | null = null;
  private connection: Promise<SupabaseClient> | null = null;
  privatePath(url: string, savedPath?: string) {
    return privateImagePath(url, siteConfig.supabaseUrl, savedPath);
  }
  private async connect() {
    if (!this.configured) return;
    this.connection ||= import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(siteConfig.supabaseUrl, siteConfig.publishableKey, {
        auth: {
          persistSession: this.browser,
          autoRefreshToken: this.browser,
          detectSessionInUrl: false,
        },
      }),
    );
    this.client = await this.connection;
  }
  async published(): Promise<Entry[]> {
    await this.connect();
    if (!this.client) return [];
    const { data, error } = await this.client
      .from('content')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .abortSignal(AbortSignal.timeout(5000));
    if (error) throw error;
    return (data || []).map(rowToEntry);
  }
  async isEditor() {
    await this.connect();
    if (!this.client) return false;
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error || !user) return false;
    const { data } = await this.client.from('editors').select('id').eq('id', user.id).maybeSingle();
    return !!data;
  }
  async save(entry: Entry, revision?: string) {
    if (!this.client) throw new Error('Conecte o Supabase para publicar.');
    const table = entry.status === 'published' ? 'content' : 'editor_drafts';
    const row = {
      id: entry.id,
      slug: entry.slug,
      kind: entry.kind,
      title: entry.title,
      excerpt: entry.excerpt,
      category: entry.category,
      body_html: entry.html,
      status: entry.status,
      published_at: entry.publishedAt,
      images: entry.images,
      year: entry.year || null,
      place: entry.place || null,
      company: entry.company || null,
      source_url: entry.sourceUrl || null,
      reflection: entry.reflection || null,
      article_slug: entry.articleSlug || null,
    };
    if (table === 'editor_drafts')
      Object.assign(row, { base_revision: entry.baseRevision || null });
    const query = revision
      ? this.client.from(table).update(row).eq('id', entry.id).eq('updated_at', revision)
      : this.client.from(table).insert(row);
    const { data, error } = await query.select('updated_at').maybeSingle();
    if (error?.code === '23505')
      throw new Error(
        'Este endereço já está em uso. Abra o texto existente ou escolha outro endereço.',
      );
    if (error)
      throw new Error(
        'Não foi possível salvar na sua conta. A cópia deste navegador continua disponível.',
      );
    if (!data)
      throw new Error(
        'Este texto foi alterado em outro dispositivo. Reabra a versão da conta antes de publicar suas alterações.',
      );
    return data.updated_at as string;
  }
  async upload(file: File, entryId: string, privateDraft = false) {
    if (!this.client) throw new Error('Conecte o Supabase para enviar imagens.');
    const extension = (
      { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<string, string>
    )[file.type];
    if (!extension || file.size > 5 * 1024 * 1024)
      throw new Error('Use JPG, PNG ou WebP de até 5 MB.');
    const path = entryId + '/' + crypto.randomUUID() + '.' + extension;
    const bucket = privateDraft ? 'editor-media' : 'site-media';
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    return privateDraft
      ? 'draft-media://' + path
      : this.client.storage.from('site-media').getPublicUrl(path).data.publicUrl;
  }
  async signedImage(path: string) {
    if (!this.client || !PRIVATE_MEDIA.test('draft-media://' + path))
      throw new Error('Não foi possível abrir esta imagem privada.');
    const { data, error } = await this.client.storage
      .from('editor-media')
      .createSignedUrl(path, 3600);
    if (error || !data) throw new Error('Não foi possível abrir esta imagem privada.');
    return data.signedUrl;
  }
  async privateFile(path: string) {
    if (!this.client || !PRIVATE_MEDIA.test('draft-media://' + path))
      throw new Error('Referência de imagem inválida.');
    const { data, error } = await this.client.storage.from('editor-media').download(path);
    if (error || !data) throw new Error('Não foi possível recuperar a imagem privada.');
    return new File([data], path.split('/').at(-1)!, { type: data.type });
  }
  async drafts(): Promise<Entry[]> {
    if (!this.client) return [];
    const { data, error } = await this.client
      .from('editor_drafts')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw new Error('Não foi possível carregar os rascunhos da conta.');
    return (data || []).map(rowToEntry);
  }
  async managed(): Promise<Entry[]> {
    if (!this.client) return [];
    const { data, error } = await this.client
      .from('content')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) throw new Error('Não foi possível carregar suas publicações.');
    return (data || []).map(rowToEntry);
  }
  async archive(id: string, revision: string) {
    if (!this.client) throw new Error('Entre com sua conta para retirar um texto do site.');
    const { data, error } = await this.client
      .from('content')
      .update({ status: 'archived' })
      .eq('id', id)
      .eq('updated_at', revision)
      .select('updated_at');
    if (error || !data?.length)
      throw new Error(
        'Não foi possível retirar o texto. Reabra a versão da conta e tente novamente.',
      );
    return data[0].updated_at as string;
  }
}
