import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-wakawa-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browser" aria-label="Demonstração do navegador waka’wã">
      <div class="tabs"><span class="tab">◉ &nbsp; Meu projeto <span>×</span></span><span class="add" aria-hidden="true">＋</span><span class="window" aria-hidden="true">− &nbsp; □ &nbsp; ×</span></div>
      <div class="address"><span aria-hidden="true">← &nbsp; → &nbsp; ⟳</span><div>⌘ &nbsp; localhost / meu-projeto</div><span aria-hidden="true">⋮</span></div>
      <div class="browser-body" [class.inspecting]="network()">
        <div class="page-preview"><span class="brand">waka’wã</span><div class="welcome"><p>NAVEGADOR DE TRABALHO</p><h4>O que vamos<br>construir hoje?</h4><div class="mini-prompt">Entender a resposta desta página.<span>↑</span></div></div></div>
        @if (network()) {
          <section class="devtools" aria-label="Exemplo de inspeção de rede">
            <header><span>DevTools</span><strong>Network</strong><i aria-hidden="true">●</i></header>
            <p class="capture">2 requisições observadas <span>JSON</span></p>
            @for (request of requests; track request.path; let i = $index) {
              <button type="button" class="request" [attr.aria-pressed]="selected() === i" (click)="selected.set(i)"><span class="status">200</span><span>{{ request.path }}</span><small>{{ request.time }}</small></button>
            }
            <div class="response-label">RESPONSE <span>campos sensíveis ocultos</span></div><pre><code>{{ requests[selected()].response }}</code></pre>
          </section>
        }
      </div>
      <footer><span><i aria-hidden="true">●</i> {{ network() ? 'Captura da aba · exemplo local' : 'Projeto local · janela nativa' }}</span><button type="button" (click)="manualNetwork.set(!network())">{{ network() ? 'Voltar à página' : 'Inspecionar a página' }} <span aria-hidden="true">↗</span></button></footer>
    </div>
  `,
  styleUrl: './wakawa-demo.scss',
})
export class WakawaDemo {
  readonly progress = input(0);
  readonly manualNetwork = signal<boolean | null>(null);
  readonly network = computed(() => this.manualNetwork() ?? this.progress() > .25);
  readonly selected = signal(0);
  readonly requests = [
    { path: '/api/components', time: '48 ms', response: '{\n  "components": [\n    "Header", "Chat", "Tournament"\n  ],\n  "total": 3,\n  "token": "[REDACTED]"\n}' },
    { path: '/api/status', time: '12 ms', response: '{\n  "status": "ok",\n  "environment": "demo",\n  "session": "[REDACTED]"\n}' },
  ];
}
