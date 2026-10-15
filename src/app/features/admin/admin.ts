import {
  Component,
  afterNextRender,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { RichEditor } from './rich-editor/rich-editor';
import { Gateway } from '../../core/content/gateway';
import { ContentStore } from '../../core/content/content-store';
import { LocalDrafts } from './drafts/local-drafts';
import {
  mergeDrafts,
  PRIVATE_MEDIA,
  newMediumEntries,
  slugify,
  validateDraft,
} from '../../core/content/content-utils';
import { Category, ContentKind, Entry, Media } from '../../core/content/models';
import { Seo } from '../../core/seo/seo';

@Component({
  imports: [ReactiveFormsModule, RichEditor, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  readonly gateway = inject(Gateway);
  readonly content = inject(ContentStore);
  private readonly local = inject(LocalDrafts);
  readonly authorized = signal(false);
  readonly checking = signal(this.gateway.configured);
  readonly drafts = signal<Entry[]>([]);
  readonly html = signal('<p></p>');
  readonly images = signal<Media[]>([]);
  readonly message = signal('');
  readonly error = signal('');
  readonly busy = signal(false);
  readonly entryId = signal('');
  readonly saved = signal('');
  readonly previewEntry = signal<Entry | null>(null);
  readonly publishedEntry = signal<Entry | null>(null);
  readonly managed = signal<Entry[] | null>(null);
  readonly library = computed(() => this.managed() || this.content.entries());
  readonly publishedPath = signal('');
  readonly libraryOpen = signal(true);
  private readonly previewDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('previewModal');
  private readonly archiveDialog = viewChild<ElementRef<HTMLDialogElement>>('archiveModal');
  private readonly editor = viewChild(RichEditor);
  private readonly destroyRef = inject(DestroyRef);
  private saveTimer?: ReturnType<typeof setTimeout>;
  private publicationDate = '';
  private sourceUrl?: string;
  private draftRevision?: string;
  private publicationRevision?: string;
  private saveQueue: Promise<void> = Promise.resolve();
  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(180)],
    }),
    kind: new FormControl<ContentKind>('article', { nonNullable: true }),
    category: new FormControl<Category>('Vida', { nonNullable: true }),
    excerpt: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(400)] }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), Validators.maxLength(120)],
    }),
    year: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(80)] }),
    place: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    reflection: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(400)] }),
    articleSlug: new FormControl('', { nonNullable: true }),
  });
  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  constructor() {
    inject(Seo).set('Escrever', 'Seu espaço para escrever e guardar rascunhos.', '/admin');
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.scheduleSave());
    afterNextRender(async () => {
      this.libraryOpen.set(!window.matchMedia('(max-width: 620px)').matches);
      this.newEntry();
      try {
        this.drafts.set(await this.local.all());
      } catch {
        this.error.set(
          'Não foi possível recuperar os rascunhos deste navegador. Você ainda pode importar uma cópia.',
        );
      }
      try {
        if (this.gateway.configured) {
          this.authorized.set(await this.gateway.isEditor());
          if (this.authorized()) await this.loadCloudDrafts();
        }
      } catch {
        this.error.set(
          'Sua conta está temporariamente indisponível. Seus rascunhos locais continuam guardados.',
        );
      } finally {
        this.checking.set(false);
      }
      if (this.destroyRef.destroyed) return;
      const flush = () => {
        void this.saveLocal();
      };
      window.addEventListener('pagehide', flush);
      this.destroyRef.onDestroy(() => window.removeEventListener('pagehide', flush));
    });
    this.destroyRef.onDestroy(() => {
      void this.saveLocal();
      if (this.saveTimer) clearTimeout(this.saveTimer);
    });
  }
  newEntry() {
    if (this.busy()) return;
    void this.saveLocal();
    this.entryId.set(crypto.randomUUID());
    this.form.reset(
      {
        title: '',
        kind: 'article',
        category: 'Vida',
        excerpt: '',
        slug: '',
        year: '',
        place: '',
        company: '',
        reflection: '',
        articleSlug: '',
      },
      { emitEvent: false },
    );
    this.html.set('<p></p>');
    this.images.set([]);
    this.sourceUrl = undefined;
    this.publicationDate = '';
    this.draftRevision = undefined;
    this.publicationRevision = undefined;
    this.publishedEntry.set(null);
    this.publishedPath.set('');
    this.saved.set('');
    this.message.set('');
    this.error.set('');
  }
  toggledLibrary(event: Event) {
    this.libraryOpen.set((event.target as HTMLDetailsElement).open);
  }
  async load(entry: Entry) {
    if (this.busy()) return;
    await this.saveLocal();
    this.busy.set(true);
    this.error.set('');
    try {
      const hydrated = await this.hydrate(entry);
      this.entryId.set(entry.id);
      this.form.reset(
        {
          title: entry.title,
          kind: entry.kind,
          category: entry.category,
          excerpt: entry.excerpt,
          slug: entry.slug,
          year: entry.year || '',
          place: entry.place || '',
          company: entry.company || '',
          reflection: entry.reflection || '',
          articleSlug: entry.articleSlug || '',
        },
        { emitEvent: false },
      );
      this.html.set(hydrated.html);
      this.images.set(hydrated.images.map((m) => ({ ...m })));
      this.sourceUrl = entry.sourceUrl;
      this.publicationDate = entry.publishedAt;
      this.draftRevision =
        entry.status === 'draft'
          ? entry.updatedAt
          : this.drafts().find((e) => e.id === entry.id)?.updatedAt;
      this.publishedEntry.set(this.library().find((e) => e.id === entry.id) || null);
      this.publicationRevision =
        entry.status === 'draft'
          ? entry.baseRevision || this.publishedEntry()?.updatedAt
          : entry.updatedAt;
      this.saved.set('');
      this.message.set('');
      this.publishedPath.set('');
    } catch (error) {
      this.showError(error);
    } finally {
      this.busy.set(false);
    }
  }
  private entry(status: 'draft' | 'published' = 'draft'): Entry {
    const v = this.form.getRawValue();
    return {
      id: this.entryId(),
      slug: v.slug.trim() || slugify(v.title),
      kind: v.kind,
      title: v.title.trim(),
      excerpt: v.excerpt.trim(),
      category: v.category,
      html: this.html(),
      images: this.images().map((m) => ({ ...m })),
      status,
      publishedAt: this.publicationDate,
      year: v.year.trim(),
      place: v.place.trim(),
      company: v.company.trim(),
      sourceUrl: this.sourceUrl,
      reflection: v.reflection.trim(),
      articleSlug: v.articleSlug || undefined,
      updatedAt: this.draftRevision,
      baseRevision: this.publicationRevision,
    };
  }
  changed(html: string) {
    this.html.set(html);
    this.scheduleSave();
  }
  private scheduleSave() {
    this.saved.set('Salvando rascunho…');
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveLocal(), 600);
  }
  async saveLocal() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
    }
    const entry = this.entry();
    if (
      !entry.id ||
      (!entry.title &&
        !entry.html.replace(/<[^>]*>/g, '').trim() &&
        !entry.html.includes('<img') &&
        !entry.images.length)
    )
      return;
    entry.savedAt = new Date().toISOString();
    this.drafts.update((drafts) => [entry, ...drafts.filter((e) => e.id !== entry.id)]);
    this.saveQueue = this.saveQueue
      .catch(() => {})
      .then(async () => {
        try {
          await this.local.put(entry);
          if (entry.id === this.entryId()) this.saved.set('Rascunho salvo neste navegador');
        } catch {
          this.error.set(
            'Não foi possível salvar neste navegador. Exporte uma cópia do rascunho para guardar seu trabalho.',
          );
        }
      });
    await this.saveQueue;
  }
  preview() {
    this.previewEntry.set(this.entry());
    this.previewDialog().nativeElement.showModal();
  }
  closePreview() {
    this.previewDialog().nativeElement.close();
  }
  async discardLocalDraft() {
    if (this.busy()) return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    await this.saveQueue;
    try {
      const id = this.entryId();
      await this.local.remove(id);
      this.drafts.update((drafts) => drafts.filter((e) => e.id !== id));
      // Clear first so starting a new entry does not autosave the discarded copy.
      this.html.set('<p></p>');
      this.images.set([]);
      this.form.reset({}, { emitEvent: false });
      this.newEntry();
      this.message.set('A cópia deste navegador foi descartada.');
    } catch {
      this.error.set('Não foi possível descartar a cópia local.');
    }
  }
  async login() {
    if (this.loginForm.invalid || !this.gateway.client || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const { error } = await this.gateway.client.auth.signInWithPassword(
        this.loginForm.getRawValue(),
      );
      if (error) throw new Error('Confira seu e-mail e sua senha.');
      const editor = await this.gateway.isEditor();
      this.authorized.set(editor);
      if (!editor) {
        await this.gateway.client.auth.signOut();
        throw new Error('Esta conta ainda não tem acesso ao editor.');
      }
      await this.loadCloudDrafts();
    } catch (error) {
      this.showError(error);
    } finally {
      this.loginForm.controls.password.reset();
      this.busy.set(false);
    }
  }
  async logout() {
    await this.saveLocal();
    await this.gateway.client?.auth.signOut();
    this.authorized.set(false);
  }
  private validEntry() {
    this.form.markAllAsTouched();
    this.error.set('');
    const entry = this.entry();
    if (this.form.invalid || !entry.title || !entry.slug)
      throw new Error('Preencha o título e confira o endereço do texto.');
    if (entry.kind === 'moment' && !entry.year)
      throw new Error('Informe o ano ou período do momento.');
    if (entry.kind === 'story' && !entry.images.length)
      throw new Error('Adicione pelo menos uma imagem ao story.');
    if (
      entry.kind !== 'story' &&
      !entry.html.replace(/<[^>]*>/g, '').trim() &&
      !entry.html.includes('<img')
    )
      throw new Error('Escreva algo antes de publicar.');
    validateDraft(entry);
    return entry;
  }
  async saveCloud(status: 'draft' | 'published') {
    if (this.busy()) return;
    let entry: Entry;
    try {
      entry = this.validEntry();
      if (status === 'published' && entry.kind === 'story')
        throw new Error('Esta coleção está guardada. A área de stories saiu do site.');
      if (!this.authorized()) throw new Error('Entre com sua conta para publicar.');
    } catch (error) {
      this.showError(error);
      return;
    }
    this.busy.set(true);
    await this.saveLocal();
    try {
      entry.status = status;
      entry.publishedAt ||= new Date().toISOString();
      entry = await this.prepareMedia(entry, status === 'draft');
      const revision = status === 'draft' ? this.draftRevision : this.publicationRevision;
      const updatedAt = await this.gateway.save(entry, revision);
      this.publicationDate = entry.publishedAt;
      if (status === 'draft') {
        this.draftRevision = updatedAt;
        const hydrated = await this.hydrate(entry);
        this.html.set(hydrated.html);
        this.images.set(hydrated.images);
        this.message.set('Rascunho e imagens salvos na sua conta, com acesso privado.');
      } else {
        this.html.set(entry.html);
        this.images.set(entry.images);
        await this.content.load();
        this.publishedEntry.set({ ...entry, updatedAt });
        this.publicationRevision = updatedAt;
        this.managed.set(await this.gateway.managed());
        this.publishedPath.set(
          entry.kind === 'article'
            ? '/caderno/' + entry.slug
            : entry.kind === 'moment'
              ? '/#momento-' + entry.slug
              : '/stories?story=' + entry.slug,
        );
        this.message.set('Publicado no site.');
      }
      await this.saveLocal();
    } catch (error) {
      this.showError(error);
    } finally {
      this.busy.set(false);
    }
  }
  async refreshDrafts() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.loadCloudDrafts();
      await this.content.load();
      this.message.set('Conteúdo da conta atualizado. Sua cópia em andamento continua guardada.');
    } catch (error) {
      this.showError(error);
    } finally {
      this.busy.set(false);
    }
  }
  private async loadCloudDrafts() {
    this.drafts.set(mergeDrafts(await this.gateway.drafts(), await this.local.all()));
    this.managed.set(await this.gateway.managed());
  }
  private async dataFile(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Não foi possível recuperar uma das imagens para a cópia.');
    const blob = await response.blob();
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.type))
      throw new Error('A cópia aceita imagens JPG, PNG ou WebP. Confira as imagens deste texto.');
    return new File([blob], 'imagem', { type: blob.type });
  }
  private async dataUrl(file: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
      reader.readAsDataURL(file);
    });
  }
  private async hydrate(entry: Entry): Promise<Entry> {
    const copy = { ...entry, images: entry.images.map((m) => ({ ...m })) };
    const doc = new DOMParser().parseFromString(entry.html, 'text/html');
    for (const img of Array.from(doc.querySelectorAll<HTMLImageElement>('img'))) {
      const path = this.gateway.privatePath(
        img.getAttribute('src') || '',
        img.dataset['storagePath'],
      );
      if (path) {
        img.src = await this.gateway.signedImage(path);
        img.dataset['storagePath'] = path;
      }
    }
    copy.html = doc.body.innerHTML;
    for (const m of copy.images) {
      const path = this.gateway.privatePath(m.url, m.storagePath);
      if (path) {
        m.url = await this.gateway.signedImage(path);
        m.storagePath = path;
      }
    }
    return copy;
  }
  private async prepareMedia(entry: Entry, privateDraft: boolean): Promise<Entry> {
    const doc = new DOMParser().parseFromString(entry.html, 'text/html');
    const upload = async (url: string, path?: string) => {
      if (privateDraft && path) return 'draft-media://' + path;
      if (path) return this.gateway.upload(await this.gateway.privateFile(path), entry.id);
      if (url.startsWith('data:'))
        return this.gateway.upload(await this.dataFile(url), entry.id, privateDraft);
      return url;
    };
    for (const img of Array.from(doc.querySelectorAll<HTMLImageElement>('img'))) {
      const path = this.gateway.privatePath(
        img.getAttribute('src') || '',
        img.dataset['storagePath'],
      );
      const url = await upload(img.getAttribute('src') || '', path);
      img.src = url;
      if (privateDraft && PRIVATE_MEDIA.test(url))
        img.dataset['storagePath'] = PRIVATE_MEDIA.exec(url)![1];
      else delete img.dataset['storagePath'];
    }
    entry.html = doc.body.innerHTML;
    for (const m of entry.images) {
      m.url = await upload(m.url, this.gateway.privatePath(m.url, m.storagePath));
      m.storagePath = privateDraft ? PRIVATE_MEDIA.exec(m.url)?.[1] : undefined;
    }
    return entry;
  }
  async addImages(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (this.busy()) return;
    this.error.set('');
    this.busy.set(true);
    try {
      for (const file of files) {
        if (
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
          file.size > 5 * 1024 * 1024
        )
          throw new Error('Use JPG, PNG ou WebP de até 5 MB.');
        if (this.images().length >= 50) throw new Error('Uma coleção pode ter até 50 imagens.');
        const url = await this.dataUrl(file);
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        if (this.form.controls.kind.value === 'story')
          this.images.update((images) => [...images, { url, caption: '', alt }]);
        else this.editor()?.insertImage(url, alt);
      }
      await this.saveLocal();
    } catch (error) {
      this.showError(error);
    } finally {
      input.value = '';
      this.busy.set(false);
    }
  }
  updateMedia(index: number, field: 'caption' | 'alt', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.images.update((images) =>
      images.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
    void this.saveLocal();
  }
  moveImage(index: number, direction: number) {
    this.images.update((images) => {
      const copy = [...images];
      const next = index + direction;
      if (next >= 0 && next < copy.length) [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    void this.saveLocal();
  }
  removeImage(index: number) {
    this.images.update((images) => images.filter((_, i) => i !== index));
    void this.saveLocal();
  }
  private download(filename: string, data: unknown) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async exportDraft(all = false) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.saveLocal();
      const list = all ? this.drafts() : [this.entry()];
      const portable: Entry[] = [];
      for (const e of list) {
        const copy = { ...e, images: e.images.map((m) => ({ ...m })) };
        const doc = new DOMParser().parseFromString(e.html, 'text/html');
        for (const img of Array.from(doc.querySelectorAll<HTMLImageElement>('img'))) {
          const path = this.gateway.privatePath(
            img.getAttribute('src') || '',
            img.dataset['storagePath'],
          );
          if (path) {
            img.src = await this.dataUrl(await this.gateway.privateFile(path));
            delete img.dataset['storagePath'];
          } else if (img.src && !img.src.startsWith('data:')) {
            img.src = await this.dataUrl(await this.dataFile(img.src));
          }
        }
        copy.html = doc.body.innerHTML;
        for (const m of copy.images) {
          const path = this.gateway.privatePath(m.url, m.storagePath);
          if (path) m.url = await this.dataUrl(await this.gateway.privateFile(path));
          else if (!m.url.startsWith('data:'))
            m.url = await this.dataUrl(await this.dataFile(m.url));
          delete m.storagePath;
        }
        portable.push(copy);
      }
      const payload = all ? { version: 1, drafts: portable } : portable[0];
      if (new Blob([JSON.stringify(payload)]).size > 100 * 1024 * 1024)
        throw new Error('Esta cópia excede 100 MB. Exporte os rascunhos separadamente.');
      this.download(
        all ? 'caderno-rascunhos.json' : (portable[0].slug || 'rascunho') + '.json',
        payload,
      );
      this.message.set('Cópia exportada com suas imagens.');
    } catch (error) {
      this.showError(error);
    } finally {
      this.busy.set(false);
    }
  }
  async importDraft(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      if (file.size > 100 * 1024 * 1024)
        throw new Error('Use um arquivo de rascunho de até 100 MB.');
      const value: unknown = JSON.parse(await file.text());
      const candidates: unknown[] =
        value && typeof value === 'object' && 'drafts' in value && Array.isArray(value.drafts)
          ? value.drafts
          : [value];
      if (candidates.length > 100) throw new Error('Importe até 100 rascunhos por vez.');
      const incoming = candidates
        .map(validateDraft)
        .map((e) => ({ ...e, id: crypto.randomUUID(), savedAt: new Date().toISOString() }));
      // Imported copies receive new IDs; they cannot overwrite an existing publication.
      for (const e of incoming) await this.local.put(e);
      this.drafts.update((drafts) => [...incoming, ...drafts]);
      this.message.set(incoming.length + ' rascunho(s) recuperado(s). Abra a cópia pela lista.');
    } catch (error) {
      this.showError(error);
    } finally {
      input.value = '';
      this.busy.set(false);
    }
  }
  async importMedium() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const response = await fetch('/api/medium');
      if (!response.ok)
        throw new Error('Não foi possível consultar o Medium agora. Tente novamente mais tarde.');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('O Medium retornou uma resposta inválida.');
      const incoming = newMediumEntries(data.map(validateDraft), [
        ...this.library(),
        ...this.drafts(),
      ]).map((e) => ({ ...e, savedAt: new Date().toISOString() }));
      for (const e of incoming) await this.local.put(e);
      this.drafts.update((drafts) => [...incoming, ...drafts]);
      this.message.set(
        incoming.length
          ? incoming.length +
              ' texto(s) do Medium adicionados aos rascunhos. Confira o assunto e a prévia antes de publicar.'
          : 'Os textos recentes do Medium já estão no seu caderno ou nos rascunhos.',
      );
    } catch (error) {
      this.showError(error);
    } finally {
      this.busy.set(false);
    }
  }
  askArchive() {
    this.archiveDialog()?.nativeElement.showModal();
  }
  closeArchive() {
    this.archiveDialog()?.nativeElement.close();
  }
  async archive() {
    const published = this.publishedEntry();
    if (!published?.updatedAt || !this.authorized() || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.saveLocal();
      this.publicationRevision = await this.gateway.archive(
        published.id,
        this.publicationRevision || published.updatedAt,
      );
      await this.content.load();
      this.publishedEntry.set({
        ...published,
        status: 'archived',
        updatedAt: this.publicationRevision,
      });
      this.managed.set(await this.gateway.managed());
      await this.saveLocal();
      this.closeArchive();
      this.message.set('Retirado do site. Sua cópia continua nos rascunhos.');
    } catch (error) {
      this.showError(error);
    } finally {
      this.busy.set(false);
    }
  }
  private showError(error: unknown) {
    this.error.set(
      error instanceof Error
        ? error.message
        : 'Não foi possível concluir. Sua cópia local continua disponível.',
    );
  }
}
