import test from 'node:test';
import assert from 'node:assert/strict';
import { phase, sceneOpacity, sceneIndex, storyProgress, chapterProgress, contentRange, EVIDENCE_SCENES, STORY_END, STORY_SCENES, STORY_SCROLL_SCALE } from '../.test-output/app/features/home/arena-story/story-timing.mjs';

test('the compact chat sequence keeps the other frames at the same pace', () => {
  const [start, end] = contentRange(5);
  const originalStoryEnd = 11.86;
  const oldScrollDistance = 39050; // 4970svh at 800px, minus viewport plus 90px header.
  const newScrollDistance = oldScrollDistance * STORY_SCROLL_SCALE;
  assert.ok(Math.abs(end - start - .25) < 1e-10);
  assert.ok(Math.abs(newScrollDistance / STORY_END - oldScrollDistance / originalStoryEnd) < 1e-10);
  assert.deepEqual(STORY_SCENES.slice(0, 6), [0, .14, .33, .54, .73, .94]);
  assert.ok(Math.abs(contentRange(6)[1] - contentRange(6)[0] - 1.27) < 1e-10);
});

test('scroll stays bounded before entry and after exit, including short regions', () => {
  assert.equal(storyProgress(900, 4000, 800, 90), 0);
  assert.equal(storyProgress(90, 4000, 800, 90), 0);
  assert.equal(storyProgress(-3200, 4000, 800, 90), 1);
  assert.equal(storyProgress(-9000, 4000, 800, 90), 1);
  assert.ok(Number.isFinite(storyProgress(0, 0, 800, 90)));
});
test('every scroll position has a visible scene, including transitions', () => {
  for (let step = 0; step <= STORY_END * 1000; step++) {
    const p = step / 1000;
    const opacity = STORY_SCENES.map((_, i) => sceneOpacity(p, i));
    assert.ok(opacity.every(value => value >= 0 && value <= 1));
    assert.ok(Math.abs(opacity.reduce((a,b) => a+b,0) - 1) < .00001, 'empty or overlapping scene at ' + p);
  }
});
test('scrubbing backward restores the same frame with no accumulated state', () => {
  const positions = STORY_SCENES.map(start => start + .07);
  const snapshots = positions.map(p => [sceneIndex(p), phase(p, .87, .97)]);
  assert.deepEqual(positions.toReversed().map(p => [sceneIndex(p), phase(p, .87, .97)]).toReversed(), snapshots);
  assert.deepEqual(snapshots.map(s => s[0]), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
});

test('each demonstration finishes before its evidence, including on backward scroll', () => {
  for (const scene of EVIDENCE_SCENES) {
    const [start, end] = contentRange(scene);
    const tail = (STORY_SCENES[scene + 1] ?? STORY_END) - .03;
    assert.deepEqual(chapterProgress(start, scene), { content: 0, evidence: 0 });
    assert.deepEqual(chapterProgress(end, scene), { content: 1, evidence: 0 });
    assert.deepEqual(chapterProgress(tail, scene), { content: 1, evidence: 1 });
    const forward = [start, end - .02, end + .02, tail].map(p => chapterProgress(p, scene));
    const backward = [tail, end + .02, end - .02, start].map(p => chapterProgress(p, scene));
    assert.deepEqual(backward.toReversed(), forward);
  }
});

test('the ClickUp workflow has no code metrics and seeking tournament states stays in the demo', () => {
  const [clickupStart, clickupEnd] = contentRange(13);
  assert.equal(chapterProgress(clickupStart, 13).evidence, 0);
  assert.equal(chapterProgress(clickupEnd, 13).evidence, 0);
  const [start, end] = contentRange(6);
  for (const target of [.58, .65, .73, .80, .86, .94]) {
    const frame = chapterProgress(start + target * (end - start), 6);
    assert.ok(Math.abs(frame.content - target) < 1e-10);
    assert.equal(frame.evidence, 0);
  }
});

