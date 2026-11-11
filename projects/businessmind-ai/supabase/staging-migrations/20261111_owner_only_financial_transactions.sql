-- Staging-only security hardening, applied on 2026-11-11.
-- This script documents the live staging migration. DO NOT run against production
-- without a separate review and explicit authorization.
-- Existing transactions are preserved.

begin;

drop policy if exists transactions_select_member on public.transactions;
create policy transactions_select_owner on public.transactions
  for select to authenticated
  using (public.is_company_owner(company_id));

drop policy if exists transactions_insert_member on public.transactions;
create policy transactions_insert_owner on public.transactions
  for insert to authenticated
  with check (public.is_company_owner(company_id) and created_by = (select auth.uid()));

drop policy if exists transactions_update_member on public.transactions;
create policy transactions_update_owner on public.transactions
  for update to authenticated
  using (public.is_company_owner(company_id))
  with check (public.is_company_owner(company_id));

drop policy if exists transactions_delete_member on public.transactions;
create policy transactions_delete_owner on public.transactions
  for delete to authenticated
  using (public.is_company_owner(company_id));

commit;

-- Verification performed on staging with SET LOCAL ROLE authenticated and
-- request.jwt.claim.sub for two distinct owners:
-- owner A: own=5, other=0; owner B: own=3, other=0.
-- Manager-role and authenticated API write tests remain pending.
