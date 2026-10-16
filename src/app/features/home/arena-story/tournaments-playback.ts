import { clamp } from './story-timing';

export type TournamentDemoState = 'loading' | 'ready' | 'filtered-empty' | 'empty' | 'error' | 'refresh-error';

// Storyboard local. Os estados seguem o catálogo V3; os dados são demonstrativos.
export const tournamentStates: { state: TournamentDemoState; at: number; label: string; code: string; hint: string }[] = [
  { state: 'loading', at: .58, label: 'Carregando', code: "{ kind: 'loading' }", hint: 'O componente informa que os dados estão chegando.' },
  { state: 'ready', at: .65, label: 'Com dados', code: "{ kind: 'ready' }", hint: 'O ViewModel organiza o que a interface precisa exibir.' },
  { state: 'filtered-empty', at: .73, label: 'Filtro vazio', code: "{ kind: 'filtered-empty' }", hint: 'Sem resultado para este filtro. Os outros torneios continuam disponíveis.' },
  { state: 'empty', at: .80, label: 'Sem dados', code: "{ kind: 'empty' }", hint: 'Uma lista vazia tem uma mensagem própria.' },
  { state: 'error', at: .86, label: 'Falha', code: "{ kind: 'error', actionLabel: 'Tentar novamente' }", hint: 'A falha oferece um caminho para tentar de novo.' },
  { state: 'refresh-error', at: .94, label: 'Atualização', code: 'catalog.error && catalog.items.length > 0', hint: 'Se a atualização falha, os dados anteriores permanecem na tela.' },
];

export function tournamentFrame(progress: number) {
  const p = clamp(progress);
  const state: TournamentDemoState = p < .62 ? 'loading' : p < .69 ? 'ready' : p < .77 ? 'filtered-empty' :
    p < .83 ? 'empty' : p < .89 ? 'error' : p < .93 ? 'ready' : p < .98 ? 'refresh-error' : 'ready';
  return tournamentStates.find(item => item.state === state)!;
}

export function tournamentPlaybackProgress(storyProgress: number) {
  return .56 + .44 * clamp((storyProgress - .61) / .23);
}
export function tournamentSeek(state: TournamentDemoState) {
  const at = tournamentStates.find(item => item.state === state)!.at;
  return .61 + (at - .56) / .44 * .23;
}
