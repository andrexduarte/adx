import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chat-code',
  templateUrl: './chat-code.html',
  styleUrl: './chat-code.scss',
})
export class ChatCode {
  readonly build = input(0);
  readonly folders = [
    {
      path: 'chat/v1',
      files: [
        { name: 'chat.component.ts', icon: 'TS', current: true, reveal: 0 },
        { name: 'chat.component.html', icon: '◇', current: false, reveal: .12 },
        { name: 'chat.component.scss', icon: '#', current: false, reveal: .24 },
      ],
    },
    {
      path: 'utils/services/web-socket',
      files: [
        { name: 'websocket.service.ts', icon: 'TS', current: false, reveal: .36 },
      ],
    },
  ];

  // Source: arena-app-front-end/src/app/chat/v1/chat.component.ts.
  // Excerpts from ngOnInit and onMessageSent; only indentation is normalized.
  // The gap and original line numbers distinguish separate parts of the file.
  readonly code = [
    { number: 127, text: 'this.subscriptions.push(', kind: '' },
    { number: 128, text: '  this.websocketService.connectionState$.subscribe((state) => {', kind: 'stream' },
    { number: 129, text: '    this.websocketConnectionState = state;', kind: 'type' },
    { number: 130, text: '    this.cdr.markForCheck();', kind: '' },
    { number: 131, text: '  })', kind: '' },
    { number: 132, text: ');', kind: '' },
    { number: null, text: '···', kind: 'omitted' },
    { number: 290, text: 'this.websocketService.sendMessage(', kind: 'stream' },
    { number: 291, text: '  `/app/chat/tournament/${this.activeChannel.id}`,', kind: 'template' },
    { number: 292, text: '  tempMessage', kind: 'type' },
    { number: 293, text: ');', kind: '' },
  ];
}
