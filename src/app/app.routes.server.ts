import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin',
    renderMode: RenderMode.Client,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
    headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
  },
];
