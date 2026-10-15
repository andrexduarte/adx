import { Component, inject, RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo/seo';
@Component({
  imports: [RouterLink],
  templateUrl: './not-found.html',
})
export class NotFound {
  constructor() {
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) response.status = 404;
    inject(Seo).set('Página não encontrada', 'A página pode ter mudado de lugar.', '/404');
  }
}
