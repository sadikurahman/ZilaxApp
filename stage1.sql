-- =====================================================================
-- ZILAX — STAGE 1 DATABASE  (accounts, partner applications, approvals)
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- It is safe to run again (it will not delete data).
-- =====================================================================

-- ---------- 1. AREAS (district -> upazila -> union / paurashava) ----------
create table if not exists public.areas (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid references public.areas(id) on delete cascade,
  level      text not null check (level in ('district','upazila','union')),
  kind       text,
  name_en    text not null,
  name_bn    text not null,
  active     boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);
create unique index if not exists areas_unique_name
  on public.areas (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), name_en);

insert into public.areas (level, kind, name_en, name_bn, sort)
select 'district', 'district', 'Jamalpur', 'জামালপুর', 1
where not exists (select 1 from public.areas where level = 'district' and name_en = 'Jamalpur');

insert into public.areas (parent_id, level, kind, name_en, name_bn, sort)
select d.id, 'upazila', 'upazila', v.en, v.bn, v.s
from public.areas d,
     (values ('Islampur', 'ইসলামপুর', 1), ('Dewangonj', 'দেওয়ানগঞ্জ', 2)) as v(en, bn, s)
where d.level = 'district' and d.name_en = 'Jamalpur'
  and not exists (select 1 from public.areas a where a.parent_id = d.id and a.name_en = v.en);

insert into public.areas (parent_id, level, kind, name_en, name_bn, sort)
select u.id, 'union', 'paurashava', v.en, v.bn, 0
from public.areas u
join (values ('Islampur', 'Islampur Paurashava', 'ইসলামপুর পৌরসভা'),
             ('Dewangonj', 'Dewangonj Paurashava', 'দেওয়ানগঞ্জ পৌরসভা')) as v(up, en, bn)
  on u.name_en = v.up and u.level = 'upazila'
where not exists (select 1 from public.areas a where a.parent_id = u.id and a.name_en = v.en);

-- ---------- 2. PROFILES (one per login) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  phone      text not null unique,
  full_name  text not null default '',
  upazila_id uuid references public.areas(id),
  union_id   uuid references public.areas(id),
  address    text not null default '',
  lat        double precision,
  lng        double precision,
  lang       text not null default 'bn',
  status     text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 3. ROLES (one person can hold several) ----------
