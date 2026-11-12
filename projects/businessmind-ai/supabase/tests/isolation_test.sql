-- =====================================================================
-- BusinessMind AI v0.4 — Teste de isolamento entre empresas (RLS)
-- STATUS: escrito, mas AINDA NÃO executado em um Supabase real.
--
-- Rodar DEPOIS da migração 0001. Supabase > SQL Editor > New query > Run.
--
-- COMO LER O RESULTADO: o script termina de propósito com um "erro".
-- Esse erro contém o RELATÓRIO (linhas OK / FALHOU). Ao falhar de propósito,
-- o banco desfaz TUDO: usuários e dados de teste NÃO ficam gravados.
-- Se o erro for outro (antes do relatório), copie a mensagem inteira.
-- =====================================================================
do $test$
declare
  uA constant uuid := 'aaaaaaaa-0000-0000-0000-00000000000a';
  uB constant uuid := 'bbbbbbbb-0000-0000-0000-00000000000b';
  cA constant uuid := 'aaaaaaaa-1111-0000-0000-00000000000a';
  cB constant uuid := 'bbbbbbbb-1111-0000-0000-00000000000b';
  cL constant uuid := 'cccccccc-1111-0000-0000-00000000000c';
  tA constant uuid := 'aaaaaaaa-2222-0000-0000-00000000000a';
  tB constant uuid := 'bbbbbbbb-2222-0000-0000-00000000000b';
  c record;
  rep text := '';
  n int := 0; ok int := 0; bad int := 0;
  got text; rows_n bigint; passed boolean;
