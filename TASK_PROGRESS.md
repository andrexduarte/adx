# Progresso da revisão do site pessoal

Atualizado em 17 de outubro de 2026. O catálogo local tem 64 frames: Trade Arena entra como primeira das nove experiências profissionais, no frame 53; os três frames de pontilhismo e contato encerram a página. A revisão passou pelos projetos pessoais e pelas experiências. As alterações descritas nas últimas entradas continuam locais, sem nova publicação. O registro abaixo preserva decisões, versões superadas, evidências e publicações anteriores.

Verificação mais recente: build:vercel concluído sem avisos em 17/10 às 05h46 UTC; 15 testes focados de timeline/navegação e dez testes SSR aprovados. Conferência da primeira experiência e cabeçalho no desktop e 390 × 844, além do link de retorno à apresentação da Arena. A fidelidade das demonstrações dos projetos continua limitada às fontes e às comparações já registradas em cada etapa.

## Direção aprovada

- Poucos elementos por tela, menos texto e destaque para o trabalho atual.
- Preservar a xilogravura dos trabalhadores no topo e a identidade em preto, vermelho e papel claro. Apenas o braço do martelo permanece animado.
- Mostrar o processo junto ao resultado: prompt, plano, ferramentas, arquivos, código e interface. Os exemplos devem corresponder ao projeto real.
- Revisar um frame por vez com André antes de mudar o seguinte. Usar os links da navegação lateral para localizar cada trecho.
- André pediu posteriormente para parar a delegação a subagentes. O agente principal conduz as perguntas, implementa, confere e registra diretamente. Não alterar frames ainda sem decisão.
- O Caderno permanece separado da home. O SSR continua funcionando; sua remoção não é necessária para esta entrega.

## Revisão por frame

