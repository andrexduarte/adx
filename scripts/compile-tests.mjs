import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import ts from 'typescript';
const files = [
  'app/core/content/career-order.ts',
  'app/core/content/models.ts',
  'app/core/content/content-utils.ts',
  'app/core/content/seed.ts',
  'app/core/config/site-config.ts',
  'app/core/content/gateway.ts',
  'app/core/content/content-store.ts',
  'rss.ts',
  'sitemap.ts',
  'medium.ts',
];
for (const file of files) {
  const result = ts
    .transpileModule(readFileSync('src/' + file, 'utf8'), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        experimentalDecorators: true,
      },
    })
    .outputText.replace(
      /from (['"])(\.\.?\/[^'"]+)\1/g,
      (_, q, path) => 'from ' + q + path + '.mjs' + q,
    );
  const output = join('.test-output', file.replace(/\.ts$/, '.mjs'));
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, result);
}
