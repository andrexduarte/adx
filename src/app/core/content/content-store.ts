import {
  computed,
  inject,
  Injectable,
  signal,
  makeStateKey,
  TransferState,
  RESPONSE_INIT,
} from '@angular/core';
import { Gateway } from './gateway';
import { SEED_ENTRIES } from './seed';
import { Entry } from './models';
const PUBLIC_CONTENT = makeStateKey<{ entries: Entry[]; failed: boolean }>('public-content-v1');
@Injectable({ providedIn: 'root' })
export class ContentStore {
  private readonly gateway = inject(Gateway);
  private readonly transfer = inject(TransferState);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  readonly entries = signal(SEED_ENTRIES);
  readonly connectionError = signal(false);
  readonly loading = signal(false);
  readonly articles = computed(() =>
    this.entries()
      .filter((e) => e.kind === 'article' && e.status === 'published')
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  );
  readonly stories = computed(() =>
    this.entries().filter(
      (e) => e.kind === 'story' && e.status === 'published' && e.images.length > 0,
    ),
  );
  async load() {
    if (this.gateway.browser && this.transfer.hasKey(PUBLIC_CONTENT)) {
      const snapshot = this.transfer.get(PUBLIC_CONTENT, { entries: SEED_ENTRIES, failed: false });
      this.transfer.remove(PUBLIC_CONTENT);
      this.entries.set(snapshot.entries);
      this.connectionError.set(snapshot.failed);
      return;
    }
    if (!this.gateway.configured) return;
    this.loading.set(true);
    try {
      const remote = await this.gateway.published();
      this.entries.set(remote);
      this.connectionError.set(false);
    } catch {
      this.entries.set([]);
      this.connectionError.set(true);
      if (this.response) this.response.status = 503;
    } finally {
      this.loading.set(false);
    }
    if (!this.gateway.browser)
      this.transfer.set(PUBLIC_CONTENT, {
        entries: this.entries(),
        failed: this.connectionError(),
      });
  }
}
