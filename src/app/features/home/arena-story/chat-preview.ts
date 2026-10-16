import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { chatFrame, chatSteps } from './chat-playback';

@Component({
  selector: 'app-chat-preview',
  templateUrl: './chat-preview.html',
  styleUrl: './chat-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--compact]': 'frame().compact' },
})
export class ChatPreview {
  readonly progress = input(0);
  readonly frame = computed(() => chatFrame(this.progress()));
  readonly step = computed(() => chatSteps[this.frame().step]);
  readonly steps = chatSteps;
}

