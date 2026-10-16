import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-nos-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nos-app">
      <header><strong>Nós</strong><span>nosso combinado</span><i aria-hidden="true">A</i></header>
      <div class="nos-body">
        <section class="overview" aria-label="Resumo ilustrativo da casa">
          <p class="eyebrow">UM POUCO MAIS EM SINTONIA</p><h4>As contas em dia.<br>A vida mais leve.</h4>
          <div class="balance" [class.balanced]="houseSettled()"><div><span>{{ houseSettled() ? 'Acerto registrado' : 'Contas da casa' }}</span><strong>{{ houseSettled() ? 'Tudo certo' : 'R$ 840,00' }}</strong><small>{{ houseSettled() ? 'Nesta demonstração' : 'Divisão de 50% para cada pessoa' }}</small></div></div>
          <div class="people"><span><i>A</i> Ana · 50%</span><span><i>B</i> Beto · 50%</span></div>
        </section>
        <section class="accounts" aria-label="Selecionar contas demonstrativas">
          <div class="account-title"><h4>Vamos acertar?</h4><span>EXEMPLO</span></div>
          <div class="switch" aria-label="Tipo de conta"><button type="button" [attr.aria-pressed]="!personal()" (click)="changeGroup(false)">Compartilhadas</button><button type="button" [attr.aria-pressed]="personal()" (click)="changeGroup(true)">Pessoais</button></div>
          @for (item of items(); track item.name; let i = $index) {
            <label class="account"><input type="checkbox" [checked]="selected()[i]" (change)="toggle(i)" /><span class="item-icon" aria-hidden="true">{{ item.icon }}</span><span><b>{{ item.name }}</b><small>{{ personal() ? 'Gasto pessoal · fora do acordo' : 'Pago por Beto · sua parte: 50%' }}</small></span><strong>{{ money(item.part) }}</strong></label>
          }
          <div class="settlement"><span>{{ personal() ? 'Seu reembolso' : 'Sua parte no acerto' }}<small>{{ selectedCount() }} {{ selectedCount() === 1 ? 'item selecionado' : 'itens selecionados' }}</small></span><strong>{{ money(total()) }}</strong></div>
          <button class="confirm" type="button" [disabled]="total() === 0 || settled()" (click)="settled.set(true)">{{ settled() ? '✓ Acerto demonstrativo registrado' : 'Simular acerto' }}<span aria-hidden="true">↗</span></button>
          <p class="notice" role="status">{{ settled() ? 'Pagamento original preservado. Você pode selecionar outros itens.' : personal() ? 'Gastos pessoais não alteram a divisão da casa.' : 'Selecione os itens para experimentar o fluxo.' }}</p>
        </section>
      </div>
    </div>
  `,
  styleUrl: './nos-demo.scss',
})
export class NosDemo {
  readonly personal = signal(false);
  readonly selected = signal([true, true]);
  readonly settled = signal(false);
  readonly items = computed(() => this.personal()
    ? [{ name: 'Fone de ouvido', icon: '♫', part: 120 }]
    : [{ name: 'Mercado', icon: '◫', part: 300 }, { name: 'Internet', icon: '⌁', part: 120 }]);
  readonly total = computed(() => this.items().reduce((sum, item, index) => sum + (this.selected()[index] ? item.part : 0), 0));
  readonly selectedCount = computed(() => this.items().filter((_, index) => this.selected()[index]).length);
  readonly houseSettled = computed(() => this.settled() && !this.personal() && this.total() === 420);
  money(value: number) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  changeGroup(personal: boolean) { this.personal.set(personal); this.selected.set([true, true]); this.settled.set(false); }
  toggle(index: number) { this.selected.update(values => values.map((value, i) => i === index ? !value : value)); this.settled.set(false); }
}
