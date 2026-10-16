# Progresso da revisão do site pessoal

Atualizado em 16 de outubro de 2026. Esta tarefa transforma a home em uma narrativa visual controlada pela rolagem. A versão atual está publicada em [andre.is-a.dev](https://andre.is-a.dev/); a revisão individual está concluída até o frame 07. O próximo ponto de decisão é o frame 08.

## Direção aprovada

- Poucos elementos por tela, menos texto e destaque para o trabalho atual.
- Preservar a xilogravura dos trabalhadores no topo e a identidade em preto, vermelho e papel claro. Apenas o braço do martelo permanece animado.
- Mostrar o processo junto ao resultado: prompt, plano, ferramentas, arquivos, código e interface. Os exemplos devem corresponder ao projeto real.
- Revisar um frame por vez com André antes de mudar o seguinte. Usar os links da navegação lateral para localizar cada trecho.
- O Caderno permanece separado da home. O SSR continua funcionando; sua remoção não é necessária para esta entrega.

## Revisão por frame

| Frame | Estado atual | Decisão incorporada |
| --- | --- | --- |
| [01 — Abertura](https://andre.is-a.dev/#frame-abertura) | Revisado | Logo de André à esquerda; sem links de trajetória, Caderno ou WhatsApp no cabeçalho. Trabalhador `fitter` removido da cena. |
| [02 — Trade Arena](https://andre.is-a.dev/#frame-trade-arena) | Revisado | Progresso no topo. Logo da Arena transita para a direita do cabeçalho, junto ao contexto `TRADE ARENA / task: chat`. Removidos os textos de abertura excedentes, o link para Nós e `stage-bottom`. |
| [03 — Prompt](https://andre.is-a.dev/#frame-chat-ideia) | Revisado | Campo inspirado no print do ChatGPT Work/Codex, cores neutras, Work selecionado, projeto e worktree da task. Prompt digitado conforme a rolagem. |
| [04 — Plano](https://andre.is-a.dev/#frame-chat-plano) | Revisado | Quatro passos apresentados como resposta do Codex, no mesmo ambiente do prompt. |
| [05 — Ferramentas](https://andre.is-a.dev/#frame-chat-ferramentas) | Aprovado sem mudanças | Preservar o diagrama de Angular, TypeScript, WebSocket, RxJS, SCSS e STOMP, inclusive seu ritmo. |
| [06 — Construção](https://andre.is-a.dev/#frame-chat-codigo) | Revisado | Preservado o editor com árvore de arquivos. Trechos reais de conexão e envio em `chat.component.ts`, com caminhos e números de linha correspondentes ao código consultado. |
| [07 — Interface](https://andre.is-a.dev/#frame-chat-interface) | Revisado | Visual baseado no HTML/SCSS real e no print fornecido: Sora, cores, avatar do canal, balões, horários e campo de envio. Três etapas: enviar, receber sem duplicar e adaptar o layout. Rolagem aproximadamente 55% menor que a versão anterior à revisão, preservando o ritmo dos demais frames. Exemplo com `any` substituído pela atualização por ID. Título final: “O chat se adapta.” CSS selecionado mostra quebra de texto e rolagem. |
| [08 — Números do chat](https://andre.is-a.dev/#frame-chat-numeros) | Aguardando decisão | Mantido como está. A pergunta pendente oferece manter os números com passagem mais curta, manter a tela atual ou ocultar este frame. |

Os números do frame 08 são um recorte de dois commits da entrada do chat nas páginas de torneio: 230 adições e 104 remoções. Não representam toda a construção do chat.

## O que já está implementado depois do chat

- Dez exemplos da Trade Arena: chat, Torneios, Dashboard, monitor flutuante, avatares, League, organização por domínios, evolução do Angular, fluxo de acompanhamento com o backend e migração de testes. Há também um trecho sobre Signals e os calendários de atividade do GitHub.
- O fluxo de ClickUp representa relatar e acompanhar problemas; não deve sugerir uma integração automática inexistente.
- Projetos Nós e waka’wã após a Arena, com mudança de ambiente visual. Nós usa o nome, sem sua logo.
- Experiências anteriores centralizadas, com uma experiência por tela durante a rolagem.
- Encerramento em pontilhismo: os pontos formam o retrato, ele sobe, o cabeçalho desaparece e entram cargo, tecnologias e links. Codex aparece primeiro nas tecnologias; Supabase também está incluído.

Esses trechos estão implementados, mas ainda não passaram por esta rodada de revisão individual. Preservar o que existe enquanto as decisões forem sendo tomadas.

## Próximos passos

1. Retomar pela resposta pendente do frame 08, sem presumir uma escolha.
2. Revisar Torneios por etapas: prompt, plano, ferramentas, estrutura, código, estados dos componentes e números.
3. Seguir com Dashboard, monitor, avatar, League e os demais exemplos da Arena, perguntando sobre cada frame e reduzindo passagens redundantes.
4. Conferir a fidelidade das interfaces contra o código, os prints e, quando disponível, a aplicação autenticada ou o Figma. Pedir uma referência específica quando faltar informação visual; não inventar estados ou resultados.
5. Revisar Nós, waka’wã, experiências anteriores e encerramento, mantendo a ideia do pontilhismo.
6. Fazer a verificação final de navegação por links, rolagem reversa, desktop, celular, movimento reduzido, build e SSR antes da próxima publicação.

## Referências e arquivos principais

- `src/app/features/home/frame-navigation/frame-catalog.ts`: identidade e posição dos links de todos os frames.
- `src/app/features/home/arena-story/story-timing.ts`: duração das cenas, números e preservação do ritmo da rolagem.
- `src/app/features/home/arena-story/chat-playback.ts`: sequência determinística do chat e trechos de código exibidos.
- `src/app/features/home/arena-story/chat-preview.*`: reconstrução da interface do chat.
- `src/app/features/home/arena-story/work-evidence.ts`: escopo e fontes dos números apresentados.
- Referência Arena: `arena-app-front-end/src/app/chat/v1/`, `utils/services/web-socket/` e `utils/components/chat-input/`.
- `PUBLICATION.md`: configuração e procedimento de produção.

As mensagens do chat são demonstrativas. A reconstrução usa referências reais de interface e comportamento, sem abrir uma conexão com o backend da Arena.

## Verificação desta revisão

- Build de produção local sem avisos.
- Suíte completa aprovada: 44 testes, incluindo chat, tempos de rolagem e navegação.
- Nove cenários SSR aprovados, além do agrupador.
- Frame 07 conferido em 1280 × 800, 390 × 844 e 360 × 780. Transição para o layout compacto e visibilidade da mensagem mais recente verificadas.
- Evidências visuais locais preservadas em `research`, fora dos recursos públicos do site.

## Publicação concluída

- [PR #7](https://github.com/andrexduarte/adx/pull/7) integrado em `main`; commit da entrega: `1e46604970785f48249dedfe1d67fe1a055a33ce`.
- [Implantação de produção na Vercel](https://vercel.com/andre-duarte/andre-is-a-dev/HuLWZaSf369guoW2teVrNwfxmLEp) concluída com sucesso.
- Domínio final confirmado em 16/10/2026 às 20h09 (Brasília), com HTTP 200 e a nova narrativa presente no HTML renderizado pelo servidor.
- Chat conferido em produção no desktop (1280 × 800) e no celular (390 × 844), incluindo as três etapas e o retorno do cabeçalho após sair do encerramento. Sem transbordamento horizontal observado no celular.
- Retrato em pontilhismo, tecnologias e links conferidos no encerramento. Nenhum erro de console do site observado nessa navegação.
- Caderno e admin responderam HTTP 200; admin preservou `no-store` e `noindex, nofollow`. Fonte Sora e imagens novas responderam HTTP 200.
- Recibo técnico e capturas desta publicação: `../research/publication-2026-10-16.json` e `../research/publication-2026-10-16-*.png`.

A comparação ao vivo com a Arena autenticada continua pendente. Essa limitação de fidelidade visual não impede a publicação do estado já aprovado e deve orientar a próxima rodada de revisão.
