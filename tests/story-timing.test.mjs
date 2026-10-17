import test from 'node:test';
import assert from 'node:assert/strict';
import { phase, sceneOpacity, sceneIndex, storyProgress, chapterProgress, contentRange, EVIDENCE_SCENES, STORY_END, STORY_SCENES, VISIBLE_STORY_SCENES, STORY_SCROLL_SCALE, DASHBOARD_STAGE_STARTS, dashboardCompactProgress, dashboardContentProgress, LEAGUE_STAGE_STARTS, leagueCompactProgress, leagueContentProgress, UPGRADE_STAGE_STARTS, upgradeCompactProgress, upgradeContentProgress } from '../.test-output/app/features/home/arena-story/story-timing.mjs';

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

test('hiding Dashboard code removes only its scroll interval and preserves the visible animation pace', () => {
  const [start, end] = contentRange(7);
  const duration = end - start;
  assert.ok(Math.abs(duration - .8692) < 1e-10);
  assert.equal(DASHBOARD_STAGE_STARTS.length, 4);
  // These are points in the original prompt, plan, map and interface animations.
  for (const original of [0, .10, .13, .28, .30, .44, .65, .827, .98, 1]) {
    const compact = dashboardCompactProgress(original);
    assert.ok(Math.abs(dashboardContentProgress(compact) - original) < 1e-10);
    const skippedScroll = original >= .64 ? .1908 : 0;
    assert.ok(Math.abs(compact * duration - (original * 1.06 - skippedScroll)) < 1e-10);
  }
  assert.ok(Math.abs(dashboardCompactProgress(.46) - dashboardCompactProgress(.64)) < 1e-10);
  assert.ok(Math.abs(dashboardContentProgress(DASHBOARD_STAGE_STARTS[3]) - .64) < 1e-10);
  assert.equal(dashboardContentProgress(-1), 0);
  assert.equal(dashboardContentProgress(2), 1);
  // Avatar retains its original content duration.
  assert.ok(Math.abs(contentRange(9)[1] - contentRange(9)[0] - .66) < 1e-10);
});

test('hiding League code preserves the pace of its workflow and complete interface sequence', () => {
  const [start, end] = contentRange(10);
  const duration = end - start;
  assert.ok(Math.abs(duration - .9512) < 1e-10);
  assert.equal(LEAGUE_STAGE_STARTS.length, 4);
  for (const original of [0, .10, .13, .28, .30, .44, .65, .67, .82, .98, 1]) {
    const compact = leagueCompactProgress(original);
    assert.ok(Math.abs(leagueContentProgress(compact) - original) < 1e-10);
    const skippedScroll = original >= .64 ? .2088 : 0;
    assert.ok(Math.abs(compact * duration - (original * 1.16 - skippedScroll)) < 1e-10);
  }
  assert.ok(Math.abs(leagueCompactProgress(.46) - leagueCompactProgress(.64)) < 1e-10);
  assert.ok(Math.abs(leagueContentProgress(LEAGUE_STAGE_STARTS[3]) - .64) < 1e-10);
  assert.equal(leagueContentProgress(-1), 0);
  assert.equal(leagueContentProgress(2), 1);
  assert.ok(EVIDENCE_SCENES.includes(10));
  assert.ok(Math.abs(STORY_SCENES[11] - end - .20) < 1e-10);
});

