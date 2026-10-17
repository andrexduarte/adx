import test from 'node:test';
import assert from 'node:assert/strict';
import { pageFrames, activePageFrame } from '../.test-output/app/features/home/frame-navigation/frame-catalog.mjs';
import { contentRange, STORY_END, STORY_SCENES, sceneIndex, chapterProgress, dashboardContentProgress, leagueContentProgress, upgradeContentProgress } from '../.test-output/app/features/home/arena-story/story-timing.mjs';

test('frame links have unique stable IDs and preserve chronological page order', () => {
  const career = [{ anchor: 'momento-2015', label: '2015 — Freelancer', kind: 'moment' }, { anchor: 'momento-2012', label: '2012 — 3bits', kind: 'moment' }];
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

test('Dashboard tools lead directly to the interface while retained examples keep their code frames', () => {
  const frames = pageFrames([]);
  assert.deepEqual(frames.filter(frame => frame.group === 'Dashboard').map(frame => frame.id), [
    'frame-dashboard-ideia', 'frame-dashboard-plano', 'frame-dashboard-ferramentas',
    'frame-dashboard-interface',
  ]);
  const result = frames.find(frame => frame.id === 'frame-dashboard-interface');
  assert.equal(result.panel, 3);
  assert.equal(frames.indexOf(result) + 1, 18);
  assert.equal(frames[frames.indexOf(result) + 1].id, 'frame-avatar-ideia');
  const content = chapterProgress(result.at * STORY_END, 7).content;
  // Open the fully visible desktop result before the camera starts moving.
  const dashboardDemo = (dashboardContentProgress(content) - .65) / .33;
  assert.ok(dashboardDemo > 0 && dashboardDemo < .16);
  for (const id of ['torneios', 'avatar', 'dominios']) {
    assert.ok(frames.some(frame => frame.id === `frame-${id}-codigo`), id);
  }
});

test('Angular plan leads directly to interface frame 34, then Signals without evidence or ClickUp', () => {
  const frames = pageFrames([]);
  assert.deepEqual(frames.filter(frame => frame.group === 'Angular 16 → 21').map(frame => frame.id), [
    'frame-angular-ideia', 'frame-angular-plano', 'frame-angular-interface',
  ]);
  const result = frames.find(frame => frame.id === 'frame-angular-interface');
  assert.equal(frames.indexOf(result) + 1, 34);
  assert.equal(result.panel, 2);
  assert.equal(result.scene, 12);
  const content = chapterProgress(result.at * STORY_END, 12).content;
  assert.ok(Math.abs(upgradeContentProgress(content) - .97) < 1e-10);
  assert.equal(frames[frames.indexOf(result) - 1].id, 'frame-angular-plano');
  assert.equal(frames[frames.indexOf(result) + 1].id, 'frame-signals-ideia');
  assert.ok(!frames.some(frame => frame.id.startsWith('frame-clickup-')));
});

test('League interface opens before the camera moves past the first Feed post', () => {
  const frames = pageFrames([]);
  assert.deepEqual(frames.filter(frame => frame.group === 'League').map(frame => frame.id), [
    'frame-league-ideia', 'frame-league-plano', 'frame-league-ferramentas', 'frame-league-interface', 'frame-league-numeros',
  ]);
  const result = frames.find(frame => frame.id === 'frame-league-interface');
  assert.equal(result.panel, 3);
  assert.equal(frames[frames.indexOf(result) - 1].id, 'frame-league-ferramentas');
  const content = leagueContentProgress(chapterProgress(result.at * STORY_END, 10).content);
  assert.ok(content > .655, 'interface crossfade must be complete');
  const demo = (content - .65) / .33;
  assert.ok(demo > 0 && demo < .10, 'initial Feed view must remain visible');
});

test('the reviewed catalogue has 64 frames with nine career moments and keeps removed evidence hidden', () => {
  const career = [{ anchor: 'momento-trade-arena', label: '2025 — Trade Arena', kind: 'moment' }, ...Array.from({ length: 8 }, (_, index) => ({ anchor: `momento-${index}`, label: `Experiência ${index}`, kind: 'moment' }))];
  const frames = pageFrames(career);
  assert.equal(frames.length, 64);
  assert.equal(frames[52].id, 'frame-momento-trade-arena');
  assert.equal(new Set(frames.map(frame => frame.id)).size, frames.length);
  for (const id of ['frame-momento-2008', 'frame-paisagem', 'frame-wakawa-codigo', 'frame-nos-codigo', 'frame-dominios-numeros', 'frame-league-codigo', 'frame-angular-codigo', 'frame-angular-numeros', 'frame-signals-numeros']) {
    assert.ok(!frames.some(frame => frame.id === id), id);
  }
});

test('Personal projects go from tools to demos without hidden scroll time', () => {
  const frames = pageFrames([]);
  const nos = frames.filter(frame => frame.region === 'nos');
  assert.deepEqual(nos.map(frame => frame.scene), [0, 1, 2, 3, 5]);
  assert.deepEqual(nos.map(frame => frame.start), [0, .2, .4, .6, .8]);
  assert.equal(frames.indexOf(nos.at(-1)) + 1, 47);
  assert.equal(frames[frames.indexOf(nos.at(-1)) + 1].id, 'frame-wakawa-apresentacao');
  const wakawa = frames.filter(frame => frame.region === 'wakawa');
  assert.deepEqual(wakawa.map(frame => frame.scene), [0, 1, 2, 3, 5]);
  assert.deepEqual(wakawa.map(frame => frame.start), [0, .2, .4, .6, .8]);
  assert.equal(frames.indexOf(wakawa.at(-1)) + 1, 52);
});

test('Signals ends at the code change and leads directly to Vitest', () => {
  const frames = pageFrames([]);
  assert.deepEqual(frames.filter(frame => frame.group === 'Signals').map(frame => frame.id), [
    'frame-signals-ideia', 'frame-signals-plano', 'frame-signals-codigo',
  ]);
  const final = frames.findIndex(frame => frame.id === 'frame-signals-codigo');
  assert.equal(frames[final + 1].id, 'frame-vitest-ideia');
});

test('Monitor has no links and Avatar keeps scene 9 as the next frame after Dashboard', () => {
  const frames = pageFrames([]);
  assert.ok(!frames.some(frame => frame.id.startsWith('frame-monitor-')));
  const avatar = frames.find(frame => frame.id === 'frame-avatar-ideia');
  assert.equal(frames.indexOf(avatar) + 1, 19);
  assert.equal(avatar.scene, 9);
  assert.equal(avatar.panel, 0);
  assert.equal(frames.find(frame => frame.id === 'frame-league-ideia').scene, 10);
});

test('Avatar ends at its interface and League becomes frame 23 without renumbering scene identities', () => {
  const frames = pageFrames([]);
  assert.deepEqual(frames.filter(frame => frame.group === 'Avatar').map(frame => frame.id), [
    'frame-avatar-ideia', 'frame-avatar-plano', 'frame-avatar-codigo', 'frame-avatar-interface',
  ]);
  const result = frames.findIndex(frame => frame.id === 'frame-avatar-interface');
  assert.equal(frames[result + 1].id, 'frame-league-ideia');
  assert.equal(result + 2, 23);
  assert.equal(frames[result + 1].scene, 10);
});
