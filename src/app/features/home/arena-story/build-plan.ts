import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-build-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="plan" aria-label="Plano de implementação">
      <div class="plan-top">@if (arenaBrand()) { <img class="plan-brand" src="/images/work/trade-arena-logo.png" alt="Trade Arena" width="37" height="37" loading="lazy" /> } @else { <span class="plan-icon" aria-hidden="true">↳</span> }<div><span>ANTES DO CÓDIGO</span><h4>Um plano para construir.</h4></div></div>
      <ol>@for (step of steps(); track step; let i = $index) {
        <li [style.opacity]="reveal(i)" [style.transform]="'translateY(' + (1 - reveal(i)) * 12 + 'px)'" [attr.aria-hidden]="reveal(i) === 0 ? true : null"><span class="number" aria-hidden="true">0{{ i + 1 }}</span><span>{{ step }}</span></li>
      }</ol>
      <div class="plan-footer"><span class="plan-line" [style.transform]="'scaleX(' + progress() + ')'" aria-hidden="true"></span><span>Da intenção aos próximos passos.</span></div>
    </div>
  `,
  styleUrl: './build-plan.scss',
})
export class BuildPlan {
  readonly steps = input.required<readonly string[]>();
  readonly progress = input(1);
  readonly arenaBrand = input(false);
  reveal(index: number) { return phase(this.progress(), index * .18, index * .18 + .23); }
}
