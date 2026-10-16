import { SiteHeader } from './layout/site-header/site-header';
import { SiteFooter } from './layout/site-footer/site-footer';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ContentStore } from './core/content/content-store';
import { FrameNavigation } from './features/home/frame-navigation/frame-navigation';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, FrameNavigation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly router = inject(Router);
  readonly content = inject(ContentStore);
}
