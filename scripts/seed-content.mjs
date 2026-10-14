import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
const feed = JSON.parse(readFileSync('content/medium-feed.json', 'utf8').replace(/^\uFEFF/, ''));
const overrides = JSON.parse(readFileSync('content/medium-map.json', 'utf8'));
const uuid = (key) => {
  const hex = createHash('sha256')
    .update('andre.is-a.dev:' + key)
    .digest('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    '5' + hex.slice(13, 16),
    'a' + hex.slice(17, 20),
    hex.slice(20, 32),
  ].join('-');
};
const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const articles = feed.map((item) => {
  const sourceUrl = item.url.split('?')[0];
  const postId = sourceUrl.match(/-([a-f0-9]{12})$/)?.[1];
  if (!postId) throw new Error('Medium post without a stable identifier: ' + item.title);
  const metadata = overrides[postId];
  if (!metadata)
    throw new Error(
      'Classify this Medium post in content/medium-map.json before importing: ' + item.title,
    );
  // Remove tracking pixels; retain actual images and captions from the author.
  const html = item.html.replace(/<img\b[^>]*>/gi, (tag) =>
    /medium\.com\/_\/stat|width=["']?1["']?\s+height=["']?1/i.test(tag) ? '' : tag,
  );
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    id: uuid('medium:' + postId),
    slug: metadata.slug,
    kind: 'article',
    title: item.title,
    excerpt: text.length > 165 ? text.slice(0, 165).replace(/\s+\S*$/, '') + '…' : text,
    category: metadata.category,
    html,
    status: 'published',
    publishedAt: new Date(item.date).toISOString(),
    images: [],
    sourceUrl,
  };
});
const stories = [
  {
    id: 'story-cerrado',
    slug: 'caminhos-do-cerrado',
    kind: 'story',
    title: 'Caminhos do cerrado',
    excerpt: 'O cavalo, a companhia e o caminho de volta.',
    category: 'Roça',
    html: '<p>O cerrado, seus frutos, o cheiro, o brilho, o rio, a simplicidade. Um lugar que continua comigo.</p>',
    status: 'published',
    publishedAt: '',
    images: [
      { url: '/images/caminho-cerrado.jpeg', caption: 'A companhia no caminho.' },
      { url: '/images/montado.webp', caption: 'O cerrado, a cavalo.' },
    ],
  },
  {
    id: 'story-tornado',
    slug: 'tornado',
    kind: 'story',
    title: 'Tornado',
    excerpt: 'Um companheiro de muitas histórias.',
    category: 'Roça',
    html: '<p>Os cavalos e o cerrado fazem parte do caminho até aqui.</p>',
    status: 'published',
    publishedAt: '',
    images: [
      { url: '/images/tornado.webp', caption: 'Tornado em Angueretá.' },
      { url: '/images/montado.webp', caption: 'Cavalgar e colecionar histórias.' },
    ],
  },
  {
    id: 'story-retratos',
    slug: 'fora-da-tela',
    kind: 'story',
    title: 'Fora da tela',
    excerpt: 'Alguns registros de quem vive a história.',
    category: 'Vida',
    html: '<p>Há muita vida entre uma interface e outra.</p>',
    status: 'published',
    publishedAt: '',
    images: [
      { url: '/images/andre-chapeu.jpeg', caption: 'Um retrato no caminho.' },
      { url: '/images/caminho-cerrado.jpeg', caption: 'Uma parte de mim sempre volta.' },
    ],
  },
];
stories.forEach((story) => {
  story.id = uuid(story.id);
  const descriptions = {
    '/images/caminho-cerrado.jpeg':
      'André a cavalo, visto de costas, seguido por seu red heeler em uma trilha no cerrado.',
    '/images/montado.webp':
      'André de chapéu preto montando um cavalo castanho, com um cachorro ao lado e o cerrado ao fundo.',
    '/images/tornado.webp':
      'Tornado selado, com rédeas vermelhas, diante da paisagem do cerrado de Angueretá.',
    '/images/andre-chapeu.jpeg': 'Retrato de André com chapéu preto em um caminho ao ar livre.',
  };
  story.images.forEach((image) => {
    image.alt = descriptions[image.url];
  });
});
const momentCode = ts.transpileModule(readFileSync('src/app/core/content/moments.ts', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { MOMENTS } = await import(
  'data:text/javascript;base64,' + Buffer.from(momentCode).toString('base64')
);
const moments = MOMENTS.map((moment) => ({
  id: uuid('moment:' + moment.id),
  slug: moment.id,
  kind: 'moment',
  title: moment.title,
  excerpt: moment.period,
  category: 'Vida',
  html:
    moment.paragraphs.map((p) => '<p>' + escape(p) + '</p>').join('') +
    (moment.highlights?.length
      ? '<ul>' + moment.highlights.map((item) => '<li>' + escape(item) + '</li>').join('') + '</ul>'
      : ''),
  status: 'published',
  publishedAt: '',
  images: [],
  year: moment.year,
  place: moment.place,
  company: moment.company,
  reflection: moment.reflection,
  articleSlug: moment.articleSlug,
}));
const entries = [...articles, ...stories, ...moments];
writeFileSync(
  'src/app/core/content/seed.ts',
  "import { Entry } from './models';\nexport const SEED_ENTRIES:Entry[] = " +
    JSON.stringify(entries, null, 2) +
    ';\n',
);
writeFileSync(
  'public/rss.xml',
  '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Caderno de André Duarte</title><link>https://andre.is-a.dev/caderno</link><description>Textos sobre código, vida e roça.</description><language>pt-br</language>' +
    articles
      .map(
        (a) =>
          '<item><title>' +
          escape(a.title) +
          '</title><link>https://andre.is-a.dev/caderno/' +
          a.slug +
          '</link><guid>https://andre.is-a.dev/caderno/' +
          a.slug +
          '</guid><pubDate>' +
          new Date(a.publishedAt).toUTCString() +
          '</pubDate><description>' +
          escape(a.excerpt) +
          '</description></item>',
      )
      .join('') +
    '</channel></rss>',
);
const sql = (value) => (value == null ? 'null' : "'" + String(value).replace(/'/g, "''") + "'");
writeFileSync(
  'supabase/migrations/20261014144734_initial_content.sql',
  '-- Initial public content, with stable IDs. Photo dates were not inferred.\n' +
    entries
      .map(
        (e) =>
          'insert into public.content (id, slug, kind, title, excerpt, category, body_html, status, published_at, images, year, place, company, source_url, reflection, article_slug) values (' +
          [e.id, e.slug, e.kind, e.title, e.excerpt, e.category, e.html, e.status]
            .map(sql)
            .join(',') +
          ',' +
          (e.publishedAt ? sql(e.publishedAt) : 'now()') +
          ',' +
          [
            JSON.stringify(e.images),
            e.year,
            e.place,
            e.company,
            e.sourceUrl,
            e.reflection,
            e.articleSlug,
          ]
            .map(sql)
            .join(',') +
          ');',
      )
      .join('\n') +
    '\n',
);
console.log(
  'Imported ' +
    articles.length +
    ' Medium articles and ' +
    stories.length +
    ' local story collections.',
);
