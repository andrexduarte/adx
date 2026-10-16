import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { WorkEvidence } from './work-evidence';

const number = new Intl.NumberFormat('pt-BR');

@Component({
  selector: 'app-work-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demonstration" [style.opacity]="staticMode() ? 1 : 1 - reveal()" [attr.aria-hidden]="showEvidence() ? true : null" [attr.inert]="showEvidence() ? '' : null">
      <ng-content />
    </div>
    @if (evidence(); as item) {
      <section class="evidence" aria-label="O trabalho em números" [style.opacity]="staticMode() ? 1 : reveal()" [attr.aria-hidden]="!staticMode() && !showEvidence() ? true : null" [attr.inert]="!staticMode() && !showEvidence() ? '' : null">
        <span class="eyebrow">O TRABALHO EM NÚMEROS</span>
        <h3>{{ item.title }}</h3>
        <p class="scope">{{ item.scope }}</p>
        <dl>
          <div><dt>commits</dt><dd><span class="sr-only">{{ format(item.commits) }}</span><span aria-hidden="true">{{ count(item.commits) }}</span></dd></div>
          <div class="additions"><dt>adições</dt><dd><span class="sr-only">{{ format(item.additions) }} linhas</span><span aria-hidden="true">+{{ count(item.additions) }}</span></dd></div>
          <div class="deletions"><dt>remoções</dt><dd><span class="sr-only">{{ format(item.deletions) }} linhas</span><span aria-hidden="true">−{{ count(item.deletions) }}</span></dd></div>
        </dl>
        <div class="sources">@for (source of item.sources; track source.url) { <a [href]="source.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Ver ' + source.label + ' no GitHub'">{{ source.label }} <span aria-hidden="true">↗</span></a> }</div>
        <p class="note">{{ item.note }}</p>
      </section>
    }
  `,
  styleUrl: './work-chapter.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class WorkChapter {
  readonly evidence = input<WorkEvidence>();
  readonly reveal = input(0);
  readonly staticMode = input(false);
  readonly showEvidence = computed(() => !this.staticMode() && !!this.evidence() && this.reveal() >= .5);
  format(value: number) { return number.format(value); }
  count(value: number) { return this.format(Math.round(value * (this.staticMode() ? 1 : this.reveal()))); }
}
