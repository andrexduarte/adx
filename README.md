# andre.is-a.dev

Nova versão local do site pessoal de André Duarte, em Angular 22.2.2, TypeScript e SCSS, com renderização no servidor.

## Organização do Angular

```text
src/app/
├── core/
│   ├── config/                  # Configuração pública gerada no início/build
│   ├── content/                 # Modelos, conteúdo inicial, acesso remoto e estado público
│   └── seo/                     # Metadados e URLs canônicas
├── features/
│   ├── home/                    # Página inicial
│   ├── timeline/                # Linha do tempo incorporada à home
│   ├── notebook/
│   │   └── article/             # Leitura de um texto do caderno
│   ├── stories/
│   │   └── story-viewer/        # Reprodução e navegação de uma coleção
│   ├── admin/
│   │   ├── drafts/              # Persistência local dos rascunhos
│   │   └── rich-editor/         # Editor visual usado pela administração
│   └── not-found/
├── layout/
│   ├── site-header/
│   └── site-footer/
├── shared/
│   └── wordmark/               # Assinatura reutilizada no cabeçalho e rodapé
├── app.routes.ts               # Entrada das páginas, com carregamento sob demanda
└── app.ts                      # Composição do layout e estado de conexão
```

Cada componente mantém TypeScript, HTML e SCSS juntos, com o mesmo nome-base. Componentes e estado exclusivos de uma funcionalidade permanecem dentro dela. `shared` recebe apenas elementos realmente reutilizados; `core` concentra os recursos usados por várias funcionalidades. As páginas não importam detalhes internos umas das outras. O servidor usa os mesmos modelos e conteúdo de `core/content` para RSS, sitemap e integração com o Medium.

O template ativo da página inicial é `src/app/features/home/home.html`. Uma cópia salva durante a reorganização foi preservada em `src/app/pages/home.html`, porque a limpeza desse caminho foi bloqueada pela proteção de execução. Essa cópia não é referenciada pelo Angular; edite apenas o template ativo.

Para trabalhar no VS Code, use `npm start`: o Angular sobe em `http://127.0.0.1:4301/`, observa os arquivos e atualiza a página. `npm run preview` e `scripts/preview-vercel.mjs` servem versões compiladas e não acompanham edições.

## O que funciona nesta versão

- Página inicial com uma xilogravura em camadas: cinco trabalhadores reorganizam uma interface desktop em um layout mobile conforme a página rola. A janela se estreita, os cards se empilham e a dupla carrega o botão até a nova posição. O movimento acompanha a rolagem nos dois sentidos. Madeira, molduras, ferramentas e paisagem usam peças gravadas, com textura de tinta e papel. A preferência por movimento reduzido mantém a composição estática e elimina o trecho adicional de rolagem.
- O cabeçalho apresenta a assinatura completa no topo e a recolhe para o monograma vetorial `A.` ao passar de 88 px de rolagem. O nome retorna abaixo de 32 px. A marca usa o gesto caligráfico da assinatura e o ponto vermelho; o arquivo independente está em `public/images/andre-monogram.svg`. A altura do cabeçalho e a posição da navegação permanecem estáveis. A preferência por movimento reduzido desativa as transições. O rodapé mantém a assinatura completa.
- A home reúne apresentação, trajetória e caderno. A navegação acompanha a rolagem e permite saltar entre as seções. A seleção do caderno destaca código e inclui vida e roça, usando somente artigos publicados. A antiga seção Vida e seus links saíram da home; o registro pessoal permanece no acervo do editor.
- A trajetória está na home com dez registros abertos, do trabalho atual na Trade Arena aos estudos em 2008. No desktop, ano, empresa e período ficam à esquerda; título e descrição, à direita, separados pela linha vertical. No celular, a identificação vem acima do conteúdo. A linha e a navegação indicam o período em leitura. A antiga URL `/trajetoria` redireciona para a home e preserva os fragmentos dos registros profissionais; saiu do sitemap. Oito descrições profissionais reproduzem os textos do LinkedIn, com as atividades em listas; hollo interact e datas da Lápis Raro foram conferidas no Facebook e confirmadas pelo proprietário.
- Caderno com dez textos reais importados do RSS do Medium, leitura local, busca por palavras e filtros por assunto.
- A xilogravura original do cerrado aparece após o período de freelancer, antes da 3bits, ocupando toda a largura do site (até 1440 px). A imagem mantém a proporção original, sem recorte nem legenda, e interrompe visualmente a linha do tempo. Os períodos continuam com anos em vermelho, artigos relacionados e navegação por âncoras.
- Editor Tiptap no navegador: textos e capítulos existentes; formatação, links, citações, blocos de código, imagens, prévia e salvamento automático, inclusive antes de escrever o título. As coleções antigas continuam disponíveis como arquivo no editor, sem publicação de stories.
- Rascunhos em IndexedDB, recuperação por arquivo e exportação com imagens incorporadas. Cópias importadas recebem novos identificadores para preservar os originais.
- A biblioteca do editor fica recolhida nas telas pequenas. A antiga URL `/stories` redireciona para o início e saiu do sitemap.
- Botão para consultar o Medium e trazer textos novos como rascunhos, sem substituir os textos já revisados no site.
- RSS, sitemap, metadados e SSR nas páginas públicas. O painel usa renderização no navegador, cache privado e cabeçalho que evita indexação.
- Empacotamento para a Vercel Build Output API, com uma função Node.js 22 e arquivos estáticos.

