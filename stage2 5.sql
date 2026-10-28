-- =====================================================================
-- ZILAX — STAGE 2.5  (Home Builder: banners, home layout, photo upload)
-- Run AFTER stage2_1.sql (it needs has_role and log_audit from stage1.sql).
-- Supabase: SQL Editor -> New query -> paste everything -> Run.
-- Safe to run again: it never deletes your banners or photos.
-- =====================================================================

-- ---------- 1. PHOTO STORAGE (public bucket, only the Super Admin can add or remove photos) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('home-media', 'home-media', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists home_media_read   on storage.objects;
drop policy if exists home_media_insert on storage.objects;
drop policy if exists home_media_delete on storage.objects;
create policy home_media_read   on storage.objects for select using (bucket_id = 'home-media');
create policy home_media_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'home-media' and public.has_role('super_admin'));
create policy home_media_delete on storage.objects for delete to authenticated
  using (bucket_id = 'home-media' and public.has_role('super_admin'));

-- ---------- 2. HOME BLOCKS (order and on/off of each part of the home page) ----------
create table if not exists public.home_blocks (
  key        text primary key check (key in ('hero', 'mosaic', 'quick', 'deliv', 'offers', 'plates', 'fashion')),
  enabled    boolean not null default true,
  sort       int not null,
  updated_at timestamptz not null default now()
);
insert into public.home_blocks (key, sort) values
  ('hero', 1), ('mosaic', 2), ('quick', 3), ('deliv', 4), ('offers', 5), ('plates', 6), ('fashion', 7)
on conflict (key) do nothing;

