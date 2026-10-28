-- =====================================================================
-- ZILAX — STAGE 2.2b  (platform fee per service + commission deal per partner)
-- Run AFTER stage2_1.sql and stage2_2.sql.
-- Supabase: SQL Editor -> New query -> paste everything -> Run.
-- Safe to run again: it never resets fees, rates or deals you have already set.
-- =====================================================================

-- ---------- 1. PLATFORM FEE per service (fixed taka per order / booking) ----------
-- First run only: adds the column and fills the starting values
-- (food 4, shop 10, every other service 200). Later runs leave your values alone.
do $$
begin
  if not exists (select 1 from information_schema.columns
                  where table_schema = 'public' and table_name = 'services' and column_name = 'platform_fee') then
    alter table public.services
      add column platform_fee numeric not null default 0 check (platform_fee >= 0 and platform_fee <= 10000);
    update public.services set platform_fee = case code when 'food' then 4 when 'shop' then 10 else 200 end;
  end if;
end $$;

-- ---------- 2. COMMISSION DEAL per partner (overrides the service default) ----------
create table if not exists public.partner_terms (
  user_id        uuid not null references public.profiles(id) on delete cascade,
  service_code   text not null references public.services(code) on delete cascade,
  commission_pct numeric not null check (commission_pct >= 0 and commission_pct <= 100),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references public.profiles(id) on delete set null,
  primary key (user_id, service_code)
);

alter table public.partner_terms enable row level security;
drop policy if exists partner_terms_read on public.partner_terms;
create policy partner_terms_read on public.partner_terms for select to authenticated
  using (user_id = auth.uid() or public.has_any_role(array['super_admin', 'admin']));
-- No insert/update/delete policy on purpose: changes go through the functions below only.

-- ---------- 3. SECURE ACTIONS (Super Admin only, every change goes to the audit log) ----------
create or replace function public.set_service_fee(p_code text, p_fee numeric)
returns void language plpgsql security definer set search_path = public as $$
declare v_before numeric;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_fee is null or p_fee < 0 or p_fee > 10000 then raise exception 'bad_value'; end if;
  if not exists (select 1 from public.services where code = p_code) then raise exception 'not_found'; end if;
  select platform_fee into v_before from public.services where code = p_code;
  update public.services set platform_fee = p_fee, updated_at = now() where code = p_code;
  perform public.log_audit('set_service_fee', 'services', p_code,
          jsonb_build_object('platform_fee', v_before), jsonb_build_object('platform_fee', p_fee));
end;
$$;

-- p_pct = a number (0..100) sets this partner's own rate; p_pct = null removes it (service default applies again).
create or replace function public.set_partner_commission(p_user uuid, p_service text, p_pct numeric)
returns void language plpgsql security definer set search_path = public as $$
declare v_before numeric; v_name text; v_role text;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_pct is not null and (p_pct < 0 or p_pct > 100) then raise exception 'bad_percent'; end if;
  if not exists (select 1 from public.services where code = p_service) then raise exception 'not_found'; end if;

  v_role := case p_service
    when 'food' then 'merchant_food'   when 'shop' then 'merchant_shop'
    when 'technical' then 'technician' when 'rent_car' then 'car_partner'
    when 'decoration' then 'decoration' when 'sound_light' then 'sound_light' end;
  if not exists (select 1 from public.user_roles
                  where user_id = p_user and role = v_role and status = 'active') then
    raise exception 'not_partner';
  end if;

  select full_name into v_name from public.profiles where id = p_user;
  select commission_pct into v_before from public.partner_terms where user_id = p_user and service_code = p_service;

  if p_pct is null then
    delete from public.partner_terms where user_id = p_user and service_code = p_service;
  else
    insert into public.partner_terms (user_id, service_code, commission_pct, updated_by)
    values (p_user, p_service, p_pct, auth.uid())
    on conflict (user_id, service_code)
    do update set commission_pct = excluded.commission_pct, updated_at = now(), updated_by = auth.uid();
  end if;

  perform public.log_audit('set_partner_commission', 'partner_terms', p_user::text,
          jsonb_build_object('service', p_service, 'pct', v_before, 'partner', v_name),
          jsonb_build_object('service', p_service, 'pct', p_pct,    'partner', v_name));
end;
$$;

-- Delivery numbers and the flat fee now live per service, so the old global "service_charge" is retired.
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

revoke all on function public.set_service_fee(text, numeric) from public, anon;
grant execute on function public.set_service_fee(text, numeric) to authenticated;
revoke all on function public.set_partner_commission(uuid, text, numeric) from public, anon;
grant execute on function public.set_partner_commission(uuid, text, numeric) to authenticated;
revoke all on function public.set_setting(text, jsonb) from public, anon;
grant execute on function public.set_setting(text, jsonb) to authenticated;

-- Done.
