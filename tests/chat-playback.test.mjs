import test from 'node:test';
import assert from 'node:assert/strict';
import { chatFrame } from '../.test-output/app/features/home/arena-story/chat-playback.mjs';

test('sending clears the draft and only shows the own message after its echo', () => {
  assert.equal(chatFrame(0).connected, false);
  assert.equal(chatFrame(.29).draft, 'Boa tarde! Tudo certo por aqui.');
  assert.equal(chatFrame(.32).sending, true);
  assert.equal(chatFrame(.32).draft, '');
  assert.equal(chatFrame(.32).messages.filter(m => m.mine).length, 0);
  assert.equal(chatFrame(.4).messages.filter(m => m.mine).length, 1);
});
test('responsive adaptation preserves the conversation and repeated ids do not duplicate bubbles', () => {
  assert.deepEqual(chatFrame(.55).messages, chatFrame(.83).messages);
  assert.equal(chatFrame(.55).compact, 0);
  assert.equal(chatFrame(.83).compact, 1);
  assert.deepEqual(chatFrame(.83).messages, chatFrame(1).messages);
  assert.equal(new Set(chatFrame(1).messages.map(m => m.id)).size, 3);
  assert.equal(chatFrame(1).messages.filter(m => m.mine).length, 1);
  assert.equal(chatFrame(.8).draft, '');
});
test('rewinding restores the draft and transcript without running timers or requests', () => {
  const positions = [0, .23, .32, .4, .51, .67, .8, .85, 1];
  const snapshots = positions.map(chatFrame);
  assert.deepEqual(positions.toReversed().map(chatFrame).toReversed(), snapshots);
  assert.deepEqual(chatFrame(-1), chatFrame(0));
  assert.deepEqual(chatFrame(2), chatFrame(1));
});
