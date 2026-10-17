import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
@Component({
  selector: 'app-wakawa-workbench',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wakawa-workbench.html',
  styleUrl: './wakawa-workbench.scss',
})
export class WakawaWorkbench {
  readonly conversation = input(false);
  readonly closePanel = output<void>();
  readonly sendExample = output<void>();
}
