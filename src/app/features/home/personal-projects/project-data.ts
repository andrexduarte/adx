export interface PersonalProject {
  id: 'nos' | 'wakawa';
  name: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  plan: readonly string[];
  tools: readonly { name: string; use: string; mark: string }[];
  files: readonly string[];
  source: string;
  code: string;
  decision: string;
}

// Content checked against the local Nos and Wakawa sources. Prompts are reconstructions.
export const PERSONAL_PROJECTS: readonly PersonalProject[] = [
  {
    id: 'nos', name: 'Nós', category: 'PROJETO PESSOAL · VIDA COMPARTILHADA',
    title: 'O que é meu.\nO que é nosso.',
    description: 'Contas, combinados e acertos entre quem divide a vida.',
    prompt: 'Vamos organizar as contas da casa. Cada pessoa vê sua parte, escolhe o que acertar e acompanha o que já foi pago.',
    plan: ['Separar as contas compartilhadas dos gastos pessoais.', 'Calcular a parte de cada pessoa com a mesma regra.', 'Agrupar os itens do acerto sem perder o pagamento original.', 'Levar o fluxo do desktop ao celular.'],
    tools: [
      { name: 'Nuxt 4', use: 'Páginas e aplicação', mark: 'N' },
      { name: 'Vue 3', use: 'Interface reativa', mark: 'V' },
      { name: 'TypeScript', use: 'Regras e contratos', mark: 'TS' },
      { name: 'Pinia', use: 'Estado compartilhado', mark: 'P' },
      { name: 'Supabase', use: 'Dados e autenticação', mark: '↯' },
      { name: 'PWA', use: 'Acesso pelo celular', mark: '↗' },
    ],
    files: ['app/pages/acertos.vue', 'app/components/ui/ResumoAcerto/', 'shared/types/acerto.ts', 'shared/utils/divisao.ts', 'shared/utils/acerto.ts'],
    source: 'shared/utils/acerto.ts',
    code: `/** O pagamento original continua preservado. */
export function contribuicaoDaParte(parte?: {
  valor_feito?: number | null;
  valor_acertado?: number | null;
}): number {
  return Math.round((
    (parte?.valor_feito ?? 0) +
    (parte?.valor_acertado ?? 0)
  ) * 100) / 100;
}`,
    decision: 'Pagamento e reembolso têm registros distintos. O acerto muda a contribuição, sem reescrever o que já aconteceu.',
  },
  {
    id: 'wakawa', name: "waka’wã", category: 'PROJETO PESSOAL · EM DESENVOLVIMENTO',
    title: 'Navegar. Investigar.\nConstruir.',
    description: 'Um navegador de trabalho para Windows, com o projeto e suas ferramentas por perto.',
    prompt: 'Vamos investigar esta página no próprio navegador: observar as requisições da aba e entender a resposta antes de mudar o código.',
    plan: ['Construir a janela nativa e as abas sobre o Chromium.', 'Aproximar a página, o projeto local e a conversa.', 'Observar a rede da aba pelas ferramentas do navegador.', 'Filtrar campos sensíveis antes de devolver uma resposta.'],
    tools: [
      { name: 'C++20', use: 'Aplicação nativa', mark: 'C++' },
      { name: 'CEF', use: 'Chromium embarcado', mark: '◉' },
      { name: 'Win32', use: 'Janelas e controles', mark: '⊞' },
      { name: 'MCP', use: 'Ferramentas locais', mark: '⌘' },
      { name: 'DevTools', use: 'Inspeção da página', mark: '⌥' },
      { name: 'CMake', use: 'Compilação', mark: '△' },
    ],
    files: ['src/main_win.cc', 'src/codex_runner.cc', 'src/wakawa_ipc.cc', 'src/network_capture.cc', 'src/network_privacy.h', 'tools/wakawa_mcp.cc'],
    source: 'src/network_privacy.h',
    code: `if (value.is_object()) {
  for (auto it = value.begin();
       it != value.end(); ++it) {
    if (Sensitive(it.key())) {
      it.value() = "[REDACTED]";
      redacted = true;
    } else {
      Sanitize(it.value(), redacted, depth + 1);
    }
  }
}`,
    decision: 'A captura observa a sessão da aba. O filtro percorre o JSON e oculta campos sensíveis antes de entregar o resultado.',
  },
];