## Desenvolvimento

Use Node.js 22.23.2 ou uma versão compatível com Angular 22.

```text
npm ci
npm start
```

A prévia local abre em http://127.0.0.1:4301.

```text
npm run build
npm run preview
```

O servidor de produção usa a variável PORT, com padrão 4000.

O início do desenvolvimento e a compilação leem `.env` quando o arquivo existe. Copie `.env.example` e preencha somente as variáveis públicas indicadas. A configuração do Supabase exige URL e chave em conjunto.

## Conteúdo existente

Os textos em `content/medium-feed.json` foram obtidos do RSS público do autor em 14/10/2026. O gerador remove as imagens de rastreamento e mantém o texto original. Os artigos importados apontam para o original no Medium por meio da URL canônica.

`npm run content:generate` gera o conteúdo inicial, o feed estático de apoio e a migração de carga inicial. Os identificadores derivam do ID do artigo no Medium; a classificação em `content/medium-map.json` não depende da ordem do feed. O gerador mantém fotos reais e remove os pixels de rastreamento. Não regenere a migração de carga depois que ela for aplicada a um projeto remoto; mudanças posteriores devem usar uma nova migração.

Depois da conexão, o banco é a fonte do conteúdo público, inclusive quando uma publicação é retirada. O servidor transmite o conteúdo carregado ao navegador via TransferState; a hidratação não faz uma segunda consulta. Falhas no banco retornam HTTP 503 com opção de tentar novamente. Nessa situação, textos e capítulos iniciais não reaparecem como se ainda estivessem publicados.

A imagem original do cerrado, `public/images/cerrado-xilogravura.jpg`, permanece intacta em largura total no meio da trajetória. O topo usa o componente `features/home/interface-workshop`, com personagens e peças nos arquivos `public/images/workshop/workers-atlas.png` e `public/images/workshop/engraving-atlas.png`, gerados com ImageGen. As peças ficam em camadas de SVG; a rolagem altera suas posições e dimensões sem nova dependência de animação. Os prompts estão em `../research/workshop-animation-generation.txt`, e os arquivos foram copiados para a pasta Imagens do proprietário. A ilustração completa anterior, `public/images/construtores-web-xilogravura-transparente.png`, e a versão inicial com fundo claro também foram preservadas. Os prompts e as referências de geração estão em `../research/web-workers-generation.txt`; as duas versões foram copiadas para a pasta Imagens do proprietário. As ilustrações `cavalo-cerrado-xilogravura.png` e `andre-retrato-xilogravura.png` foram retiradas da home, mas seus arquivos continuam preservados; as fotografias de referência não aparecem como fotos na home. As fotos fornecidas e as coleções antigas foram preservadas no editor. As datas das fotos não foram presumidas. As referências de Facebook e Instagram continuam em `../research/social-references.json`, fora do conteúdo público. A exportação do Facebook foi processada localmente em `imports/facebook`, com candidatos para revisão; não entra automaticamente no site. As descrições profissionais do LinkedIn estão documentadas em `../research/linkedin-experience-review.json` (consulta de 14/10/2026). Os textos de Trade Arena, Evavip, Plural, freelancer, 3bits, Lápis Raro, Commquest e Webroom foram reproduzidos dessa fonte na home. A hollo permanece com o registro confirmado pelo proprietário. Os campos `paragraphs` e `highlights` em `moments.ts` mantêm a separação entre parágrafos e atividades para geração do conteúdo. Esta revisão foi aplicada somente ao conteúdo local; as migrações existentes não foram regeneradas.

