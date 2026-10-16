import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChildren } from '@angular/core';
import { activityCalendar, activityKeyIndex } from './activity-calendar';
import { GITHUB_ACTIVITY } from './github-activity-data';
import { phase } from './story-timing';

@Component({
  selector: 'app-github-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.scss',
})
export class GithubActivity {
  readonly progress = input(1);
  readonly snapshot = GITHUB_ACTIVITY;
  readonly selectedYear = signal(GITHUB_ACTIVITY.years[0].year);
  readonly selected = computed(() => this.snapshot.years.find(year => year.year === this.selectedYear())!);
  readonly calendar = computed(() => activityCalendar(this.selected(), this.snapshot.retrievedAt));
  readonly total = computed(() => this.selected().total.toLocaleString('pt-BR'));
  readonly updated = this.snapshot.retrievedAt.split('-').reverse().join('/');
  readonly yearUrl = computed(() => `${this.snapshot.profileUrl}?tab=overview&from=${this.selectedYear()}-01-01&to=${this.selectedYear()}-12-31`);
  readonly activeIndex = signal<number | null>(null);
  readonly hoveredIndex = signal<number | null>(null);
  readonly focusedIndex = signal<number | null>(null);
  readonly interacted = signal(false);
  readonly detail = computed(() => {
    const index = this.hoveredIndex() ?? this.focusedIndex();
    return index === null ? null : this.calendar().days[index]?.label;
  });
  readonly levels = [0, 1, 2, 3, 4];
  private readonly dayButtons = viewChildren<ElementRef<HTMLButtonElement>>('dayButton');

  selectYear(year: number) {
    this.selectedYear.set(year);
    this.activeIndex.set(null);
    this.hoveredIndex.set(null);
    this.focusedIndex.set(null);
    this.interacted.set(true);
  }
  reveal(week: number) {
    return this.interacted() ? 1 : .18 + .82 * phase(this.progress(), .02 + week / 100, .17 + week / 100);
  }
  focusDay(index: number) {
    this.activeIndex.set(index);
    this.focusedIndex.set(index);
    this.interacted.set(true);
  }
  navigate(event: KeyboardEvent, index: number, row: number) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = activityKeyIndex(event.key, index, row, this.calendar().lastAvailable);
    this.dayButtons().find(button => Number(button.nativeElement.dataset['index']) === next)?.nativeElement.focus();
  }
}
