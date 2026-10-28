-- =====================================================================
-- ZILAX — STAGE 2.2  (delivery charge and commission in the database)
-- Run AFTER stage2_1.sql. Safe to run again (it never resets your values).
-- If you already ran an older version of this file, just run this one again: it updates the functions
-- and adds the new delivery settings (minimum 15, 2.5 per 100 m).
-- Supabase: SQL Editor -> New query -> paste -> Run.
-- =====================================================================

-- ---------- 1. Commission per service (empty = not decided yet) ----------
alter table public.services
  add column if not exists commission_pct numeric
  check (commission_pct is null or (commission_pct >= 0 and commission_pct <= 100));

-- Food commission is the one rule already decided: 15%.
update public.services set commission_pct = 15 where code = 'food' and commission_pct is null;

-- ---------- 2. Settings table (delivery charge) ----------
create table if not exists public.app_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value) values
  ('delivery_min',      '15'::jsonb),     -- minimum delivery charge (BDT)
  ('delivery_per_100m', '2.5'::jsonb)     -- charge for every started 100 metres (BDT)
on conflict (key) do nothing;

alter table public.app_settings enable row level security;
drop policy if exists app_settings_read on public.app_settings;
create policy app_settings_read on public.app_settings for select using (true);
-- No insert/update/delete policy on purpose: changes go through the functions below only.

-- ---------- 3. SECURE ACTIONS (Super Admin only, written to the audit log) ----------
create or replace function public.set_setting(p_key text, p_value jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_before jsonb;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;

  if p_key in ('delivery_min', 'delivery_per_100m') then
    if jsonb_typeof(p_value) is distinct from 'number' then raise exception 'bad_value'; end if;
    if (p_value #>> '{}')::numeric < 0 or (p_value #>> '{}')::numeric > 1000 then raise exception 'bad_value'; end if;
  else
    raise exception 'unknown_setting';
  end if;

  select value into v_before from public.app_settings where key = p_key;
  insert into public.app_settings (key, value) values (p_key, p_value)
  on conflict (key) do update set value = excluded.value, updated_at = now();
  perform public.log_audit('set_setting', 'app_settings', p_key, v_before, p_value);
end;
$$;

create or replace function public.set_service_commission(p_code text, p_pct numeric)
returns void language plpgsql security definer set search_path = public as $$
declare v_before numeric;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_pct is null or p_pct < 0 or p_pct > 100 then raise exception 'bad_percent'; end if;
  if not exists (select 1 from public.services where code = p_code) then raise exception 'not_found'; end if;
  select commission_pct into v_before from public.services where code = p_code;
  update public.services set commission_pct = p_pct, updated_at = now() where code = p_code;
  perform public.log_audit('set_service_commission', 'services', p_code,
          jsonb_build_object('commission_pct', v_before), jsonb_build_object('commission_pct', p_pct));
end;
$$;

revoke all on function public.set_setting(text, jsonb) from public, anon;
grant execute on function public.set_setting(text, jsonb) to authenticated;
revoke all on function public.set_service_commission(text, numeric) from public, anon;
grant execute on function public.set_service_commission(text, numeric) to authenticated;

-- Done.
