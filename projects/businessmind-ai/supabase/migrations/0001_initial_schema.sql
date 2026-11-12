-- =====================================================================
-- BusinessMind AI v0.4 — Migração 0001: esquema inicial + RLS
-- STATUS: escrita, mas AINDA NÃO executada em um Supabase real.
-- Como usar: Supabase > SQL Editor > New query > colar tudo > Run.
-- Rodar UMA vez, em projeto novo. Roda numa transação: se algo falhar,
-- nada é aplicado pela metade.
-- =====================================================================
begin;

-- ---------------------------------------------------------------------
-- 1. TABELAS
-- ---------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  created_at   timestamptz not null default now()
);

create table public.companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 80),
  owner_id   uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Preparado para equipes futuras (convites/papéis). Hoje só existe 'owner'.
create table public.company_members (
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies (id) on delete cascade,
  type        text not null check (type in ('income', 'expense')),
  description text not null check (char_length(btrim(description)) between 1 and 80),
  category    text not null check (char_length(btrim(category)) between 1 and 40),
  amount      numeric(14, 2) not null check (amount > 0 and amount <= 999999999.99),
  occurred_on date not null,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index transactions_company_date_idx on public.transactions (company_id, occurred_on desc);
create index companies_owner_idx           on public.companies (owner_id);
create index company_members_user_idx      on public.company_members (user_id);

-- created_by passa a ser sempre o usuário logado quando não informado.
alter table public.transactions alter column created_by set default auth.uid();

-- ---------------------------------------------------------------------
-- 2. FUNÇÕES AUXILIARES (security definer: evitam recursão nas políticas)
-- ---------------------------------------------------------------------
create function public.is_company_member(p_company_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.company_members m
    where m.company_id = p_company_id and m.user_id = (select auth.uid())
  );
$$;

create function public.is_company_owner(p_company_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.company_members m
    where m.company_id = p_company_id and m.user_id = (select auth.uid()) and m.role = 'owner'
  );
$$;

-- Única porta para criar empresa: cria a empresa e já registra o criador como dono.
create function public.create_company(p_name text)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_id  uuid;
begin
  if v_uid is null then
    raise exception 'usuário não autenticado' using errcode = '28000';
  end if;
  insert into public.companies (name, owner_id) values (btrim(p_name), v_uid) returning id into v_id;
  insert into public.company_members (company_id, user_id, role) values (v_id, v_uid, 'owner');
  return v_id;
end;
$$;

-- Cria o perfil automaticamente quando um usuário se cadastra.
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(left(new.raw_user_meta_data ->> 'display_name', 80), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantém updated_at correto.
create function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- Proteção do plano gratuito (500 MB): limite de movimentações por empresa.
create function public.enforce_transaction_limit()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.transactions where company_id = new.company_id) >= 5000 then
    raise exception 'Limite de 5000 movimentações por empresa atingido.';
  end if;
  return new;
end;
$$;

create trigger enforce_transaction_limit
  before insert on public.transactions
  for each row execute function public.enforce_transaction_limit();

-- ---------------------------------------------------------------------
-- 3. RLS (Row Level Security): ligado em TODAS as tabelas
-- ---------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.companies       enable row level security;
alter table public.company_members enable row level security;
alter table public.transactions    enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy companies_select_member on public.companies
  for select to authenticated using (public.is_company_member(id));
create policy companies_update_owner on public.companies
  for update to authenticated
  using (public.is_company_owner(id)) with check (public.is_company_owner(id));
create policy companies_delete_owner on public.companies
  for delete to authenticated using (public.is_company_owner(id));

create policy members_select_member on public.company_members
  for select to authenticated using (public.is_company_member(company_id));

create policy transactions_select_member on public.transactions
  for select to authenticated using (public.is_company_member(company_id));
create policy transactions_insert_member on public.transactions
  for insert to authenticated
  with check (public.is_company_member(company_id) and created_by = (select auth.uid()));
create policy transactions_update_member on public.transactions
  for update to authenticated
  using (public.is_company_member(company_id)) with check (public.is_company_member(company_id));
create policy transactions_delete_member on public.transactions
  for delete to authenticated using (public.is_company_member(company_id));

-- ---------------------------------------------------------------------
-- 4. PRIVILÉGIOS (defesa em camadas, além do RLS): mínimo necessário.
--    Visitante (anon) não acessa nada. Usuário logado só o que precisa.
--    Atenção: remove os acessos padrão do Supabase às tabelas de "public".
-- ---------------------------------------------------------------------
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;

grant select, update (display_name) on public.profiles        to authenticated;
grant select, update (name), delete on public.companies       to authenticated;
grant select                        on public.company_members to authenticated;
grant select, delete                on public.transactions    to authenticated;
grant insert (company_id, type, description, category, amount, occurred_on)
                                    on public.transactions    to authenticated;
grant update (type, description, category, amount, occurred_on)
                                    on public.transactions    to authenticated;

grant execute on function public.is_company_member(uuid) to authenticated;
grant execute on function public.is_company_owner(uuid)  to authenticated;
grant execute on function public.create_company(text)    to authenticated;
-- handle_new_user, set_updated_at e enforce_transaction_limit só rodam como gatilhos.

commit;
