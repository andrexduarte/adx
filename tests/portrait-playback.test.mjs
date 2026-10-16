import test from 'node:test';
import assert from 'node:assert/strict';
import { PORTRAIT_TITLE, portraitProgress, portraitFrame, portraitDotPosition, samplePortrait } from '../.test-output/app/layout/site-footer/portrait-playback.mjs';

test('the portrait assembles at the center, rises, then reveals the title, seven tools and links', () => {
  assert.equal(portraitFrame(0).title, '');
  assert.equal(portraitFrame(0).formation, 0);
  assert.equal(portraitFrame(.5).formation, 1);
  assert.equal(portraitFrame(.5).lift, 0);
  assert.equal(portraitFrame(.68).lift, 1);
  assert.equal(portraitFrame(.68).title, '');
  assert.equal(portraitFrame(.8).title, PORTRAIT_TITLE);
  assert.deepEqual(portraitFrame(.8).tools, Array(7).fill(0));
  assert.deepEqual(portraitFrame(1).tools, Array(7).fill(1));
  assert.equal(portraitFrame(.956).links, 0);
  assert.equal(portraitFrame(1).links, 1);
  assert.deepEqual(portraitFrame(2), portraitFrame(1));
  assert.deepEqual(portraitFrame(-1), portraitFrame(0));
  const forwards = Array.from({ length: 101 }, (_, i) => portraitFrame(i / 100));
  for (let i = 100; i >= 0; i--) assert.deepEqual(portraitFrame(i / 100), forwards[i]);
});

test('transparent and dark pixels do not become a rectangular cloud; sampling is deterministic', () => {
  const size = 30;
  const empty = new Uint8ClampedArray(size * size * 4);
  assert.equal(samplePortrait(empty, size, size).length, 0);
  const pixels = new Uint8ClampedArray(empty);
  for (let i = 0; i < size * size; i++) pixels.set(i % 2 ? [240, 230, 210, 255] : [10, 10, 10, 255], i * 4);
  const dots = samplePortrait(pixels, size, size);
  assert.ok(dots.length > 200 && dots.length < 450);
  assert.deepEqual(samplePortrait(pixels, size, size), dots);
  assert.ok(dots.every(dot => Math.floor(dot.x * size) % 2 === 1));
});

test('scroll geometry is bounded and every dot reaches the matching portrait pixel on desktop and mobile', () => {
  assert.equal(portraitProgress(800, 2400, 800, 90), 0);
  assert.equal(portraitProgress(90, 2400, 800, 90), 0);
  assert.equal(portraitProgress(-1600, 2400, 800, 90), 1);
  assert.equal(portraitProgress(-9999, 2400, 800, 90), 1);
  const dot = { x: .4, y: .6, spreadX: .8, spreadY: .2, radius: 1, delay: .15, color: 0, bend: 30 };
  for (const [width, height, size] of [[1280, 710, 300], [390, 768, 244]]) {
    const box = { x: (width - size) / 2, y: 60, size };
    const from = portraitDotPosition(dot, 0, width, height, box);
    assert.equal(from.x, width * .8);
    assert.equal(from.y, height * .2);
    const to = portraitDotPosition(dot, 1, width, height, box);
    assert.ok(Math.abs(to.x - (box.x + .4 * size)) < 1e-8);
    assert.ok(Math.abs(to.y - (box.y + .6 * size)) < 1e-8);
  }
});
