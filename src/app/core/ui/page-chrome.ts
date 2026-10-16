import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageChrome {
  readonly hideHeader = signal(false);
  readonly arenaLogo = signal<{ transform: string; opacity: number } | null>(null);
  readonly arenaContext = signal<{ project: string; task: string; opacity: number } | null>(null);
}
