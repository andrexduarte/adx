import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { PromptComposer } from './prompt-composer';
import { BuildPlan } from './build-plan';
import { TournamentsPreview } from './tournaments-preview';
import { TournamentDemoState, tournamentFrame, tournamentStates, tournamentPlaybackProgress, tournamentSeek } from './tournaments-playback';
import { TechnologyMap } from './technology-map';
import { ResponsivePreview } from './responsive-preview';
import { clamp, phase, TOURNAMENT_STAGE_STARTS } from './story-timing';

@Component({
  selector: 'app-tournaments-story',
  imports: [PromptComposer, TournamentsPreview, BuildPlan, TechnologyMap, ResponsivePreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tournaments-story.html',
  styleUrl: './tournaments-story.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class TournamentsStory {
  readonly progress = input(0);
  readonly staticMode = input(false);
  readonly seek = output<number>();
  readonly selectedState = signal<TournamentDemoState>('ready');
  readonly states = tournamentStates;
  readonly stages = ['A ideia', 'O plano', 'O fluxo', 'Arquivos', 'O código', 'A interface'];
  readonly starts = TOURNAMENT_STAGE_STARTS;
  readonly stage = computed(() => Math.max(0, this.starts.filter(start => start <= this.progress()).length - 1));
  readonly plan = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .13) / .11));
  readonly mapProgress = computed(() => this.staticMode() ? 1 : clamp((this.progress() - .27) / .11));
  readonly compact = computed(() => this.staticMode() ? 0 : phase(this.progress(), .86, .98));
  readonly steps = ['Separar destaques, torneios em andamento e catálogo.', 'Mapear dados para os ViewModels.', 'Definir carregamento, vazio, erro e recuperação.', 'Compor a página e adaptar os componentes.'];
  readonly frame = computed(() => this.staticMode()
    ? this.states.find(item => item.state === this.selectedState())! : tournamentFrame(tournamentPlaybackProgress(this.progress())));
  readonly prompt = computed(() => 'Vamos construir a página de torneios.'.slice(0,
    this.staticMode() ? undefined : Math.ceil(36 * phase(this.progress(), 0, .10))));
  readonly templateCode = `@if (vm$ | async; as vm) {
  <app-user-tournament-summary [state]="vm.userSummary" />
  <!-- Demais seções omitidas neste recorte. -->
}`;
  readonly modelCode = `protected readonly vm$ = combineLatest({
  person: this.personState$,
  league: this.tournamentsService.leagueState$,
  tournamentRanking: this.tournamentsService.tournamentRankingState$,
  openTournaments: this.tournamentsService.openTournamentsState$,
  participations: this.tournamentsService.participationsState$,
  dashboardStatus: this.tournamentsService.dashboardStatusState$,
  highlights: this.tournamentsService.highlightsState$
}).pipe(
  map(buildTournamentsPageVm),
  startWith(TOURNAMENTS_PAGE_VM_INITIAL),
  shareReplay({ bufferSize: 1, refCount: true })
);`;
  panelOpacity(index: number) {
    if (this.staticMode()) return 1;
    const starts = this.starts;
    return (index === 0 ? 1 : phase(this.progress(), starts[index] - .015, starts[index] + .015)) *
      (index === starts.length - 1 ? 1 : 1 - phase(this.progress(), starts[index + 1] - .015, starts[index + 1] + .015));
  }
  choose(state: TournamentDemoState) {
    if (this.staticMode()) this.selectedState.set(state);
    else this.seek.emit(tournamentSeek(state));
  }
}
