import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { XMLParser } from 'fast-xml-parser';
import handler from '../.vercel/output/functions/render.func/index.mjs';

test('the packaged Vercel function renders public content, metadata, feeds and real HTTP errors', async (t) => {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const get = async (path) => {
    const response = await fetch(base + path);
    return { response, body: await response.text() };
  };
  try {
    await t.test('homepage contains the personal presentation and Person metadata', async () => {
      const { response, body } = await get('/');
      assert.equal(response.status, 200);
      assert.match(body, /Código,/);
      assert.match(body, /café\./);
      assert.match(body, /application\/ld\+json/);
      assert.match(body, /"@type":"Person"/);
      assert.match(response.headers.get('x-robots-tag'), /noindex/);
    });
    await t.test(
      'the homepage renders ten career chapters with the landscape between periods',
      async () => {
        const { response, body } = await get('/');
        assert.equal(response.status, 200);
        assert.equal((body.match(/class="moment(?: [^"]+)?"/g) || []).length, 10);
        for (const text of [
          'Webroom',
          'Commquest',
          'Lápis Raro',
          'hollo interact',
          '3bits',
          'Freelancer',
          'Plural',
          'Evavip',
          'Trade Arena',
        ])
          assert.ok(body.includes(text));
        assert.doesNotMatch(body, /id="(?:momento-agora|agora)"/);
        assert.match(body, /id="paisagem"/);
        assert.ok(body.indexOf('id="momento-2015"') < body.indexOf('id="paisagem"'));
        assert.ok(body.indexOf('id="paisagem"') < body.indexOf('id="momento-2012"'));
        assert.ok(body.indexOf('id="momento-2025"') < body.indexOf('id="momento-2009"'));
        assert.match(body, /WebSocket/);
        assert.doesNotMatch(body, /career-index|app-current-work/);
        const previousRoute = await fetch(base + '/trajetoria', { redirect: 'manual' });
        assert.ok([301, 302, 307, 308].includes(previousRoute.status));
        const destination = new URL(previousRoute.headers.get('location'), base);
        assert.equal(destination.pathname, '/');
        assert.equal(destination.hash, '');
      },
    );
    await t.test(
      'an imported article includes its complete text, date and original canonical URL',
      async () => {
        const { response, body } = await get('/caderno/penar');
        assert.equal(response.status, 200);
        assert.match(body, /Angueretá/);
        assert.match(body, /BlogPosting/);
        assert.match(body, /rel="canonical" href="https:\/\/medium.com\/\@andre_amaral\/penar-/);
        assert.doesNotMatch(body, /medium.com\/_\/stat/);
      },
    );
    await t.test(
      'admin has private cache and indexing headers and no credentials or draft body in HTML',
      async () => {
        const { response, body } = await get('/admin');
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.match(response.headers.get('x-robots-tag'), /noindex/);
        assert.doesNotMatch(body, /service_role|sb_secret_/);
      },
    );
    await t.test(
      'homepage serves the workers illustration and keeps retired sections out of navigation',
      async () => {
        const { body } = await get('/');
        assert.match(body, /Trabalhadores constroem uma interface/);
        assert.match(body, /\/images\/workshop\/workers-atlas.png/);
        assert.match(body, /\/images\/workshop\/engraving-atlas.png/);
        assert.doesNotMatch(body, /acaua-mark.png|id="vida"/);
        assert.doesNotMatch(body, /id="projetos"|app-wakawa-project/);
        assert.match(body, /Experiência profissional/);
        assert.match(body, /mailto:andrexduarte@gmail.com/);
        assert.doesNotMatch(body, /Abrir os stories|home-stories/);
        for (const asset of ['workers-atlas.png', 'engraving-atlas.png']) {
          const { response } = await get('/images/workshop/' + asset);
          assert.equal(response.status, 200);
          assert.match(response.headers.get('content-type'), /image\/png/);
        }
        const oldRoute = await fetch(base + '/stories', { redirect: 'manual' });
        assert.ok([301, 302, 307, 308].includes(oldRoute.status));
        assert.equal(new URL(oldRoute.headers.get('location'), base).pathname, '/');
      },
    );
    await t.test('RSS, sitemap and robots expose public pages only', async () => {
      const parser = new XMLParser();
      const rss = await get('/rss.xml');
      assert.equal(rss.response.status, 200);
      assert.equal(parser.parse(rss.body).rss.channel.item.length, 10);
      const sitemap = await get('/sitemap.xml');
      assert.equal(sitemap.response.status, 200);
      assert.equal(parser.parse(sitemap.body).urlset.url.length, 12);
      assert.doesNotMatch(sitemap.body, /admin|stories|trajetoria/);
      assert.match((await get('/robots.txt')).body, /Disallow: \/admin/);
    });
    await t.test(
      'missing paths and missing articles return 404, while static assets load',
      async () => {
        assert.equal((await get('/not-a-page')).response.status, 404);
        assert.equal((await get('/caderno/not-an-article')).response.status, 404);
        assert.equal((await get('/images/cerrado-xilogravura.jpg')).response.status, 200);
      },
    );
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
