import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-prompt-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.codex-preview]': 'worktree() !== null', '[class.continuation]': 'continuation()' },
  template: `
    @if (worktree(); as task) {
      @if (!continuation()) {
        <div class="work-switch" aria-label="Modo Work selecionado"><span>Chat</span><strong>Work</strong></div>
        <h3 class="work-title">No que vamos trabalhar?</h3>
      }
      <div class="work-composer" role="group" aria-label="Demonstração de um prompt no Codex" [class.sent]="sent()">
        <div class="work-field">
          <p class="work-message" [class.placeholder]="!text()">{{ text() || 'Trabalhe com o ChatGPT' }}@if (text()) { <span class="work-caret" aria-hidden="true"></span> }</p>
          <div class="work-actions" aria-hidden="true">
            <svg class="plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            <span class="work-model">GPT-6.1 Sol <span>Max</span><svg class="chevron" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg></span>
            <svg class="microphone" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3M9 21h6" /></svg>
            <span class="work-send">
              @if (sent()) { <svg viewBox="0 0 24 24"><rect class="stop" x="7" y="7" width="10" height="10" rx="1.5" /></svg> }
              @else if (text()) { <svg viewBox="0 0 24 24"><path d="M12 18V6m-5 5 5-5 5 5" /></svg> }
              @else { <svg viewBox="0 0 24 24"><path d="M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4" /></svg> }
            </span>
          </div>
        </div>
        <div class="work-context">
          <span class="work-project"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8V5a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm0 1h18" /></svg><span>arena-app-front-end</span></span>
          <span class="work-files" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="13" height="17" rx="2" /><path d="m10 4 1-2 9 2 1 13-3 1" /></svg>Arquivos</span>
          <span class="work-tree" [attr.aria-label]="'Worktree selecionada: ' + task"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M6 7v10m12-10v2a5 5 0 0 1-5 5H6" /></svg><span>Worktree <b>· {{ task }}</b></span><svg class="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></span>
        </div>
      </div>
    } @else {
    <div class="composer" [class.sent]="sent()">
      <p class="message">{{ text() }}<span class="caret" aria-hidden="true"></span></p>
      <div class="actions" aria-hidden="true">
        <span class="attach">＋</span><span class="mode">{{ sent() ? 'Ideia enviada' : 'Escrevendo uma ideia…' }}</span>
        <span class="send">{{ sent() ? '✓' : '↑' }}</span>
      </div>
    </div>
    }
  `,
  styleUrl: './prompt-composer.scss',
})
export class PromptComposer {
  readonly text = input.required<string>();
  readonly sent = input(false);
  readonly worktree = input<string | null>(null);
  readonly continuation = input(false);
}
