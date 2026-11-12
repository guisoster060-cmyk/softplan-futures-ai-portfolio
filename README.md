# Softplan Futures — BusinessMind AI

> **Para avaliadores da Softplan Futures:** [Comece aqui — teste guiado em 5–10 minutos](projects/businessmind-ai/docs/START_HERE_RECRUITER.md) · [Conferência com requisitos oficiais](projects/businessmind-ai/docs/SOFTPLAN_FUTURES_REQUIREMENTS_CHECK_2026-11-12.md) · [Prévia funcional com Gemini limitado](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev). Use dados fictícios. A demo pública separada não aciona Gemini.

> **Atualização de entrega — 12/11/2026, 19h45 BRT:** Na prévia isolada [BusinessMind AI com Gemini limitado](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev), o usuário confirmou cadastro, acesso, criação de empresa, separação visual entre contas e interpretação generativa. O Supabase registrou `claim=accepted` e `provider=accepted` em 22:45 UTC na função `hermes-recruiter` v2. A quota global registrou 2 consultas em 12/11. A execução [GitHub Actions #43322922898](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/actions/runs/43322922898) passou. **A demonstração pública sem cadastro e o staging antigo não devem ser descritos como tendo Gemini ativado.** Evidências detalhadas em [HERMES_RECRUITER_LIMITED_2026-11-12.md](projects/businessmind-ai/docs/HERMES_RECRUITER_LIMITED_2026-11-12.md). Capturas existentes são da demonstração fictícia e não devem ser rotuladas como screenshots da prévia Gemini.

> **Atualização verificada em 12/11/2026:** o staging recebeu novo deploy e uma consulta Hermes retornou HTTP 200, com resposta determinística observada no Android. A autorização única de teste Gemini foi consumida, mas **não há evidência de resposta generativa**. O Gemini permanece experimental e não deve ser anunciado como validado. As referências históricas abaixo descrevem versões anteriores. [Estado de entrega e evidências](projects/businessmind-ai/docs/DELIVERY_STATUS_2026-11-12.md).

**Problema:** pequenos negócios podem registrar receitas e despesas em fontes dispersas e perder visibilidade do resultado. **Solução:** o BusinessMind AI reúne movimentações por empresa, calcula indicadores a partir dos registros carregados e oferece explicações determinísticas pelo Hermes. É um MVP de portfólio, não um produto comercial validado.

> Estado em 11/11/2026: `new-branch` contém as atualizações de documentação e o MVP; o staging real foi testado manualmente com cadastro por e-mail, confirmação, criação de empresa e movimentação. O Hermes opera em modo determinístico; Gemini generativo não está ativado. A demonstração pública fictícia está publicada separadamente.

**Revisão de 12/11/2026:** o frontend público do staging coincide byte a byte com o PR #24 e pode consultar a Edge Function, mas continua exibindo o cálculo mensal local. A função remota v12 segue determinística. A preparação generativa desta branch não foi publicada nem validada com uma chamada real. O [plano de ensaio](projects/businessmind-ai/docs/GEMINI_VALIDATION_PLAN.md) registra as pré-condições e o bloqueio de segurança encontrado.

## Avaliação em dois minutos

1. Abra a [demonstração pública sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev): os dados são fictícios e ficam somente no navegador. A versão com Supabase Auth e PostgreSQL está no [staging](https://businessmind-ai-staging.pages.dev); use apenas dados fictícios.
2. Veja as quatro telas abaixo; depois, se quiser testar o fluxo, crie uma movimentação em **Indicadores**, confira o dashboard e pergunte ao Hermes em **Inteligência**.
3. Para avaliar engenharia e limites, consulte o [roteiro de avaliação](projects/businessmind-ai/docs/REVIEW_GUIDE.md), a [arquitetura](projects/businessmind-ai/docs/ARCHITECTURE.md) e as [evidências de testes](projects/businessmind-ai/docs/TESTING.md).

## Quatro telas principais

Capturas do **modo público fictício**, em celular. Não comprovam autenticação nem RLS remotos. [Galeria e origem das imagens](projects/businessmind-ai/screenshots/README.md).

| Visão geral — resultado do mês | Indicadores — filtros e movimentações |
| --- | --- |
| ![Visão geral no celular](projects/businessmind-ai/screenshots/01-visao-geral.png) | ![Indicadores no celular](projects/businessmind-ai/screenshots/02-indicadores.png) |
| Inteligência — Hermes determinístico | Configurações — perfil de demonstração |
| ![Hermes no celular](projects/businessmind-ai/screenshots/03-inteligencia.png) | ![Configurações no celular](projects/businessmind-ai/screenshots/04-configuracoes.png) |

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

HTML semântico, CSS, JavaScript, SVG, Supabase JS/Auth, PostgreSQL com RLS, Supabase Edge Functions, Deno, Node.js Test Runner e GitHub Actions. O staging usa Cloudflare Pages; a demonstração fictícia pública é servida por Cloudflare Workers.

Não foram introduzidos React ou Vite. A integração com Gemini está preparada no servidor, mas `STAGING_DETERMINISTIC_ONLY = true` impede chamadas ao provedor e o consumo da autorização única; nenhuma chave privada está no frontend.

## Arquitetura resumida

O navegador serve a aplicação estática e usa a publishable key para autenticar no Supabase. O JWT da sessão acompanha as consultas; policies RLS limitam o acesso à empresa associada. O cliente pagina e valida a leitura antes de calcular indicadores e gráficos. A Edge Function Hermes valida o usuário e a associação à empresa antes de produzir uma resposta determinística. Consulte a [arquitetura completa](projects/businessmind-ai/docs/ARCHITECTURE.md).

## Demonstração

- [Demonstração pública, sem senha, com dados fictícios](https://businessmind-ai-demo.guisoster060.workers.dev)
- [Sistema real de testes, com cadastro e PostgreSQL](https://businessmind-ai-staging.pages.dev)
- [Galeria complementar: navegação mobile e indicadores em detalhe](projects/businessmind-ai/screenshots/README.md)

O staging é um ambiente de testes, não uma produção aprovada. Em 11/11/2026 foi confirmado um cadastro novo com e-mail, criação de empresa e persistência de uma movimentação. A disponibilidade de confirmação de e-mail continua sujeita aos limites do serviço. Não use dados financeiros reais.

A demonstração pública está publicada separadamente, sem Supabase nem IA externa; ela não comprova Auth ou RLS remotos. Consulte o [roteiro do recrutador](projects/businessmind-ai/docs/REVIEW_GUIDE.md).

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

Na Missão 2 (11/11/2026), passaram 54/54 testes Node e 28/28 testes Deno com mocks. O teste concorrente em PostgreSQL local foi aprovado anteriormente, mas não reexecutado nesta missão. Login, dashboard, indicadores, movimentações e Hermes determinístico foram aprovados manualmente no staging em validações anteriores; essas evidências não equivalem a uma auditoria completa nem a teste generativo real.

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
| [Roteiro de avaliação](projects/businessmind-ai/docs/REVIEW_GUIDE.md) | Caminho curto para demonstração e evidências |
| [Apresentação para recrutador](projects/businessmind-ai/docs/RECRUITER_PRESENTATION.md) | Roteiros opcionais de 2–3 e 5 minutos; nenhum vídeo gravado |
| [Plano de validação Gemini](projects/businessmind-ai/docs/GEMINI_VALIDATION_PLAN.md) | Condições para eventual ativação, ainda não autorizada |
| [Acervo histórico](docs/businessmind-ai/README.md) | Planejamento, validação e registros preservados |

## Autoria e transparência

Guilherme Soster Santeti responde pela concepção, direcionamento, decisões de produto, ambiente externo e validação humana. Ferramentas de IA apoiaram análise, implementação, testes e redação técnica. Todo resultado permanece sujeito a revisão humana; a documentação não atribui experiência profissional ou testes sem evidência.

[Perfil no GitHub](https://github.com/guisoster060-cmyk)
