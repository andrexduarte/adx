import { clamp } from './story-timing';

export type TournamentDemoState = 'loading' | 'ready' | 'refresh-error';

// Storyboard local. Os estados seguem o catálogo V3; os dados são demonstrativos.
export const tournamentStates: { state: TournamentDemoState; at: number; label: string; code: string; hint: string }[] = [
  { state: 'loading', at: .62, label: 'Carregando', code: "{ kind: 'loading' }", hint: 'O componente informa que os dados estão chegando.' },
  { state: 'ready', at: .69, label: 'Com dados', code: "{ kind: 'ready' }", hint: 'Moeda, ativos, premiação e status organizam o catálogo.' },
  { state: 'refresh-error', at: .83, label: 'Falha ao atualizar', code: "filteredRows.length > 0 → { kind: 'ready' }", hint: 'A atualização falhou. A tabela preserva os torneios já carregados.' },
];

export function tournamentFrame(progress: number) {
  const p = clamp(progress);
  const state: TournamentDemoState = p < .64 ? 'loading' : p < .79 ? 'ready' : p < .88 ? 'refresh-error' : 'ready';
  return tournamentStates.find(item => item.state === state)!;
}

export function tournamentPlaybackProgress(storyProgress: number) {
  return .56 + .44 * clamp((storyProgress - .61) / .23);
}
export function tournamentSeek(state: TournamentDemoState) {
  const at = tournamentStates.find(item => item.state === state)!.at;
  return .61 + (at - .56) / .44 * .23;
}
