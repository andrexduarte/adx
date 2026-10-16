import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-angular-upgrade-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './angular-upgrade-demo.html',
  styleUrl: './angular-upgrade-demo.scss',
})
export class AngularUpgradeDemo {
  readonly progress = input(0);
  readonly milestones = [
    { version: '16', core: '^16.2.0', typescript: '~5.1.3', owner: 'Base', date: 'Ponto de partida' },
    { version: '17', core: '^17.3.11', typescript: '~5.2.2', owner: 'André', date: 'Janeiro de 2026' },
    { version: '19', core: '^19.2.19', typescript: '~5.5.4', owner: 'André', date: 'Março de 2026' },
    { version: '20', core: '^20.3.23', typescript: '~5.9.3', owner: 'Equipe', date: 'Maio de 2026' },
    { version: '21', core: '^21.2.15', typescript: '~5.9.3', owner: 'Equipe', date: 'Maio de 2026' },
  ];
  readonly index = computed(() => this.progress() < .18 ? 0 : this.progress() < .40 ? 1 : this.progress() < .65 ? 2 : this.progress() < .85 ? 3 : 4);
  readonly current = computed(() => this.milestones[this.index()]);
  readonly newBuilder = computed(() => this.index() >= 3);
}
