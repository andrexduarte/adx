export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export const TOURNAMENT_STAGE_STARTS = [0, .12, .26, .40, .50, .61] as const;
export const PRODUCT_STAGE_STARTS = [0, .17, .38, .63] as const;
export const PRODUCT_MAP_STAGE_STARTS = [0, .13, .30, .46, .64] as const;
export const ENGINEERING_STAGE_STARTS = [0, .2, .5] as const;
const CONTENT_SCENES = [0, .14, .33, .54, .73, .94, 1.53, 2.38, 3.08, 3.78, 4.48, 5.28, 6.00, 6.72, 7.34, 7.72, 8.10] as const;
export const EVIDENCE_SCENES = [5, 6, 7, 8, 9, 10, 11, 12, 14, 15] as const;
const EVIDENCE_DURATION = .18;
const EXPANDED_CHAPTERS = [{ scene: 6, duration: .46 }, { scene: 7, duration: .40 }, { scene: 10, duration: .40 }];
// Three chat beats occupy .25 units instead of the original .55.
const CHAT_DEMO_REDUCTION = .30;
const expansionBefore = (scene: number) => EXPANDED_CHAPTERS.filter(item => item.scene < scene).reduce((sum, item) => sum + item.duration, 0);
export const STORY_SCENES = CONTENT_SCENES.map((start, scene) => start + EVIDENCE_SCENES.filter(index => index < scene).length * EVIDENCE_DURATION + expansionBefore(scene) - (scene > 5 ? CHAT_DEMO_REDUCTION : 0));
const ORIGINAL_STORY_END = 8.80 + EVIDENCE_SCENES.length * EVIDENCE_DURATION + expansionBefore(CONTENT_SCENES.length);
export const STORY_END = ORIGINAL_STORY_END - CHAT_DEMO_REDUCTION;
// Shorten the scroll track too, preserving the pace of every other frame.
export const STORY_SCROLL_SCALE = STORY_END / ORIGINAL_STORY_END;
export function contentRange(scene: number): readonly [number, number] {
  const tail = EVIDENCE_SCENES.some(index => index === scene) ? EVIDENCE_DURATION : 0;
  return [STORY_SCENES[scene] + .02, (STORY_SCENES[scene + 1] ?? STORY_END) - .02 - tail];
}
export function chapterProgress(progress: number, scene: number) {
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
  const starts = STORY_SCENES;
  const incoming = index === 0 ? 1 : phase(progress, starts[index] - .02, starts[index] + .02);
  const outgoing = index === starts.length - 1 ? 0 : phase(progress, starts[index + 1] - .02, starts[index + 1] + .02);
  return incoming * (1 - outgoing);
}
export function sceneIndex(progress: number): number {
  const next = STORY_SCENES.findIndex(start => start > progress);
  return next < 0 ? STORY_SCENES.length - 1 : Math.max(0, next - 1);
}
