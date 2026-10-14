import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Local curation only. Candidates never enter the public site automatically.
export function metaCandidates(value, source) {
  if (!['facebook', 'instagram'].includes(source))
    throw new Error('Choose Facebook or Instagram as the source.');
  const rows = Array.isArray(value) ? value : value?.ig_stories || value?.posts;
  if (!Array.isArray(rows))
    throw new Error('Expected a Facebook/Instagram posts or stories JSON file.');
  const result = new Map();
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const postText = Array.isArray(row.data)
      ? row.data.map((item) => (typeof item?.post === 'string' ? item.post : '')).filter(Boolean)
      : [];
    const captions = Array.isArray(row.media)
      ? row.media.map((item) => (typeof item?.title === 'string' ? item.title : '')).filter(Boolean)
      : [];
    let text = [
      ...new Set([
        ...postText,
        ...captions,
        ...(typeof row.title === 'string' && source === 'instagram' ? [row.title] : []),
      ]),
    ]
      .join('\n\n')
      .trim();
    if (/[ÃÂð]|â[\u0080-\u009f]/.test(text)) {
      const repaired = Buffer.from(text, 'latin1').toString('utf8');
      if (!repaired.includes('\uFFFD')) text = repaired;
    }
    if (!text) continue;
    const timestamp = row.timestamp || row.creation_timestamp || row.media?.[0]?.creation_timestamp;
    const date =
      typeof timestamp === 'number' &&
      Number.isFinite(timestamp) &&
      timestamp > 0 &&
      timestamp < 8640000000000
        ? new Date(timestamp * 1000).toISOString()
        : null;
    const sharedLink = row.attachments?.some((attachment) =>
      attachment.data?.some((item) => item.external_context?.url),
    );
    result.set((date || '') + ':' + text, {
      source,
      date,
      text,
      visibility: 'unconfirmed',
      needsReview: true,
      sharedLink: !!sharedLink,
    });
  }
  return [...result.values()].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = process.argv[2]?.replace(/^--/, '');
  if (!['facebook', 'instagram'].includes(source))
    throw new Error('Choose --facebook or --instagram, then pass extracted JSON files.');
  const files = process.argv.slice(3);
  if (!files.length)
    throw new Error(
      'Pass extracted posts/stories JSON files. Messages, contacts and reactions are not accepted.',
    );
  const candidates = files.flatMap((file) => {
    if (
      !/(?:^|[\\/])(?:your_posts[^\\/]*|posts[^\\/]*|stories)\.json$/i.test(file) ||
      /(?:^|[\\/])(?:messages|contacts|friends|comments|likes)(?:[\\/]|$)/i.test(file)
    )
      throw new Error('Use only posts/stories JSON from the export: ' + file);
    return metaCandidates(JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, '')), source);
  });
  mkdirSync('imports', { recursive: true });
  writeFileSync(
    'imports/' + source + '-candidates.json',
    JSON.stringify({ version: 1, candidates }, null, 2),
  );
  console.log(
    candidates.length +
      ' candidates saved locally. Review privacy, authorship and dates before using them.',
  );
}
