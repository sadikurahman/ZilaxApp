-- =====================================================================
-- ZILAX — STAGE 2.4  (technician rate list, fixed by the Super Admin)
-- Run AFTER stage2_1.sql. Safe to run again (it never deletes your rates).
-- Supabase: SQL Editor -> New query -> paste everything -> Run.
-- =====================================================================
-- Technicians cannot change these prices. Customers can see them.
-- A rate is hidden (active = false) instead of deleted, so old jobs keep their history.

create table if not exists public.tech_services (
  id         uuid primary key default gen_random_uuid(),
  name_en    text not null check (char_length(name_en) between 1 and 80),
  name_bn    text not null check (char_length(name_bn) between 1 and 80),
  price      numeric not null check (price >= 0 and price <= 1000000),
  active     boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tech_services enable row level security;
drop policy if exists tech_services_read on public.tech_services;
create policy tech_services_read on public.tech_services for select using (true);
-- No insert/update/delete policy on purpose: changes go through upsert_tech_service() only.

-- p_id = null creates a new rate; p_id = an existing id edits it (also used to hide / show).
create or replace function public.upsert_tech_service(p_id uuid, p_name_en text, p_name_bn text, p_price numeric, p_active boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_before jsonb; v_id uuid; v_en text := btrim(coalesce(p_name_en, '')); v_bn text := btrim(coalesce(p_name_bn, ''));
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if char_length(v_en) < 1 or char_length(v_en) > 80 or char_length(v_bn) < 1 or char_length(v_bn) > 80 then raise exception 'bad_value'; end if;
  if p_price is null or p_price < 0 or p_price > 1000000 then raise exception 'bad_value'; end if;

  if p_id is null then
    insert into public.tech_services (name_en, name_bn, price, active, sort)
    values (v_en, v_bn, p_price, coalesce(p_active, true), (select coalesce(max(sort), 0) + 1 from public.tech_services))
    returning id into v_id;
    perform public.log_audit('upsert_tech_service', 'tech_services', v_id::text, null,
            jsonb_build_object('name_en', v_en, 'name_bn', v_bn, 'price', p_price, 'active', coalesce(p_active, true)));
  else
    select jsonb_build_object('name_en', name_en, 'name_bn', name_bn, 'price', price, 'active', active)
      into v_before from public.tech_services where id = p_id;
    if v_before is null then raise exception 'not_found'; end if;
    update public.tech_services
       set name_en = v_en, name_bn = v_bn, price = p_price, active = coalesce(p_active, active), updated_at = now()
     where id = p_id;
    v_id := p_id;
    perform public.log_audit('upsert_tech_service', 'tech_services', v_id::text, v_before,
            (select jsonb_build_object('name_en', name_en, 'name_bn', name_bn, 'price', price, 'active', active)
               from public.tech_services where id = p_id));
  end if;
  return v_id;
end;
$$;

revoke all on function public.upsert_tech_service(uuid, text, text, numeric, boolean) from public, anon;
grant execute on function public.upsert_tech_service(uuid, text, text, numeric, boolean) to authenticated;

-- Done.
