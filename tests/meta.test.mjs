import test from 'node:test';
import assert from 'node:assert/strict';
import { metaCandidates } from '../scripts/meta-candidates.mjs';
test('Meta exports produce review candidates with unconfirmed visibility; comments and reactions are ignored', () => {
  const candidates = metaCandidates(
    [
      {
        timestamp: 1700000000,
        title: 'André added a post',
        data: [{ post: 'A memory from the cerrado.' }, { comment: 'Not my publication' }],
      },
      { timestamp: 1700000001, data: [{ reaction: 'LIKE' }] },
      {
        timestamp: 1700000002,
        data: [{ post: 'A shared text' }],
        attachments: [{ data: [{ external_context: { url: 'https://example.com' } }] }],
      },
    ],
    'facebook',
  );
  assert.equal(candidates.length, 2);
  assert.equal(candidates[0].visibility, 'unconfirmed');
  assert.equal(candidates[0].needsReview, true);
  assert.doesNotMatch(candidates[0].text, /Not my publication|added a post/);
  assert.equal(candidates[1].sharedLink, true);
});
test('Instagram captions are deduplicated and no birth or residence date is inferred', () => {
  const candidates = metaCandidates(
    [
      {
        title: 'One month with my son.',
        media: [{ creation_timestamp: 1700000000, title: 'One month with my son.' }],
      },
    ],
    'instagram',
  );
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].text, 'One month with my son.');
  assert.deepEqual(
    Object.keys(candidates[0]).sort(),
    ['source', 'date', 'text', 'visibility', 'needsReview', 'sharedLink'].sort(),
  );
  assert.throws(() => metaCandidates({ messages: [] }, 'facebook'));
});
test('Meta UTF-8 mojibake is repaired without changing correctly encoded Portuguese', () => {
  const text = 'Acauã no cerrado. Realização.';
  for (const input of [text, Buffer.from(text).toString('latin1')]) {
    assert.equal(metaCandidates([{ data: [{ post: input }] }], 'facebook')[0].text, text);
  }
});
