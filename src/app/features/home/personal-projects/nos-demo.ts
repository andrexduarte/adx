import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { NosNavigation } from './nos-navigation';
import { NosBalance } from './nos-balance';
import { phase } from '../arena-story/story-timing';

type Group = 'voce' | 'alguem' | 'fechado';
// Sources: nos/app/pages/index.vue, layouts/app.vue, EquilibrioAcordo/v2,
// Acerto/v1, useGruposDoCiclo.ts (17 Oct 2026). Fictional data; local state only.
@Component({
  selector: 'app-nos-demo',
  imports: [NosBalance, NosNavigation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nos-demo.html',
  styleUrl: './nos-demo.scss',
  host: { '[class.static]': 'staticMode()' },
})
export class NosDemo {
  readonly progress = input(0);
  readonly staticMode = input(false);
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private readonly size = signal(0);
  readonly dueSoon = signal(false);
  readonly done = signal<readonly string[]>([]);

  readonly groups: readonly { id: Group; title: string }[] = [
    { id: 'voce', title: 'Depende de você' },
    { id: 'alguem', title: 'Esperando os outros' },
    { id: 'fechado', title: 'Fechado' },
  ];
  private readonly accounts = [
    { id: 'internet', name: 'Internet', category: 'Casa', total: 120, mine: false, other: true, due: true, icon: 'internet' },
    { id: 'mercado', name: 'Mercado', category: 'Alimentação', total: 600, mine: false, other: false, due: false, icon: 'supermercado' },
    { id: 'luz', name: 'Energia', category: 'Casa', total: 200, mine: true, other: false, due: true, icon: 'luz' },
    { id: 'aluguel', name: 'Aluguel', category: 'Moradia', total: 1800, mine: true, other: true, due: false, icon: 'aluguel' },
  ];
  readonly items = computed(() => this.accounts.map(item => {
    const mine = item.mine || this.done().includes(item.id);
    const group: Group = !mine ? 'voce' : !item.other ? 'alguem' : 'fechado';
    return { ...item, mine, group, part: item.total / 2,
      summary: group === 'fechado' ? 'Vocês estão quites' : mine ? 'Você já fez · falta Beto'
        : item.other ? 'Beto já fez · falta você' : 'Ninguém começou ainda' };
  }));
  readonly visibleGroups = computed(() => this.groups.map(group => ({ ...group,
    items: this.items().filter(item => item.group === group.id && (!this.dueSoon() || (item.due && item.group !== 'fechado'))),
  })));
  readonly mine = computed(() => this.items().reduce((sum, item) => sum + (item.mine ? item.part : 0), 0));
  readonly other = 960;
  readonly total = 2720;
  readonly pending = computed(() => this.items().filter(item => !item.mine));
  readonly camera = computed(() => this.staticMode() ? 0 : phase(this.progress(), .22, .88));
  constructor() {
    afterRenderEffect(onCleanup => {
      const viewport = this.viewport()?.nativeElement;
      const content = this.content()?.nativeElement;
      if (!viewport || !content) return;
      const observer = new ResizeObserver(() => this.size.update(value => value + 1));
      observer.observe(viewport); observer.observe(content);
      onCleanup(() => observer.disconnect());
    });
    afterRenderEffect(() => {
      const viewport = this.viewport()?.nativeElement;
      this.size(); this.visibleGroups();
      if (!viewport || this.staticMode()) return;
      viewport.scrollTop = this.camera() * Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    });
  }
  money(value: number) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  register(id: string) { this.done.update(values => values.includes(id) ? values : [...values, id]); }
}