| Frame | Estado atual | Decisão incorporada |
| --- | --- | --- |
| [01 — Abertura](https://andre.is-a.dev/#frame-abertura) | Revisado | Logo de André à esquerda; sem links de trajetória, Caderno ou WhatsApp no cabeçalho. Trabalhador `fitter` removido da cena. |
| [02 — Trade Arena](https://andre.is-a.dev/#frame-trade-arena) | Revisado | Progresso no topo. Logo da Arena transita para a direita do cabeçalho, junto ao contexto `TRADE ARENA / task: chat`. Removidos os textos de abertura excedentes, o link para Nós e `stage-bottom`. |
| [03 — Prompt](http://127.0.0.1:4301/#frame-chat-ideia) | Revertido ao padrão do site, localmente | Decisão mais recente: voltar ao formato anterior, tomando os frames 15 e 16 como referência. Título serifado “Vamos construir.” e campo compartilhado com os outros exemplos, mantendo a digitação e o envio conforme a rolagem. Retirada a reprodução da interface Work/Codex deste frame. |
| [04 — Plano](https://andre.is-a.dev/#frame-chat-plano) | Revisado | Quatro passos apresentados como resposta do Codex, no mesmo ambiente do prompt. |
| [05 — Fluxo de trabalho](http://127.0.0.1:4301/#frame-chat-ferramentas) | Ampliado localmente | Nova decisão: mostrar um fluxo mais completo e real com Codex, specs, MCP e Figma. Referências alimentam o trabalho com Codex; tecnologias constroem a interface; revisão e testes levam a novos ajustes. Mantidas as tecnologias do chat e a revelação pela rolagem. |
| [06 — Construção](https://andre.is-a.dev/#frame-chat-codigo) | Revisado | Preservado o editor com árvore de arquivos. Trechos reais de conexão e envio em `chat.component.ts`, com caminhos e números de linha correspondentes ao código consultado. |
| [07 — Interface](https://andre.is-a.dev/#frame-chat-interface) | Revisado | Visual baseado no HTML/SCSS real e no print fornecido: Sora, cores, avatar do canal, balões, horários e campo de envio. Três etapas: enviar, receber sem duplicar e adaptar o layout. Rolagem aproximadamente 55% menor que a versão anterior à revisão, preservando o ritmo dos demais frames. Exemplo com `any` substituído pela atualização por ID. Título final: “O chat se adapta.” CSS selecionado mostra quebra de texto e rolagem. |
| 08 original — Números do chat | Oculto localmente | Decisão: “Ocultar esse frame”. Removidos o quadro, seu tempo de rolagem e o link lateral. O chat passa diretamente para Torneios. Dados de origem preservados. |
| [08 atual — Torneios](http://127.0.0.1:4301/#frame-torneios-ideia) | Textos revisados localmente | “TORNEIOS”, sem V3. Título: “Encontrar. Filtrar. Escolher um torneio.”. Contexto no cabeçalho: `task: torneios`. Mantido o campo no estilo do site. |
| [09 — Plano de Torneios](http://127.0.0.1:4301/#frame-torneios-plano) | Conferido e mantido | Decisão: manter e verificar no plano real. Os quatro passos são uma síntese de itens documentados em `PLAN_TOURNAMENTS_V3.md`; texto, formato e animação preservados. Evidências abaixo. |
| [10 — Fluxo de Torneios](http://127.0.0.1:4301/#frame-torneios-ferramentas) | Ampliado e conferido localmente | Figma, specs, Git/GitHub, MCP e André + Codex conduzem à implementação. Angular/TypeScript, RxJS, ViewModel, AsyncPipe e OnPush conferidos no código real. WebSocket incluído por pedido explícito como “preparado · desativado”. Resultado mostra composição responsiva, filtros, estados e recuperação. |
| [11 — Arquivos de Torneios](http://127.0.0.1:4301/#frame-torneios-arquivos) | Conferido e mantido | Todos os arquivos e diretórios exibidos existem sob `src/app/pages/user/tournaments/v3`. `standalone: true` confirmado no componente da página. Árvore compacta e apresentação preservadas. |
| [12 — Código de Torneios](http://127.0.0.1:4301/#frame-torneios-codigo) | Implementado; QA desktop/mobile concluída | Pipeline real dos sete recursos para um ViewModel, com `combineLatest`, mapper, estado inicial e `shareReplay`; template com AsyncPipe. Formato de editor preservado. Fonte e responsividade conferidas pelo principal após entrega do subagente. |
| [13 — Interface de Torneios](http://127.0.0.1:4301/#frame-torneios-interface) | Implementado; QA desktop/mobile concluída | Recorte fiel de “Todos os torneios”: oito colunas, quatro filtros e duas linhas demonstrativas. Tabela desktop vira cards mobile na mesma árvore. Carregando, com dados e falha ao atualizar preservando os dados conferidos, incluindo rolagem reversa. Sem transbordamento horizontal a 360px. |
| [14 — Números de Torneios](http://127.0.0.1:4301/#frame-torneios-numeros) | Revisado; QA desktop/mobile concluída | Números preservados: 134 commits, 18.203 adições e 196 remoções. Título “Torneios”, sem V3. Link do PR removido; referência textual e escopo incluindo integrações mantidos. |
| [15 — Prompt do Dashboard](http://127.0.0.1:4301/#frame-dashboard-ideia) | Textos revisados localmente | Título “As operações, em perspectiva.” e prompt “Vamos mostrar resultados, operações por horário e desempenho por ativo.” |
| [16 — Plano do Dashboard](http://127.0.0.1:4301/#frame-dashboard-plano) | Reduzido e conferido na branch | Três passos: organizar operações e resultados em ViewModels; mostrar gráficos por horário e desempenho por ativo; definir estados iniciais e mensagens de erro. Fonte: branch `feat/dashboad-torneios`, conforme a confirmação de André. |
| [17 — Ferramentas do Dashboard](http://127.0.0.1:4301/#frame-dashboard-ferramentas) | Mapa mantido e ampliado localmente | Preservados Angular, TypeScript, ViewModel, RxJS, SCSS e HTTP. SVG adicionado por pedido posterior de André, com referência ao gráfico de distribuição. |
| 18 anterior — Código do Dashboard | Oculto localmente | Quadro de arquivos/código e seu tempo de rolagem removidos da apresentação. Conteúdo de origem preservado. Ferramentas levam diretamente à interface. |
| [18 atual — Interface do Dashboard](http://127.0.0.1:4301/#frame-dashboard-interface) | Reconstruída; QA desktop/mobile e estática concluída | Quatro gráficos da branch: operações por tempo, distribuição, PNL/operações por ativo e histograma de PNL. Câmera, eixos e rolagem reversa conferidos em desktop e 390 × 844, com adaptação a 360px. Os quatro gráficos permanecem no modo estático. André confirmou que a referência existe somente em `feat/dashboad-torneios`, não em `main`. |
| 19 anterior — Números do Dashboard | Oculto localmente | Decisão: ocultar o fechamento numérico. Recorte de três commits, 421 adições e 160 remoções preservado nos dados de origem. |
| 19–23 anteriores — Monitor flutuante | Ocultos localmente | Toda a área removida da narrativa, dos links laterais e da duração de rolagem: prompt, plano, código, interface e números. Implementação preservada nos arquivos. |
| [19 atual — Prompt de Avatar](http://127.0.0.1:4301/#frame-avatar-ideia) | Textos revisados localmente | Título “Um avatar, do seu jeito.” e prompt “Vamos criar um modal para escolher a classe e trocar o avatar.” |
| [20 — Plano de Avatar](http://127.0.0.1:4301/#frame-avatar-plano) | Reduzido e conferido no código | Três passos: escolher classe/avatar liberado pelo nível; pré-carregar a imagem e apresentar a prévia com transição; confirmar e atualizar avatar/classe do perfil. |
| [21 — Código de Avatar](http://127.0.0.1:4301/#frame-avatar-codigo) | Trecho substituído localmente | Regra real de bloqueio por nível em `processedLevels`: compara `level.level` com `sourceClass.userLevel` e produz `isLocked`. Mantidos o editor e a identificação do recorte. |
| [22 — Modal de Avatar](http://127.0.0.1:4301/#frame-avatar-interface) | Implementado; seleção/prévia conferidas e confirmação funcional no celular | Modal “Escolha sua classe” com Analista Gráfico e Sniper, imagens e textos reais, prévia, grupo do nível 1, nível 2 bloqueado, avatar atual e confirmação. Corrigidos o vazamento dos cards e os controles locais. Seleção/prévia conferidas em 1280 × 800 e 390 × 844; confirmação funcionando em 390 × 844. Modo estático e 360px ainda pendentes neste recorte. |
| 23 anterior — Números de Avatar | Oculto localmente | Fechamento numérico retirado da apresentação e do tempo de rolagem. Dados de origem preservados. |
| [23 atual — Prompt da League](http://127.0.0.1:4301/#frame-league-ideia) | Textos revisados localmente | Título “Feed, ranking e equipes.” e prompt “Vamos construir o feed, o ranking e as equipes da League.” |
| [24 — Plano da League](http://127.0.0.1:4301/#frame-league-plano) | Conferido e mantido | Quatro passos confirmados: identidade/navegação; carregamento por rota; dados, estados e permissões; adaptação de Feed, Ranking e Equipes. Nenhuma alteração necessária no texto. Evidências abaixo. |
| [25 — Fluxo da League](http://127.0.0.1:4301/#frame-league-ferramentas) | Implementado; QA final pendente | Fluxo ampliado com Codex e specs, preservando as tecnologias da League e distinguindo o processo informado por André das evidências de implementação. |
| 26 anterior — Código da League | Oculto localmente | A rota inicial real do Feed com `loadComponent` permanece no código de origem. Editor, link lateral e duração retirados por decisão posterior; o fluxo leva diretamente à interface. |
| [26 atual — Interface da League](http://127.0.0.1:4301/#frame-league-interface) | Implementado; sequência, rolagem reversa e modo estático conferidos | Feed → Ranking → Estatísticas com estreitamento progressivo e percurso pelo conteúdo, em desktop/mobile. Reconstrução com dados demonstrativos; a câmera não captura a rolagem da página. Em modo estático a 1280 × 660, as três áreas aparecem completas, com altura natural. Verificação adicional a 360px ainda pendente neste recorte. |
| [27 — Números da League](http://127.0.0.1:4301/#frame-league-numeros) | Revisado localmente | Números e recorte mantidos; link para o PR removido por decisão de André. |
| [28 — Prompt de Domínios](http://127.0.0.1:4301/#frame-dominios-ideia) | Textos revisados localmente | Título “A League além da página.”. Prompt apresenta o problema: responsabilidades que ultrapassaram uma página, recursos compartilhados e organização em domínio com entradas públicas e limites de dependência. |
| [29 — Plano de Domínios](http://127.0.0.1:4301/#frame-dominios-plano) | Conferido e mantido | Quatro passos: mapear responsabilidades da League; separar features, dados, contratos e recursos; definir entradas públicas e ajustar imports; expressar fronteiras com Sheriff. |
| [30 — Código de Domínios](http://127.0.0.1:4301/#frame-dominios-codigo) | Implementado; QA final pendente | Scripts reais de Sheriff e Detective, acompanhados do escopo de integração do ESLint na League. Diferencia visualização de dependências e verificação de regras, sem sugerir adoção integral. |
| [31 — Interface de Domínios](http://127.0.0.1:4301/#frame-dominios-interface) | Implementado; QA a 360 × 780 concluída | Sequência Detective → organização do domínio → Sheriff. Relaciona dependências observadas, estrutura por responsabilidade e regras de fronteira, sem simular um resultado de análise executada. Sem transbordamento horizontal no celular conferido. |
| Anterior — Números de Domínios | Oculto localmente | Quadro, link lateral e duração retirados. Preservado nos dados de origem o recorte de três commits, 6.652 adições e 1.527 remoções. |
| [32 — Prompt do Angular](http://127.0.0.1:4301/#frame-angular-ideia) | Textos revisados localmente | Título “Do Angular 16 ao 21.”. Prompt: “Vamos atualizar o Angular e suas dependências, preservando os fluxos existentes.” |
| [33 — Plano do Angular](http://127.0.0.1:4301/#frame-angular-plano) | Quatro passos mantidos e conferidos no histórico | Dependências compatíveis; evolução por etapas; ajustes de configuração, tipos e integrações; validação dos fluxos. O último item é uma etapa do plano, sem afirmar execução comprovada de testes a cada migração. |
| Anterior — Código do Angular | Oculto localmente | Quadro separado de configuração/código retirado, com duração e link lateral. Os recortes de código agora acompanham os marcos da demonstração. |
| [34 — Evolução do Angular](http://127.0.0.1:4301/#frame-angular-interface) | Implementado; QA a 360 × 780 concluída | Marcos 16, 17, 19, 20 e 21 com código real antes/depois: builder original, `browserTarget` → `buildTarget`, `QRCodeModule` → `QRCodeComponent`, `@angular/build` e evento tipado na máscara. Altura ajustada para 560px, sem transbordamento horizontal no celular conferido. Sem autores individuais; nota de trabalho em equipe preservada. |
| Anterior — Números do Angular | Oculto localmente | Fechamento numérico, link e duração retirados; recortes históricos preservados em `work-evidence.ts`. |
| Anteriores — ClickUp / Relatar e acompanhar | Ocultos localmente | Toda a área retirada da narrativa, da navegação e da duração. Fontes e implementação preservadas; o exemplo continua sendo um fluxo de relato e acompanhamento, não uma integração automática. |
| [35 — Prompt de Signals](http://127.0.0.1:4301/#frame-signals-ideia) | Prompt revisado localmente | “Vamos simplificar o estado de apresentação da League com Signals, mantendo RxJS no fluxo de dados.” |
| [36 — Plano de Signals](http://127.0.0.1:4301/#frame-signals-plano) | Quatro passos conferidos e mantidos | Mapear estados do template; manter RxJS nos dados; expor Signals para apresentação; revisar o template e os componentes afetados. |
| [37 — Código de Signals](http://127.0.0.1:4301/#frame-signals-codigo) | Conferido e implementado | Trecho real de `toSignal(this.identityStateSource$, { initialValue: LEAGUE_IDENTITY_STATE_INITIAL })`, com consumo do template de `identityState$` por AsyncPipe para `identityState()`. Conferido no commit `efc99c1c2`; RxJS permanece no fluxo de dados. |
| 38 anterior — Números de Signals | Oculto localmente | Fechamento, link lateral e duração retirados; dados de origem preservados. |
| [38 atual — Prompt de Vitest](http://127.0.0.1:4301/#frame-vitest-ideia) | Prompt revisado localmente | “Vamos migrar de Karma e Jasmine para Vitest, preservando os cenários já cobertos.” |
| [39 — Plano de Vitest](http://127.0.0.1:4301/#frame-vitest-plano) | Três passos conferidos | Configurar Vitest no Angular com Chromium; adaptar specs, mocks e timers preservando os cenários; executar a suíte ativa e registrar o resultado. O plano não afirma que a suíte da Arena foi executada nesta revisão do portfólio. |
| [40 — Migração de Vitest](http://127.0.0.1:4301/#frame-vitest-codigo) | Implementado; QA desktop/mobile concluída | Recorte de 197 specs em 206 arquivos confirmado no commit `69bf27aa59ee2370595eb116913c46eaa6f395e0`. Mostra `spyOn` → `vi.spyOn(...).mockImplementation` e `toBeFalse()` → `toBe(false)`. Código legível em 1280 × 800 e 390 × 844, sem sobreposição. Parágrafo de legenda removido por decisão posterior; abaixo do quadro permanece somente a referência de commit/arquivo. |
| [41 — Números de Vitest](http://127.0.0.1:4301/#frame-vitest-numeros) | Mantidos; QA desktop/mobile concluída | Três commits, 6.533 adições e 6.901 remoções, mantendo o recorte do PR #925 sem link para ele. Escopo diferente da contagem de arquivos do commit isolado. |
| [42 — Atividade no GitHub](http://127.0.0.1:4301/#frame-github) | Implementado; percurso e totais conferidos | Rolagem de janeiro de 2025 até o último dia coletado em 2026. Totais da Arena separados da atividade do perfil: 1.313 commits, 534.546 adições e 311.560 remoções, conforme o recorte descrito abaixo. |
| [43 — Apresentação de Nós](http://127.0.0.1:4301/#frame-nos-apresentacao) | Implementado | Passagem breve dentro da abertura: “Projetos pessoais”, “Nós · waka’wã” e mudança do escuro para o claro. Nome e contexto no cabeçalho, à direita do A; retirado o link de conhecer o próximo projeto. |
| [44 — Prompt de Nós](http://127.0.0.1:4301/#frame-nos-ideia) | Texto revisado | Parte do problema de saber quem pagou e quanto falta acertar. |
| [45 — Plano de Nós](http://127.0.0.1:4301/#frame-nos-plano) | Quatro passos mantidos e conferidos | Separação pessoal/compartilhado, cálculo da parte, agrupamento do acerto e adaptação conferidos no projeto. |
| [46 — Ferramentas de Nós](http://127.0.0.1:4301/#frame-nos-ferramentas) | Stack conferida e mapa revisado | Nuxt 4, Vue 3, TypeScript, Pinia, Supabase e PWA com ícones, usando o mesmo diagrama dos demais exemplos. |
| 47 anterior — Código de Nós | Oculto | Conteúdo preservado em project-data.ts; removido da exibição, dos links e da duração. André esclareceu que a crítica à interface se referia ao antigo 48. |
| [47 atual — Home de Nós](http://127.0.0.1:4301/#frame-nos-interface) | Reconstruída a partir do código real; QA concluída | Indicador de equilíbrio, situação do ciclo, quadro em três grupos, filtro e registro demonstrativo. A rolagem percorre a página sem transformar sua largura. Dados de Ana e Beto são fictícios. |

Os números ocultos do chat, Dashboard, Monitor, Avatar, Domínios, Angular e Signals foram preservados em `work-evidence.ts`. O chat registra dois commits da entrada nas páginas de torneio, com 230 adições e 104 remoções; não representa toda sua construção. A numeração lateral se ajusta às remoções, preservando os IDs dos frames que continuam visíveis. A tabela distingue números anteriores dos atuais: catálogo de 66 frames, com dez experiências anteriores.

## O que já está implementado depois do chat

- Exemplos visíveis da Trade Arena: chat, Torneios, Dashboard, avatares, League, organização por domínios, evolução do Angular, Signals e migração de testes, além dos calendários de atividade do GitHub.
- Monitor flutuante e toda a área de ClickUp estão preservados no código, mas ocultos por decisão de André. O fluxo de ClickUp representa relatar e acompanhar problemas; não deve sugerir uma integração automática inexistente.
- Projetos Nós e waka’wã após a Arena, com mudança de ambiente visual. Nós usa o nome, sem sua logo.
- Experiências anteriores centralizadas, com uma experiência por tela durante a rolagem.
- Encerramento em pontilhismo: os pontos formam o retrato, ele sobe, o cabeçalho desaparece e entram cargo, tecnologias e links. Codex aparece primeiro nas tecnologias; Supabase também está incluído.

A revisão individual está incorporada até Nós, com o código oculto e a home demonstrada. A abertura do waka’wã (48) foi simplificada por pedido posterior; o prompt (49) parte do problema que motivou o navegador. O plano (50) foi reduzido a três passos; a próxima decisão é ferramentas (51). Os frames seguintes de waka’wã, experiências anteriores e encerramento ainda aguardam esta rodada; preservar seu conteúdo até a decisão de André.

## Próximos passos

1. Concluir o frame 42 de GitHub: percurso 2025 → 2026 e apresentação separada dos totais do repositório Arena e do perfil. Conferir navegação e escopo das fontes, mantendo o catálogo de 67 frames.
2. Definir com André a passagem para os projetos pessoais na revisão de Nós, frame 43: transição dentro da abertura, frame próprio ou apenas rótulo. A pergunta já foi enviada; não implementar a sugestão “Projetos pessoais” / “Nós · waka’wã” nem antecipar alterações nos frames seguintes antes da decisão.
3. Conferir visualmente o novo percurso de GitHub, incluindo celular, retorno da rolagem e modo estático. Preservar a QA já concluída de Dashboard, Vitest, League, Domínios/Angular e Avatar; completar as pendências específicas de movimento reduzido, Avatar estático e Avatar/League a 360px. Torneios 12–14 só deve ser repetido se novas alterações afetarem o trecho.
4. Repetir e registrar os checks finais após as últimas edições de Vitest/GitHub. O último resultado consolidado é de 27 testes focados, `build:vercel` sem avisos às 03h55 UTC e nove cenários SSR mais o agrupador às 03h46 UTC em 17/10; esses checks antecedem as últimas edições. Não tratá-los como uma suíte completa atualizada, prova de produção ou validação da Arena.
5. Conferir fidelidade contra código, prints e, quando disponível, aplicação autenticada ou Figma. Para o Dashboard, usar `feat/dashboad-torneios`, conforme a confirmação de André. Pedir referência específica quando faltar evidência visual; não inventar estados ou resultados.
6. Revisar Nós, waka’wã, experiências anteriores e encerramento, mantendo o pontilhismo. Antes da próxima publicação, conferir também links, rolagem reversa, desktop, celular e movimento reduzido.

## Referências e arquivos principais

- `src/app/features/home/frame-navigation/frame-catalog.ts`: identidade e posição dos links de todos os frames.
- `src/app/features/home/arena-story/story-timing.ts`: duração das cenas, números e preservação do ritmo da rolagem.
- `src/app/features/home/arena-story/chat-playback.ts`: sequência determinística do chat e trechos de código exibidos.
- `src/app/features/home/arena-story/chat-preview.*`: reconstrução da interface do chat.
- `src/app/features/home/arena-story/league-demo.*` e componentes `league-demo-feed`, `league-demo-ranking` e `league-demo-statistics`: sequência, câmera e recortes reais da League, incluindo modo estático.
- `src/app/features/home/arena-story/angular-upgrade-demo.*`: marcos de versão e recortes reais de código antes/depois.
- `src/app/features/home/arena-story/engineering-insight.*`: planos e demonstrações de Signals e Vitest.
- `src/app/features/home/arena-story/work-evidence.ts`: escopo e fontes dos números apresentados.
- Referência Arena: `arena-app-front-end/src/app/chat/v1/`, `utils/services/web-socket/` e `utils/components/chat-input/`.
- `PUBLICATION.md`: configuração e procedimento de produção.

As mensagens do chat são demonstrativas. A reconstrução usa referências reais de interface e comportamento, sem abrir uma conexão com o backend da Arena.

## Verificação da versão publicada

- Build de produção local sem avisos.
- Suíte completa aprovada: 44 testes, incluindo chat, tempos de rolagem e navegação.
- Nove cenários SSR aprovados, além do agrupador.
- Frame 07 conferido em 1280 × 800, 390 × 844 e 360 × 780. Transição para o layout compacto e visibilidade da mensagem mais recente verificadas.
- Evidências visuais locais preservadas em `research`, fora dos recursos públicos do site.

## Revisão local após a publicação

O quadro de números do chat foi ocultado, incluindo a apresentação estática e o link lateral. Seu trecho de rolagem foi retirado; o chat mantém as três etapas e passa diretamente ao prompt de Torneios, agora identificado como frame 08. Os dados de origem foram preservados.

O frame 03 voltou ao campo de prompt utilizado pelos demais exemplos, acompanhado do título serifado “Vamos construir.”. A referência mais recente é o estilo dos frames 15 e 16. Essa alteração é exclusiva do frame 03; o plano do frame 04 mantém a decisão anterior até sua própria revisão.

O frame 05 agora descreve o processo de trabalho, em vez de apenas listar tecnologias. `workflow-map.*` contém o desenho responsivo: Figma e GitHub → contexto por MCP; `specs/` → padrões, referências e decisões; André + Codex → plano e implementação; Angular, TypeScript, SCSS, RxJS, WebSocket e STOMP → interface; revisão, testes e comparação visual → ajustes. A definição de `specs/` foi conferida no README e no AGENTS dessa pasta no frontend da Arena. O desenho é uma síntese do fluxo informado por André, não uma alegação de automação integral nem de uso retroativo de todas as ferramentas na criação original do chat.

Na abertura de Torneios, “V3” foi retirado do título visível e “DADOS QUE VIRAM INTERFACE” foi substituído por `task: torneios`. Caminhos de arquivos e referências técnicas versionadas continuam intactos.

Nove testes existentes de navegação e tempo passaram novamente após as alterações. O link de Torneios agora para no prompt completo antes do início da transição para o plano, evitando textos sobrepostos. A passagem do chat para Torneios foi conferida no navegador local, assim como a ausência dos números do chat na apresentação estática. A sugestão anterior de usar o visual do Codex na abertura de Torneios foi substituída pela decisão mais recente de manter o padrão do site e rever seus textos.

O fluxo foi conferido em desktop (1280 × 800), celulares (390 × 844 e 360 × 780) e modo estático em tela baixa (1280 × 660), sem transbordamento horizontal. A rolagem para trás oculta as etapas e a rolagem para a frente as restaura. Prompt 03 e abertura de Torneios conferidos em celular. Build de produção sem avisos; nove cenários SSR aprovados, além do agrupador. A suíte completa de 44 testes não foi repetida nesta rodada. Capturas em `../research/frame-05-workflow-desktop.png`, `frame-05-workflow-mobile.png`, `frame-03-prompt-site-mobile.png` e `frame-08-torneios-mobile.png`. Essas alterações ainda não foram publicadas.

## Conferência do plano de Torneios — frame 09

Fonte consultada em 16/10/2026: `C:/Users/andre/projetos/arena-app/arena-app-front-end/src/app/pages/user/tournaments/PLAN_TOURNAMENTS_V3.md`, selecionado pelo índice e pelo carregador do repositório com `-Plan tournaments -IncludeArchived`. O documento está arquivado e foi consultado como histórico, sem executar suas pendências.

| Passo exibido | Evidência no plano consultado |
| --- | --- |
| Separar destaques, torneios em andamento e catálogo. | Etapa 3, linhas 329–337: composição visual por seção, incluindo andamento, catálogo, cards de torneios em destaque e tabela. |
| Mapear dados para os ViewModels. | Etapa 1, linha 319; etapa 2, linha 324; fluxo de dados, linhas 287–289: mapeamento dos payloads e composição em ViewModels. |
| Definir carregamento, vazio, erro e recuperação. | Etapa 2, linha 327: estados por seção. Estado da execução, linha 45: estado explícito do catálogo e retry na vitrine e na tabela, preservando dados anteriores. |
| Compor a página e adaptar os componentes. | Etapa 3, linhas 329–337; etapa 7, linhas 371–380; fluxo de dados, linha 294: composição mobile e uma única árvore responsiva. |

O frame é uma síntese do plano, não sua transcrição integral nem a lista completa de entregas. Layout e textos mantidos conforme a decisão de André. Nenhuma mudança no código do site ou da Arena nesta conferência; build e testes não repetidos, pois houve apenas consulta de fontes e atualização deste registro.

## Conferência e ampliação do fluxo de Torneios — frame 10

O frame reaproveita o fluxo visual do chat com conteúdo próprio de Torneios: Figma, Git/GitHub e specs como contexto; MCP e André + Codex durante o trabalho; implementação; interface e revisão. Essa parte representa o processo informado por André. As tecnologias foram conferidas no checkout real, sem alterações na Arena:

- `tournaments.component.ts:80–83`: componente standalone, OnPush e import de AsyncPipe.
- `tournaments.component.ts:131–142`: `combineLatest`, `map(buildTournamentsPageVm)` e estado inicial do ViewModel.
- `tournaments.component.html:87`: consumo de `vm$` por `async`; linhas 94, 99, 136, 187 e 199 registram recuperação por seção.
- `components/tournaments-table/tournaments-table.component.ts:43–48`: estados ready, loading, empty, filtered-empty e error.
- `tournaments.component.ts:74,157`: WebSocket implementado sob `LIVE_DASHBOARD_WEBSOCKET_ENABLED = false`. André pediu sua inclusão no mapa; a legenda “preparado · desativado” preserva o estado real, sem alegar entrega de atualizações ao vivo.

AsyncPipe substitui SCSS no mapa para destacar o caminho real dos dados até o template. TypeScript permanece na legenda de Angular para abrir espaço para WebSocket. A responsividade aparece no resultado: uma árvore, dois layouts, com miniatura ilustrativa de catálogo/tabela no desktop e cards no celular. O mapa do chat mantém suas próprias tecnologias.

O link do frame 10 foi ajustado para parar antes da sobreposição com a árvore de arquivos. A miniatura de interface foi separada em `workflow-interface.*` para manter os componentes dentro do orçamento de estilos, sem aumentar esse limite.

Verificação desta rodada: build sem avisos; nove testes de navegação/rolagem e nove cenários SSR (mais agrupador) aprovados. Conferido em 1280 × 720/800, 390 × 844 e 360 × 780, sem transbordamento horizontal. Houve um erro transitório de atualização de metadados do HMR ao extrair o componente; após carregamento completo, o frame renderizou e não houve novo erro. Capturas: `../research/frame-10-torneios-fluxo-desktop.png` e `frame-10-torneios-fluxo-mobile.png`. Alterações locais, ainda não publicadas.

## Conferência dos caminhos de Torneios — frame 11

Em 16/10/2026, a árvore exibida foi comparada com `C:/Users/andre/projetos/arena-app/arena-app-front-end/src/app/pages/user/tournaments/v3`. Confirmados: `tournaments.component.ts`, `tournaments.viewmodel.ts`, a pasta `components/`, suas subpastas `ongoing-tournaments/`, `daily-highlights/` e `tournaments-table/`, além dos arquivos `tournaments-table.component.html` e `tournaments-table.viewmodel.ts` dentro desta última. A linha 81 de `tournaments.component.ts` confirma `standalone: true`.

A árvore é um recorte compacto da estrutura real; não pretende listar todos os arquivos. Nenhuma correção de caminho foi necessária. Mantidos formato, conteúdo e animação. Esta rodada alterou somente o registro de progresso; build e testes não foram repetidos.

## Revisão local de Torneios — frames 12 a 14

Fontes: `C:/Users/andre/projetos/arena-app/arena-app-front-end/src/app/pages/user/tournaments/v3/`. O frame 12 substitui o trecho anterior pelo pipeline de `tournaments.component.ts:131–143`: sete recursos em `combineLatest`, `map(buildTournamentsPageVm)`, `startWith(TOURNAMENTS_PAGE_VM_INITIAL)` e `shareReplay({ bufferSize: 1, refCount: true })`. O template mostra o consumo por AsyncPipe e o componente de resumo, conforme `tournaments.component.html:87–88`; um comentário identifica as demais seções omitidas. Não é código reescrito como se fosse o original.

O frame 13 usa `components/tournaments-table/tournaments-table.component.ts/.html/.scss` e o componente de filtros como referências. Preserva os rótulos Torneio, Inscrição, Ativos, Inscritos, Saldo inicial, Data/hora, Status e Detalhes; os filtros são Moeda, Ativos, Premiação e Status. O exemplo reduz o catálogo a duas linhas fictícias e reaproveita a estrutura da tabela para os cards mobile. Identidade tipográfica, cores, indicadores de status e organização dos filtros foram aproximados das fontes reais. O exemplo não solicita dados ao backend.

Em `tournaments-table.component.ts`, `updateTableState()` prioriza linhas existentes antes de verificar erro. Assim, o terceiro estado do portfólio explica a falha de atualização mantendo os dados; não foi inventado um aviso de erro dentro da tabela. O aviso do exemplo anterior, hero, contador e paginação sem correspondência no recorte foram retirados. A navegação para “Carregando” passou a apontar depois do término do crossfade, para exibir a interface por inteiro; um teste existente recebeu a condição correspondente. A rodada focada de navegação, timing e playback foi executada pelo principal e passou, com 19 testes.

O frame 14 mantém os totais do PR #767 e sua delimitação “incluindo integrações”. A apresentação usa apenas “Torneios” e não oferece mais link para o PR; a identificação textual da fonte permanece. Os totais não foram convertidos em métricas exclusivas de uma pessoa ou de uma única funcionalidade.

QA local registrada pelo principal em 17/10/2026: frames 12–14 conferidos em 1280 × 720 e 390 × 844, incluindo código, fechamento numérico e interface de Torneios. Carregando, com dados, falha de atualização e rolagem reversa foram verificados. A verificação adicional a 360px não apresentou transbordamento horizontal. Essa conferência visual não substitui o build e o SSR finais da rodada.

## Revisão local do Dashboard — frames 15 a 18

André confirmou que a referência existe apenas na branch `feat/dashboad-torneios`, não em `main`. O recorte usado em `dashboard-demo.ts` identifica `cf0ad43cc4` e `dashboard/v2`. Essa é a fonte para a composição e os estados; a aplicação do checkout principal não deve ser usada como substituta silenciosa.

O plano foi reduzido de quatro para três passos, mantendo o que corresponde à branch: operações/resultados organizados em ViewModels; visualização por horário e ativo; estados iniciais e mensagens de erro. A abertura recebeu título e prompt mais concretos. O mapa preserva as seis tecnologias existentes e acrescenta SVG, associado à distribuição das operações.

A interface conserva quatro visualizações: “Operações totais x Tempo”, “Distribuição das operações”, “PNL e Operações por ativo” e “Histograma PNL por faixa”. Rótulos, composição e cores seguem a referência da branch; todos os valores do portfólio são demonstrativos. O principal conferiu os quatro gráficos no desktop, a câmera sem captura do wheel e a rolagem reversa. No celular de 390 × 844, o percurso chegou ao último histograma com eixos visíveis, adaptou-se a 360px e retornou ao início; não houve transbordamento horizontal, com largura da página de 380px para viewport de 390px. A captura está em `../research/frame-18-dashboard-mobile.png`. Em modo estático a 1280 × 660, os quatro gráficos permanecem no DOM. Essa QA local não comprova equivalência pixel a pixel nem comparação com o runtime autenticado da Arena.

O quadro de código e o quadro de números foram ocultados por decisão de André. O tempo desses trechos também foi removido, preservando o ritmo das etapas restantes. Os trechos e o recorte numérico de três commits continuam nos arquivos como referência histórica.

## Monitor oculto e modal de Avatar

Os cinco frames do Monitor flutuante foram ocultados: não aparecem na narrativa animada, na apresentação estática ou na navegação lateral. O conteúdo foi preservado nos arquivos. Os identificadores internos das cenas restantes continuam estáveis, para não deslocar por engano suas evidências e seus componentes.

O plano e o código de Avatar foram conferidos em `C:/Users/andre/projetos/arena-app/arena-app-front-end/src/app/shared/_modals/change-avatar-modal/v2/`, especialmente `component/change-avatar-modal.component.ts`, seu template e estilos, além do model e do service. O novo trecho de código destaca a regra `isLocked` por nível; o plano descreve escolher, pré-carregar/apresentar a prévia e confirmar a atualização. Os números de Avatar foram ocultados e preservados somente nos dados de origem.

O frame 22 foi implementado em `avatar-demo.*` e `avatar-class-selector.*`. Reproduz o modal “Escolha sua classe” com Analista Gráfico e Sniper, duas opções do nível 1 por classe e um nível 2 bloqueado. Mantém avatar atual, prévia, seleção, confirmação e mensagens de sucesso reais, além da animação pelo `progress`. O recorte declara o perfil demonstrativo no nível 1 e não chama o backend. Fundo, previews e imagens do nível bloqueado foram copiados sem alteração para `public/images/work/avatar-modal-real`; os avatares já existentes continuam reutilizados. O principal conferiu seleção e prévia em 1280 × 800 e 390 × 844, além da confirmação funcional em 390 × 844. Foram corrigidos o vazamento dos cards e os controles locais; ainda faltam QA estática e a verificação adicional a 360px deste recorte.

Evidências do modal real: `change-avatar-modal.model.ts:79,128` contém as duas classes, suas descrições e opções; `component/change-avatar-modal.component.html:119–186` apresenta grupos e bloqueios, e `:192–231` mostra avatar atual e confirmação; `component/change-avatar-modal.component.ts:671–684` calcula o bloqueio por nível, e `:824–827` define as mensagens de sucesso. A redução de opções foi solicitada por André; não representa o catálogo inteiro da Arena.

## Revisão local da League — frames atuais 23 a 27

O frame 24 da League manteve seus quatro passos após conferência nas fontes reais. Referências recebidas da revisão do subagente:

- `league.component.html:60–78`: identidade, abas e outlet.
- `league.routes.ts:81–139`: carregamento das áreas Feed, Ranking e Equipes com `loadComponent`.
- `league.component.ts:163–224`, `league.routes.ts:16–78,133` e `data-access/v3/league-api.service.ts:45`: dados, estados e permissões.
- Estilos de Feed (linhas 51–79), Ranking (17–28) e Equipes (77–88): composição responsiva.

O fluxo do frame 25 foi implementado com Codex e specs, mantendo as tecnologias da League. Essa parte representa o processo de trabalho informado por André; não deve atribuir retroativamente uma integração automática a cada trecho histórico.

O antigo frame 26 foi primeiro refinado para mostrar a rota inicial real do Feed: `path: ''`, `pathMatch: 'full'` e `loadComponent` que importa `./components/league-feed/v3` e retorna `LeagueFeedComponent`. Decisão posterior: ocultar esse quadro de código. O recorte continua nos arquivos, mas editor, link lateral e duração foram retirados. A interface passou de 27 para 26; seu fechamento numérico passou de 28 para 27.

O frame atual 26 alterna Feed, Ranking e Estatísticas, percorre o conteúdo pela rolagem e demonstra a adaptação ao celular. `league-demo.*` compõe recortes da interface real: dois eventos do Feed (`FINISHED` e `CREATED`), pódio e três linhas de Ranking por Vitórias, e Hall da Fama com os cinco indicadores do resumo e três tipos de recorde existentes no viewmodel. O sprite de ícones e a coroa vêm da Arena; a imagem original do pódio foi convertida para WebP de aproximadamente 73KB. Nomes e valores são demonstrativos, sem chamadas ao backend.

A janela animada tem 480px de altura; a câmera acompanha o conteúdo sem capturar o wheel da página. As áreas trocam nos progressos 0,34 e 0,67, e o estreitamento acontece ao longo da sequência. O principal conferiu Feed → Ranking → Estatísticas em desktop/mobile, incluindo a rolagem reversa. Também conferiu o modo estático em 1280 × 660: as três áreas aparecem completas, sem câmera nem altura fixa, ocupando sua altura natural. Restam a verificação adicional a 360px e a preferência de movimento reduzido. O frame atual 27 mantém os números e seu escopo; apenas o link para o PR foi removido.

Referências: `league-feed.viewmodel.ts:295–305` para os textos dos eventos; `league-activity-feed.component.scss:32–184` para a composição e o pódio; `shared/_widgets/ranking-podium/v1` para apresentação e responsividade; `league-ranking-table.config.ts:11` para Vitórias; `league-statistics.viewmodel.ts:128–132,267–293` para períodos e indicadores; `league-statistics-achievements.viewmodel.ts:50–60,225` para os recordes e seu status. A janela é um recorte iniciado nas abas, não uma miniatura da página inteira ou reprodução do hero completo.

## Revisão local de Domínios — frames atuais 28 a 31

A abertura aprovada é “A League além da página.”. O prompt apresenta a motivação antes da solução: a League cresceu além de uma página e fornece recursos a outras áreas; por isso, organizar responsabilidades em um domínio com entradas públicas e limites de dependência. O plano, agora frame 29, foi conferido e manteve quatro passos: mapear responsabilidades; separar features, dados, contratos e recursos; definir entradas públicas e ajustar imports; expressar as fronteiras com Sheriff.

O frame atual 30 mostra scripts reais do `package.json`: `architecture:verify` executa `sheriff verify`, e `architecture:inspect` executa `detective --open false`. O segundo recorte mostra `eslint.config.js`, com `files: ['src/app/domains/league/**/*.ts']` e `extends: [sheriff.configs.all]`. A árvore também identifica `sheriff.config.ts` e `.detective/config.json`. A legenda distingue as responsabilidades: Detective visualiza dependências; Sheriff verifica as regras. O exemplo descreve uma adoção incremental na League, sem alegar cobertura integral de todos os domínios.

A sequência visual do frame atual 31 foi implementada: Detective → organização do domínio → Sheriff. Relaciona os escopos reais de dependências, a estrutura por responsabilidade e a verificação das fronteiras, sem simular um relatório de análise executada. O principal conferiu a apresentação em 360 × 780, sem transbordamento horizontal.

Os números de Domínios foram ocultados: quadro, link lateral e tempo de rolagem retirados, preservando nos dados o recorte de três commits, 6.652 adições e 1.527 remoções. Com a remoção adicional do código da League, a abertura do Angular passa a ser o frame 32.

## Revisão local da evolução Angular — frames atuais 32 a 34

A abertura usa “Do Angular 16 ao 21.” e o prompt “Vamos atualizar o Angular e suas dependências, preservando os fluxos existentes.”. Os quatro passos do plano foram mantidos após leitura do histórico: conferir dependências compatíveis, atualizar em etapas, ajustar configuração/tipos/integrações e validar os fluxos. O último item é um objetivo do plano; a presença dos scripts `build` e `test` não comprova que foram executados a cada marco.

Marcos consultados: `4ad961ee5` atualiza Angular 16 para 17 e TypeScript 5.1 para 5.2; `a2e1117f8` e `e78600da2` registram o Angular 19 e os ajustes de integração; `ff592265b` leva ao Angular 20 e ao pacote `@angular/build`; `c11a59920` atualiza para Angular 21 e ajusta eventos/tipos. A sequência é trabalho de equipe, não autoria exclusiva de André.

O quadro separado de código foi ocultado. A demonstração em `angular-upgrade-demo.*` passou a mostrar um recorte real antes/depois em cada transição: builder original no 16; `browserTarget` → `buildTarget` no 17; `QRCodeModule` → `QRCodeComponent` no módulo financeiro no 19; pacote `@angular/build` no 20; `Event` e `HTMLInputElement` na máscara de moeda no 21. Cada recorte identifica arquivo e commit. A interface não mostra os autores individuais e conserva a nota “Recortes reais do Git · evolução feita em equipe.”. Não foram acrescentadas contagens de edições sem apuração nem conceitos sem correspondência no projeto.

O fechamento numérico do Angular também foi ocultado, incluindo link e duração; os dados permanecem em `work-evidence.ts`. O principal ajustou a altura da apresentação para 560px e conferiu a sequência em 360 × 780, sem transbordamento horizontal.

## ClickUp oculto e revisão de Signals — frames atuais 35 a 37

Toda a área de ClickUp foi ocultada por decisão de André: prompt, plano, código e demonstração não aparecem na narrativa, no modo estático ou nos links laterais, e seu trecho de rolagem foi retirado. A implementação e as fontes foram preservadas. O conteúdo histórico descreve o fluxo de relatar e acompanhar problemas com o backend, sem alegar integração automática com ClickUp.

O prompt de Signals agora apresenta a responsabilidade concreta: “Vamos simplificar o estado de apresentação da League com Signals, mantendo RxJS no fluxo de dados.”. Os quatro passos foram conferidos e mantidos: mapear estados consumidos pelo template; manter RxJS nos dados; expor Signals para apresentação; revisar o template e os componentes afetados. O recorte de código foi conferido contra o commit `efc99c1c2`: `identityState` é produzido por `toSignal(this.identityStateSource$, { initialValue: LEAGUE_IDENTITY_STATE_INITIAL })`. O template passa de `identityState$ | async` para `identityState()`. A apresentação destaca a mudança real de consumo do estado, sem sugerir abandono de RxJS.

Os números de Signals foram ocultados, incluindo o fechamento, o link lateral e a duração, com os dados de origem preservados. O catálogo totaliza 67 frames, incluindo dez experiências anteriores, e Vitest ocupa os frames 38 a 41.

## Revisão local de Vitest — frames atuais 38 a 41

O prompt foi tornado concreto: “Vamos migrar de Karma e Jasmine para Vitest, preservando os cenários já cobertos.”. O plano contém três passos conferidos nas fontes: configurar Vitest no Angular com Chromium; adaptar specs, mocks e timers preservando os cenários; executar a suíte ativa e registrar o resultado. Este último passo descreve a validação da migração; não afirma que a suíte da Arena tenha sido executada durante a revisão do portfólio.

A demonstração usa o commit `69bf27aa59ee2370595eb116913c46eaa6f395e0`, cujo recorte foi confirmado como 197 specs em 206 arquivos. O antes/depois mostra `spyOn(component.changeMainLeague, 'emit')` convertido em `vi.spyOn(component.changeMainLeague, 'emit').mockImplementation(() => undefined)` e o matcher `toBeFalse()` convertido em `toBe(false)`. São mudanças verificadas no histórico, não exemplos genéricos ou resultados simulados de uma execução atual.

O fechamento mantém três commits, 6.533 adições e 6.901 remoções do recorte do PR #925, sem link para o PR. Esses totais têm um escopo distinto dos 197 specs e 206 arquivos do commit isolado. O principal conferiu código e números em 1280 × 800 e 390 × 844: legíveis e sem sobreposição. As verificações consolidadas de build/SSR abaixo incluem essas alterações.

André pediu a retirada de “Evoluir também é cuidar...”. A frase antiga já havia sido substituída por “O runner muda. O cenário permanece.”; o principal removeu o parágrafo de legenda inteiro, exclusivamente no caso `tests` de `engineering-insight.html`. Abaixo do quadro permanece somente a referência de commit e arquivo. Essa remoção posterior não altera os recortes de Signals.

## GitHub e Nós — frames 42 a 47

O calendário acompanha a rolagem desde 01/01/2025 até 16/10/2026, último dia coletado. Os 624 eventos de 2025 e 1.006 de 2026 pertencem ao perfil GitHub. Não representam commits exclusivos da Arena.

O encerramento separado usa os commits de André (`andrexduarte` e `andrextradearena`) nas branches remotas da Arena, sem merges, por SHA único: **1.313 commits, 534.546 adições e 311.560 remoções**. Consulta de 17/10/2026, comparando 360 branches remotas com `git ls-remote --heads origin`. Foram excluídos commits apenas locais, stashes e 107 merges. O numstat usa detecção de renomes; linhas incluem reaplicações, lockfiles e outros arquivos textuais, não linhas únicas do produto. Recorte anual: 2025, 458/+102.757/−38.811; 2026, 855/+431.789/−272.749. Nenhum fetch ou alteração de repositório. Fonte de exibição: `arena-repository-activity.ts`.

QA anterior do calendário em 390 × 844: janeiro de 2025, passagem de ano, último dia coletado, totais visíveis, troca manual de ano e teclado. Ajustado o estado de detalhes para não preservar um dia selecionado quando a rolagem retoma no mesmo ano. A reconferência específica desse ajuste no browser e a QA estática do calendário continuam pendentes; os testes de playback passam.

A passagem para projetos pessoais foi aprovada dentro da abertura de Nós, sem um frame adicional. O cabeçalho compartilhado mostra o nome do projeto à direita do A, sem logo do Nós na apresentação nem link para o próximo projeto. A marca original aparece somente dentro da reprodução da interface do app.

Plano conferido em `C:/Users/andre/projetos/nos`: `shared/utils/acerto.ts`, `shared/utils/divisao.ts`, `app/pages/acertos.vue` e `app/components/ui/ResumoAcerto/v1/index.vue`. Stack conferida em `package.json` e `nuxt.config.ts`; novos ícones e fontes têm proveniência nos respectivos README/licença.

A escolha de tela foi a página inicial do Nós. Fontes da reconstrução: `app/pages/index.vue`, `app/layouts/app.vue`, `app/components/ui/EquilibrioAcordo/v2/index.vue`, `Acerto/v1`, `AppBar.vue`, `BottomNav.vue`, `Lente/v1`, `app/composables/useGruposDoCiclo.ts` e os tokens em `app/assets/scss/_temas.scss`/`_variables.scss`. Preservadas as cores das pessoas no arco, o vão como valor sem responsável, a hierarquia das contas, as mensagens dos estados, os ícones locais e Inter. O exemplo tem quatro contas fictícias e estado apenas local; não opera pagamentos nem grava no Nós. A navegação/lente/histórico são elementos de contexto, não uma réplica funcional de todas as rotas do aplicativo.

O antigo frame 47 de código foi ocultado após a correção explícita de André. Seu comentário sobre fidelidade e ausência de foco em responsividade era para o antigo 48. A demonstração atual (47) não estreita o app ao rolar: apenas percorre verticalmente a home. Em modo sem animação o conteúdo tem altura natural. A lista lateral usa cinco cenas do Nós e mantém seis do waka’wã, preservando os IDs estáveis.

QA da home em 1280 × 800 e 390 × 844: entrada pelo link, passagem pelas contas e retorno ao início; “Fazer minha parte” move Internet para Fechado e atualiza assumido de R$ 1.000 para R$ 1.060, com o vão de R$ 760 para R$ 700. Filtros Tudo/Vence logo conferidos. Modo estático mobile com conteúdo integral (1.337px), sem transbordamento horizontal. Captura: `../research/frame-47-nos-home-desktop.png`. Não houve comparação visual com o runtime autenticado do Nós; fidelidade nesta rodada foi conferida no código e nos assets locais.

## Verificação integrada — rodada de 17/10/2026

Trinta e quatro testes focados de navegação, timing, playback e calendário passaram na execução consolidada mais recente. A QA de Torneios 12–14 foi concluída em desktop/mobile, incluindo os três estados, rolagem reversa e a verificação de largura a 360px. A suíte completa não foi declarada executada nesta rodada, e o resultado focado não cobre sozinho as alterações posteriores.

O build consolidado `build:vercel` passou em 17/10 às 04h45 UTC sem avisos. Nove cenários SSR e o agrupador passaram depois desse build, totalizando dez testes. A reconstrução do Nós foi separada em navegação, equilíbrio e página para manter componentes e estilos dentro dos limites existentes. Logs em `../research/build-review-2026-10-17.log`, `focused-review-2026-10-17.log` e `ssr-review-2026-10-17.log`. O pacote foi preparado localmente; nenhum deploy foi executado.

QA consolidada informada pelo principal:

- Modo estático em 1280 × 660: League com três áreas em altura natural, quatro gráficos do Dashboard no DOM e links dos frames ocultos ausentes.
- Domínios e Angular em 360 × 780, sem transbordamento horizontal; altura do Angular corrigida para 560px.
- Avatar: seleção e prévia em 1280 × 800 e 390 × 844, confirmação funcionando em 390 × 844; vazamento dos cards e controles corrigidos.
- League: Feed → Ranking → Estatísticas em desktop/mobile e rolagem reversa, além da verificação estática acima.
- Dashboard: quatro gráficos no desktop; câmera sem capturar a rolagem da página; percurso até o último histograma com eixos visíveis em 390 × 844, adaptação a 360px e retorno ao início. Sem transbordamento horizontal observado. Captura em `../research/frame-18-dashboard-mobile.png`.
- Vitest: código e números legíveis em 1280 × 800 e 390 × 844, sem sobreposição.

Permanecem pendentes a conferência específica do detalhe selecionado ao retomar a rolagem do GitHub, o calendário em modo estático, as verificações específicas de movimento reduzido, Avatar estático e Avatar/League a 360px. Preservar a evidência de Torneios já concluída e repetir sua QA apenas se alterações posteriores afetarem o trecho. Não houve comparação com o runtime autenticado da Arena nem nova publicação nesta rodada.

## Publicação anterior concluída — 16/10/2026

- [PR #7](https://github.com/andrexduarte/adx/pull/7) integrado em `main`; commit da entrega: `1e46604970785f48249dedfe1d67fe1a055a33ce`.
- [Implantação de produção na Vercel](https://vercel.com/andre-duarte/andre-is-a-dev/HuLWZaSf369guoW2teVrNwfxmLEp) concluída com sucesso.
- Domínio final confirmado em 16/10/2026 às 20h09 (Brasília), com HTTP 200 e a nova narrativa presente no HTML renderizado pelo servidor.
- Chat conferido em produção no desktop (1280 × 800) e no celular (390 × 844), incluindo as três etapas e o retorno do cabeçalho após sair do encerramento. Sem transbordamento horizontal observado no celular.
- Retrato em pontilhismo, tecnologias e links conferidos no encerramento. Nenhum erro de console do site observado nessa navegação.
- Caderno e admin responderam HTTP 200; admin preservou `no-store` e `noindex, nofollow`. Fonte Sora e imagens novas responderam HTTP 200.
- Recibo técnico e capturas desta publicação: `../research/publication-2026-10-16.json` e `../research/publication-2026-10-16-*.png`.

A comparação ao vivo com a Arena autenticada continua pendente. Essa limitação de fidelidade visual não impede a publicação do estado já aprovado e deve orientar a próxima rodada de revisão.

## waka’wã — revisão do prompt, frame 49

Decisão: começar pelo problema que motivou o navegador. Texto aplicado: “Preciso conectar o que vejo na página ao código do projeto. Vamos criar um navegador de trabalho com o Codex, para investigar problemas e conferir as mudanças no mesmo lugar.” Base: objetivo e direção de PLANO-V1.md, objetivo/fluxo de AGENTE-V1.md e README.md atuais, no checkout C:/Users/andre/projetos/wakawa. É uma reconstrução do pedido, não uma citação literal do pedido original nem uma declaração de que todas as capacidades planejadas estão prontas. Alteração restrita ao prompt; título removido da abertura não foi restaurado. Revisão textual/visual local, sem repetir build ou testes para esta troca de texto. Essa primeira redação foi substituída pela motivação explicitada por André abaixo.

### Atualização aprovada — motivação e plano, frames 49 e 50

André explicitou o problema: navegador inchado, com recursos que não usa e consumo elevado de RAM. Prompt atual: “Meu navegador tem recursos que não uso e consome muita RAM. Vamos criar um navegador mais leve, focado no trabalho, com a página, o projeto e o Codex no mesmo lugar.” Trata a leveza como objetivo do pedido, sem afirmar ganho de desempenho já medido.

Plano aprovado com três passos: construir a navegação nativa com ferramentas sob demanda; conectar página e pasta do projeto ao Codex; conferir as mudanças na interface e medir memória e CPU. Fontes atuais consultadas: README.md:5–9 (C++/Win32, CEF, DevTools sob demanda, projeto/localhost e Codex iniciado ao enviar pedido); PLANO-V1.md:8,35,64,106–116 (objetivo de baixo consumo, ferramentas sob demanda e validação comparativa). Não foram executados benchmarks do navegador. Trocas de texto/lista conferidas na prévia local; sem repetir build/testes para este ajuste. Próxima revisão: frame 51 de ferramentas.


### Frame 51 — ferramentas do waka’wã

Adicionado Codex e substituído o mapa antigo pelo mesmo componente de tecnologias usado nos demais projetos, com sete nós e entrada acompanhando a rolagem. C++20, Codex, CEF, Win32, MCP, DevTools e CMake recebem ícones e descrições curtas. Codex ocupa a posição superior central. Mantidos os mapas existentes do Nós e Dashboard.

Conferência somente de leitura no projeto C:/Users/andre/projetos/wakawa: CMakeLists.txt (CXX_STANDARD 20, CEF, Windows e executável wakawa-mcp); src/main_win.cc (windows.h e ShowDevTools, linha 1374); src/codex_runner.cc:551 (app-server --stdio); tools/wakawa_mcp.cc (protocolo e ferramentas MCP). C++ e CMake usam Simple Icons; os demais ícones novos são glifos SVG ilustrativos locais, sem atribuição de marca oficial. Proveniência em public/images/technology/README.txt.

Verificação: build:vercel concluído sem avisos em 17/10/2026 às 04:59 UTC; nove cenários SSR mais agrupador, dez testes aprovados. QA visual no desktop e 390 × 844: sete ícones legíveis, sem sobreposição. Captura: ../research/frame-51-wakawa-ferramentas.png. Sem deploy e sem alteração no código do navegador. Próxima decisão: frame 52, código do waka’wã.


### Código do waka’wã oculto — antigo frame 52

Decisão de André: ocultar. Removida a cena 4 da lista de cenas visíveis, da navegação e da duração da rolagem, preservando o conteúdo de origem e os IDs das demais cenas. Ferramentas levam diretamente à demonstração, agora frame 52. Catálogo com 65 frames; ambos os projetos pessoais têm cinco cenas visíveis. Testes existentes atualizados para conferir sequência, contagem e ausência do código também no HTML SSR. Onze testes de navegação passaram; build:vercel passou sem avisos e os dez testes SSR passaram. Alteração local, sem publicação. Próxima revisão: frame-wakawa-interface.


### Frame 52 — navegador real e Codex

Decisão: reproduzir o navegador e sua integração com Codex. A demonstração antiga de Network foi substituída por três etapas conduzidas pela rolagem e também acessíveis por botões: página inicial, painel do projeto/Codex, conversa. O link lateral abre no início da demonstração. O retorno da rolagem recompõe a página inicial; seleções manuais deixam de prevalecer quando a rolagem avança.

Fontes consultadas somente para leitura em C:/Users/andre/projetos/wakawa: app/home.html e home.css (textos, compositor, pasta, acauã e cores); app/workbench.html e workbench.css (cabeçalho COM CODEX, projeto/página ativa, ferramentas, mensagens e compositor); src/main_win.cc (paleta nativa, barras e MeasureDock, painel ocupando a área da página em janela estreita). Marca original copiada de design/assets/wakawa-acaua.png, proveniência registrada em public/images/projects/README.txt. O projeto de exemplo é C:\projetos\wakawa; conversa ilustrativa aponta app/home.html e os seletores .composer/.composer textarea de app/home.css, que existem na fonte. Nenhuma chamada real ao Codex, nenhuma credencial ou dado de conta usados. Controles nativos sem ação no portfólio são apresentados como contexto visual; somente os controles da demonstração operam localmente.

Limite de fidelidade: browser_list_windows do conector waka’wã retornou lista vazia. Reconstrução conferida contra o código e os assets atuais, sem comparação com uma janela nativa em execução. Não se afirma ganho de RAM medido.

QA no desktop e 390 × 844: página inicial, abertura do painel, conversa legível, avanço e retorno por rolagem e seleção manual. Painel ocupa a área da página no recorte estreito, preservando o comportamento nativo. Ajustado o rótulo da cena para não sobrepor as abas. Captura: ../research/frame-52-wakawa-codex.png. Build:vercel concluído sem avisos em 17/10/2026 às 05:07 UTC; onze testes de navegação e dez testes SSR aprovados. Asserções SSR conferem o painel Codex e a retirada da antiga resposta de rede. Nenhuma publicação nesta rodada. Próxima revisão: frame 53, experiência Evavip.com.


### Experiências anteriores — agenda com um evento por frame

André aprovou aplicar a todas as experiências o formato de agenda inspirado no calendário do iPhone. Atualizados timeline.html e timeline.scss: conjunto centralizado com ano em destaque, separador discreto e bloco compacto de evento com faixa vermelha, empresa, cargo/resumo e período. Sem grade mensal, dias inventados ou campos novos. Espaçamentos entre textos reduzidos (6–9px), tipografia da empresa menor e em sans-serif, nomes longos quebram dentro do evento. Preservados conteúdo cadastrado, ordem, links, tempo de rolagem e xilogravura entre períodos. São nove eventos de carreira e uma pausa de imagem, mantendo os dez capítulos e 65 frames totais.

Verificação visual: desktop com Evavip.com e troca por rolagem para Plural Systems; 390 × 844 com Webroom Soluções Interativas sem corte ou sobreposição. Modo sem animação mostra os eventos em lista compacta, com retorno ao modo animado. Captura: ../research/experiencias-agenda-desktop.png. Build:vercel passou sem avisos às 05:19 UTC de 17/10/2026; dez testes SSR passaram, incluindo presença dos capítulos da carreira. Alteração local, sem deploy. Layout aplicado a todos; revisão do conteúdo pode continuar pelo frame 54, Plural Systems.


### Correção da referência visual e dos frames removidos

André esclareceu que a referência era um seletor com vários itens visíveis e o item central maior. A animação foi aprovada; a primeira aparência de agenda/cartões foi rejeitada. Versão atual: lista tipográfica centralizada, títulos serifados, ano discreto em vermelho, resumo e período próximos, sem caixas, bordas laterais ou ícones de calendário. A experiência central cresce; vizinhas permanecem menores e esmaecidas acima e abaixo. Deslocamento contínuo e reversível; passos visuais de 150px e rolagem de 85svh por experiência. Sem animação, o conteúdo permanece como lista.

Correção explícita de André: retirar “O começo”, de 2008, e não a abertura do pontilhismo. A alteração transitória no encerramento foi integralmente revertida: pontos soltos → formação do retrato → subida → título, tecnologias e links; duração original de 360svh, marcos de playback, controles e três links laterais restaurados. Mantida a retirada da xilogravura intermediária. Oito experiências e três etapas de encerramento; catálogo total de 63 frames. Assets e entradas de origem preservados, sem apagar conteúdo remoto.

Plural Systems (frame 54): destaque aprovado “AngularJS, React e React Native.”, mantendo maio de 2022 a março de 2023. Texto aplicado na apresentação local por slug, para prevalecer sobre o título antigo retornado pelo conteúdo remoto; seed.ts e moments.ts alinhados. Nenhuma alteração no banco remoto ou publicação.

Verificação: 18 testes focados de navegação, timeline e pontilhismo passaram; build:vercel passou sem avisos às 05:25 UTC e dez testes SSR passaram. QA visual desktop e 390 × 844: três experiências visíveis, destaque central, rolagem para frente e reversa, nomes longos de Commquest/Webroom sem sobreposição; pontilhismo restaurado com pontos soltos e indicação “Role para reunir os pontos”. Captura atual: ../research/experiencias-seletor-tipografico.png. As capturas anteriores de cartões são versões superadas. Próximo conteúdo a revisar: Freelancer, frame 55; antes disso André pode avaliar o novo visual.


### Indicadores inferiores das experiências

Removida, a pedido de André, a barra horizontal de indicadores abaixo das experiências. Excluídos o nav local e seus estilos; preservados a rolagem do seletor, os links laterais e o botão de modo sem animação. Alteração restrita à apresentação, sem repetir build ou testes.

### Título das experiências e fechamento com xilogravura

Título persistente alterado para “Experiência profissional”. André escolheu combinar a frase com a xilogravura: no final da experiência Webroom (2009), o texto sobe discretamente e aparece a ilustração com a placa “Will code HTML for food”, seguida de “Desde quando a web era mato.”. O fechamento ocupa o trecho final da mesma experiência, sem acrescentar frame; catálogo preservado com 63 etapas. Rolagem reversa desfaz a entrada, e o modo sem animação exibe a ilustração no fluxo da página. Nenhuma alteração nas etapas de pontilhismo.

Ilustração criada com a ferramenta integrada imagegen, usando o meme fornecido como referência de composição. Original preservado em C:/Users/andre/.codex/generated_images/01a13b86-82e6-7291-8392-8190f1c7629e/exec-0128feb2-a6d5-4053-a049-4e01810ad986.png. Asset publicado localmente em public/images/work/html-for-food-xilogravura.webp: 600 × 600, transparência preservada, 122.128 bytes. Prompt e proveniência em public/images/work/html-for-food.prompt.txt.

Verificação: desktop e 390 × 844, entrada e retorno por rolagem, modo sem animação e imagem HTTP 200. Captura: ../research/experiencias-html-for-food.png. Build:vercel passou sem avisos às 05:33 UTC de 17/10/2026; dez testes SSR passaram, incluindo título, frase e entrega WebP. Alterações locais, sem deploy nesta rodada. Próximo passo: avaliar o fechamento e continuar a revisão do conteúdo pelo frame 55, Freelancer.

### Links finais — contato

Removidos “Escrever” e “RSS” da navegação final e adicionado WhatsApp para o número informado por André: https://wa.me/5531992930696. Instagram confirmado como @andrexduarte e incluído com destino https://www.instagram.com/andrexduarte/. Demais links preservados. HTML servido pela prévia local e disposição dos links no encerramento em 390 × 844 conferidos. Sem repetir build ou testes para essa alteração de links; sem deploy.

### Experiências — título no cabeçalho à direita

“Experiência profissional” e contador passam a ocupar o lado direito do cabeçalho, alinhados à logo de André na mesma linha, seguindo os projetos. O contexto do cabeçalho acompanha a entrada e saída da seção, inclusive no modo sem animação, e é limpo ao desmontar a timeline. Título semântico mantido na seção, sem duplicação visual enquanto está no cabeçalho. Conferência na prévia local: desktop, 390 × 844, troca do waka’wã para experiências e encerramento com cabeçalho oculto. Captura: ../research/experiencias-titulo-direita.png. Sem nova execução de build ou testes; sem deploy.

### Abertura — recorte do braço com martelo

Correção do recorte SVG do trabalhador rigger: o martelo girava para fora da célula 512 × 512, cujo overflow estava oculto; o recorte do braço também retirava toda a junção com o ombro. O corpo agora tem um clip próprio limitado à célula do atlas, enquanto o braço pode ultrapassar seu limite superior. A máscara preserva uma sobreposição no ombro e o pivô foi reposicionado para 260/137, com giro reduzido de −10°/+5° para −7°/+3°.

Conferência na prévia local em desktop e 390 × 844, com preservação da transformação da interface por rolagem. Estilos computados confirmam que apenas hammer-arm possui animação; demais corpos continuam estáticos. Captura: ../research/hero-martelo-corrigido.png. Sem alteração nos WebPs de origem, sem repetir build/testes e sem deploy nesta correção visual.

### Trade Arena como primeira experiência

Adicionada a experiência atual antes da Evavip: “Trade Arena”, “Front-end developer · experimentando IA” e “Desde o verão de 2025 — atual”. O nome leva à abertura detalhada da Arena. Reutilizada a entrada publicada de 2025 com os textos aprovados na apresentação local, sem alteração no banco remoto. Âncora própria momento-trade-arena e títulos internos das experiências separados da seção original, preservando momento-2025 sem IDs duplicados.

Nove experiências, 64 frames; Trade Arena é o frame 53 da navegação. Grupo lateral renomeado para “Experiência profissional”. Contador, rolagem e fechamento com xilogravura continuam derivados da quantidade de itens.

Verificação: 15 testes focados de navegação/timeline aprovados; build:vercel sem avisos às 05:46 UTC e dez testes SSR aprovados. A primeira execução SSR encontrou uma asserção antiga que proibia WhatsApp em toda a página: ajustada para manter a ausência no cabeçalho e conferir WhatsApp/Instagram no rodapé, conforme as decisões recentes. Desktop e 390 × 844 conferidos, inclusive o link de retorno à Arena. Captura: ../research/experiencias-trade-arena.png. Sem deploy.


### Preparação da publicação — checks do Vitest recuperados

André identificou a retirada da matriz animada como regressão. Recuperados os 48 indicadores decorativos, que se preenchem conforme a rolagem e retornam ao voltar, mantendo ao lado o antes/depois real de Jasmine para Vitest. No celular, a matriz fica ao lado das métricas e o código abaixo. A frase descartada não foi restaurada. Componente isolado para preservar o limite de CSS existente. Conferência local desktop/mobile e rolagem reversa: 48 checks ao concluir e 22 no recuo conferido. A publicação autorizada abrange esta correção e toda a revisão aprovada.
