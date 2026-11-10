# BusinessMind AI v0.4

MVP estático de inteligência empresarial em HTML, CSS e JavaScript puro, preservando a interface da v0.3 e usando Supabase Auth, PostgreSQL e RLS.

## Estrutura

- `app/`: aplicação ativa v0.4.
- `versions/v0.3/`: referência original e inalterada recebida no ZIP.
- `supabase/migrations/`: migração já aplicada manualmente pelo responsável do projeto.
- `supabase/tests/`: teste SQL de isolamento executado manualmente pelo responsável.
- `supabase/functions/hermes/`: arquitetura de IA em Edge Function, ainda não implantada.
- `tests/`: testes automatizados locais sem credenciais privadas.

## Execução local

Sirva a pasta `app/` por HTTP; abrir por `file://` pode impedir recursos de autenticação:

```bash
python3 -m http.server 8080 --directory app
```

Abra `http://localhost:8080`. A URL do projeto e a publishable key ficam em `app/config.js`; ambos são valores públicos por desenho. Nunca coloque `service_role`, secret key ou chave de IA no frontend.

## Fluxo funcional

1. Cadastro ou login por e-mail e senha.
2. Restauração automática da sessão pelo Supabase.
3. Cadastro da primeira empresa via RPC `create_company`.
4. CRUD de movimentações protegido por RLS.
5. Indicadores, gráficos, CSV e análises determinísticas calculados apenas dos dados carregados.
6. Perfil e nome da empresa persistidos no PostgreSQL.

## Verificação

```bash
npm ci
npm run verify
```

Esses testes não acessam o Supabase remoto. O teste SQL presente em `supabase/tests/` não deve ser executado novamente sem autorização.

## Hermes

O Hermes permanece funcional no frontend na camada determinística. A camada generativa está preparada em `supabase/functions/hermes/`, consulta dados com o JWT do usuário e envia somente agregados ao provedor. Deploy e segredos de servidor ainda dependem de autorização e da aprovação de um provedor.

## Limitações conhecidas

- O envio de e-mail de confirmação e recuperação depende da configuração SMTP do projeto Supabase.
- A Edge Function Hermes ainda não foi implantada.
- Testes ponta a ponta com uma conta real dependem de credenciais de teste e não fazem parte da CI pública.
- Não foi criada nem alterada nenhuma tabela nesta implementação.