test('Dashboard ends at its interface without an evidence interval', () => {
  const [start, end] = contentRange(7);
  for (const progress of [start, (start + end) / 2, end, STORY_SCENES[9] - .01]) {
    assert.equal(chapterProgress(progress, 7).evidence, 0);
  }
  assert.ok(Math.abs(STORY_SCENES[9] - end - .02) < 1e-10);
  assert.equal(chapterProgress(end, 7).content, 1);
});
test('hiding Angular code keeps prompt, plan and version milestones at their original scroll pace', () => {
  const [start, end] = contentRange(12);
  const duration = end - start;
  assert.ok(Math.abs(duration - .51) < 1e-10);
  assert.equal(UPGRADE_STAGE_STARTS.length, 3);
  for (const original of [0, .14, .17, .36, .64, .75, .97, 1]) {
    const compact = upgradeCompactProgress(original);
    assert.ok(Math.abs(upgradeContentProgress(compact) - original) < 1e-10);
    const skippedScroll = original >= .63 ? .17 : 0;
    assert.ok(Math.abs(compact * duration - (original * .68 - skippedScroll)) < 1e-10);
  }
  assert.equal(upgradeCompactProgress(.38), upgradeCompactProgress(.63));
  assert.ok(Math.abs(upgradeContentProgress(UPGRADE_STAGE_STARTS[2]) - .63) < 1e-10);
  assert.equal(upgradeContentProgress(-1), 0);
  assert.equal(upgradeContentProgress(2), 1);
  assert.ok(!EVIDENCE_SCENES.includes(12));
  assert.ok(Math.abs(STORY_SCENES[14] - end - .02) < 1e-10);
  assert.equal(chapterProgress(end + .01, 12).evidence, 0);
});
test('every scroll position has a visible scene, including transitions', () => {
  for (let step = 0; step <= STORY_END * 1000; step++) {
    const p = step / 1000;
    const opacity = STORY_SCENES.map((_, i) => sceneOpacity(p, i));
    assert.notEqual(sceneIndex(p), 8, 'hidden Monitor became active at ' + p);
    assert.notEqual(sceneIndex(p), 13, 'hidden ClickUp became active at ' + p);
    assert.ok(opacity.every(value => value >= 0 && value <= 1));
    assert.ok(Math.abs(opacity.reduce((a,b) => a+b,0) - 1) < .00001, 'empty or overlapping scene at ' + p);
  }
});
test('scrubbing backward restores the same frame with no accumulated state', () => {
  const positions = VISIBLE_STORY_SCENES.map(scene => STORY_SCENES[scene] + .07);
  const snapshots = positions.map(p => [sceneIndex(p), phase(p, .87, .97)]);
  assert.deepEqual(positions.toReversed().map(p => [sceneIndex(p), phase(p, .87, .97)]).toReversed(), snapshots);
  assert.deepEqual(snapshots.map(s => s[0]), [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16]);
});

test('hiding Monitor removes its entire chapter and evidence without changing other scene identities', () => {
  const boundary = STORY_SCENES[9];
  assert.equal(sceneIndex(boundary - .03), 7);
  assert.equal(sceneIndex(boundary + .03), 9);
  assert.equal(sceneOpacity(boundary, 8), 0);
  assert.deepEqual(chapterProgress(boundary, 8), { content: 0, evidence: 0 });
  assert.equal(contentRange(8)[0], contentRange(8)[1]);
  assert.ok(!EVIDENCE_SCENES.includes(8));
});

test('hiding ClickUp joins Angular to Signals without an empty scroll interval', () => {
  const boundary = STORY_SCENES[14];
  assert.equal(sceneIndex(boundary - .03), 12);
  assert.equal(sceneIndex(boundary + .03), 14);
  assert.equal(sceneOpacity(boundary, 13), 0);
  assert.deepEqual(chapterProgress(boundary, 13), { content: 0, evidence: 0 });
  assert.equal(contentRange(13)[0], contentRange(13)[1]);
  assert.ok(!EVIDENCE_SCENES.includes(13));
  // Previous reductions plus League code, Angular code/evidence and the ClickUp chapter.
  assert.ok(Math.abs(STORY_END - (11.0092 - .88 - .18 - .18 - .2088 - .17 - .18 - .62 - .18)) < 1e-10);
});

test('hiding Signals evidence preserves its three content stages and removes the closing interval', () => {
  const [start, end] = contentRange(14);
  assert.ok(!EVIDENCE_SCENES.includes(14));
  assert.ok(Math.abs(end - start - .34) < 1e-10);
  assert.ok(Math.abs(STORY_SCENES[15] - end - .02) < 1e-10);
  for (const progress of [start, (start + end) / 2, end, STORY_SCENES[15] - .01]) {
    assert.equal(chapterProgress(progress, 14).evidence, 0);
  }
  assert.equal(chapterProgress(end, 14).content, 1);
});

test('hiding Avatar evidence removes only its closing interval and keeps its content duration', () => {
  const [start, end] = contentRange(9);
  assert.ok(!EVIDENCE_SCENES.includes(9));
  assert.ok(Math.abs(end - start - .66) < 1e-10);
  assert.ok(Math.abs(STORY_SCENES[10] - end - .02) < 1e-10);
  for (const progress of [start, (start + end) / 2, end, STORY_SCENES[10] - .01]) {
    assert.equal(chapterProgress(progress, 9).evidence, 0);
  }
  assert.equal(chapterProgress(end, 9).content, 1);
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

test('seeking tournament states stays in the demo', () => {
  const [start, end] = contentRange(6);
  for (const target of [.58, .65, .73, .80, .86, .94]) {
    const frame = chapterProgress(start + target * (end - start), 6);
    assert.ok(Math.abs(frame.content - target) < 1e-10);
    assert.equal(frame.evidence, 0);
  }
});

