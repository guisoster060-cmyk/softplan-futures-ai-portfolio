-- Staging only: third, independent Gemini test authorization. Never reset trials 1 or 2.
do $$
begin
  if not exists (
    select 1 from public.companies c
    where c.id = '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid
      and c.name = 'Empresa teste'
      and (select count(*) from public.transactions t where t.company_id = c.id) = 5
      and (select count(*) from public.company_members m where m.company_id = c.id and m.role = 'owner') = 1
  ) then
    raise exception 'Staging synthetic company/owner/five transactions not confirmed';
  end if;
  if not exists (select 1 from hermes_test.one_shot where company_id = '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid and claimed_at is not null) then
    raise exception 'First trial must remain consumed';
  end if;
end $$;
do $ begin
 if not exists (select 1 from hermes_test.second_one_shot where company_id='53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid and claimed_at is not null) then
  raise exception 'Second trial must remain consumed';
 end if;
end $;
create table hermes_test.third_one_shot (
  company_id uuid primary key,
  claimed_at timestamptz,
  claimed_by uuid,
  constraint third_test_company_only check (company_id = '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid),
  constraint third_claim_consistency check ((claimed_at is null) = (claimed_by is null))
);
alter table hermes_test.third_one_shot enable row level security;
revoke all on hermes_test.third_one_shot from public, anon, authenticated;
insert into hermes_test.third_one_shot (company_id) values ('53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid);
create function public.claim_hermes_test_third_once(p_company_id uuid)
returns boolean language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_claimed boolean;
begin
  if v_uid is null or p_company_id is distinct from '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid then return false; end if;
  update hermes_test.third_one_shot g
    set claimed_at = clock_timestamp(), claimed_by = v_uid
    where g.company_id = p_company_id and g.claimed_at is null
    and exists (
      select 1 from public.company_members m
      where m.company_id = p_company_id and m.user_id = v_uid and m.role = 'owner'
    )
  returning true into v_claimed;
  return coalesce(v_claimed, false);
end;
$$;
revoke all on function public.claim_hermes_test_third_once(uuid) from public, anon, authenticated;
grant execute on function public.claim_hermes_test_third_once(uuid) to authenticated;