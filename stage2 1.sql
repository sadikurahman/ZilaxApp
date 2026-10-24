-- =====================================================================
-- ZILAX — STAGE 2.1  (Services on/off + listing-approval rule)
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- It is safe to run again (it will not delete data or reset your switches).
-- =====================================================================

-- ---------- 1. SERVICES table ----------
create table if not exists public.services (
  code             text primary key,
  name_en          text not null,
  name_bn          text not null,
  enabled          boolean not null default true,
  listing_approval boolean not null default true,
  sort             int not null default 0,
  updated_at       timestamptz not null default now()
);

insert into public.services (code, name_en, name_bn, sort) values
  ('food',       'Food',          'ফুড',            1),
  ('technical',  'Technical',     'টেকনিক্যাল',      2),
  ('shop',       'Shop',          'শপ',             3),
  ('rent_car',   'Rent a Car',    'গাড়ি ভাড়া',      4),
  ('decoration', 'Decoration',    'ডেকোরেশন',       5),
  ('sound_light','Sound & Light', 'সাউন্ড ও লাইট',   6)
on conflict (code) do nothing;

-- ---------- 2. WHO CAN SEE IT (everyone: the home page needs it) ----------
alter table public.services enable row level security;
drop policy if exists services_read on public.services;
create policy services_read on public.services for select using (true);
-- No insert/update/delete policy on purpose: changes go through set_service() only.

-- ---------- 3. SECURE ACTION (Super Admin only, written to the audit log) ----------
create or replace function public.set_service(p_code text, p_enabled boolean, p_listing_approval boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_before jsonb;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  select jsonb_build_object('enabled', enabled, 'listing_approval', listing_approval)
    into v_before from public.services where code = p_code;
  if v_before is null then raise exception 'not_found'; end if;
  update public.services
     set enabled = coalesce(p_enabled, enabled),
         listing_approval = coalesce(p_listing_approval, listing_approval),
         updated_at = now()
   where code = p_code;
  perform public.log_audit('set_service', 'services', p_code, v_before,
          (select jsonb_build_object('enabled', enabled, 'listing_approval', listing_approval)
             from public.services where code = p_code));
end;
$$;

revoke all on function public.set_service(text, boolean, boolean) from public, anon;
grant execute on function public.set_service(text, boolean, boolean) to authenticated;

-- Done.
