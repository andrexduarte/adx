# Publicação de andre.is-a.dev

## Revisão de 17/10/2026 — preparada para publicação

A revisão reúne 64 frames, demonstrações conferidas no código da Arena, páginas reconstruídas de Nós e waka’wã, nove experiências profissionais e links finais de WhatsApp/Instagram. A matriz de checks do Vitest foi recuperada junto do antes/depois real. O retrato em pontilhismo permanece no encerramento.

Validação: suíte completa com 64 testes, build de produção e nove cenários SSR mais agrupador. A comparação autenticada ao vivo com a Arena continua pendente nos exemplos indicados em TASK_PROGRESS.md. A confirmação de PR, implantação e domínio será registrada após a publicação.

## Revisão de 16/10/2026

A versão publicada pelo [PR #7](https://github.com/andrexduarte/adx/pull/7), commit `1e46604970785f48249dedfe1d67fe1a055a33ce`, acrescenta a narrativa por frames, os exemplos da Trade Arena, Nós e waka’wã, a trajetória por telas e o encerramento em pontilhismo. A revisão individual está concluída até o frame 07; o frame 08 aguarda uma decisão. [TASK_PROGRESS.md](TASK_PROGRESS.md) registra o estado e a sequência de continuidade.

Validação local desta versão: 44 testes aprovados, build de produção sem avisos e nove cenários SSR aprovados, além do agrupador. A [implantação de produção](https://vercel.com/andre-duarte/andre-is-a-dev/HuLWZaSf369guoW2teVrNwfxmLEp) foi concluída e o domínio final retornou HTTP 200 com a nova narrativa em 16/10/2026 às 20h09 (Brasília). Chat e navegação foram conferidos em desktop e celular; o encerramento em pontilhismo também foi confirmado no site publicado. Banco, permissões e variáveis de ambiente não foram alterados.

## Recursos

| Recurso | Configuração |
| --- | --- |
| Repositório | `andrexduarte/adx` |
| Projeto Vercel | `andre-duarte/andre-is-a-dev` |
| URL Vercel | https://andre-is-a-dev.vercel.app/ |
| Domínio | https://andre.is-a.dev/ |
| Projeto Supabase | `andre-is-a-dev`, ref `qwhzexecvrgzcieaknwv` |
| Organização Supabase | `cgqlklpsdhsvbikdcfdk` |
| Região do banco | São Paulo, `sa-east-1` |
| Planos | Supabase Free e Vercel Hobby |

O projeto nos permanece separado. Credenciais privadas ficam fora do código e do ambiente público do site.

## Banco e editor

As seis migrações de `supabase/migrations` foram aplicadas em ordem. Há 24 registros: dez artigos, dez capítulos profissionais públicos e quatro registros arquivados, preservados para o proprietário. RLS está habilitado em `content`, `editor_drafts` e `editors`.

O usuário proprietário criou sua senha diretamente no Supabase e recebeu permissão em `public.editors`. O cadastro público está desabilitado; contas Auth sem essa permissão não podem editar. `auth.email.enable_signup` permanece habilitado para permitir login por e-mail, enquanto `auth.enable_signup = false` impede novos cadastros públicos.

`editor-media` é privado; `site-media` é público. Ambos aceitam JPG, PNG e WebP de até 5 MB. Rascunhos, imagens privadas, publicação e arquivamento foram conferidos pela API real. As contas e os dados temporários de verificação foram removidos.

Para alterações futuras, crie uma migração com `supabase migration new`, revise o projeto de destino e as migrações pendentes antes de aplicar. Não regenere a migração inicial. Execute `supabase/verify.sql` e os advisors após mudanças de permissões ou estrutura.

## Vercel

| Campo | Valor |
| --- | --- |
| Framework preset | Other |
| Node.js | 22.x |
| Install command | `npm ci` |
| Build command | `npm run build:vercel` |
| Output directory | `.vercel/output` |

`SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` estão configuradas em Production, Preview e Development. A chave do cliente começa com `sb_publishable_`. Não adicionar chaves secretas ao build.

O pacote contém uma função Node.js para SSR e recursos estáticos na CDN. Os HTML de entrada e o RSS são tratados pela função; isso evita uma home sem conteúdo renderizado e mantém o feed atualizado. `/admin` usa `no-store` e `noindex`; hosts alternativos também não são indexados.

As regras `.vercelignore` excluem ambientes, importações privadas, temporários, dependências e arquivos do editor. Implante apenas o checkout do repositório do site.

## Domínio

O [PR 56611](https://github.com/is-a-dev/register/pull/56611) foi aprovado e integrado. DNS consultado em 15/10/2026:

- CNAME de `andre.is-a.dev`: `336b420493fe2b96.vercel-dns-017.com`.
- TXT de `_vercel.andre.is-a.dev`: `vc-domain-verify=andre.is-a.dev,f45064f0fc1824d7b808`.

Esses valores foram retornados pelo projeto Vercel. A propriedade do domínio foi verificada na Vercel em 15/10/2026. HTTPS e home renderizada foram confirmados no domínio final, que permite indexação pública. O painel continua protegido por login e não é indexado.

## Evidências

Em 14/10/2026, `npm test` aprovou 20 testes; `npm run build:vercel` passou sem avisos; `npm run test:ssr` aprovou sete cenários, além do agrupador. A revisão visual abrangeu desktop e mobile; login foi conferido no navegador. Auth, RLS e Storage foram verificados contra o projeto dedicado. Lint não foi executado.

O estado da implantação e da verificação do domínio consta em `verification.json`. A publicação do código passa pelo [PR 1](https://github.com/andrexduarte/adx/pull/1).

O advisor de 15/10 apontou apenas a proteção contra senhas vazadas desabilitada. Esse recurso [exige Supabase Pro ou superior](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection); o projeto permanece no Free, com cadastro público desabilitado e permissão de edição restrita ao proprietário.
