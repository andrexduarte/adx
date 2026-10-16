import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-league-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './league-demo.html',
  styleUrl: './league-demo.scss',
})
export class LeagueDemo {
  readonly progress = input(0);
  readonly view = computed(() => this.progress() < .18 ? 'loading' : this.progress() < .44 ? 'feed' : this.progress() < .70 ? 'ranking' : 'teams');
  readonly tabs = [{ id: 'feed', label: 'Feed de Atividade' }, { id: 'ranking', label: 'Ranking' }, { id: 'teams', label: 'Equipes' }];
  readonly leaders = [{ position: 2, name: 'Participante B', image: 'analista2', score: 720 }, { position: 1, name: 'Participante A', image: 'sniper1-1', score: 860 }, { position: 3, name: 'Participante C', image: 'analista1', score: 650 }];
}
