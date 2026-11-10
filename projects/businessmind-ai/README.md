# BusinessMind AI v0.5 Visual

MVP web de inteligência empresarial em HTML, CSS e JavaScript puro. O produto registra movimentações financeiras por empresa, calcula indicadores a partir dos dados autorizados e oferece análises determinísticas por meio do Hermes.

## Capacidades atuais

- Supabase Auth: cadastro, confirmação quando configurada, login, sessão, recuperação e logout;
- onboarding da primeira empresa pela RPC `create_company`;
- leitura, criação, edição e exclusão de receitas e despesas;
- isolamento multiempresa com PostgreSQL, constraints, grants e RLS;
- saldo, receitas, despesas, margem, série mensal, categorias e alertas calculados sem dados fictícios;
- exportação CSV;
- experiência responsiva para desktop, tablet e celular;
- estados vazios, carregamento, erros, feedback, foco visível e `prefers-reduced-motion`;
- Hermes determinístico funcional e scaffold de integração generativa no servidor.

## Tecnologias e decisões

| Camada | Tecnologia |
| --- | --- |
| Interface | HTML semântico, CSS custom properties, JavaScript ES modules e SVG |
| Backend gerenciado | Supabase Auth, PostgREST, RPC e Edge Functions (scaffold) |
| Dados | PostgreSQL com RLS |
| Qualidade | Node.js Test Runner, verificações estáticas e GitHub Actions |
| Preview | Cloudflare Pages |

A aplicação permanece estática e sem framework porque o escopo atual não justifica uma cadeia de build. A avaliação de Apache ECharts concluiu que o gráfico SVG existente atende ao volume e às interações do MVP com menor custo de dependência.

## Estrutura

```text
projects/businessmind-ai/
├── app/                  # aplicação v0.5 ativa
├── docs/                 # documentação técnica canônica
├── scripts/              # verificações locais/CI
├── supabase/
│   ├── functions/hermes/ # scaffold da integração generativa
│   ├── migrations/       # schema versionado
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
3. No primeiro acesso, `create_company` cria empresa, perfil e vínculo de forma transacional.
4. Consultas e alterações em `transactions` são avaliadas pelas policies RLS.
5. O cliente calcula e renderiza indicadores apenas com registros retornados pela consulta autorizada.

Detalhes e limites de confiança estão em [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Testes

```bash
npm run verify
```

O comando executa análise estática, testes Node e consistência documental. Ele não acessa o Supabase remoto. O teste em `supabase/tests/` deve ser executado somente em ambiente autorizado; o resultado manual histórico não substitui uma execução reproduzível. Veja [TESTING.md](docs/TESTING.md).

## Demonstração

- [Preview da branch v0.5](https://codex-businessmind-v0-5-visu.businessmind-ai.pages.dev)
- [Preview imutável](https://1cd5c052.businessmind-ai.pages.dev)

São previews de revisão, não uma implantação de produção aprovada.

## Hermes

A análise determinística funciona no frontend. O scaffold em `supabase/functions/hermes/` define a fronteira para um futuro provedor generativo: valida o JWT, consulta dados autorizados e envia somente agregados. Não houve escolha de provedor, configuração de segredo, deploy ou teste remoto dessa função.

## Limitações conhecidas

- confirmação e recuperação por e-mail dependem da configuração SMTP do projeto Supabase;
- E2E autenticado com conta real não integra a CI pública;
- a Edge Function Hermes não foi implantada;
- paginação e estratégia para grandes volumes ainda não foram implementadas;
- auditoria formal de acessibilidade e matriz cross-browser estão pendentes;
- a v0.5 permanece em PR, ainda fora da `main`.

## Documentação técnica

- [Requisitos](docs/REQUIREMENTS.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Decisões](docs/TECHNICAL_DECISIONS.md)
- [Diário de engenharia](docs/ENGINEERING_LOG.md)
- [Estratégia de testes](docs/TESTING.md)
- [Desenvolvimento assistido por IA](docs/AI_DEVELOPMENT_METHOD.md)
- [Estado atual](docs/PROJECT_STATUS.md)
- [Índice de tarefas delegadas](docs/PROMPT_LOG.md)
- [Design system v0.5](docs/DESIGN_SYSTEM_V0.5.md)

## Responsabilidades

A concepção, o direcionamento, as decisões externas e a validação final são humanas. A implementação e a documentação receberam assistência de IA, com resultados rastreados por commits, PRs e testes. Consulte [AI_DEVELOPMENT_METHOD.md](docs/AI_DEVELOPMENT_METHOD.md).
