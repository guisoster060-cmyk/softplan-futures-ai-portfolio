# BusinessMind AI — MVP para demonstração

MVP web de inteligência empresarial em HTML, CSS e JavaScript puro. Ele reúne movimentações financeiras por empresa, calcula indicadores a partir de dados autorizados e oferece análises determinísticas pelo Hermes. O objetivo é tornar receitas, despesas e resultados consultáveis em uma interface única, preservando o isolamento entre empresas.

## Capacidades atuais

- Supabase Auth: cadastro, confirmação quando configurada, login, sessão, recuperação e logout;
- onboarding e criação de outras empresas pela RPC `create_company`, com seletor da empresa ativa;
- leitura, criação, edição e exclusão de receitas e despesas;
- isolamento multiempresa com PostgreSQL, constraints, grants e RLS;
- saldo, receitas, despesas, margem, série mensal, categorias e alertas calculados sem dados fictícios;
- exportação CSV;
- experiência responsiva para desktop, tablet e celular;
- estados vazios, carregamento, erros, feedback, foco visível e `prefers-reduced-motion`;
- leitura paginada de movimentações, com validação de completude antes de calcular totais;
- Hermes determinístico no staging e integração Gemini preparada no servidor, porém bloqueada.

## Tecnologias e decisões

| Camada | Tecnologia |
| --- | --- |
| Interface | HTML semântico, CSS custom properties, JavaScript ES modules e SVG |
| Backend gerenciado | Supabase Auth, PostgREST, RPC e Edge Function Hermes |
| Dados | PostgreSQL com RLS |
| Qualidade | Node.js Test Runner, Deno, PostgreSQL local, verificações estáticas e GitHub Actions |
| Preview | Cloudflare Pages |

A aplicação permanece estática e sem framework. O build opcional de staging somente copia os arquivos para uma saída isolada com configuração pública de teste; não altera `app/config.js`. A avaliação de Apache ECharts concluiu que o gráfico SVG existente atende ao MVP com menor custo de dependência.

## Estrutura

```text
projects/businessmind-ai/
├── app/                  # aplicação v0.5 ativa
├── docs/                 # documentação técnica canônica
├── scripts/              # verificações locais/CI
├── supabase/
│   ├── functions/hermes/ # assistente determinístico e integração generativa bloqueada
│   ├── migrations/       # schema versionado
│   ├── staging-migrations/ # trava de teste, exclusiva do staging
│   └── tests/            # teste SQL manual/controlado
├── tests/                # testes automatizados sem segredos
└── versions/v0.3/        # baseline histórica preservada
```

## Execução local

Requisitos: Python 3 para o servidor estático e Node.js 20+ para as verificações.

```bash
npm ci
python3 -m http.server 8080 --directory app
```

Abra `http://localhost:8080`. O arquivo `app/config.js` contém apenas a URL e a publishable key, valores públicos por desenho. Nunca adicione `service_role`, secret key ou chave de provedor de IA ao cliente.

## Fluxo de dados e segurança

1. O usuário autentica pelo Supabase Auth.
2. O cliente restaura a sessão e recebe um JWT.
3. O trigger de Auth cria o perfil; `create_company` cria empresa e vínculo de forma transacional.
4. Consultas e alterações em `transactions` são avaliadas pelas policies RLS.
5. O cliente pagina a consulta autorizada, valida contagem e completude e só então calcula indicadores. Falhas não são apresentadas como totais válidos.

O procedimento para gerar um preview separado apontado ao Supabase staging está em [STAGING_PREVIEW.md](docs/STAGING_PREVIEW.md). Nenhum deploy é feito pelo build local.

