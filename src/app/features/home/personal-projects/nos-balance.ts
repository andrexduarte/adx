import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-nos-balance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nos-balance.html',
  styleUrl: './nos-balance.scss',
})
export class NosBalance {
  readonly mine = input.required<number>();
  readonly other = input.required<number>();
  readonly total = input.required<number>();
  readonly pending = input.required<readonly { id: string; name: string; part: number }[]>();
  readonly register = output<string>();
  readonly remaining = computed(() => this.total() - this.mine() - this.other());
  readonly next = computed(() => this.pending()[0]);
  money(value: number) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
}
