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
    await t.test('homepage retains an accessible heading and Person metadata', async () => {
      const { response, body } = await get('/');
      assert.equal(response.status, 200);
      assert.match(
        body,
        /<h1[^>]*class="hero-title"[^>]*>André Duarte, desenvolvedor front-end<\/h1>/,
      );
      assert.doesNotMatch(body, /class="hero-copy"|Código,<br|hero-actions/);
      assert.match(body, /NDRÉ DUARTE/);
      assert.match(body, /src="\/images\/andre-mark\.svg"/);
      assert.doesNotMatch(body, /andre-duarte-signature\.png|andre-monogram\.svg/);
      assert.match(body, /application\/ld\+json/);
      assert.match(body, /"@type":"Person"/);
      assert.match(response.headers.get('x-robots-tag'), /noindex/);
    });
    await t.test(
      'the homepage renders nine career events without the landscape or beginning',
      async () => {
        const { response, body } = await get('/');
        assert.equal(response.status, 200);
        assert.equal((body.match(/class="moment(?: [^"]+)?"/g) || []).length, 9);
        assert.match(body, /id="momento-2025"/);
        assert.equal((body.match(/id="momento-2025"/g) || []).length, 1);
        assert.equal((body.match(/id="titulo-2025"/g) || []).length, 1);
        assert.ok(body.indexOf('id="momento-trade-arena"') < body.indexOf('id="momento-2023"'));
        assert.match(body, /Desde o verão de 2025 — atual/);
        assert.match(body, /Demonstração do Chat do Torneio/);
        assert.match(body, /Conversa demonstrativa/);
        assert.doesNotMatch(body, /<img[^>]+arena-(?:chat-torneio|arenito)/);
        for (const name of ['arena-chat-torneio', 'arena-arenito']) {
          const asset = await get('/images/work/' + name + '.webp');
          assert.equal(asset.response.status, 200);
          assert.match(asset.response.headers.get('content-type'), /image\/webp/);
        }
        assert.doesNotMatch(body, /class="stage-bottom"|Conhecer o Nós/);
        assert.match(body, /TORNEIOS/);
        assert.match(body, /tournaments-table.viewmodel.ts/);
        assert.match(body, /Recorte de Todos os torneios com dados demonstrativos/);
        assert.match(body, /LEAGUE \/ EXPERIÊNCIA/);
        assert.doesNotMatch(body, /href="#frame-(?:monitor-[^"]+|clickup-[^"]+|dashboard-codigo|dashboard-numeros|avatar-numeros|league-codigo|dominios-numeros|angular-codigo|angular-numeros|signals-numeros)"/);
        assert.match(body, /197/);
        assert.match(body, /206 arquivos alterados/);
        assert.match(body, /Prompt reconstruído/);
        assert.doesNotMatch(body, /home-notebook|id="textos"|related-text|moment-body/);
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
        assert.doesNotMatch(body, /id="paisagem"|href="#frame-paisagem"|href="#frame-momento-2008"/);
        assert.ok(body.indexOf('id="momento-2025"') < body.indexOf('id="momento-2009"'));
        assert.match(body, /Experiência profissional/);
        assert.match(body, /Desde quando a web era mato/);
        const coda = await get('/images/work/html-for-food-xilogravura.webp');
        assert.equal(coda.response.status, 200);
        assert.match(coda.response.headers.get('content-type'), /image\/webp/);
        assert.match(body, /WebSocket/);
        assert.doesNotMatch(body, /career-index|app-current-work/);
        const previousRoute = await fetch(base + '/trajetoria', { redirect: 'manual' });
        assert.ok([301, 302, 307, 308].includes(previousRoute.status));
        const destination = new URL(previousRoute.headers.get('location'), base);
        assert.equal(destination.pathname, '/');
        assert.equal(destination.hash, '');
      },
    );
    await t.test('personal projects remain readable without animation, after Arena and before the career', async () => {
      const { body } = await get('/');
      const arena = body.indexOf('<app-arena-story');
      const nos = body.indexOf('id="projeto-nos"');
      const wakawa = body.indexOf('id="projeto-wakawa"');
      const career = body.indexOf('id="experiencias-anteriores"');
      assert.ok(arena >= 0 && arena < nos && nos < wakawa && wakawa < career);
      const projects = body.slice(nos, career);
      assert.equal((projects.match(/data-project-scene="/g) || []).length, 10);
      assert.doesNotMatch(body.slice(nos, wakawa), /data-project-scene="4"|shared\/utils\/acerto.ts/);
      assert.doesNotMatch(projects, /data-project-scene="4"|src\/network_privacy.h/);
      assert.match(projects, /O que está combinado/);
      assert.match(projects, /Depende de você/);
      assert.match(projects, /Esperando os outros/);
      assert.match(projects, /Página inicial do Nós · dados ilustrativos/);
      assert.match(projects, /aplicativo Windows em desenvolvimento/);
      assert.match(projects, /Conversa ilustrativa com o Codex/);
      assert.match(projects, /app\/home.css/);
      assert.match(projects, /COM CODEX/);
      assert.doesNotMatch(projects, /2 requisições observadas|\[REDACTED\]/);
      const scenes = projects.match(/<section\b[^>]*data-project-scene="\d"[^>]*>/g) || [];
      assert.equal(scenes.length, 10);
      for (const scene of scenes) assert.doesNotMatch(scene, /aria-hidden="true"|\binert(?:[ =])/);
      assert.doesNotMatch(projects, /nos-sisal|intro-rope/);
      for (const name of ['wakawa-wallpaper.webp']) {
        const { response } = await get('/images/projects/' + name);
        assert.equal(response.status, 200);
        assert.match(response.headers.get('content-type'), /image\/webp/);
      }
    });
    await t.test('the closing portrait is readable before hydration and appears only on the homepage', async () => {
      const { body } = await get('/');
      const closing = body.indexOf('<app-footer-portrait');
      assert.ok(closing > body.indexOf('id="momento-2009"'));
      const footer = body.slice(closing, body.indexOf('</app-site-footer>', closing));
      assert.match(footer, /id="encerramento"/);
      assert.match(footer, /Front-end developer/);
      assert.match(footer, /aria-label="Tecnologias com que trabalho"/);
      assert.ok(footer.indexOf('>Codex<') >= 0 && footer.indexOf('>Codex<') < footer.indexOf('>Angular<'));
      assert.ok(footer.indexOf('>Angular<') < footer.indexOf('>TypeScript<'));
      assert.ok(footer.indexOf('>TypeScript<') < footer.indexOf('>SCSS<'));
      assert.ok(footer.indexOf('>SCSS<') < footer.indexOf('>RxJS<'));
      assert.ok(footer.indexOf('>RxJS<') < footer.indexOf('>Supabase<'));
      assert.ok(footer.indexOf('>Supabase<') < footer.indexOf('>Git<'));
      assert.doesNotMatch(footer, /class="footer-brand"|Minas Gerais, Brasil/);
      assert.match(footer, /Passear pela web/);
      const { response } = await get('/images/footer/andre-pontilhismo.webp');
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /image\/webp/);
      for (const path of ['/caderno', '/admin']) {
        const { body: page } = await get(path);
        assert.doesNotMatch(page, /<app-footer-portrait|id="encerramento"/);
        if (path === '/caderno') assert.match(page, /Passear pela web/);
      }
    });
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
        assert.match(body, /corpos e funções diferentes/);
        assert.doesNotMatch(body, /worker-body fitter/);
        const header = body.match(/<app-site-header[\s\S]*?<\/app-site-header>/)?.[0];
        const footer = body.match(/<app-site-footer[\s\S]*?<\/app-site-footer>/)?.[0];
        assert.ok(header);
        assert.ok(footer);
        assert.doesNotMatch(header, /wa.me\/5531992930696/);
        assert.match(footer, /href="https:\/\/wa.me\/5531992930696"/);
        assert.match(footer, /href="https:\/\/www.instagram.com\/andrexduarte\/"/);
        assert.doesNotMatch(footer, /href="\/(?:rss.xml|admin)"/);
        assert.match(body, /\/images\/workshop\/workers-atlas-v2.webp/);
        assert.match(body, /\/images\/workshop\/engraving-atlas.webp/);
        assert.doesNotMatch(body, /\/images\/workshop\/[^"\s]+\.png/);
        const head = body.slice(0, body.indexOf('</head>'));
        for (const atlas of ['workers-atlas-v2', 'engraving-atlas']) {
          assert.match(
            head,
            new RegExp(
              '<link[^>]+rel="preload"[^>]+as="image"[^>]+href="/images/workshop/' +
                atlas +
                '\\.webp"[^>]+fetchpriority="high"',
            ),
          );
        }
        assert.doesNotMatch(body, /acaua-mark.png|id="vida"/);
        assert.doesNotMatch(body, /id="projetos"|app-wakawa-project/);
        assert.match(body, /https:\/\/www.linkedin.com\/in\/andrexdev\//);
        assert.match(body, /https:\/\/github.com\/andrexduarte/);
        assert.doesNotMatch(body, /Abrir os stories|home-stories/);
        for (const asset of ['workers-atlas-v2.webp', 'engraving-atlas.webp']) {
          const { response } = await get('/images/workshop/' + asset);
          assert.equal(response.status, 200);
          assert.match(response.headers.get('content-type'), /image\/webp/);
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
        const { response: font } = await get('/fonts/space-grotesk-wordmark.woff2');
        assert.equal(font.status, 200);
        assert.match(font.headers.get('content-type'), /font\/woff2/);
        const { response: mark } = await get('/images/andre-mark.svg');
        assert.equal(mark.status, 200);
        assert.match(mark.headers.get('content-type'), /image\/svg\+xml/);
      },
    );
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
