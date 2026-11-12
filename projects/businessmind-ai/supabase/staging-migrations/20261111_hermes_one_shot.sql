-- SOMENTE STAGING ogypzmxnvjbomamkejkh. Nao adicionar ao fluxo de migrations de producao.
-- Aplicacao manual futura exige autorizacao especifica e conferencia da project ref.
-- O registro e consumido ANTES da tentativa de rede; nunca reiniciar em caso de falha.
begin;

do $$
begin
  if not exists (
    select 1 from public.companies c
    where c.id = '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid
      and c.name = 'Empresa teste'
      and (select count(*) from public.transactions t where t.company_id = c.id) = 5
  ) then
    raise exception 'Empresa ficticia de staging ou cinco lancamentos nao confirmados.';
  end if;
end;
$$;

create schema hermes_test;
revoke all on schema hermes_test from public, anon, authenticated;

create table hermes_test.one_shot (
  -- Sem FKs: a trava nao pode bloquear exclusoes ja permitidas no schema da aplicacao.
  company_id uuid primary key,
  claimed_at timestamptz,
  claimed_by uuid,
  constraint hermes_test_company_only check (company_id = '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid),
  constraint hermes_claim_consistency check ((claimed_at is null) = (claimed_by is null))
);
alter table hermes_test.one_shot enable row level security;
revoke all on hermes_test.one_shot from public, anon, authenticated;
insert into hermes_test.one_shot (company_id) values ('53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid);

-- Unica operacao exposta: o dono autenticado pode consumir, nunca criar/rearmar/apagar.
create function public.claim_hermes_test_once(p_company_id uuid)
returns boolean
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_claimed boolean;
begin
  if v_uid is null or p_company_id is distinct from '53ec445f-610a-4d80-a6d7-da4acd9c14e1'::uuid then
    return false;
  end if;
  update hermes_test.one_shot g
     set claimed_at = clock_timestamp(), claimed_by = v_uid
   where g.company_id = p_company_id
     and g.claimed_at is null
     and exists (
       select 1 from public.company_members m
       where m.company_id = p_company_id and m.user_id = v_uid and m.role = 'owner'
     )
  returning true into v_claimed;
  return coalesce(v_claimed, false);
end;
$$;

revoke all on function public.claim_hermes_test_once(uuid) from public, anon, authenticated;
grant execute on function public.claim_hermes_test_once(uuid) to authenticated;
commit;
