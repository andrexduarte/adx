import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('../scripts/configure.mjs', import.meta.url));

test('deployment requires public Supabase configuration while local editing works offline', () => {
  const directory = mkdtempSync(join(tmpdir(), 'andre-config-test-'));
  mkdirSync(join(directory, 'src/app/core/config'), { recursive: true });
  const run = (values) => spawnSync(process.execPath, [script], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      VERCEL: '',
      SUPABASE_URL: '',
      SUPABASE_PUBLISHABLE_KEY: '',
      FEDIVERSE_PROFILE_URL: '',
      FEDIRING_MEMBER: 'false',
      ...values,
    },
  });
  try {
    assert.equal(run({}).status, 0);
    const missing = run({ VERCEL: '1' });
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /Configure Supabase before deploying/);
    const publicConfig = {
      VERCEL: '1',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture',
    };
    assert.equal(run(publicConfig).status, 0);
    const generated = readFileSync(join(directory, 'src/app/core/config/site-config.ts'), 'utf8');
    assert.match(generated, /sb_publishable_fixture/);
    const secret = run({ ...publicConfig, SUPABASE_PUBLISHABLE_KEY: 'sb_secret_fixture' });
    assert.notEqual(secret.status, 0);
    assert.match(secret.stderr, /never a secret key/);
    assert.equal(readFileSync(join(directory, 'src/app/core/config/site-config.ts'), 'utf8'), generated);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
