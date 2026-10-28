-- =====================================================================
-- ZILAX — STAGE 2.3  (switch a service on or off per upazila)
-- Run AFTER stage2_1.sql (it needs the services table). Safe to run again.
-- Supabase: SQL Editor -> New query -> paste everything -> Run.
-- =====================================================================
-- How it works: the Services page switches a service on or off EVERYWHERE.
-- This file adds a second switch for ONE upazila. A row in area_service_off
-- means "this service is OFF in this upazila". No row = it follows the main switch.

create table if not exists public.area_service_off (
  area_id      uuid not null references public.areas(id) on delete cascade,
  service_code text not null references public.services(code) on delete cascade,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles(id) on delete set null,
  primary key (area_id, service_code)
);

alter table public.area_service_off enable row level security;
drop policy if exists area_service_off_read on public.area_service_off;
create policy area_service_off_read on public.area_service_off for select using (true);
-- No insert/update/delete policy on purpose: changes go through set_area_service() only.

create or replace function public.set_area_service(p_area uuid, p_service text, p_enabled boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_level text; v_name text; v_was_off boolean;
begin
  if not public.has_role('super_admin') then raise exception 'forbidden'; end if;
  if p_enabled is null then raise exception 'bad_value'; end if;
  select level, name_en into v_level, v_name from public.areas where id = p_area;
  if v_level is null then raise exception 'not_found'; end if;
  if v_level <> 'upazila' then raise exception 'bad_level'; end if;
  if not exists (select 1 from public.services where code = p_service) then raise exception 'not_found'; end if;

  select exists (select 1 from public.area_service_off where area_id = p_area and service_code = p_service) into v_was_off;
  if v_was_off = (not p_enabled) then return; end if;   -- nothing to change, nothing to log

  if p_enabled then
    delete from public.area_service_off where area_id = p_area and service_code = p_service;
  else
    insert into public.area_service_off (area_id, service_code, updated_by) values (p_area, p_service, auth.uid());
  end if;

  perform public.log_audit('set_area_service', 'area_service_off', p_area::text,
          jsonb_build_object('service', p_service, 'enabled', not v_was_off, 'area', v_name),
          jsonb_build_object('service', p_service, 'enabled', p_enabled,     'area', v_name));
end;
$$;

revoke all on function public.set_area_service(uuid, text, boolean) from public, anon;
grant execute on function public.set_area_service(uuid, text, boolean) to authenticated;

-- Done.
