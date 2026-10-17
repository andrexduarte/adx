import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, afterRenderEffect, computed, inject, input, linkedSignal, signal, viewChild, viewChildren } from '@angular/core';
import { activityCalendar, activityKeyIndex, activityPlayback } from './activity-calendar';
import { GITHUB_ACTIVITY } from './github-activity-data';
import { ARENA_REPOSITORY_ACTIVITY } from './arena-repository-activity';
import { phase } from './story-timing';

@Component({
  selector: 'app-github-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.scss',
})
export class GithubActivity {
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly snapshot = GITHUB_ACTIVITY;
  readonly repository = ARENA_REPOSITORY_ACTIVITY;
  readonly repositoryReveal = computed(() => this.staticMode() ? 1 : phase(this.progress(), .80, .91));
  readonly repositoryUpdated = this.repository.retrievedAt.split('-').reverse().join('/');
  readonly repositoryMetrics = [
    { label: 'commits', value: this.repository.commits.toLocaleString('pt-BR'), kind: 'commits' },
    { label: 'adições', value: this.repository.additions.toLocaleString('pt-BR'), kind: 'additions' },
    { label: 'remoções', value: this.repository.deletions.toLocaleString('pt-BR'), kind: 'deletions' },
  ];
  readonly years = this.snapshot.years
    .filter(year => year.year >= 2025 && year.days.some(([date]) => date <= this.snapshot.retrievedAt))
    .sort((left, right) => left.year - right.year);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportWidth = signal(0);
  private readonly manualSelection = signal<{ year: number; at: number } | null>(null);
  private readonly position = computed(() => activityPlayback(this.snapshot, this.staticMode() ? 1 : this.progress()));
  private readonly manualYear = computed(() => {
    const selection = this.manualSelection();
    return selection?.at === this.progress() ? selection.year : null;
  });
  readonly selectedYear = computed(() => this.manualYear() ?? this.position()?.year ?? this.years[0].year);
  readonly selected = computed(() => this.snapshot.years.find(year => year.year === this.selectedYear())!);
  readonly calendar = computed(() => activityCalendar(this.selected(), this.snapshot.retrievedAt));
  readonly playheadIndex = computed(() => this.staticMode() || this.manualYear() !== null ? null : this.position()?.dayIndex ?? null);
  readonly total = computed(() => this.selected().total.toLocaleString('pt-BR'));
  readonly updated = this.snapshot.retrievedAt.split('-').reverse().join('/');
  readonly yearUrl = computed(() => `${this.snapshot.profileUrl}?tab=overview&from=${this.selectedYear()}-01-01&to=${this.selectedYear()}-12-31`);
  readonly activeIndex = linkedSignal<number | null>(() => { this.selectedYear(); this.playheadIndex(); return null; });
  readonly hoveredIndex = linkedSignal<number | null>(() => { this.selectedYear(); this.playheadIndex(); return null; });
  readonly focusedIndex = linkedSignal<number | null>(() => { this.selectedYear(); this.playheadIndex(); return null; });
  readonly detail = computed(() => {
    const index = this.hoveredIndex() ?? this.focusedIndex();
    return index === null ? null : this.calendar().days[index]?.label;
  });
  readonly levels = [0, 1, 2, 3, 4];
  readonly cursorLabel = computed(() => {
    const index = this.playheadIndex();
    return index === null ? 'Cada quadradinho, um dia.' : this.calendar().days[index]?.label;
  });
  private readonly scrollViewport = viewChild<ElementRef<HTMLElement>>('calendarScroll');
  private readonly dayButtons = viewChildren<ElementRef<HTMLButtonElement>>('dayButton');

  constructor() {
    afterRenderEffect(() => {
      this.viewportWidth();
      const index = this.playheadIndex();
      const viewport = this.scrollViewport()?.nativeElement;
      const target = this.dayButtons().find(button => Number(button.nativeElement.dataset['index']) === index)?.nativeElement;
      if (index === null || !viewport || !target) return;
      const center = target.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft + target.offsetWidth / 2;
      viewport.scrollLeft = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, center - viewport.clientWidth / 2));
    });
    afterNextRender(() => {
      const viewport = this.scrollViewport()?.nativeElement;
      if (!viewport) return;
      const observer = new ResizeObserver(([entry]) => this.viewportWidth.set(entry.contentRect.width));
      observer.observe(viewport);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  selectYear(year: number) {
    if (!this.years.some(item => item.year === year)) return;
    this.manualSelection.set({ year, at: this.progress() });
    this.activeIndex.set(null);
    this.hoveredIndex.set(null);
    this.focusedIndex.set(null);
    const viewport = this.scrollViewport()?.nativeElement;
    if (viewport) viewport.scrollLeft = 0;
  }
  reveal(week: number) {
    const index = this.playheadIndex();
    if (index === null) return 1;
    const calendar = this.calendar();
    const firstDay = week * 7 - calendar.days[0].row;
    return .18 + .82 * phase(index + 1, firstDay, Math.min(firstDay + 7, calendar.lastAvailable + 1));
  }
  focusDay(index: number) {
    this.manualSelection.set({ year: this.selectedYear(), at: this.progress() });
    this.activeIndex.set(index);
    this.focusedIndex.set(index);
  }
  navigate(event: KeyboardEvent, index: number, row: number) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = activityKeyIndex(event.key, index, row, this.calendar().lastAvailable);
    this.dayButtons().find(button => Number(button.nativeElement.dataset['index']) === next)?.nativeElement.focus();
  }
}
