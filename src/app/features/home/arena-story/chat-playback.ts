import { clamp, phase } from './story-timing';

export interface DemoMessage {
  id: string; sender: string; content: string; mine: boolean; time: string;
}
const firstText = 'Boa tarde! Tudo certo por aqui.';
const events: { at: number; message: DemoMessage }[] = [
  { at: .08, message: { id: 'welcome', sender: 'Participante', content: 'Boa tarde, pessoal!', mine: false, time: '15:15' } },
  { at: .35, message: { id: 'own-1', sender: 'Você', content: firstText, mine: true, time: '15:15' } },
  { at: .47, message: { id: 'reply', sender: 'Participante', content: 'Tudo certo. Bom torneio!', mine: false, time: '15:16' } },
  { at: .86, message: { id: 'reply', sender: 'Participante', content: 'Tudo certo. Bom torneio!', mine: false, time: '15:16' } },
];

// Deterministic local storyboard: scroll backward restores prior messages.
// Like the real component, an existing id is updated instead of appended.
export function chatFrame(value: number) {
  const p = clamp(value);
  const messages: DemoMessage[] = [];
  let lastEvent = 0;
  for (const event of events) {
    if (event.at > p) continue;
    const index = messages.findIndex(message => message.id === event.message.id);
    if (index === -1) messages.push(event.message);
    else messages[index] = event.message;
    if (index === -1) lastEvent = event.at;
  }
  return {
    connected: p >= .06,
    draft: p >= .14 && p < .3 ? firstText.slice(0, Math.ceil(firstText.length * phase(p, .14, .28))) : '',
    sending: p >= .3 && p < .35,
    compact: phase(p, .60, .82),
    step: p < .44 ? 0 : p < .60 ? 1 : 2,
    messages,
    packet: p < .44 ? phase(p, .3, .35) : 1 - phase(p, .44, .49),
    lastReveal: phase(p, lastEvent, lastEvent + .025),
  };
}

// Reduced source excerpts; comments mark explanatory omissions.
export const chatSteps = [
  { title: 'Escrever. Enviar.', file: 'websocket.service.ts', hint: 'O texto é serializado e publicado no canal do torneio.', label: 'client.publish', lines: [
    'this.client.publish({', '  destination,', '  body: JSON.stringify(message)', '});',
  ] },
  { title: 'Receber sem duplicar.', file: 'chat.component.ts', hint: 'Se o mesmo ID voltar pelo canal, a mensagem existente é atualizada.', label: 'findIndex · message.id', lines: [
    'const index = this.listMessages[message.tournamentId].findIndex(',
    '  (msg) => msg.id === message.id',
    ');',
    'if (index !== -1) {',
    '  this.listMessages[message.tournamentId][index] = message;',
    '}',
  ] },
  { title: 'O chat se adapta.', file: 'chat.component.scss', hint: 'O conteúdo ocupa o espaço disponível. Mensagens quebram linha e o histórico ganha rolagem.', label: 'SCSS responsivo', lines: [
    '.chat-body {', '  overflow-y: auto;', '  flex: 1;', '}',
    '.chat-message p {', '  word-break: break-word;', '  hyphens: auto;', '}',
  ] },
] as const;

