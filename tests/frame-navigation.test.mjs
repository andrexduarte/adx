import test from 'node:test';
import assert from 'node:assert/strict';
import { pageFrames, activePageFrame } from '../.test-output/app/features/home/frame-navigation/frame-catalog.mjs';
import { contentRange, STORY_END, STORY_SCENES, sceneIndex } from '../.test-output/app/features/home/arena-story/story-timing.mjs';

test('frame links have unique stable IDs and preserve chronological page order', () => {
  const career = [{ anchor: 'momento-2015', label: '2015 — Freelancer', kind: 'moment' }, { anchor: 'paisagem', label: 'Cerrado', kind: 'landscape' }];
  const frames = pageFrames(career);
  assert.equal(new Set(frames.map(frame => frame.id)).size, frames.length);
  assert.equal(frames[0].id, 'frame-abertura');
  assert.equal(frames[1].id, 'frame-trade-arena');
  assert.equal(frames.at(-1).id, 'frame-contato');
  const order = ['hero', 'arena', 'nos', 'wakawa', 'career', 'closing'];
  frames.forEach((frame, index) => {
    assert.ok(frame.start >= 0 && frame.start <= frame.at && frame.at <= 1);
    if (!index) return;
    const previous = frames[index - 1];
    assert.ok(order.indexOf(frame.region) >= order.indexOf(previous.region));
    if (previous.region === frame.region) assert.ok(frame.start >= previous.start);
  });
  const extended = pageFrames([{ anchor: 'momento-2023', label: '2023 — Evavip', kind: 'moment' }, ...career]);
  assert.ok(extended.some(frame => frame.id === 'frame-momento-2015'));
});

test('every Arena link stays in its own scene, with evidence after the demonstration', () => {
  for (const frame of pageFrames([]).filter(frame => frame.region === 'arena')) {
    const progress = frame.at * STORY_END;
    assert.equal(sceneIndex(progress), frame.scene, frame.id);
    const [start, end] = contentRange(frame.scene);
    if (frame.evidence) {
      assert.ok(progress > end + .04, frame.id);
      assert.ok(progress < (STORY_SCENES[frame.scene + 1] ?? STORY_END), frame.id);
    } else if (frame.scene > 0) assert.ok(progress >= start && progress <= end, frame.id);
  }
});

test('active frame follows scroll in both directions and ignores unavailable sections', () => {
  const positions = [0, 100, 200, Infinity, 400];
  assert.equal(activePageFrame(positions, 210), 2);
  assert.equal(activePageFrame(positions, 450), 4);
  assert.equal(activePageFrame(positions, 100), 1);
  assert.equal(activePageFrame(positions, -20), 0);
});
