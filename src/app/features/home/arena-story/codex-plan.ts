import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PromptComposer } from './prompt-composer';
import { phase } from './story-timing';

@Component({
  selector: 'app-codex-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PromptComposer],
  template: `
    <div class="conversation" role="group" aria-label="Plano do chat apresentado como uma resposta do Codex">
      <p class="user-message">Vamos construir um chat.</p>
      <div class="assistant-response">
        <p class="assistant-name">Codex</p>
        <h3>Vou seguir este plano:</h3>
        <ol>
          @for (step of steps(); track $index; let i = $index) {
            <li [style.opacity]="reveal(i)" [style.transform]="'translateY(' + (1 - reveal(i)) * 6 + 'px)'" [attr.aria-hidden]="reveal(i) === 0 ? 'true' : null">
              <span class="step-number" aria-hidden="true">{{ i + 1 }}.</span><span>{{ step }}</span>
            </li>
          }
        </ol>
      </div>
      <app-prompt-composer text="" worktree="task: chat" [continuation]="true" [sent]="progress() < .98" />
    </div>
  `,
  styleUrl: './codex-plan.scss',
})
export class CodexPlan {
  readonly steps = input.required<readonly string[]>();
  readonly progress = input(1);
  reveal(index: number) { return phase(this.progress(), index * .19, index * .19 + .23); }
}
