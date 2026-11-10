# Arquitetura técnica — BusinessMind AI v0.4

## Frontend

A aplicação continua estática, sem framework e sem build. `supabase-js` 2.84.0 é carregado por CDN com versão fixada. `config.js` contém somente URL e publishable key públicas.

## Autenticação e sessão

Supabase Auth gerencia cadastro, login, restauração de sessão, renovação de token, recuperação de senha e logout. O trigger `handle_new_user` da migração cria `profiles` no cadastro.

## Empresa e autorização

O frontend nunca insere diretamente em `companies` ou `company_members`. A criação inicial usa exclusivamente `create_company(p_name)`, que cria empresa e associação de proprietário em uma transação. Todas as consultas e mutações usam o JWT do usuário e continuam sujeitas ao RLS.

## Movimentações e indicadores

O CRUD acessa `transactions` pelo cliente público. O frontend não envia `created_by`; o banco preenche `auth.uid()`. Indicadores e gráficos são derivados em memória das linhas realmente retornadas pelo banco. Banco vazio produz valores zero e estados sem dados.

## Hermes

O frontend oferece análises determinísticas sobre dados carregados. A Edge Function opcional:

1. valida o JWT;
2. consulta `transactions` com o token do usuário;
3. agrega os valores no servidor;
4. envia apenas agregados ao provedor aprovado;
5. mantém `HERMES_API_KEY` exclusivamente nos segredos da função.

Nenhuma Edge Function foi implantada e nenhum provedor pago foi contratado.

## Segurança

- Nenhuma chave administrativa no frontend.
- RLS é a autoridade de isolamento entre empresas.
- Validação de entrada existe no navegador e no schema PostgreSQL.
- A CI não usa credenciais nem acessa o banco remoto.
- A migração e os testes SQL importados são preservados como evidência e não foram executados nesta implementação.
