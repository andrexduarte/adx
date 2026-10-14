import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'trajetoria',
    pathMatch: 'full',
    redirectTo: ({ fragment, queryParams }) =>
      inject(Router).createUrlTree(['/'], { fragment: fragment ?? undefined, queryParams }),
  },
  {
    path: 'caderno',
    loadComponent: () => import('./features/notebook/notebook').then((m) => m.Notebook),
  },
  {
    path: 'caderno/:slug',
    loadComponent: () => import('./features/notebook/article/article').then((m) => m.Article),
  },
  { path: 'stories', redirectTo: '', pathMatch: 'full' },
  { path: 'admin', loadComponent: () => import('./features/admin/admin').then((m) => m.Admin) },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