## Supabase — preparação concluída, conexão pendente

Não foi criado nem alterado nenhum projeto remoto. O proprietário escolheu a organização `andrexduarte@gmail.com's Org` (`cgqlklpsdhsvbikdcfdk`), a mesma do nos, para um projeto dedicado ao site. O projeto nos permanece separado. A integração e a migração estão preparadas, mas login, persistência remota e políticas precisam ser verificados no novo projeto quando ele existir. A criação aguarda acesso autenticado ao painel: a consulta de custo do conector não estava disponível nesta sessão.

1. Criar um projeto dedicado e gratuito na organização escolhida pelo usuário.
2. Aplicar as cinco migrações em `supabase/migrations`, na ordem dos nomes. Elas criam as tabelas, a carga inicial, as políticas, a revisão profissional e as datas confirmadas. O resultado são 24 registros: dez artigos, onze momentos e três coleções guardadas.
3. Criar a conta do proprietário em Auth e cadastrar seu UUID na tabela `editors`, pelo painel do Supabase.
4. Configurar `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` no ambiente de compilação.
5. Executar as consultas de `supabase/verify.sql` e verificar leitura pública, bloqueio de escrita para visitantes, bloqueio de rascunhos e imagens privadas para não editores, login do proprietário, reabertura em outro dispositivo, upload e publicação.

A compilação gera somente a configuração pública. O script rejeita chaves secretas. Nunca use `service_role` no cliente.

Os rascunhos remotos ficam em `editor_drafts`, separados do conteúdo publicado em `content`. Salvar um rascunho não substitui o texto público. O navegador não pode se cadastrar como editor.

O editor preserva a data original ao revisar uma publicação. As atualizações conferem a versão da linha no banco; uma edição em outro dispositivo não é sobrescrita silenciosamente. Retirar do site arquiva o registro e mantém uma cópia local. O proprietário pode abrir um conteúdo arquivado pela biblioteca e publicá-lo novamente.

O bucket `editor-media` é privado. As imagens de rascunhos remotos usam referências internas e URLs temporárias ao abrir o editor. Elas só vão para `site-media`, público, quando o proprietário publica. Ambos aceitam JPG, PNG e WebP de até 5 MB. Imagens removidas de um texto não são apagadas automaticamente do armazenamento, para preservar versões e cópias; a limpeza de arquivos sem uso deve ser conferida no Storage.

Os rascunhos locais ficam apenas no navegador, sem limite de 40 entradas. A cópia exportada incorpora as imagens e aceita recuperação de arquivos de até 100 MB. Rascunhos privados precisam da conta conectada para exportar suas imagens; imagens de outros servidores precisam permitir leitura pelo navegador. Se a recuperação de uma imagem falhar, a exportação informa o erro em vez de entregar uma cópia incompleta.

## Hospedagem

```text
npm run build:vercel
```

O pacote é gerado em `.vercel/output`. A função SSR contém seus arquivos de servidor e browser, e a pasta static contém os recursos servidos pela CDN. O RSS é tratado pela função para incorporar publicações futuras do Supabase.

O campo `engines.node` fixa a versão principal 22 também no build da Vercel. O build remoto recusa configurações sem URL e chave pública do Supabase para impedir a publicação acidental do modo local do editor. Configure as duas variáveis nos ambientes Preview e Production antes de implantar. A chave deve começar com `sb_publishable_`.

O arquivo `.vercelignore` exclui arquivos de ambiente, exportações locais em `imports`, temporários, configurações do editor e dependências locais do upload. Esses arquivos não devem ser adicionados ao repositório de publicação. O domínio ainda aponta para `andrexduarte.github.io`; a troca de DNS deve usar os registros exatos fornecidos pelo novo projeto Vercel, depois de verificar a prévia publicada.

