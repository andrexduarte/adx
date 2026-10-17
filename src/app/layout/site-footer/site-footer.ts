import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Wordmark } from '../../shared/wordmark/wordmark';
import { siteConfig } from '../../core/config/site-config';
import { FooterPortrait } from './footer-portrait';
@Component({
  selector: 'app-site-footer',
  imports: [Wordmark, FooterPortrait, NgTemplateOutlet],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  host: { '[class.has-portrait]': 'showPortrait()' },
})
export class SiteFooter {
  readonly showPortrait = input(false);
  readonly config = siteConfig;
}
