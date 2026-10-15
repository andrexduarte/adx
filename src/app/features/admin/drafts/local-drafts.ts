import { Injectable } from '@angular/core';
import { Entry } from '../../../core/content/models';
import { validateDraft } from '../../../core/content/content-utils';

@Injectable({ providedIn: 'root' })
export class LocalDrafts {
  private db?: Promise<IDBDatabase>;
  private open() {
    return (this.db ||= new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('andre-site', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('drafts', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () =>
        reject(new Error('Feche as outras abas do editor e tente novamente.'));
    }));
  }
  private async transaction<T>(
    mode: IDBTransactionMode,
    work: (store: IDBObjectStore) => IDBRequest<T>,
  ) {
    const db = await this.open();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction('drafts', mode);
      const request = work(transaction.objectStore('drafts'));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
      transaction.onerror = () => reject(transaction.error);
    });
  }
  async all(): Promise<Entry[]> {
    const legacy = localStorage.getItem('andre-site:drafts:v1');
    if (legacy) {
      const list: unknown = JSON.parse(legacy);
      if (Array.isArray(list)) for (const item of list) await this.put(validateDraft(item));
      localStorage.removeItem('andre-site:drafts:v1');
    }
    return this.transaction<Entry[]>('readonly', (store) => store.getAll());
  }
  async put(entry: Entry) {
    await this.transaction('readwrite', (store) => store.put(entry));
  }
  async remove(id: string) {
    await this.transaction('readwrite', (store) => store.delete(id));
  }
}
