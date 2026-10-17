import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-avatar-class-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-class-selector.html',
  styleUrl: './avatar-class-selector.scss',
})
export class AvatarClassSelector {
  readonly classes = input.required<readonly { name: string; preview: string }[]>();
  readonly selected = input(0);
  readonly active = input(0);
  readonly choose = output<number>();
}
