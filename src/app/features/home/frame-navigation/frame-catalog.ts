import type { TimelineFrame } from '../../timeline/timeline-playback';
import { visibleProjectScenes } from '../personal-projects/project-timing';
import { contentRange, STORY_END, STORY_SCENES, VISIBLE_STORY_SCENES, EVIDENCE_SCENES, TOURNAMENT_STAGE_STARTS, PRODUCT_STAGE_STARTS, DASHBOARD_STAGE_STARTS, dashboardCompactProgress, LEAGUE_STAGE_STARTS, leagueCompactProgress, UPGRADE_STAGE_STARTS, upgradeCompactProgress, ENGINEERING_STAGE_STARTS } from '../arena-story/story-timing';

export interface PageFrame {
  id: string;
  title: string;
  group: string;
  region: 'hero' | 'arena' | 'nos' | 'wakawa' | 'career' | 'closing';
  start: number;
  at: number;
  scene?: number;
  panel?: number;
  evidence?: boolean;
  anchor?: string;
}

// Each link has a stable identity and seeks a readable point inside its scene.
// Timing comes from the same constants used by the animation components.
export function pageFrames(career: readonly TimelineFrame[]): PageFrame[] {
  const frames: PageFrame[] = [{ id: 'frame-abertura', title: 'Trabalhadores construindo a web', group: 'Abertura', region: 'hero', start: 0, at: 0 }];
  const arena = (id: string, title: string, group: string, scene: number, at: number, start = STORY_SCENES[scene], panel?: number, evidence = false) => {
    frames.push({ id: `frame-${id}`, title, group, region: 'arena', scene, panel, evidence, start: start / STORY_END, at: at / STORY_END });
  };
  const evidence = (id: string, title: string, scene: number) => {
    if (!EVIDENCE_SCENES.some(index => index === scene)) return;
    const [, end] = contentRange(scene);
    arena(`${id}-numeros`, 'O trabalho em números', title, scene, end + .10, end + .02, undefined, true);
  };
  arena('trade-arena', 'O trabalho atual', 'Trade Arena', 0, .07);
  const chat = ['A ideia', 'O plano', 'O fluxo de trabalho', 'A construção', 'A conversa e a responsividade'];
  const chatIds = ['ideia', 'plano', 'ferramentas', 'codigo', 'interface'];
  [ .29, .51, .70, .90, contentRange(5)[0] + (contentRange(5)[1] - contentRange(5)[0]) * .52 ].forEach((at, i) => arena(`chat-${chatIds[i]}`, chat[i], 'Chat do Torneio', i + 1, at));

  const addStages = (id: string, title: string, scene: number, starts: readonly number[], labels: readonly string[], ids: readonly string[], demoAt = .82) => {
    const [begin, end] = contentRange(scene);
    starts.forEach((start, index) => {
      const next = starts[index + 1] ?? 1;
      // Keep the reviewed content clear of the following panel's crossfade.
      const readablePoint = id === 'torneios' ? ([.84, .94, .88, .94, .8][index] ?? .94)
        : id === 'dashboard' ? ([.86, .9][index] ?? .94) : .94;
      const at = index === starts.length - 1 ? demoAt
        : Math.min(start + (next - start) * readablePoint, next - (id === 'dashboard' || id === 'league' ? .021 : id === 'angular' ? .022 : .017));
      arena(`${id}-${ids[index]}`, labels[index], title, scene, begin + at * (end - begin), begin + start * (end - begin), index);
    });
    evidence(id, title, scene);
  };
  addStages('torneios', 'Torneios', 6, TOURNAMENT_STAGE_STARTS,
    ['A ideia', 'O plano', 'O fluxo de trabalho', 'A estrutura de arquivos', 'O código', 'Os componentes e seus estados'],
    ['ideia', 'plano', 'ferramentas', 'arquivos', 'codigo', 'interface'], .665);
  const products = [['dashboard', 'Dashboard', 7], ['monitor', 'Monitor flutuante', 8], ['avatar', 'Avatar', 9], ['league', 'League', 10], ['dominios', 'Domínios', 11], ['angular', 'Angular 16 → 21', 12], ['clickup', 'Relatar e acompanhar', 13]] as const;
  products.filter(([, , scene]) => VISIBLE_STORY_SCENES.includes(scene)).forEach(([id, title, scene]) => {
    const dashboard = id === 'dashboard';
    const league = id === 'league';
    const upgrade = id === 'angular';
    addStages(id, title, scene, dashboard ? DASHBOARD_STAGE_STARTS : league ? LEAGUE_STAGE_STARTS : upgrade ? UPGRADE_STAGE_STARTS : PRODUCT_STAGE_STARTS,
      dashboard ? ['A ideia', 'O plano', 'As ferramentas', 'A interface'] : league ? ['A ideia', 'O plano', 'O fluxo de trabalho', 'A interface'] : upgrade ? ['A ideia', 'O plano', 'Na prática'] : ['A ideia', 'O plano', 'O código', 'Na prática'],
      dashboard || league ? ['ideia', 'plano', 'ferramentas', 'interface'] : upgrade ? ['ideia', 'plano', 'interface'] : ['ideia', 'plano', 'codigo', 'interface'], dashboard ? dashboardCompactProgress(.70) : league ? leagueCompactProgress(.67) : upgrade ? upgradeCompactProgress(.97) : .97);
  });
  addStages('signals', 'Signals', 14, ENGINEERING_STAGE_STARTS, ['A ideia', 'O plano', 'A mudança no código'], ['ideia', 'plano', 'codigo'], .96);
  addStages('vitest', 'Vitest', 15, ENGINEERING_STAGE_STARTS, ['A ideia', 'O plano', 'A migração dos testes'], ['ideia', 'plano', 'codigo'], .96);
  arena('github', 'Contribuições no GitHub', 'Atividade', 16, contentRange(16)[0] + .025);

  const projectTitles = ['O projeto', 'A ideia', 'O plano', 'As ferramentas', 'O código', 'Na prática'];
  const projectIds = ['apresentacao', 'ideia', 'plano', 'ferramentas', 'codigo', 'interface'];
  for (const region of ['nos', 'wakawa'] as const) {
    const visible = visibleProjectScenes(region);
    visible.forEach((scene, step) => frames.push({ id: `frame-${region}-${projectIds[scene]}`, title: projectTitles[scene], group: region === 'nos' ? 'Nós' : 'waka’wã', region, scene, start: step / visible.length, at: (step + (scene === 0 ? region === 'nos' ? .1 : .35 : scene === 5 ? .23 : .85)) / visible.length }));
  }
  career.forEach((item, scene) => frames.push({ id: `frame-${item.anchor}`, title: item.label, group: 'Experiência profissional', region: 'career', scene, anchor: item.anchor, start: scene / career.length, at: (scene + .25) / career.length }));
  frames.push(
    { id: 'frame-pontos', title: 'Os pontos se encontram', group: 'Encerramento', region: 'closing', start: 0, at: .03 },
    { id: 'frame-retrato', title: 'Retrato em pontilhismo', group: 'Encerramento', region: 'closing', start: .40, at: .51 },
    { id: 'frame-contato', title: 'Ferramentas e links', group: 'Encerramento', region: 'closing', start: .68, at: 1 },
  );
  return frames;
}

export function activePageFrame(starts: readonly number[], scroll: number): number {
  let current = 0;
  for (let i = 0; i < starts.length; i++) if (Number.isFinite(starts[i]) && starts[i] <= scroll + 3) current = i;
  return current;
}