create table if not exists public.user_roles (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null check (role in (
               'customer','merchant_food','merchant_shop','rider','technician',
               'car_partner','decoration','sound_light','sales_admin','admin','super_admin')),
  status     text not null default 'pending' check (status in ('pending','active','rejected','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- ---------- 4. PARTNER APPLICATIONS + DOCUMENTS ----------
create table if not exists public.partner_applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  category      text not null check (category in (
                  'merchant_food','merchant_shop','rider','technician',
                  'car_partner','decoration','sound_light')),
  business_name text not null,
  owner_name    text not null,
  phone         text not null,
  upazila_id    uuid references public.areas(id),
  union_id      uuid references public.areas(id),
  address       text not null default '',
  lat           double precision,
  lng           double precision,
  details       jsonb not null default '{}'::jsonb,
  status        text not null default 'pending'
                check (status in ('pending','recommended','not_recommended','approved','rejected')),
  sales_note    text,
  sales_by      uuid references public.profiles(id),
  sales_at      timestamptz,
  admin_note    text,
  admin_by      uuid references public.profiles(id),
  admin_at      timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
-- one open application per person per category
create unique index if not exists partner_app_one_open
  on public.partner_applications (user_id, category)
  where status in ('pending','recommended','not_recommended','approved');

create table if not exists public.application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.partner_applications(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  kind           text not null,
  storage_path   text not null,
  created_at     timestamptz not null default now()
);

-- ---------- 5. AUDIT LOG (who changed what) ----------
create table if not exists public.audit_logs (
  id         bigint generated always as identity primary key,
  actor      uuid references public.profiles(id) on delete set null,
  action     text not null,
  entity     text,
  entity_id  text,
  before     jsonb,
  after      jsonb,
  created_at timestamptz not null default now()
);

-- ---------- 6. HELPER FUNCTIONS ----------
create or replace function public.has_any_role(p_roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and status = 'active' and role = any (p_roles)
  );
$$;

create or replace function public.has_role(p_role text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_any_role(array[p_role]);
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_any_role(array['sales_admin','admin','super_admin']);
$$;

create or replace function public.norm_phone(p_phone text)
returns text language sql immutable as $$
  select case
    when d ~ '^8801[0-9]{9}$' then substr(d, 3)
    else d
  end
  from (select regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g') as d) t;
$$;

create or replace function public.log_audit(p_action text, p_entity text, p_entity_id text, p_before jsonb, p_after jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs (actor, action, entity, entity_id, before, after)
  values (auth.uid(), p_action, p_entity, p_entity_id, p_before, p_after);
end;
$$;

-- ---------- 7. NEW LOGIN -> PROFILE + CUSTOMER ROLE (automatic) ----------
-- The phone number is taken from the login e-mail (<phone>@users.zilax.app),
-- never from user-typed metadata, so nobody can claim someone else's number.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_phone text := split_part(coalesce(new.email, ''), '@', 1);
  v_up uuid;
  v_un uuid;
begin
  if v_phone !~ '^01[3-9][0-9]{8}$' then
    raise exception 'invalid_phone';
  end if;
  begin v_up := nullif(new.raw_user_meta_data->>'upazila_id', '')::uuid; exception when others then v_up := null; end;
  begin v_un := nullif(new.raw_user_meta_data->>'union_id', '')::uuid;   exception when others then v_un := null; end;
  insert into public.profiles (id, phone, full_name, upazila_id, union_id, address)
  values (new.id, v_phone,
          left(coalesce(new.raw_user_meta_data->>'full_name', ''), 120),
          v_up, v_un,
          left(coalesce(new.raw_user_meta_data->>'address', ''), 300));
  insert into public.user_roles (user_id, role, status) values (new.id, 'customer', 'active');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- people can edit their own profile, but never their phone or status
create or replace function public.protect_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_staff() then
    new.id := old.id;
    new.phone := old.phone;
    new.status := old.status;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile();

-- ---------- 8. ROW LEVEL SECURITY (who can see what) ----------
alter table public.areas                enable row level security;
alter table public.profiles             enable row level security;
alter table public.user_roles           enable row level security;
alter table public.partner_applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.audit_logs           enable row level security;

drop policy if exists areas_read on public.areas;
create policy areas_read on public.areas for select using (true);

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists roles_read on public.user_roles;
create policy roles_read on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists apps_read on public.partner_applications;
create policy apps_read on public.partner_applications for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists docs_read on public.application_documents;
create policy docs_read on public.application_documents for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists audit_read on public.audit_logs;
create policy audit_read on public.audit_logs for select to authenticated
  using (public.has_any_role(array['admin','super_admin']));
-- There is deliberately NO insert/update/delete policy on roles, applications,
-- documents or audit logs: all changes go through the secure functions below.

-- ---------- 9. PRIVATE FILE STORAGE for partner documents ----------
insert into storage.buckets (id, name, public)
values ('partner-docs', 'partner-docs', false)
on conflict (id) do nothing;

drop policy if exists "partner docs upload own" on storage.objects;
create policy "partner docs upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'partner-docs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "partner docs read own or staff" on storage.objects;
create policy "partner docs read own or staff" on storage.objects for select to authenticated
  using (bucket_id = 'partner-docs'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff()));

-- ---------- 10. SECURE ACTIONS (the only way to change roles & applications) ----------
create or replace function public.submit_partner_application(
  p_category text, p_business_name text, p_owner_name text, p_phone text,
  p_upazila uuid, p_union uuid, p_address text, p_lat double precision, p_lng double precision,
  p_details jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_id  uuid;
  v_phone text := public.norm_phone(p_phone);
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  if p_category not in ('merchant_food','merchant_shop','rider','technician','car_partner','decoration','sound_light') then
    raise exception 'bad_category';
  end if;
  if coalesce(trim(p_business_name), '') = '' or coalesce(trim(p_owner_name), '') = '' then
    raise exception 'missing_name';
  end if;
  if v_phone !~ '^01[3-9][0-9]{8}$' then raise exception 'invalid_phone'; end if;
  if exists (select 1 from public.profiles where id = v_uid and status <> 'active') then
    raise exception 'account_suspended';
  end if;

  insert into public.partner_applications
    (user_id, category, business_name, owner_name, phone, upazila_id, union_id, address, lat, lng, details)
  values
    (v_uid, p_category, left(trim(p_business_name), 160), left(trim(p_owner_name), 120), v_phone,
     p_upazila, p_union, left(coalesce(p_address, ''), 300), p_lat, p_lng, coalesce(p_details, '{}'::jsonb))
  returning id into v_id;

  insert into public.user_roles as ur (user_id, role, status)
  values (v_uid, p_category, 'pending')
  on conflict (user_id, role)
  do update set status = 'pending', updated_at = now() where ur.status = 'rejected';

  perform public.log_audit('application_submitted', 'partner_applications', v_id::text, null,
                           jsonb_build_object('category', p_category));
  return v_id;
exception when unique_violation then
  raise exception 'already_applied';
end;
$$;

create or replace function public.add_application_document(p_app uuid, p_kind text, p_path text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not exists (select 1 from public.partner_applications where id = p_app and user_id = auth.uid()) then
    raise exception 'forbidden';
  end if;
  if split_part(p_path, '/', 1) <> auth.uid()::text then raise exception 'forbidden'; end if;
  insert into public.application_documents (application_id, user_id, kind, storage_path)
  values (p_app, auth.uid(), left(coalesce(p_kind, 'other'), 40), p_path)
  returning id into v_id;
  return v_id;
end;
$$;

-- Sales Admin (or Admin / Super Admin): recommend or not recommend
create or replace function public.sales_review(p_app uuid, p_recommend boolean, p_note text)
returns void language plpgsql security definer set search_path = public as $$
declare v_old text;
begin
  if not public.has_any_role(array['sales_admin','admin','super_admin']) then raise exception 'forbidden'; end if;
  select status into v_old from public.partner_applications where id = p_app;
  if v_old is null then raise exception 'not_found'; end if;
  if v_old not in ('pending','recommended','not_recommended') then raise exception 'not_reviewable'; end if;
  update public.partner_applications
     set status = case when p_recommend then 'recommended' else 'not_recommended' end,
         sales_note = left(p_note, 500), sales_by = auth.uid(), sales_at = now(), updated_at = now()
   where id = p_app;
  perform public.log_audit('sales_review', 'partner_applications', p_app::text,
                           jsonb_build_object('status', v_old),
                           jsonb_build_object('recommend', p_recommend, 'note', p_note));
end;
$$;

-- Admin (or Super Admin): final approve / reject. Approving turns the role on.
create or replace function public.admin_decide(p_app uuid, p_approve boolean, p_note text)
returns void language plpgsql security definer set search_path = public as $$
declare v_row public.partner_applications;
begin
  if not public.has_any_role(array['admin','super_admin']) then raise exception 'forbidden'; end if;
  select * into v_row from public.partner_applications where id = p_app;
  if not found then raise exception 'not_found'; end if;
  if v_row.status not in ('pending','recommended','not_recommended') then raise exception 'not_reviewable'; end if;
  update public.partner_applications
     set status = case when p_approve then 'approved' else 'rejected' end,
         admin_note = left(p_note, 500), admin_by = auth.uid(), admin_at = now(), updated_at = now()
   where id = p_app;
  insert into public.user_roles as ur (user_id, role, status)
  values (v_row.user_id, v_row.category, case when p_approve then 'active' else 'rejected' end)
  on conflict (user_id, role)
  do update set status = case when p_approve then 'active' else 'rejected' end, updated_at = now();
  perform public.log_audit('admin_decide', 'partner_applications', p_app::text,
                           jsonb_build_object('status', v_row.status),
                           jsonb_build_object('approved', p_approve, 'note', p_note));
end;
$$;

-- Super Admin only: give / take staff roles
create or replace function public.super_grant_role(p_phone text, p_role text)
returns void language plpgsql security definer set search_path = public as $$
declare v_user uuid;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_role not in ('sales_admin','admin','super_admin') then raise exception 'bad_role'; end if;
  select id into v_user from public.profiles where phone = public.norm_phone(p_phone);
  if v_user is null then raise exception 'user_not_found'; end if;
  insert into public.user_roles as ur (user_id, role, status)
  values (v_user, p_role, 'active')
  on conflict (user_id, role) do update set status = 'active', updated_at = now();
  perform public.log_audit('grant_role', 'user_roles', v_user::text, null, jsonb_build_object('role', p_role));
end;
$$;

create or replace function public.super_revoke_role(p_user uuid, p_role text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_role not in ('sales_admin','admin','super_admin') then raise exception 'bad_role'; end if;
  if p_role = 'super_admin' and
     (select count(*) from public.user_roles where role = 'super_admin' and status = 'active') <= 1 then
    raise exception 'last_super_admin';
  end if;
  delete from public.user_roles where user_id = p_user and role = p_role;
  perform public.log_audit('revoke_role', 'user_roles', p_user::text, jsonb_build_object('role', p_role), null);
end;
$$;

-- Super Admin / Admin: add or edit an area (district, upazila, union)
create or replace function public.upsert_area(
  p_id uuid, p_parent uuid, p_level text, p_kind text, p_name_en text, p_name_bn text, p_active boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.has_any_role(array['admin','super_admin']) then raise exception 'forbidden'; end if;
  if p_level not in ('district','upazila','union') then raise exception 'bad_level'; end if;
  if p_level <> 'district' and p_parent is null then raise exception 'parent_required'; end if;
  if coalesce(trim(p_name_en), '') = '' or coalesce(trim(p_name_bn), '') = '' then raise exception 'missing_name'; end if;
  if p_id is null then
    insert into public.areas (parent_id, level, kind, name_en, name_bn, active)
    values (p_parent, p_level, coalesce(p_kind, p_level), trim(p_name_en), trim(p_name_bn), coalesce(p_active, true))
    returning id into v_id;
  else
    update public.areas
       set name_en = trim(p_name_en), name_bn = trim(p_name_bn), active = coalesce(p_active, true),
           kind = coalesce(p_kind, kind)
     where id = p_id
    returning id into v_id;
    if v_id is null then raise exception 'not_found'; end if;
  end if;
  perform public.log_audit('upsert_area', 'areas', v_id::text, null,
                           jsonb_build_object('name_en', p_name_en, 'name_bn', p_name_bn, 'level', p_level));
  return v_id;
exception when unique_violation then
  raise exception 'already_exists';
end;
$$;

-- FIRST SUPER ADMIN: run this yourself in the SQL Editor (not available from the app).
create or replace function public.bootstrap_super_admin(p_phone text)
returns text language plpgsql security definer set search_path = public as $$
declare v_user uuid;
begin
  select id into v_user from public.profiles where phone = public.norm_phone(p_phone);
  if v_user is null then
    return 'No account with this phone yet. Sign up in the app first, then run this again.';
  end if;
  insert into public.user_roles as ur (user_id, role, status)
  values (v_user, 'super_admin', 'active')
  on conflict (user_id, role) do update set status = 'active', updated_at = now();
  return 'OK: ' || p_phone || ' is now Super Admin.';
end;
$$;

-- ---------- 11. WHO MAY CALL WHICH FUNCTION ----------
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig, p.proname
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('has_role','has_any_role','is_staff','submit_partner_application',
                        'add_application_document','sales_review','admin_decide',
                        'super_grant_role','super_revoke_role','upsert_area')
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('bootstrap_super_admin','log_audit','handle_new_user','protect_profile')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', r.sig);
  end loop;
end $$;

-- Done. Next: Authentication -> Providers -> Email -> turn OFF "Confirm email".