begin
  -- ---------- Preparação (como administrador) ----------
  insert into auth.users (id, aud, role, email) values
    (uA, 'authenticated', 'authenticated', 'teste-a@example.invalid'),
    (uB, 'authenticated', 'authenticated', 'teste-b@example.invalid');

  insert into public.companies (id, name, owner_id) values
    (cA, 'Empresa A', uA), (cB, 'Empresa B', uB), (cL, 'Empresa Limite', uA);
  insert into public.company_members (company_id, user_id, role) values
    (cA, uA, 'owner'), (cB, uB, 'owner'), (cL, uA, 'owner');
  insert into public.transactions (id, company_id, type, description, category, amount, occurred_on, created_by) values
    (tA, cA, 'income', 'Venda A', 'Serviços', 100, current_date, uA),
    (tB, cB, 'income', 'Venda B', 'Serviços', 200, current_date, uB);

  -- Empresa "Limite": 5000 movimentações (gatilho desligado só na preparação).
  alter table public.transactions disable trigger enforce_transaction_limit;
  insert into public.transactions (company_id, type, description, category, amount, occurred_on, created_by)
    select cL, 'expense', 'Carga ' || g, 'Outras despesas', 1, current_date, uA from generate_series(1, 5000) g;
  alter table public.transactions enable trigger enforce_transaction_limit;

  -- ---------- Casos de teste ----------
  -- label | usuário | papel do banco | comando | esperado ('ok' ou código do erro) | linhas esperadas
  for c in
    select * from (values
      ('Perfis criados automaticamente no cadastro', null::uuid, 'postgres',
        'select 1 from public.profiles where id in (''' || uA || ''',''' || uB || ''')', 'ok', 2),

      -- Leitura: cada um vê só o que é seu
      ('A vê a própria empresa',                  uA, 'authenticated', 'select 1 from public.companies where id = ''' || cA || '''', 'ok', 1),
      ('A NÃO vê a empresa de B',                 uA, 'authenticated', 'select 1 from public.companies where id = ''' || cB || '''', 'ok', 0),
      ('A vê as próprias movimentações',          uA, 'authenticated', 'select 1 from public.transactions where company_id = ''' || cA || '''', 'ok', 1),
      ('A NÃO vê movimentações de B',             uA, 'authenticated', 'select 1 from public.transactions where company_id = ''' || cB || '''', 'ok', 0),
      ('B vê somente 1 empresa (a dele)',         uB, 'authenticated', 'select 1 from public.companies', 'ok', 1),
      ('B NÃO vê movimentações da empresa A',     uB, 'authenticated', 'select 1 from public.transactions where company_id = ''' || cA || '''', 'ok', 0),
      ('B vê somente 1 movimentação (a dele)',    uB, 'authenticated', 'select 1 from public.transactions', 'ok', 1),
      ('B NÃO vê participantes da empresa A',     uB, 'authenticated', 'select 1 from public.company_members where company_id = ''' || cA || '''', 'ok', 0),
      ('B NÃO vê o perfil de A',                  uB, 'authenticated', 'select 1 from public.profiles where id = ''' || uA || '''', 'ok', 0),

      -- Escrita: B não consegue mexer em nada de A
      ('B NÃO insere movimentação na empresa A',  uB, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cA || ''',''income'',''invasão'',''x'',1,current_date)', '42501', null::int),
      ('B NÃO altera movimentação de A',          uB, 'authenticated', 'update public.transactions set amount = 1 where id = ''' || tA || '''', 'ok', 0),
      ('B NÃO apaga movimentação de A',           uB, 'authenticated', 'delete from public.transactions where id = ''' || tA || '''', 'ok', 0),
      ('B NÃO move a própria movimentação p/ A',  uB, 'authenticated', 'update public.transactions set company_id = ''' || cA || ''' where id = ''' || tB || '''', '42501', null),
      ('B NÃO forja created_by',                  uB, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on,created_by) values (''' || cB || ''',''income'',''x'',''x'',1,current_date,''' || uA || ''')', '42501', null),
      ('B NÃO altera a empresa de A',             uB, 'authenticated', 'update public.companies set name = ''hack'' where id = ''' || cA || '''', 'ok', 0),
      ('B NÃO apaga a empresa de A',              uB, 'authenticated', 'delete from public.companies where id = ''' || cA || '''', 'ok', 0),
      ('B NÃO cria empresa direto na tabela',     uB, 'authenticated', 'insert into public.companies (name, owner_id) values (''x'', ''' || uB || ''')', '42501', null),
      ('B NÃO se adiciona como membro de A',      uB, 'authenticated', 'insert into public.company_members (company_id,user_id,role) values (''' || cA || ''',''' || uB || ''',''owner'')', '42501', null),
      ('B NÃO altera o perfil de A',              uB, 'authenticated', 'update public.profiles set display_name = ''hack'' where id = ''' || uA || '''', 'ok', 0),
      ('B insere na própria empresa (permitido)', uB, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cB || ''',''expense'',''Aluguel'',''Aluguel e estrutura'',50.25,current_date)', 'ok', 1),

      -- Visitante sem login
      ('Visitante (anon) NÃO lê movimentações',   null, 'anon', 'select 1 from public.transactions', '42501', null),
      ('Visitante (anon) NÃO cria empresa',       null, 'anon', 'select public.create_company(''x'')', '42501', null),
      ('Logado sem identidade NÃO cria empresa',  null, 'authenticated', 'select public.create_company(''x'')', '28000', null),

      -- Operações legítimas de A
      ('A cria empresa pela função create_company', uA, 'authenticated', 'select public.create_company(''Empresa Teste A2'')', 'ok', 1),
      ('A NÃO cria empresa com nome vazio',       uA, 'authenticated', 'select public.create_company(''   '')', '23514', null),
      ('A atualiza a própria movimentação',       uA, 'authenticated', 'update public.transactions set amount = 150 where id = ''' || tA || '''', 'ok', 1),
      ('A atualiza o próprio perfil',             uA, 'authenticated', 'update public.profiles set display_name = ''Teste A'' where id = ''' || uA || '''', 'ok', 1),
      ('A insere movimentação válida',            uA, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cA || ''',''income'',''Venda'',''Serviços'',100.50,current_date)', 'ok', 1),
      ('Valor zero é rejeitado',                  uA, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cA || ''',''income'',''x'',''x'',0,current_date)', '23514', null),
      ('Tipo inválido é rejeitado',               uA, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cA || ''',''transfer'',''x'',''x'',1,current_date)', '23514', null),
      ('Descrição vazia é rejeitada',             uA, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cA || ''',''income'',''   '',''x'',1,current_date)', '23514', null),
      ('Limite de 5000 movimentações por empresa', uA, 'authenticated',
        'insert into public.transactions (company_id,type,description,category,amount,occurred_on) values (''' || cL || ''',''income'',''excedente'',''x'',1,current_date)', 'P0001', null),
      ('A apaga a própria movimentação',          uA, 'authenticated', 'delete from public.transactions where id = ''' || tA || '''', 'ok', 1)
    ) as t(label, uid, rl, stmt, expect, exp_rows)
  loop
    n := n + 1;
    perform set_config('request.jwt.claims',
      case when c.uid is null then '{}' else json_build_object('sub', c.uid, 'role', c.rl)::text end, true);
    perform set_config('request.jwt.claim.sub', coalesce(c.uid::text, ''), true);
    execute format('set local role %I', c.rl);

    got := 'ok'; rows_n := null;
    begin
      if c.stmt ~* '^\s*select' then
        execute 'select count(*) from (' || c.stmt || ') s' into rows_n;
      else
        execute c.stmt;
        get diagnostics rows_n = row_count;
      end if;
    exception when others then
      got := sqlstate;
    end;
    reset role;

    passed := case when c.expect = 'ok'
                    then got = 'ok' and (c.exp_rows is null or rows_n = c.exp_rows)
                    else got = c.expect end;
    if passed then
      ok := ok + 1;
      rep := rep || format(E'OK      %s\n', c.label);
    else
      bad := bad + 1;
      rep := rep || format(E'FALHOU  %s  (esperado: %s%s | obtido: %s%s)\n', c.label, c.expect,
               coalesce(' / ' || c.exp_rows || ' linhas', ''), got, coalesce(' / ' || rows_n || ' linhas', ''));
    end if;
  end loop;

  -- Falha de propósito: desfaz tudo e mostra o relatório.
  raise exception E'\n===== RELATORIO DE ISOLAMENTO =====\n%\nTotal: %  |  OK: %  |  FALHAS: %\n(Este erro e intencional: nada foi gravado.)', rep, n, ok, bad;
end
$test$;
