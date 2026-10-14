import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { Router, provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { ContentStore } from './core/content/content-store';
import { DOCUMENT, ViewportScroller } from '@angular/common';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition }) => {
          const router = inject(Router);
          const target = router.currentNavigation()?.finalUrl;
          if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            (target &&
              router.isActive(target, {
                paths: 'exact',
                matrixParams: 'exact',
                queryParams: 'ignored',
                fragment: 'ignored',
              }))
          )
            transition.skipTransition();
        },
      }),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const document = inject(DOCUMENT);
      inject(ViewportScroller).setOffset(() => {
        const header =
          document.querySelector('app-site-header')?.getBoundingClientRect().height ?? 0;
        const crossing = document.querySelector('.crossing')?.getBoundingClientRect().height ?? 0;
        return [0, header + crossing + 24];
      });
    }),
    provideAppInitializer(() => inject(ContentStore).load()),
  ],
};
