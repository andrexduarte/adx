import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageChrome {
  readonly hideHeader = signal(false);
  readonly arenaLogo = signal<{ transform: string; opacity: number } | null>(null);
  readonly arenaContext = signal<{ project: string; task: string; opacity: number } | null>(null);
  readonly personalProject = signal<{ id: 'nos' | 'wakawa'; name: string } | null>(null);
  readonly careerContext = signal<{ counter: string | null } | null>(null);
}
