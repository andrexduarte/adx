import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tournaments-preview-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tournaments-preview-filters.html',
  styleUrl: './tournaments-preview-filters.scss',
})
export class TournamentsPreviewFilters {
  readonly filters = ['Moeda: Todas', 'Ativos: Todos', 'Premiação: Todas', 'Status: Todas'] as const;
}
