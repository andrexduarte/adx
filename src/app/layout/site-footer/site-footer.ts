import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Wordmark } from '../../shared/wordmark/wordmark';
import { siteConfig } from '../../core/config/site-config';
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, Wordmark],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly config = siteConfig;
}
