import test from 'node:test';
import assert from 'node:assert/strict';
import { tournamentFrame, tournamentStates, tournamentPlaybackProgress, tournamentSeek } from '../.test-output/app/features/home/arena-story/tournaments-playback.mjs';

test('state navigation reaches each state and scroll recovery returns to data', () => {
  for (const stop of tournamentStates) assert.equal(tournamentFrame(stop.at).state, stop.state);
  assert.equal(tournamentFrame(.90).state, 'ready');
  assert.equal(tournamentFrame(1).state, 'ready');
});

test('state buttons seek their state after the tools scene and resizing preserves ready data', () => {
  for (const stop of tournamentStates) {
    assert.equal(tournamentFrame(tournamentPlaybackProgress(tournamentSeek(stop.state))).state, stop.state);
    assert.ok(tournamentSeek(stop.state) >= .61 && tournamentSeek(stop.state) < .84);
  }
  for (const progress of [.84, .88, .92, .96, 1]) {
    assert.equal(tournamentFrame(tournamentPlaybackProgress(progress)).state, 'ready');
  }
});
test('tournament playback is bounded and reversible, including failures', () => {
  const points = [-1, .54, .62, .70, .77, .83, .87, .94, 2];
  const forward = points.map(tournamentFrame);
  assert.deepEqual(points.toReversed().map(tournamentFrame).toReversed(), forward);
  assert.equal(forward[0].state, 'loading');
  assert.equal(forward.at(-1).state, 'ready');
});
