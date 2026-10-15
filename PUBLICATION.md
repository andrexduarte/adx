# Publicação de andre.is-a.dev

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
