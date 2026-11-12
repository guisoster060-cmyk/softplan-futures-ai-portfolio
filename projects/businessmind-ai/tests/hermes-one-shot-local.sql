-- Fixture local para testar a migration staging sem Supabase remoto.
-- Executar APENAS em PostgreSQL descartavel criado para este teste.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;

create table public.companies (id uuid primary key, name text not null);
create table public.company_members (
  company_id uuid not null,
  user_id uuid not null,
  role text not null check (role in ('owner', 'member')),
  primary key (company_id, user_id)
);
create table public.transactions (id uuid primary key, company_id uuid not null);

insert into auth.users (id) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
insert into public.companies (id, name) values
  ('53ec445f-610a-4d80-a6d7-da4acd9c14e1', 'Empresa teste');
insert into public.company_members (company_id, user_id, role) values
  ('53ec445f-610a-4d80-a6d7-da4acd9c14e1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'owner'),
  ('53ec445f-610a-4d80-a6d7-da4acd9c14e1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'member');
insert into public.transactions (id, company_id) values
  ('00000000-0000-4000-8000-000000000001', '53ec445f-610a-4d80-a6d7-da4acd9c14e1'),
  ('00000000-0000-4000-8000-000000000002', '53ec445f-610a-4d80-a6d7-da4acd9c14e1'),
  ('00000000-0000-4000-8000-000000000003', '53ec445f-610a-4d80-a6d7-da4acd9c14e1'),
  ('00000000-0000-4000-8000-000000000004', '53ec445f-610a-4d80-a6d7-da4acd9c14e1'),
  ('00000000-0000-4000-8000-000000000005', '53ec445f-610a-4d80-a6d7-da4acd9c14e1');
