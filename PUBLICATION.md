# Publicação de andre.is-a.dev

## Estado em 14/10/2026

- Código preparado na branch `publish/andre-site-angular` de `andrexduarte/adx`.
- Build de produção e empacotamento Vercel aprovados; 20 testes locais e sete cenários de SSR aprovados.
- Organização Supabase escolhida: `andrexduarte@gmail.com's Org`, ID `cgqlklpsdhsvbikdcfdk`. Plano Free confirmado pelo conector; apenas o projeto nos aparece na listagem atual.
- Nenhum projeto Supabase do site foi criado. O projeto nos não foi alterado.
- Nenhum deployment foi criado. Painéis e CLIs do Supabase e Vercel estão sem sessão. A consulta de custo do conector Supabase está indisponível. A Vercel recusou o fluxo temporário sem autenticação nesta tentativa.
- O domínio continua no GitHub Pages. A branch main e a publicação existente permanecem preservadas.

## 1. Banco dedicado

No [painel da organização](https://supabase.com/dashboard/org/cgqlklpsdhsvbikdcfdk), criar o projeto `andre-is-a-dev`, região São Paulo (`sa-east-1`), após conferir que a criação permanece no plano gratuito. A senha do banco deve ser definida e guardada pelo proprietário; nunca colocá-la no frontend ou no repositório.

Aplicar as cinco migrações de `supabase/migrations` na ordem dos nomes, com o conector autenticado no projeto novo. Executar `supabase/verify.sql` e conferir RLS, permissões dos papéis `anon`/`authenticated`, as 24 entradas iniciais e os buckets `site-media` (público) e `editor-media` (privado).

Criar o usuário proprietário no Auth e cadastrar apenas seu UUID em `public.editors`. Confirmar login, bloqueio de visitantes, rascunho privado com imagem, reabertura, publicação e arquivamento. Uma conta Auth sem cadastro em `editors` não pode editar.

## 2. Prévia na Vercel

Importar a branch de publicação de `andrexduarte/adx` ou usar a CLI autenticada a partir deste checkout. Configuração do projeto:

| Campo | Valor |
| --- | --- |
| Framework preset | Other |
| Node.js | 22.x |
| Install command | `npm ci` |
| Build command | `npm run build:vercel` |
| Output directory | `.vercel/output` |

Adicionar `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` aos ambientes Preview e Production. A chave pública começa com `sb_publishable_`. Não usar `service_role` ou `sb_secret_`. O build remoto falha se faltar a configuração.

Conferir a URL real da prévia: home, trajetória, imagens, artigos, RSS, sitemap, 404, redirecionamentos, login do editor e persistência. A função aceita o host informado pela variável de sistema `VERCEL_URL`; prévias recebem `noindex, nofollow`.

Arquivos `.env`, `imports`, temporários das CLIs, dependências locais e configurações do editor ficam fora do upload. Use o código deste checkout; não publique a pasta superior de pesquisa ou exportações.

## 3. Domínio

Após validar o deployment, adicionar `andre.is-a.dev` ao projeto Vercel. Usar exatamente os registros apresentados pelo painel, inclusive o TXT de verificação se solicitado. Preparar o PR no [registro is-a.dev](https://github.com/is-a-dev/register/blob/main/domains/andre.json), seguindo o [guia da Vercel](https://docs.is-a.dev/guides/vercel/).

Não substituir o DNS por um endereço genérico nem apontar para um deployment temporário. Depois do merge do registro, verificar HTTPS, domínio canônico, indexação pública, RSS, sitemap e login. A migração só está concluída depois dessas verificações.
