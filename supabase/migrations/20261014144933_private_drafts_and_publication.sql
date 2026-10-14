-- Prepared locally; apply only to the dedicated personal-site database.
alter table public.content drop constraint content_status_check;
alter table public.content add constraint content_status_check check (status in ('published', 'archived'));
alter table public.editor_drafts add column base_revision timestamptz;
create policy "Editors read managed content" on public.content
  for select to authenticated using (
    exists (select 1 from public.editors where id = (select auth.uid()))
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('editor-media', 'editor-media', false, 5242880, array['image/jpeg','image/png','image/webp']);
create policy "Editors upload private draft media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'editor-media' and exists (select 1 from public.editors where id = (select auth.uid()))
  );
create policy "Editors read private draft media" on storage.objects
  for select to authenticated using (
    bucket_id = 'editor-media' and exists (select 1 from public.editors where id = (select auth.uid()))
  );
