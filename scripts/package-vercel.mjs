import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, resolve } from 'node:path';
const root = realpathSync('.');
const output = resolve(root, '.vercel/output');
if (relative(root, output).replaceAll('\\', '/') !== '.vercel/output')
  throw new Error('Invalid output path.');
if (existsSync(join(root, '.vercel')) && lstatSync(join(root, '.vercel')).isSymbolicLink())
  throw new Error('Refusing a linked output directory.');
if (existsSync(output) && lstatSync(output).isSymbolicLink())
  throw new Error('Refusing a linked output directory.');
rmSync(output, { recursive: true, force: true });
const fn = join(output, 'functions/render.func');
mkdirSync(fn, { recursive: true });
cpSync('dist/andre-site/server', join(fn, 'server'), { recursive: true });
cpSync('dist/andre-site/browser', join(fn, 'browser'), { recursive: true });
cpSync('dist/andre-site/browser', join(output, 'static'), { recursive: true });
rmSync(join(output, 'static/rss.xml'), { force: true });
// HTML entry points must pass through Angular SSR, including the home page.
for (const entry of ['index.html', 'index.csr.html']) {
  rmSync(join(output, 'static', entry), { force: true });
}
writeFileSync(
  join(fn, 'index.mjs'),
  "export { reqHandler as default } from './server/server.mjs';\n",
);
writeFileSync(
  join(fn, '.vc-config.json'),
  JSON.stringify(
    {
      runtime: 'nodejs22.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      shouldAddHelpers: true,
      maxDuration: 30,
    },
    null,
    2,
  ),
);
writeFileSync(
  join(output, 'config.json'),
  JSON.stringify(
    { version: 3, routes: [{ handle: 'filesystem' }, { src: '/(.*)', dest: '/render' }] },
    null,
    2,
  ),
);
console.log('Vercel Build Output prepared. Deployment has not been run.');
