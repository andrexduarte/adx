import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { phase } from './story-timing';

@Component({
  selector: 'app-domain-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './domain-demo.html',
  styleUrl: './domain-demo.scss',
})
export class DomainDemo {
  readonly progress = input(0);
  readonly stage = computed(() => this.progress() < .28 ? 0 : this.progress() < .68 ? 1 : 2);
  readonly steps = [
    { tool: 'Detective', action: 'Inspecionar' },
    { tool: 'Domínio', action: 'Organizar' },
    { tool: 'Sheriff', action: 'Verificar' },
  ];
  readonly titles = ['Enxergar as dependências.', 'Separar as responsabilidades.', 'Conferir as fronteiras.'];
  // Recorte dos escopos reais de .detective/config.json, sem simular resultados da análise.
  readonly scopes = ['pages/user/league/v2', 'domains/league/v3', 'shared/league-team/v2'];
  readonly folders = ['context / v3', 'feature-teams / v3', 'data / teams / v3', 'interfaces / v3', 'resources / v3'];
  readonly inspected = computed(() => phase(this.progress(), .02, .24));
  readonly verification = computed(() => phase(this.progress(), .68, .82));
  reveal(index: number) { return phase(this.progress(), .29 + index * .035, .40 + index * .035); }
}
