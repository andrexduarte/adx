import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const owner = '11111111-1111-4111-a111-111111111111';
const outsider = '22222222-2222-4222-a222-222222222222';

test('prepared migrations enforce public, authenticated visitor and editor access in isolated PostgreSQL', async (t) => {
  const db = new PGlite();
  try {
    // Only the platform schemas are fixtures. The site's tables, grants and RLS
    // below are loaded from the actual migrations, not duplicated in this test.
    await db.exec(`create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema public, auth, storage to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects (id bigint generated always as identity, bucket_id text references storage.buckets(id), name text);
      alter table storage.objects enable row level security;
      grant select, insert, update, delete on storage.objects to anon, authenticated;
      grant usage on sequence storage.objects_id_seq to anon, authenticated;
      insert into auth.users values ('${owner}'), ('${outsider}');`);
    for (const file of readdirSync('supabase/migrations')
      .filter((f) => f.endsWith('.sql'))
      .sort())
      await db.exec(readFileSync('supabase/migrations/' + file, 'utf8'));
    await db.query('insert into public.editors (id) values ($1)', [owner]);
    const asRole = async (role, id, work) => {
      await db.exec('set role ' + role);
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id || '']);
      try {
        return await work();
      } finally {
        await db.exec('reset role');
      }
    };
    const count = async (table) =>
      Number((await db.query('select count(*) as n from ' + table)).rows[0].n);
    await t.test(
      'anonymous readers see active content and cannot access retired sections, drafts or editor access',
      async () => {
        await asRole('anon', null, async () => {
          assert.equal(await count('public.content'), 20);
          assert.equal(
            (await db.query("select id from public.content where kind = 'story' or slug = 'agora'"))
              .rows.length,
            0,
          );
          await assert.rejects(db.query('select * from public.editor_drafts'));
          await assert.rejects(db.query('select * from public.editors'));
          await assert.rejects(db.query("update public.content set title = 'Visitor edit'"));
          await assert.rejects(db.query('insert into public.editors values ($1)', [outsider]));
          assert.equal(await count('storage.objects'), 0);
        });
      },
    );
    await t.test('having an Auth account does not grant editor powers', async () => {
      await asRole('authenticated', outsider, async () => {
        assert.equal(await count('public.content'), 20);
        assert.equal(await count('public.editor_drafts'), 0);
        assert.equal(await count('public.editors'), 0);
        const update = await db.query(
          "update public.content set title = 'Visitor edit' returning id",
        );
        assert.equal(update.rows.length, 0);
        await assert.rejects(db.query('insert into public.editors values ($1)', [outsider]));
        await assert.rejects(
          db.query(
            "insert into storage.objects (bucket_id,name) values ('editor-media','private.png')",
          ),
        );
      });
    });
    let article;
    await t.test(
      'the editor saves a private draft without replacing a public article and can upload private images',
      async () => {
        await asRole('authenticated', owner, async () => {
          assert.equal(await count('public.editors'), 1);
          assert.equal(await count('public.content'), 24);
          article = (await db.query("select * from public.content where slug = 'penar'")).rows[0];
          await db.query(
            `insert into public.editor_drafts (id,slug,kind,title,category,body_html,base_revision)
          values ($1,$2,'article','Private revision','Vida','Private text',$3)`,
            [article.id, article.slug, article.updated_at],
          );
          assert.equal(
            (await db.query('select title from public.content where id = $1', [article.id])).rows[0]
              .title,
            'Penar',
          );
          await db.query(
            "insert into storage.objects (bucket_id,name) values ('editor-media','private.png'),('site-media','public.png')",
          );
          assert.equal(
            (
              await db.query(
                "select count(*) as n from storage.objects where bucket_id = 'editor-media'",
              )
            ).rows[0].n,
            1,
          );
        });
        await asRole('authenticated', outsider, async () => {
          assert.equal(await count('public.editor_drafts'), 0);
          assert.equal(await count('storage.objects'), 0);
        });
      },
    );
    await t.test(
      'archived content disappears for readers and remains editable by the owner',
      async () => {
        await asRole('authenticated', owner, async () => {
          await db.query("update public.content set status = 'archived' where id = $1", [
            article.id,
          ]);
          assert.equal(await count('public.content'), 24);
        });
        await asRole('anon', null, async () => {
          assert.equal(await count('public.content'), 19);
          assert.equal(
            (await db.query('select * from public.content where id = $1', [article.id])).rows
              .length,
            0,
          );
        });
        await asRole('authenticated', owner, async () => {
          const stale = await db.query(
            "update public.content set title = 'Stale device' where id = $1 and updated_at = $2 returning id",
            [article.id, article.updated_at],
          );
          assert.equal(stale.rows.length, 0);
          await db.query("update public.content set status = 'published' where id = $1", [
            article.id,
          ]);
        });
        await asRole('anon', null, async () => assert.equal(await count('public.content'), 20));
      },
    );
    await t.test(
      'draft images use a private bucket and cannot be listed by anonymous readers',
      async () => {
        assert.equal(
          (await db.query("select public from storage.buckets where id = 'editor-media'")).rows[0]
            .public,
          false,
        );
        await asRole('anon', null, async () => assert.equal(await count('storage.objects'), 0));
      },
    );
  } finally {
    await db.close();
  }
});
