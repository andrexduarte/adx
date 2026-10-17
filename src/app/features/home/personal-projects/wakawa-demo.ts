import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { WakawaWorkbench } from './wakawa-workbench';

@Component({
  selector: 'app-wakawa-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WakawaWorkbench],
  templateUrl: './wakawa-demo.html',
  styleUrl: './wakawa-demo.scss',
})
export class WakawaDemo {
  readonly progress = input(0);
  readonly selection = signal<{ progress: number; step: number } | null>(null);
  readonly step = computed(() => {
    const selection = this.selection();
    if (selection && Math.abs(selection.progress - this.progress()) < .025) return selection.step;
    return this.progress() < .28 ? 0 : this.progress() < .62 ? 1 : 2;
  });
  readonly steps = ['A página', 'O projeto e o Codex', 'A conversa'];
  select(step: number) { this.selection.set({ progress: this.progress(), step }); }
}
