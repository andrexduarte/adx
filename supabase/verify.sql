-- Read-only checks after applying all five migrations to the dedicated project.
select kind, count(*) from public.content group by kind order by kind;
select tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename in ('content','editor_drafts','editors')
order by tablename, cmd;
select relname, relrowsecurity from pg_class
where oid in ('public.content'::regclass, 'public.editor_drafts'::regclass, 'public.editors'::regclass);
select id, public, file_size_limit, allowed_mime_types from storage.buckets
where id in ('site-media','editor-media');
select table_name, grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('content','editor_drafts','editors')
and grantee in ('anon','authenticated') order by table_name, grantee, privilege_type;

-- These catalog checks do not validate Auth or the Storage HTTP service.
-- Complete an authenticated browser check: private draft + image, reopen on a
-- second device, publish, edit without changing the public article, then unpublish.