-- ---------- 3. BANNERS ----------
create table if not exists public.home_banners (
  id          uuid primary key default gen_random_uuid(),
  placement   text not null check (placement in ('hero', 'inline')),
  after_block text check (after_block in ('hero', 'mosaic', 'quick', 'deliv', 'offers', 'plates', 'fashion')),
  tag_en text not null default '', tag_bn text not null default '',
  title_en text not null, title_bn text not null,
  sub_en text not null default '', sub_bn text not null default '',
  badge text not null default '',
  cta_en text not null default '', cta_bn text not null default '',
  link text check (link in ('#food', '#shop', '#service', '#join', '#offers', '#activity')),
  landing boolean not null default false,
  body_en text not null default '', body_bn text not null default '',
  image_path text,
  starts_at timestamptz, ends_at timestamptz,
  daily_from time, daily_to time,
  areas uuid[],
  countdown boolean not null default false,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.home_blocks  enable row level security;
alter table public.home_banners enable row level security;
drop policy if exists home_blocks_read  on public.home_blocks;
drop policy if exists home_banners_read on public.home_banners;
create policy home_blocks_read  on public.home_blocks  for select using (true);
create policy home_banners_read on public.home_banners for select using (true);
-- No insert/update/delete policy on purpose: changes go through the functions below only.

-- ---------- 4. SECURE ACTIONS (Super Admin only, every change goes to the audit log) ----------
-- p is a json object with the banner fields (see the Home Builder screen). p_id = null creates a new banner.
create or replace function public.upsert_home_banner(p_id uuid, p jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_before jsonb; v_id uuid;
  v_place text := p ->> 'placement';
  v_after text := nullif(p ->> 'after_block', '');
  v_title_en text := btrim(coalesce(p ->> 'title_en', '')); v_title_bn text := btrim(coalesce(p ->> 'title_bn', ''));
  v_tag_en text := btrim(coalesce(p ->> 'tag_en', ''));     v_tag_bn text := btrim(coalesce(p ->> 'tag_bn', ''));
  v_sub_en text := btrim(coalesce(p ->> 'sub_en', ''));     v_sub_bn text := btrim(coalesce(p ->> 'sub_bn', ''));
  v_badge text := btrim(coalesce(p ->> 'badge', ''));
  v_cta_en text := btrim(coalesce(p ->> 'cta_en', ''));     v_cta_bn text := btrim(coalesce(p ->> 'cta_bn', ''));
  v_link text := nullif(p ->> 'link', '');
  v_landing boolean := coalesce((p ->> 'landing')::boolean, false);
  v_body_en text := btrim(coalesce(p ->> 'body_en', ''));   v_body_bn text := btrim(coalesce(p ->> 'body_bn', ''));
  v_img text := nullif(p ->> 'image_path', '');
  v_start timestamptz := nullif(p ->> 'starts_at', '')::timestamptz;
  v_end timestamptz := nullif(p ->> 'ends_at', '')::timestamptz;
  v_from time := nullif(p ->> 'daily_from', '')::time;
  v_to time := nullif(p ->> 'daily_to', '')::time;
  v_countdown boolean := coalesce((p ->> 'countdown')::boolean, false);
  v_active boolean := coalesce((p ->> 'active')::boolean, true);
  v_areas uuid[] := null;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if v_place not in ('hero', 'inline') then raise exception 'bad_value'; end if;
  if v_place = 'inline' and (v_after is null or v_after not in ('hero', 'mosaic', 'quick', 'deliv', 'offers', 'plates', 'fashion')) then raise exception 'bad_value'; end if;
  if v_place = 'hero' then v_after := null; end if;
  if char_length(v_title_en) < 1 or char_length(v_title_en) > 120 or char_length(v_title_bn) < 1 or char_length(v_title_bn) > 120 then raise exception 'bad_value'; end if;
  if char_length(v_tag_en) > 40 or char_length(v_tag_bn) > 40 or char_length(v_sub_en) > 200 or char_length(v_sub_bn) > 200
     or char_length(v_badge) > 24 or char_length(v_cta_en) > 30 or char_length(v_cta_bn) > 30
     or char_length(v_body_en) > 4000 or char_length(v_body_bn) > 4000 then raise exception 'bad_value'; end if;
  if v_link is not null and v_link not in ('#food', '#shop', '#service', '#join', '#offers', '#activity') then raise exception 'bad_value'; end if;
  if v_landing and char_length(v_body_en) + char_length(v_body_bn) = 0 then raise exception 'bad_value'; end if;
  if v_img is not null and (v_img !~ '^banners/[A-Za-z0-9_.-]+$' or char_length(v_img) > 120 or v_img like '%..%') then raise exception 'bad_value'; end if;
  if v_start is not null and v_end is not null and v_end <= v_start then raise exception 'bad_value'; end if;
  if v_countdown and v_end is null then raise exception 'bad_value'; end if;
  if (v_from is null) <> (v_to is null) then raise exception 'bad_value'; end if;
  if p ? 'areas' and jsonb_typeof(p -> 'areas') = 'array' and jsonb_array_length(p -> 'areas') > 0 then
    select array_agg(x::uuid) into v_areas from jsonb_array_elements_text(p -> 'areas') x;
    if exists (select 1 from unnest(v_areas) a where not exists (select 1 from public.areas where id = a and level = 'upazila')) then raise exception 'bad_value'; end if;
  end if;

  if p_id is null then
    insert into public.home_banners (placement, after_block, tag_en, tag_bn, title_en, title_bn, sub_en, sub_bn, badge, cta_en, cta_bn, link, landing, body_en, body_bn,
                                     image_path, starts_at, ends_at, daily_from, daily_to, areas, countdown, active, sort)
    values (v_place, v_after, v_tag_en, v_tag_bn, v_title_en, v_title_bn, v_sub_en, v_sub_bn, v_badge, v_cta_en, v_cta_bn, v_link, v_landing, v_body_en, v_body_bn,
            v_img, v_start, v_end, v_from, v_to, v_areas, v_countdown, v_active, (select coalesce(max(sort), 0) + 1 from public.home_banners))
    returning id into v_id;
    perform public.log_audit('upsert_home_banner', 'home_banners', v_id::text, null,
            jsonb_build_object('title_en', v_title_en, 'title_bn', v_title_bn, 'placement', v_place, 'active', v_active, 'starts_at', v_start, 'ends_at', v_end));
  else
    select jsonb_build_object('title_en', title_en, 'title_bn', title_bn, 'placement', placement, 'active', active, 'starts_at', starts_at, 'ends_at', ends_at)
      into v_before from public.home_banners where id = p_id;
    if v_before is null then raise exception 'not_found'; end if;
    update public.home_banners set placement = v_place, after_block = v_after, tag_en = v_tag_en, tag_bn = v_tag_bn, title_en = v_title_en, title_bn = v_title_bn,
           sub_en = v_sub_en, sub_bn = v_sub_bn, badge = v_badge, cta_en = v_cta_en, cta_bn = v_cta_bn, link = v_link, landing = v_landing, body_en = v_body_en, body_bn = v_body_bn,
           image_path = v_img, starts_at = v_start, ends_at = v_end, daily_from = v_from, daily_to = v_to, areas = v_areas, countdown = v_countdown, active = v_active, updated_at = now()
     where id = p_id;
    v_id := p_id;
    perform public.log_audit('upsert_home_banner', 'home_banners', v_id::text, v_before,
            jsonb_build_object('title_en', v_title_en, 'title_bn', v_title_bn, 'placement', v_place, 'active', v_active, 'starts_at', v_start, 'ends_at', v_end));
  end if;
  return v_id;
end;
$$;

create or replace function public.delete_home_banner(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_before jsonb;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  select jsonb_build_object('title_en', title_en, 'title_bn', title_bn, 'placement', placement, 'active', active)
    into v_before from public.home_banners where id = p_id;
  if v_before is null then raise exception 'not_found'; end if;
  delete from public.home_banners where id = p_id;
  perform public.log_audit('delete_home_banner', 'home_banners', p_id::text, v_before, null);
end;
$$;

-- p_dir = -1 moves the banner up, +1 moves it down (inside its own placement).
create or replace function public.move_home_banner(p_id uuid, p_dir int)
returns void language plpgsql security definer set search_path = public as $$
declare v_place text; v_sort int; v_other uuid; v_other_sort int; v_title text;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_dir not in (-1, 1) then raise exception 'bad_value'; end if;
  select placement, sort, title_en into v_place, v_sort, v_title from public.home_banners where id = p_id;
  if v_place is null then raise exception 'not_found'; end if;
  if p_dir = -1 then
    select id, sort into v_other, v_other_sort from public.home_banners where placement = v_place and (sort, id) < (v_sort, p_id) order by sort desc, id desc limit 1;
  else
    select id, sort into v_other, v_other_sort from public.home_banners where placement = v_place and (sort, id) > (v_sort, p_id) order by sort asc, id asc limit 1;
  end if;
  if v_other is null then return; end if;
  if v_other_sort = v_sort then
    update public.home_banners set sort = sort + (case when p_dir = 1 then 1 else -1 end) where id = p_id;
  else
    update public.home_banners set sort = v_other_sort where id = p_id;
    update public.home_banners set sort = v_sort where id = v_other;
  end if;
  perform public.log_audit('move_home_banner', 'home_banners', p_id::text, null, jsonb_build_object('title_en', v_title, 'dir', p_dir));
end;
$$;

-- p = [{"key":"hero","enabled":true}, ...]  (all 7 keys exactly once; the order of the list becomes the order on the home page)
create or replace function public.set_home_blocks(p jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_before jsonb; v_n int; v_distinct int;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if jsonb_typeof(p) is distinct from 'array' then raise exception 'bad_value'; end if;
  v_n := jsonb_array_length(p);
  select count(distinct e ->> 'key') into v_distinct from jsonb_array_elements(p) e;
  if v_n <> 7 or v_distinct <> 7 then raise exception 'bad_value'; end if;
  if exists (select 1 from jsonb_array_elements(p) e where (e ->> 'key') not in ('hero', 'mosaic', 'quick', 'deliv', 'offers', 'plates', 'fashion') or jsonb_typeof(e -> 'enabled') is distinct from 'boolean') then raise exception 'bad_value'; end if;
  select jsonb_agg(jsonb_build_object('key', key, 'enabled', enabled) order by sort) into v_before from public.home_blocks;
  insert into public.home_blocks (key, enabled, sort)
  select e.v ->> 'key', (e.v ->> 'enabled')::boolean, e.i::int
    from jsonb_array_elements(p) with ordinality as e(v, i)
  on conflict (key) do update set enabled = excluded.enabled, sort = excluded.sort, updated_at = now();
  perform public.log_audit('set_home_blocks', 'home_blocks', 'layout', jsonb_build_object('blocks', v_before), jsonb_build_object('blocks', p));
end;
$$;

revoke all on function public.upsert_home_banner(uuid, jsonb) from public, anon;
revoke all on function public.delete_home_banner(uuid) from public, anon;
revoke all on function public.move_home_banner(uuid, int) from public, anon;
revoke all on function public.set_home_blocks(jsonb) from public, anon;
grant execute on function public.upsert_home_banner(uuid, jsonb) to authenticated;
grant execute on function public.delete_home_banner(uuid) to authenticated;
grant execute on function public.move_home_banner(uuid, int) to authenticated;
grant execute on function public.set_home_blocks(jsonb) to authenticated;

-- Done.
