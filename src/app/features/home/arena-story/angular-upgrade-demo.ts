import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-angular-upgrade-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './angular-upgrade-demo.html',
  styleUrl: './angular-upgrade-demo.scss',
})
export class AngularUpgradeDemo {
  readonly progress = input(0);
  readonly milestones = [
    {
      version: '16', core: '^16.2.0', typescript: '~5.1.3', date: 'Ponto de partida',
      title: 'A configuração original.',
      detail: 'O projeto usava o builder browser do Angular CLI.',
      file: 'angular.json', path: 'angular.json', source: '4ad961ee5^ · base anterior ao Angular 17',
      before: '', after: '"builder": "@angular-devkit/build-angular:browser"',
    },
    {
      version: '17', core: '^17.3.11', typescript: '~5.2.2', date: 'Janeiro de 2026',
      title: 'O alvo do build muda.',
      detail: 'A configuração do servidor passa de browserTarget para buildTarget.',
      file: 'angular.json', path: 'angular.json', source: '4ad961ee5 · recorte real',
      before: '"browserTarget": "arena-app-front-end:build:production"',
      after: '"buildTarget": "arena-app-front-end:build:production"',
    },
    {
      version: '19', core: '^19.2.19', typescript: '~5.5.4', date: 'Março de 2026',
      title: 'O QR Code vira componente.',
      detail: 'A integração financeira troca QRCodeModule por QRCodeComponent.',
      file: 'financial.module.ts', path: 'src/app/pages/user/financial/v1/financial.module.ts', source: 'e78600da2 · recorte real',
      before: "import { QRCodeModule } from 'angularx-qrcode';",
      after: "import { QRCodeComponent } from 'angularx-qrcode';",
    },
    {
      version: '20', core: '^20.3.23', typescript: '~5.9.3', date: 'Maio de 2026',
      title: 'Um novo pacote de build.',
      detail: 'Build, servidor e testes passam a usar @angular/build.',
      file: 'angular.json', path: 'angular.json', source: 'ff592265b · recorte real',
      before: '"builder": "@angular-devkit/build-angular:application"',
      after: '"builder": "@angular/build:application"',
    },
    {
      version: '21', core: '^21.2.15', typescript: '~5.9.3', date: 'Maio de 2026',
      title: 'O evento ganha um tipo.',
      detail: 'A máscara recebe Event e lê o valor como HTMLInputElement.',
      file: 'currency-mask.directive.ts', path: 'src/app/utils/directives/currency-mask/currency-mask.directive.ts', source: 'c11a59920 · recorte real',
      before: "@HostListener('input', ['$event.target.value'])\nonInput(value: string): void {",
      after: "@HostListener('input', ['$event'])\nonInput(event: Event): void {\n  const value = (event.target as HTMLInputElement).value;",
    },
  ] as const;
  readonly index = computed(() => this.progress() < .18 ? 0 : this.progress() < .40 ? 1 : this.progress() < .65 ? 2 : this.progress() < .85 ? 3 : 4);
  readonly current = computed(() => this.milestones[this.index()]);
}
