import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createFeed } from './rss';
import { createSitemap } from './sitemap';
import { readMediumFeed } from './medium';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  res
    .set('X-Content-Type-Options', 'nosniff')
    .set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.hostname !== 'andre.is-a.dev') res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});
const deploymentHosts = [
  process.env['VERCEL_URL'],
  process.env['VERCEL_PROJECT_PRODUCTION_URL'],
].filter((host): host is string => !!host && /^[a-z0-9.-]+\.vercel\.app$/.test(host));
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1', 'andre.is-a.dev', ...deploymentHosts],
});

app.get('/rss.xml', async (_req, res) => {
  try {
    res
      .type('application/rss+xml')
      .set('Cache-Control', 'public, max-age=300')
      .send(await createFeed());
  } catch {
    res.status(503).type('text/plain').send('O feed está temporariamente indisponível.');
  }
});
app.get('/sitemap.xml', async (_req, res) => {
  try {
    res
      .type('application/xml')
      .set('Cache-Control', 'public, max-age=300')
      .send(await createSitemap());
  } catch {
    res.status(503).type('text/plain').send('O mapa do site está temporariamente indisponível.');
  }
});
app.get('/api/medium', async (_req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=600').json(await readMediumFeed());
  } catch {
    res
      .status(502)
      .json({ error: 'Não foi possível consultar o Medium agora. Tente novamente mais tarde.' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '5m',
    setHeaders: (res, path) => {
      if (/[-.][a-zA-Z0-9_-]{8}\.(?:js|css)$/.test(path))
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
