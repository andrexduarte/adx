import test from 'node:test';
import assert from 'node:assert/strict';
import { careerFrames, careerAgendaFrame, timelineFrame, timelineIndex, timelinePosition } from '../.test-output/app/features/timeline/timeline-playback.mjs';

test('career frames retain the supplied content without the removed landscape', () => {
  const moments = [
    { slug: '2023', company: 'Evavip.com', year: '2023' },
    { slug: '2022', company: 'Plural Systems', year: '2022' },
    { slug: '2015', company: 'Freelancer', year: '2015' },
    { slug: '2012', company: '3bits', year: '2012' },
    { slug: '2008', company: 'O começo', year: '2008' },
  ];
  const frames = careerFrames(moments);
  assert.deepEqual(frames.map(frame => frame.anchor), ['momento-2023', 'momento-2022', 'momento-2015', 'momento-2012']);
  assert.equal(frames[2].moment, moments[2]);
  assert.equal(frames[3].moment, moments[3]);
  assert.deepEqual(careerFrames([]), []);
  assert.equal(careerFrames(moments.slice(0, 2)).length, 2);
  const withCurrent = careerFrames([{ slug: '2025', company: 'Trade Arena', year: '2025' }, ...moments]);
  assert.equal(withCurrent[0].anchor, 'momento-trade-arena');
  assert.equal(withCurrent[0].moment.title, 'Front-end developer · experimentando IA');
  assert.equal(withCurrent[0].moment.excerpt, 'Desde o verão de 2025 — atual');
  assert.equal(withCurrent[1].anchor, 'momento-2023');
});
test('scroll and current frame stay bounded before, inside and after the sequence', () => {
  assert.equal(timelinePosition(900, 9500, 800, 90, 10), 0);
  assert.equal(timelinePosition(90, 9500, 800, 90, 10), 0);
  assert.equal(timelinePosition(-8700, 9500, 800, 90, 10), 10);
  assert.equal(timelinePosition(-20000, 9500, 800, 90, 10), 10);
  assert.equal(timelinePosition(0, 0, 800, 90, 0), 0);
  assert.equal(timelineIndex(-5, 10), 0);
  assert.equal(timelineIndex(10, 10), 9);
  assert.equal(timelineIndex(0, 0), 0);
});
test('frame changes remain continuous, reverse identically, and navigation stops show one complete experience', () => {
  for (const count of [1, 3, 10]) {
    const positions = Array.from({ length: count * 100 + 1 }, (_, i) => i / 100);
    const snapshot = position => Array.from({ length: count }, (_, i) => timelineFrame(position, i, count));
    const forward = positions.map(snapshot);
    for (const frames of forward) {
      assert.ok(frames.every(frame => frame.opacity >= 0 && frame.opacity <= 1));
      assert.ok(Math.abs(frames.reduce((sum, frame) => sum + frame.opacity, 0) - 1) < 1e-8);
    }
    assert.deepEqual(positions.toReversed().map(snapshot).toReversed(), forward);
    for (let i = 0; i < count; i++) {
      assert.equal(timelineIndex(i + .25, count), i);
      assert.deepEqual(snapshot(i + .25).map(frame => frame.opacity), Array.from({ length: count }, (_, j) => i === j ? 1 : 0));
    }
  }
});

test('agenda keeps neighbours visible, centres each stop and reverses continuously', () => {
  for (let i = 1; i < 8; i++) {
    const center = careerAgendaFrame(i + .25, i, 9);
    assert.deepEqual(center, { offset: 0, scale: 1, opacity: 1 });
    for (const neighbour of [i - 1, i + 1]) {
      const frame = careerAgendaFrame(i + .25, neighbour, 9);
      assert.ok(frame.opacity > 0 && frame.opacity < 1);
      assert.ok(frame.scale < center.scale);
      assert.equal(Math.abs(frame.offset), 1);
    }
  }
  const forward = Array.from({ length: 901 }, (_, n) => careerAgendaFrame(n / 100, 4, 9));
  for (let n = 900; n >= 0; n--) assert.deepEqual(careerAgendaFrame(n / 100, 4, 9), forward[n]);
});
