-- Removed sections remain available to the owner in the editor, not the public API.
update public.content
set status = 'archived'
where kind = 'story' or (kind = 'moment' and slug = 'agora');
