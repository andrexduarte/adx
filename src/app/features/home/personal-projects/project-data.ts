export interface PersonalProject {
  id: 'nos' | 'wakawa';
  name: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  plan: readonly string[];
  tools: readonly { name: string; use: string; mark: string; icon?: string }[];
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
    prompt: 'Dividimos as contas da casa, mas é difícil saber quem pagou e quanto falta acertar. Vamos organizar isso em um só lugar.',
    plan: ['Separar as contas compartilhadas dos gastos pessoais.', 'Calcular a parte de cada pessoa com a mesma regra.', 'Agrupar os itens do acerto sem perder o pagamento original.', 'Levar o fluxo do desktop ao celular.'],
    tools: [
      { name: 'Nuxt 4', use: 'Páginas e aplicação', mark: 'N', icon: 'nuxt' },
      { name: 'Vue 3', use: 'Interface reativa', mark: 'V', icon: 'vue' },
      { name: 'TypeScript', use: 'Regras e contratos', mark: 'TS', icon: 'typescript' },
      { name: 'Pinia', use: 'Estado compartilhado', mark: 'P', icon: 'pinia' },
      { name: 'Supabase', use: 'Dados e autenticação', mark: '↯', icon: 'supabase' },
      { name: 'PWA', use: 'Acesso pelo celular', mark: '↗', icon: 'pwa' },
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
    prompt: 'Meu navegador tem recursos que não uso e consome muita RAM. Vamos criar um navegador mais leve, focado no trabalho, com a página, o projeto e o Codex no mesmo lugar.',
    plan: ['Construir a navegação nativa, com ferramentas sob demanda.', 'Conectar a página e a pasta do projeto ao Codex.', 'Conferir as mudanças na interface e medir memória e CPU.'],
    tools: [
      { name: 'C++20', use: 'Aplicação nativa', mark: 'C++', icon: 'cplusplus' },
      { name: 'Codex', use: 'Agente no projeto', mark: '>_', icon: 'codex' },
      { name: 'CEF', use: 'Chromium embarcado', mark: '◉', icon: 'cef' },
      { name: 'Win32', use: 'Janelas e controles', mark: '⊞', icon: 'win32' },
      { name: 'MCP', use: 'Ferramentas locais', mark: '⌘', icon: 'mcp' },
      { name: 'DevTools', use: 'Inspeção da página', mark: '⌥', icon: 'devtools' },
      { name: 'CMake', use: 'Compilação', mark: '△', icon: 'cmake' },
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
