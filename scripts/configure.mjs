import { writeFileSync } from 'node:fs';
const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const fediverseProfile = process.env.FEDIVERSE_PROFILE_URL || '';
const fediringMember = process.env.FEDIRING_MEMBER === 'true';
if (process.env.VERCEL === '1' && (!supabaseUrl || !publishableKey))
  throw new Error('Configure Supabase before deploying this site to Vercel.');
if (!!supabaseUrl !== !!publishableKey)
  throw new Error('Configure both Supabase URL and publishable key.');
if (publishableKey && !publishableKey.startsWith('sb_publishable_'))
  throw new Error('Use a Supabase publishable key, never a secret key.');
if (supabaseUrl && !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(supabaseUrl))
  throw new Error('Invalid Supabase project URL.');
if (fediverseProfile) {
  const url = new URL(fediverseProfile);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash)
    throw new Error('Use the public HTTPS profile URL on the Fediverse.');
}
if (fediringMember && !fediverseProfile)
  throw new Error('Configure the Fediverse profile before enabling Fediring membership.');
writeFileSync(
  'src/app/core/config/site-config.ts',
  'export const siteConfig = ' +
    JSON.stringify({ supabaseUrl, publishableKey, fediverseProfile, fediringMember }) +
    ';\n',
);
