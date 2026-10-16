import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-wordmark',
  imports: [RouterLink],
  templateUrl: './wordmark.html',
  styleUrl: './wordmark.scss',
  host: { '[class.is-compact]': 'collapsible() && compact()' },
})
export class Wordmark {
  readonly collapsible = input(false);
  readonly compact = input(false);
}
