# André Duarte

Site pessoal em Angular 22, TypeScript e SCSS, com renderização no servidor, conteúdo no Supabase e hospedagem na Vercel.

- Apresentação e trajetória profissional na home.
- Xilogravura em camadas: trabalhadores reorganizam uma interface desktop em mobile durante a rolagem. Movimento reduzido mantém a composição estática.
- Caderno com artigos, RSS, sitemap e metadados.
- Editor privado com login, publicações, rascunhos e imagens.

[Site](https://andre.is-a.dev/) · [Endereço Vercel](https://andre-is-a-dev.vercel.app/) · [Editor](https://andre.is-a.dev/admin)

## Desenvolvimento

Use Node.js 22. Copie `.env.example` para `.env` e preencha a URL do Supabase e sua chave pública `sb_publishable_`.

```sh
npm ci
npm start
```

O Angular acompanha as alterações em `http://127.0.0.1:4301/`. Para executar a versão compilada:

```sh
npm run build
npm run preview
```

O servidor usa `PORT`, com padrão 4000. Sem configuração do Supabase, o desenvolvimento local utiliza conteúdo inicial e rascunhos no navegador; o build na Vercel exige a conexão configurada.

## Organização

`src/app/features` reúne home, trajetória, caderno e administração. Cada componente mantém TypeScript, HTML e SCSS juntos. `core/content` concentra modelos, acesso ao Supabase e estado; `layout` contém cabeçalho e rodapé; `shared` contém elementos reutilizados. O template ativo da home é `src/app/features/home/home.html`.

O topo usa `features/home/interface-workshop` e os atlas de `public/images/workshop`. A imagem original do cerrado continua em largura total no meio da trajetória. A assinatura se recolhe para o monograma `A.` durante a rolagem.

## Conteúdo e acesso

O projeto Supabase dedicado é `andre-is-a-dev`, na região São Paulo. As seis migrações de `supabase/migrations` foram aplicadas na ordem dos nomes: 24 registros iniciais, dos quais 20 públicos e quatro arquivados. As antigas coleções e o registro da seção Vida permanecem disponíveis ao proprietário no editor.

Depois da conexão, o banco é a fonte do conteúdo público. A hidratação reutiliza o resultado do servidor. Falhas de leitura retornam HTTP 503; conteúdo arquivado não reaparece a partir do conteúdo inicial.

O cadastro público está desabilitado. Ter uma conta Auth não concede permissão de edição: apenas usuários cadastrados em `public.editors` podem escrever. RLS protege conteúdo, rascunhos e imagens. O navegador não consegue conceder acesso a si mesmo.

`content` guarda as publicações; `editor_drafts` guarda revisões privadas. Alterações conferem a versão do registro para evitar sobrescritas entre dispositivos. Arquivar retira o conteúdo do site e o preserva no editor.

O bucket `editor-media` é privado e usa URLs temporárias. `site-media` recebe imagens destinadas à publicação. Ambos aceitam JPG, PNG e WebP de até 5 MB. Imagens sem uso não são apagadas automaticamente. Rascunhos também são salvos no navegador e podem ser exportados com suas imagens.

A configuração enviada ao cliente contém apenas a URL e a chave pública. Nunca configure `service_role` ou `sb_secret_` no frontend. Ambientes, importações privadas e temporários ficam fora do Git e do upload.

## Publicação

O projeto Vercel usa Node.js 22, preset Other, instalação `npm ci`, build `npm run build:vercel` e saída `.vercel/output`.

Configure `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` em Production, Preview e Development. O script recusa uma chave secreta ou uma configuração incompleta. O empacotamento mantém os HTML de entrada fora da CDN para que a home passe pelo SSR.

O domínio usa os registros fornecidos pela Vercel, aprovados no [PR do is-a.dev](https://github.com/is-a-dev/register/pull/56611). Endereços alternativos recebem `noindex, nofollow`; `/admin` usa cache privado e não é indexado.

Consulte [PUBLICATION.md](PUBLICATION.md) para os recursos de produção e o procedimento de implantação.

## Verificação

```sh
npm test
npm run build:vercel
npm run test:ssr
```

Em 14/10/2026: 20 testes aprovados, build sem avisos e sete cenários SSR aprovados. A API real do Supabase foi verificada para login, permissões de visitante e editor, revisão de rascunhos, upload privado, publicação e arquivamento. O login também foi verificado no navegador com uma conta temporária, removida ao concluir. Lint não foi executado.

`supabase/verify.sql` contém consultas de conferência de políticas, permissões e buckets. `verification.json` preserva a evidência por etapa.

## Importação de conteúdo

Os artigos iniciais vieram do RSS público do autor e preservam o endereço canônico no Medium. `content/medium-map.json` organiza a classificação por identificador. Não regenere uma migração já aplicada: alterações posteriores devem usar uma nova migração.

Importações de Facebook e Instagram permanecem locais para revisão de autoria, visibilidade e data. Não são publicadas automaticamente nem incluídas no pacote.
