export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export const TOURNAMENT_STAGE_STARTS = [0, .12, .26, .40, .50, .61] as const;
export const PRODUCT_STAGE_STARTS = [0, .17, .38, .63] as const;
export const PRODUCT_MAP_STAGE_STARTS = [0, .13, .30, .46, .64] as const;
const DASHBOARD_CODE_START = PRODUCT_MAP_STAGE_STARTS[3];
const DASHBOARD_CODE_END = PRODUCT_MAP_STAGE_STARTS[4];
export const DASHBOARD_CONTENT_FRACTION = 1 - (DASHBOARD_CODE_END - DASHBOARD_CODE_START);
// Dashboard omits the code panel; the remaining animation keeps its original pace.
export function dashboardCompactProgress(progress: number): number {
  const value = clamp(progress);
  const skipped = Math.min(Math.max(value - DASHBOARD_CODE_START, 0), DASHBOARD_CODE_END - DASHBOARD_CODE_START);
  return (value - skipped) / DASHBOARD_CONTENT_FRACTION;
}
export function dashboardContentProgress(progress: number): number {
  const value = clamp(progress);
  const skipped = value >= dashboardCompactProgress(DASHBOARD_CODE_START) ? DASHBOARD_CODE_END - DASHBOARD_CODE_START : 0;
  return clamp(value * DASHBOARD_CONTENT_FRACTION + skipped);
}
export const DASHBOARD_STAGE_STARTS = PRODUCT_MAP_STAGE_STARTS.filter((_, index) => index !== 3).map(dashboardCompactProgress);
const LEAGUE_CODE_START = PRODUCT_MAP_STAGE_STARTS[3];
const LEAGUE_CODE_END = PRODUCT_MAP_STAGE_STARTS[4];
export const LEAGUE_CONTENT_FRACTION = 1 - (LEAGUE_CODE_END - LEAGUE_CODE_START);
export function leagueCompactProgress(progress: number): number {
  const value = clamp(progress);
  const skipped = Math.min(Math.max(value - LEAGUE_CODE_START, 0), LEAGUE_CODE_END - LEAGUE_CODE_START);
  return (value - skipped) / LEAGUE_CONTENT_FRACTION;
}
export function leagueContentProgress(progress: number): number {
  const value = clamp(progress);
  const skipped = value >= leagueCompactProgress(LEAGUE_CODE_START) ? LEAGUE_CODE_END - LEAGUE_CODE_START : 0;
  return clamp(value * LEAGUE_CONTENT_FRACTION + skipped);
}
export const LEAGUE_STAGE_STARTS = PRODUCT_MAP_STAGE_STARTS.filter((_, index) => index !== 3).map(leagueCompactProgress);
const UPGRADE_CODE_START = PRODUCT_STAGE_STARTS[2];
const UPGRADE_CODE_END = PRODUCT_STAGE_STARTS[3];
export const UPGRADE_CONTENT_FRACTION = 1 - (UPGRADE_CODE_END - UPGRADE_CODE_START);
// Keep the prompt, plan and upgrade demonstration at their original pace.
export function upgradeCompactProgress(progress: number): number {
  const value = clamp(progress);
  const skipped = Math.min(Math.max(value - UPGRADE_CODE_START, 0), UPGRADE_CODE_END - UPGRADE_CODE_START);
  return (value - skipped) / UPGRADE_CONTENT_FRACTION;
}
export function upgradeContentProgress(progress: number): number {
  const value = clamp(progress);
  const skipped = value >= upgradeCompactProgress(UPGRADE_CODE_START) ? UPGRADE_CODE_END - UPGRADE_CODE_START : 0;
  return clamp(value * UPGRADE_CONTENT_FRACTION + skipped);
}
export const UPGRADE_STAGE_STARTS = PRODUCT_STAGE_STARTS.filter((_, index) => index !== 2).map(upgradeCompactProgress);
export const ENGINEERING_STAGE_STARTS = [0, .2, .5] as const;
const CONTENT_SCENES = [0, .14, .33, .54, .73, .94, 1.53, 2.38, 3.08, 3.78, 4.48, 5.28, 6.00, 6.72, 7.34, 7.72, 8.10] as const;
// Keep original scene identities when hiding Monitor and the ClickUp workflow.
export const VISIBLE_STORY_SCENES = CONTENT_SCENES.map((_, scene) => scene).filter(scene => scene !== 8 && scene !== 13);
export const EVIDENCE_SCENES = [6, 10, 15] as const;
const EVIDENCE_DURATION = .18;
const EXPANDED_CHAPTERS = [{ scene: 6, duration: .46 }, { scene: 7, duration: .40 }, { scene: 10, duration: .40 }];
// Three chat beats occupy .25 units instead of the original .55.
const CHAT_DEMO_REDUCTION = .30;
const DASHBOARD_CONTENT_DURATION = CONTENT_SCENES[8] - CONTENT_SCENES[7] + EXPANDED_CHAPTERS.find(item => item.scene === 7)!.duration - .04;
const DASHBOARD_CODE_REDUCTION = DASHBOARD_CONTENT_DURATION * (1 - DASHBOARD_CONTENT_FRACTION);
const LEAGUE_CONTENT_DURATION = CONTENT_SCENES[11] - CONTENT_SCENES[10] + EXPANDED_CHAPTERS.find(item => item.scene === 10)!.duration - .04;
const LEAGUE_CODE_REDUCTION = LEAGUE_CONTENT_DURATION * (1 - LEAGUE_CONTENT_FRACTION);
const UPGRADE_CONTENT_DURATION = CONTENT_SCENES[13] - CONTENT_SCENES[12] - .04;
const UPGRADE_CODE_REDUCTION = UPGRADE_CONTENT_DURATION * (1 - UPGRADE_CONTENT_FRACTION);
const MONITOR_CONTENT_REDUCTION = CONTENT_SCENES[9] - CONTENT_SCENES[8];
const HANDOFF_CONTENT_REDUCTION = CONTENT_SCENES[14] - CONTENT_SCENES[13];
const expansionBefore = (scene: number) => EXPANDED_CHAPTERS.filter(item => item.scene < scene).reduce((sum, item) => sum + item.duration, 0);
export const STORY_SCENES = CONTENT_SCENES.map((start, scene) => start + EVIDENCE_SCENES.filter(index => index < scene).length * EVIDENCE_DURATION + expansionBefore(scene) - (scene > 5 ? CHAT_DEMO_REDUCTION : 0) - (scene > 7 ? DASHBOARD_CODE_REDUCTION : 0) - (scene > 8 ? MONITOR_CONTENT_REDUCTION : 0) - (scene > 10 ? LEAGUE_CODE_REDUCTION : 0) - (scene > 12 ? UPGRADE_CODE_REDUCTION : 0) - (scene > 13 ? HANDOFF_CONTENT_REDUCTION : 0));
// Fixed reference for the original scroll track, including all ten evidence frames.
const ORIGINAL_STORY_END = 11.86;
export const STORY_END = 8.80 + EVIDENCE_SCENES.length * EVIDENCE_DURATION + expansionBefore(CONTENT_SCENES.length) - CHAT_DEMO_REDUCTION - DASHBOARD_CODE_REDUCTION - MONITOR_CONTENT_REDUCTION - LEAGUE_CODE_REDUCTION - UPGRADE_CODE_REDUCTION - HANDOFF_CONTENT_REDUCTION;
// Shorten the scroll track too, preserving the pace of every other frame.
export const STORY_SCROLL_SCALE = STORY_END / ORIGINAL_STORY_END;
const nextSceneStart = (scene: number) => STORY_SCENES[VISIBLE_STORY_SCENES.find(index => index > scene) ?? STORY_SCENES.length] ?? STORY_END;
export function contentRange(scene: number): readonly [number, number] {
  if (!VISIBLE_STORY_SCENES.includes(scene)) return [STORY_SCENES[scene], STORY_SCENES[scene]];
  const tail = EVIDENCE_SCENES.some(index => index === scene) ? EVIDENCE_DURATION : 0;
  return [STORY_SCENES[scene] + .02, nextSceneStart(scene) - .02 - tail];
}
export function chapterProgress(progress: number, scene: number) {
  if (!VISIBLE_STORY_SCENES.includes(scene)) return { content: 0, evidence: 0 };
  const [start, end] = contentRange(scene);
  return {
    content: clamp((progress - start) / (end - start)),
    evidence: EVIDENCE_SCENES.some(index => index === scene) ? phase(progress, end, end + .04) : 0,
  };
}
export function phase(progress: number, start: number, end: number): number {
  const value = clamp((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
}
export function storyProgress(top: number, height: number, viewport: number, inset: number): number {
  return clamp((inset - top) / Math.max(1, height - viewport + inset));
}
export function sceneOpacity(progress: number, index: number): number {
  if (!VISIBLE_STORY_SCENES.includes(index)) return 0;
  const starts = STORY_SCENES;
  const incoming = index === 0 ? 1 : phase(progress, starts[index] - .02, starts[index] + .02);
  const next = nextSceneStart(index);
  const outgoing = index === starts.length - 1 ? 0 : phase(progress, next - .02, next + .02);
  return incoming * (1 - outgoing);
}
export function sceneIndex(progress: number): number {
  const next = VISIBLE_STORY_SCENES.findIndex(index => STORY_SCENES[index] > progress);
  return VISIBLE_STORY_SCENES[next < 0 ? VISIBLE_STORY_SCENES.length - 1 : Math.max(0, next - 1)];
}
