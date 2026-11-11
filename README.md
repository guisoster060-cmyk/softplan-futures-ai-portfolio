# Softplan Futures — BusinessMind AI

Portfólio de engenharia de software centrado no **BusinessMind AI**, um MVP para pequenos negócios que precisam acompanhar receitas, despesas e resultados sem depender de planilhas dispersas. A aplicação registra movimentações por empresa e transforma somente dados autorizados em indicadores, gráficos e análises determinísticas.

> Estado em 11/11/2026: a interface e os fluxos financeiros estão disponíveis no staging para demonstração. Hermes v11 está ACTIVE nesse ambiente em modo exclusivamente determinístico. A integração Gemini existe no código, mas permanece bloqueada e não foi validada em execução generativa remota. Esta branch ainda requer revisão antes de integração ao repositório principal.

## Funcionalidades implementadas

- cadastro, login, restauração de sessão, recuperação de senha e logout;
- criação inicial de empresa e associação do usuário;
- CRUD de receitas e despesas persistidas no PostgreSQL, com paginação completa na leitura;
- controle de acesso por JWT, associação à empresa e Row Level Security;
- KPIs, evolução mensal, categorias, alertas e exportação CSV derivados dos dados carregados;
- Hermes determinístico, que separa fatos, estimativas, riscos e recomendações;
- dashboard responsivo com navegação por teclado e suporte a movimento reduzido;
- testes automatizados e integração contínua sem credenciais privadas.

## Tecnologias

HTML semântico, CSS, JavaScript ES modules, SVG, Supabase JS, Supabase Auth, PostgreSQL, RLS, Supabase Edge Functions, Deno, Node.js Test Runner, GitHub Actions e Cloudflare Pages para staging e previews.

Não foram introduzidos React ou Vite. A integração com Gemini está preparada no servidor, mas `STAGING_DETERMINISTIC_ONLY = true` impede chamadas ao provedor e o consumo da autorização única; nenhuma chave privada está no frontend.

## Arquitetura resumida

O navegador serve a aplicação estática e usa a publishable key para autenticar no Supabase. O JWT da sessão acompanha as consultas; policies RLS limitam o acesso à empresa associada. O cliente pagina e valida a leitura antes de calcular indicadores e gráficos. A Edge Function Hermes valida o usuário e a associação à empresa antes de produzir uma resposta determinística. Consulte a [arquitetura completa](projects/businessmind-ai/docs/ARCHITECTURE.md).

## Demonstração

- [BusinessMind AI staging](https://businessmind-ai-staging.pages.dev)
- [Preview histórico da v0.5](https://1cd5c052.businessmind-ai.pages.dev)

O staging é um ambiente de demonstração, não uma produção aprovada. Fluxos autenticados exigem conta de teste autorizada; não use dados financeiros reais.

## Executar e verificar

```bash
cd projects/businessmind-ai
npm ci
python3 -m http.server 8080 --directory app
```

Acesse `http://localhost:8080`. Para executar as verificações que não usam credenciais privadas:

```bash
npm run verify
```

Para verificar a função separadamente:

```bash
cd supabase/functions/hermes
deno check index.ts index_test.ts
deno test --allow-env index_test.ts
```

Execute esses comandos a partir de `projects/businessmind-ai`. O teste de concorrência PostgreSQL local está documentado no [README do projeto](projects/businessmind-ai/README.md).

Na validação local de 11/11/2026, passaram 51/51 testes Node, 28/28 testes Deno com mocks e o teste concorrente em PostgreSQL local. Login, dashboard, indicadores, movimentações e Hermes determinístico foram aprovados manualmente no staging; essa evidência não equivale a uma auditoria completa nem a teste generativo real.

## Documentação

| Documento | Finalidade |
| --- | --- |
| [README do projeto](projects/businessmind-ai/README.md) | Execução, estrutura e limitações |
| [Requisitos](projects/businessmind-ai/docs/REQUIREMENTS.md) | Requisitos, prioridades e aceite |
| [Arquitetura](projects/businessmind-ai/docs/ARCHITECTURE.md) | Componentes, fluxos, dados e segurança |
| [Decisões técnicas](projects/businessmind-ai/docs/TECHNICAL_DECISIONS.md) | Decisões e trade-offs |
| [Diário de engenharia](projects/businessmind-ai/docs/ENGINEERING_LOG.md) | Entregas, evidências e responsabilidades |
| [Testes](projects/businessmind-ai/docs/TESTING.md) | Estratégia, resultados e limitações |
| [Método de desenvolvimento com IA](projects/businessmind-ai/docs/AI_DEVELOPMENT_METHOD.md) | Processo e divisão real de responsabilidades |
| [Estado atual](projects/businessmind-ai/docs/PROJECT_STATUS.md) | Concluído, pendências e riscos |
| [Índice de tarefas delegadas](projects/businessmind-ai/docs/PROMPT_LOG.md) | Especificações técnicas derivadas, não prompts literais |
| [Acervo histórico](docs/businessmind-ai/README.md) | Planejamento, validação e registros preservados |

## Autoria e transparência

Guilherme Soster Santeti responde pela concepção, direcionamento, decisões de produto, ambiente externo e validação humana. Ferramentas de IA apoiaram análise, implementação, testes e redação técnica. Todo resultado permanece sujeito a revisão humana; a documentação não atribui experiência profissional ou testes sem evidência.

[Perfil no GitHub](https://github.com/guisoster060-cmyk)