Detalhes e limites de confiança estão em [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Testes

```bash
npm run verify
```

O comando executa análise estática, testes Node e consistência documental. Ele não acessa o Supabase remoto. Para a Edge Function, instale Deno 2.5.6 e execute:

```bash
cd supabase/functions/hermes
deno check index.ts index_test.ts
deno test --allow-env index_test.ts
```

De volta a `projects/businessmind-ai`, `node tests/hermes-one-shot-postgres.mjs` executa o teste transacional local; requer Docker e a imagem `postgres:17-alpine`. O teste em `supabase/tests/` depende de ambiente autorizado. Veja [TESTING.md](docs/TESTING.md).

Na Missão 2 (11/11/2026), passaram **54/54 testes Node** e **28/28 testes Deno com mocks**. O teste concorrente em PostgreSQL local e os fluxos manuais de login, dashboard, indicadores, movimentações e Hermes determinístico no staging foram aprovados em validações anteriores, não reexecutadas nesta missão. Mocks não comprovam execução generativa remota.

## Demonstração

- [Aplicação no staging](https://businessmind-ai-staging.pages.dev)
- [Preview histórico da v0.5](https://1cd5c052.businessmind-ai.pages.dev)

O staging é exclusivo para demonstração e validação com contas e dados fictícios; não é uma implantação de produção aprovada.

Sem credenciais, há um [roteiro de avaliação](docs/REVIEW_GUIDE.md) e um build local isolado com dados fictícios (`npm run build:demo-preview`). Esse modo não consulta Supabase e ainda não está publicado; não equivale a testar Auth ou RLS reais.

## Hermes

A análise determinística funciona no frontend e permanece como fallback. A Edge Function Hermes v11 está ACTIVE no Supabase staging: valida JWT, confirma a associação usuário–empresa sob RLS e calcula agregados em código. O `STAGING_DETERMINISTIC_ONLY = true` retorna antes da reivindicação de uso único e de qualquer chamada ao Gemini, inclusive se os demais controles generativos estiverem ativos.

A integração Gemini existe no código do servidor, mas não foi validada por execução generativa remota e não está habilitada para a demonstração. Qualquer ativação futura requer revisão da proteção, autorização explícita para tratamento de dados e testes próprios; não é uma funcionalidade concluída do MVP. Consulte o [guia da função](supabase/functions/hermes/README.md) e as [decisões técnicas](docs/TECHNICAL_DECISIONS.md).

## Limitações conhecidas

- confirmação e recuperação por e-mail dependem da configuração SMTP do projeto Supabase;
- E2E autenticado com conta real não integra a CI pública;
- o modo generativo do Hermes está bloqueado e não passou por teste remoto; os testes Deno usam mocks;
- a leitura é paginada, mas o limite de 5.000 movimentações e alterações simultâneas entre páginas exigem tratamento adicional para volumes maiores;
- auditoria formal de acessibilidade e matriz cross-browser estão pendentes;
- `new-branch` contém os PRs #1–#4, mas permanece separada de `main`; promoção a produção depende de revisão e autorização humana.

## Documentação técnica

- [Requisitos](docs/REQUIREMENTS.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Decisões](docs/TECHNICAL_DECISIONS.md)
- [Diário de engenharia](docs/ENGINEERING_LOG.md)
- [Estratégia de testes](docs/TESTING.md)
- [Desenvolvimento assistido por IA](docs/AI_DEVELOPMENT_METHOD.md)
- [Estado atual](docs/PROJECT_STATUS.md)
- [Índice de tarefas delegadas](docs/PROMPT_LOG.md)
- [Roteiro de avaliação](docs/REVIEW_GUIDE.md)
- [Plano de validação Gemini](docs/GEMINI_VALIDATION_PLAN.md)
- [Design system v0.5](docs/DESIGN_SYSTEM_V0.5.md)

## Responsabilidades

A concepção, o direcionamento, as decisões externas e a validação final são humanas. A implementação e a documentação receberam assistência de IA, com resultados rastreados por commits, PRs e testes. Consulte [AI_DEVELOPMENT_METHOD.md](docs/AI_DEVELOPMENT_METHOD.md).
