import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-nos-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nos-navigation.html',
  styleUrl: './nos-navigation.scss',
  host: { '[class.mobile]': 'mobile()', '[class.static]': 'staticMode()' },
})
export class NosNavigation {
  readonly mobile = input(false);
  readonly staticMode = input(false);
  readonly navigation = [
    { label: 'Início', path: 'm3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-8H9v8H5a2 2 0 0 1-2-2z' },
    { label: 'Acordo', path: 'M21 12h-9V3M12 3a9 9 0 1 0 9 9M15 3.5A9 9 0 0 1 20.5 9H15z' },
    { label: 'Histórico', path: 'M3 11a9 9 0 1 1 2.7 7.2M3 4v7h7m2-4v5l4 2' },
    { label: 'Você', path: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
  ];
}
