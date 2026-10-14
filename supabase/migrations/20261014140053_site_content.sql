-- Prepared for a dedicated personal-site project. Not applied to a remote database.
create table public.editors (
  id uuid primary key references auth.users(id) on delete cascade
);
alter table public.editors enable row level security;
revoke all on public.editors from anon, authenticated;
grant select on public.editors to authenticated;
create policy "Editor can see own access" on public.editors
  for select to authenticated using (id = (select auth.uid()));

create table public.content (
  id uuid primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null check (kind in ('article','moment','story')),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 400),
  category text not null check (category in ('Código','Vida','Roça')),
  body_html text not null default '',
  status text not null default 'published' check (status = 'published'),
  published_at timestamptz not null default now(),
  images jsonb not null default '[]'::jsonb check (jsonb_typeof(images) = 'array'),
  year text,
  place text,
  company text,
  source_url text,
  reflection text check (char_length(reflection) <= 400),
  article_slug text check (article_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  updated_at timestamptz not null default now()
);
create index content_published_order_idx on public.content (kind, published_at desc);
alter table public.content enable row level security;
revoke all on public.content from anon, authenticated;
grant select on public.content to anon, authenticated;
grant insert, update on public.content to authenticated;
create policy "Read published content" on public.content
  for select to anon, authenticated using (status = 'published');
create policy "Editors insert published content" on public.content
  for insert to authenticated with check (
    exists (select 1 from public.editors where id = (select auth.uid()))
  );
create policy "Editors update published content" on public.content
  for update to authenticated using (
    exists (select 1 from public.editors where id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.editors where id = (select auth.uid()))
  );

create table public.editor_drafts (
  id uuid primary key,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null check (kind in ('article','moment','story')),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 400),
  category text not null check (category in ('Código','Vida','Roça')),
  body_html text not null default '',
  status text not null default 'draft' check (status = 'draft'),
  published_at timestamptz not null default now(),
  images jsonb not null default '[]'::jsonb check (jsonb_typeof(images) = 'array'),
  year text,
  place text,
  company text,
  source_url text,
  reflection text check (char_length(reflection) <= 400),
  article_slug text check (article_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  updated_at timestamptz not null default now()
);
alter table public.editor_drafts enable row level security;
revoke all on public.editor_drafts from anon, authenticated;
grant select, insert, update on public.editor_drafts to authenticated;
create policy "Editors read drafts" on public.editor_drafts
  for select to authenticated using (
    exists (select 1 from public.editors where id = (select auth.uid()))
  );
create policy "Editors insert drafts" on public.editor_drafts
  for insert to authenticated with check (
    exists (select 1 from public.editors where id = (select auth.uid()))
  );
create policy "Editors update drafts" on public.editor_drafts
  for update to authenticated using (
    exists (select 1 from public.editors where id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.editors where id = (select auth.uid()))
  );

create function public.set_content_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke execute on function public.set_content_updated_at() from public, anon, authenticated;
create trigger content_updated_at before update on public.content
  for each row execute function public.set_content_updated_at();
create trigger draft_updated_at before update on public.editor_drafts
  for each row execute function public.set_content_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg','image/png','image/webp']);
create policy "Editors upload site media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'site-media' and exists (select 1 from public.editors where id = (select auth.uid()))
  );

-- Grant the owner access using the SQL editor after creating their Auth account:
-- insert into public.editors (id) values ('USER_UUID_FROM_AUTH_USERS');
-- The browser cannot assign editor access to itself.
-- site-media is public: upload only images intended for the website.

