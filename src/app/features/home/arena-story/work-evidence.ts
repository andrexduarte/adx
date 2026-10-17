export interface WorkEvidence {
  title: string;
  scope: string;
  commits: number;
  additions: number;
  deletions: number;
  note: string;
  sources: readonly { label: string; url: string }[];
}

const repository = 'https://github.com/trade-arena/arena-app-front-end';
const pr = (title: string, number: number, commits: number, additions: number, deletions: number): WorkEvidence => ({
  title, scope: 'Entrega registrada no GitHub', commits, additions, deletions,
  note: 'Totais do PR, incluindo integrações. Consulta em 16/10/2026.',
  sources: [{ label: `PR #${number}`, url: `${repository}/pull/${number}` }],
});

type Commit = readonly [sha: string, additions: number, deletions: number];
const selected = (title: string, scope: string, commits: readonly Commit[], note = 'Soma das alterações dos commits selecionados, de autoria de André.'): WorkEvidence => ({
  title, scope, commits: commits.length,
  additions: commits.reduce((sum, commit) => sum + commit[1], 0),
  deletions: commits.reduce((sum, commit) => sum + commit[2], 0), note,
  sources: commits.map(([sha]) => ({ label: sha.slice(0, 7), url: `${repository}/commit/${sha}` })),
});

// PR totals and selected commit churn have different scopes and must not be added together.
// Commit numstats use rename detection (-M); binary assets do not contribute line counts.
export const WORK_EVIDENCE: Readonly<Partial<Record<number, WorkEvidence>>> = {
  5: selected('Chat do Torneio', 'Recorte · entrada do chat nas páginas de torneio', [
    ['66eccfc0395dd16635c5aff412de14e5af860c94', 158, 104],
    ['4e88251ca07a6594a4ab4a8d889d7f71001c1e7f', 72, 0],
  ]),
  6: {
    ...pr('Torneios', 767, 134, 18203, 196),
    note: 'Totais do PR #767, incluindo integrações. Consulta em 16/10/2026.',
    sources: [],
  },
  7: selected('Dashboard', 'Recorte · ViewModels e cards analíticos', [
    ['68bbe50c0783a5e49d6165df50fe952e75ab3fc0', 98, 0],
    ['a993d04843837de42f698b53d2792ef19a218cc3', 179, 160],
    ['2816a7f1cf9260367070f4b6536426b53e13289d', 144, 0],
  ]),
  8: pr('Monitor flutuante', 879, 6, 3353, 8),
  9: selected('Classes e avatares', 'Recorte · estrutura, interface e acessibilidade', [
    ['b7c8f37da946b6fa7d528db9d982ff48f158cbbb', 434, 1],
    ['f453fdc89060943a337c89511efaf9d9da9dc370', 412, 166],
    ['7e9dd8e1319988ec1a7116001aca7a9d02804bed', 1183, 1037],
  ]),
  10: {
    ...pr('League', 877, 213, 48441, 805),
    note: 'Totais do PR #877, incluindo integrações. Consulta em 16/10/2026.',
    sources: [],
  },
  11: selected('Organização por domínio', 'Recorte · League, entradas públicas e Sheriff', [
    ['77dff79fd8e41200a5aa114ceb71f13f9bde4c16', 5342, 1400],
    ['382a1368167b24d7ea7e1e995c75f4dde39db784', 1235, 99],
    ['aa7e66bcb1a28dd4e3c8e1a66aa6908067b7c7a4', 75, 28],
  ]),
  12: selected('Evolução do Angular', 'Recorte · meus marcos no Angular 17 e 19', [
    ['4ad961ee5682d32eab5989510a5f6d40e874fc23', 35, 35],
    ['e78600da2bff7ceec05295743ef06e4dca091e96', 502, 329],
  ], 'Soma desses dois commits. A evolução até o Angular 21 foi um trabalho em equipe.'),
  14: selected('Signals na League', 'Recorte · estado de apresentação', [
    ['efc99c1c2e83a141384c360a8aab3d3b76888724', 307, 236],
  ]),
  15: {
    ...pr('Migração para Vitest', 925, 3, 6533, 6901),
    note: 'Totais do PR #925, incluindo integrações. Consulta em 16/10/2026.',
    sources: [],
  },
};