O domínio previsto continua sendo `andre.is-a.dev`. As prévias em outros hosts recebem `X-Robots-Tag: noindex, nofollow`. Recursos com nome versionado usam cache longo; fotos e arquivos sem versão usam cache curto.

A implantação na Vercel e a configuração do domínio ainda não foram executadas. A Vercel Hobby limita o uso gratuito a projetos pessoais não comerciais. O Supabase Free possui limites e pode pausar projetos após inatividade.

## Ainda falta

- Criar e verificar o projeto Supabase.
- Validar a implantação real no provedor e conectar o domínio.
- Incorporar a exportação de Facebook e Instagram e refinar os capítulos com datas confirmadas.
- Definir a participação no Fediring. O rodapé já aponta para o projeto; o site ainda não foi inscrito no anel.

## Facebook e Instagram

Foram localizados 13 ZIPs do Facebook em Downloads, com duas duplicatas exatas e onze partes distintas. A curação reúne 2.794 textos próprios únicos, de 2009 a 2026, e referências de mídia sem extrair os arquivos. `imports/facebook` contém o inventário, os candidatos e as evidências. Visibilidade permanece não confirmada e todo candidato requer revisão. O relatório está em `../research/facebook-export-review.md`. O conteúdo privado de `imports` é excluído do versionamento e do pacote de revisão.

`scripts/meta-candidates.mjs` continua disponível para candidatos locais a partir de JSONs extraídos da Meta. Não publica conteúdo, não lê mensagens/contatos/reações e não presume que uma exportação contenha apenas publicações públicas.

```text
node scripts/meta-candidates.mjs --facebook caminho/your_posts__1.json
node scripts/meta-candidates.mjs --instagram caminho/posts_1.json
```

Cada candidato precisa de revisão de autoria, privacidade e data. O programa corrige problemas comuns de codificação do português e não infere nascimento, mudança de cidade ou vínculo profissional a partir de uma foto.

## Fediring

O rodapé permite visitar o projeto e passear por um site aleatório do anel. A participação ainda não foi solicitada. O Fediring exige um perfil ativo no Fediverso e uma solicitação aos mantenedores; ela cria um chamado público.

`FEDIVERSE_PROFILE_URL` adiciona o perfil ao rodapé com `rel="me"`. Ative `FEDIRING_MEMBER=true` apenas depois da admissão: isso mostra os links de site anterior e próximo. Nenhuma mensagem foi enviada aos mantenedores.

## Verificação e revisão

```text
npm test
npm run build:vercel
npm run test:ssr
```

Os testes cobrem importação de conteúdo, hidratação, preparação dos arquivos da Meta e as migrações em PostgreSQL isolado via PGlite. Os schemas `auth` e `storage` da plataforma são simulados; as tabelas, permissões e políticas do site são carregadas das migrações reais. Isso não substitui a verificação de Auth e Storage no Supabase remoto.

Os testes de SSR carregam a função realmente empacotada para Vercel e conferem páginas, os dez capítulos profissionais na home e a paisagem entre os períodos, os arquivos da xilogravura dos trabalhadores, texto completo, canonical, metadados, RSS, sitemap, redirecionamentos e erros 404. Em 14/10/2026, com autorização do proprietário, o build de produção passou sem avisos, os 20 testes locais passaram e a suíte de SSR passou nas sete verificações internas. A expectativa antiga pela imagem de Acauã foi substituída pela composição atual. O build usa conteúdo inicial local; não valida a integração remota ainda pendente. Lint não foi executado. A implantação no provedor continua pendente.

Para revisar: abra a home, use o atalho para a experiência atual, percorra os capítulos na própria página, busque e filtre textos em `/caderno` e experimente `/admin`. Confira o rodapé ao final da rolagem. No editor, use a biblioteca para abrir cada capítulo; edite, veja a prévia e exporte uma cópia. A publicação está desativada enquanto a conta não estiver conectada. `verification.json` registra os resultados e limites da verificação.

## Referências

- Angular SSR: https://angular.dev/guide/ssr
- Tiptap: https://tiptap.dev/docs/editor/getting-started/overview
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Vercel Build Output API: https://vercel.com/docs/build-output-api
- Fediring: https://fediring.net/
- Medium RSS do autor: https://medium.com/feed/@andre_amaral
