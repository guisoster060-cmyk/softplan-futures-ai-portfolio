# Estado atual do BusinessMind AI

Atualizado em: 10/11/2026

## Resumo executivo

As entregas v0.4, v0.5 Visual e documentação profissional foram auditadas e integradas em `new-branch` pelos PRs #1, #2 e #3. A `main` recebeu somente o workflow manual de staging pelo PR #5. O Hermes com Gemini está implementado em branch própria, mas permanece desativado, sem deploy, secrets da função ou uso de dados reais pelo provedor. A paginação do frontend e o build isolado de staging estão no commit `d15282a` e a validação pós-build em `c4fba528`; a correção adicional da Edge Function descrita aqui é local, ainda sem commit ou push.

## Entregas concluídas

- [x] Supabase Auth, sessão, recuperação e logout.
- [x] Onboarding de empresa por RPC e vínculo de usuário.
- [x] CRUD de movimentações com PostgreSQL e RLS.
- [x] Indicadores, gráficos e CSV derivados de dados autorizados.
- [x] Interface v0.5 responsiva e Hermes determinístico.
- [x] Documentação canônica, testes e GitHub Actions.
- [x] Auditoria e integração dos PRs #1–#3 em `new-branch`.
- [x] Cliente Hermes preparado para Edge Function com fallback.
- [x] Edge Function Gemini com JWT, validação de empresa, agregação, timeout e limites.
- [x] Gate de ativação global e allowlist manual por empresa, ambos desabilitados por padrão; opt-in auditável pelo proprietário permanece pendente.
- [x] 33 verificações HTTP reais com JWTs no staging, sem falhas; duas empresas fictícias remanescentes e zero movimentações.
- [x] Paginação completa no frontend, build separado de staging e teste E2E local em Chromium com mocks.
- [x] Correção local da paginação da Edge Function, cálculo em centavos, minimização do payload e testes Deno ampliados; ainda não versionada.

## Evidências Git

| Entrega | Referência | Estado |
| --- | --- | --- |
| Integração Supabase v0.4 | PR #1, merge `5ee367a` | Integrada em `new-branch` |
| Interface v0.5 | PR #2, merge `209120b` | Integrada em `new-branch` |
| Documentação profissional | PR #3, merge `5744db2` | Integrada em `new-branch` |
| Hermes com Gemini | branch `codex/businessmind-hermes-gemini` | Implementado localmente; PR pendente nesta entrega |

## Situação operacional do Hermes

| Componente | Situação |
| --- | --- |
| Motor determinístico | Ativo no frontend |
| Integração frontend–função | Implementada, toggle `false` |
| Edge Function | Implementada, não implantada |
| Modelo | `gemini-3.5-flash-lite` selecionado |
| Chave Gemini | Não configurada |
| Consentimento para agregados reais | Não concedido/configurado; allowlist de servidor vazia |
| Teste remoto Gemini | Não executado; HTTP de Auth/CRUD/RLS no staging executado separadamente |

## Pendências para implantação

1. Revisão humana do PR Hermes e da política de tratamento de dados.
2. Decisão explícita sobre uso do Free Tier, cujos termos permitem uso de dados para melhoria de produtos.
3. Criação da chave no Google AI Studio sem habilitar faturamento.
4. Definição de um processo auditável de aprovação/retirada por empresa. A allowlist manual `HERMES_APPROVED_COMPANY_IDS` não é um fluxo self-service.
5. Configuração futura e autorizada de `GEMINI_API_KEY`, `GEMINI_MODEL`, `ALLOWED_ORIGINS`, `HERMES_DATA_SHARING_APPROVED` e da allowlist no staging, somente após aprovações.
6. Deploy autorizado e testes inicialmente com dados fictícios/agregados.
7. Teste E2E de JWT, RLS, CORS, erro, timeout e fallback.
8. Rate limiting distribuído se o recurso avançar além do MVP.
9. Ativação de `hermesGenerativeEnabled` somente após as etapas anteriores.

## Riscos e limitações

- `app.js` ainda concentra UI, estado e acesso remoto.
- A Edge Function passou em `deno check` e 21 testes locais com mocks nesta correção; RLS real no fluxo Hermes e integração remota continuam pendentes.
- O limite em memória atua por instância e não é garantia global.
- E2E autenticado, SMTP, dispositivos físicos e matriz cross-browser permanecem pendentes.
- O teste SQL de 34 casos continua sendo resultado manual informado, não reproduzido nesta branch.
- A validação técnica não equivale à validação de mercado.

## Proposta de simplificação — sem exclusões

| Grupo | Situação | Proposta para revisão humana |
| --- | --- | --- |
| `projects/businessmind-ai/app/` | Essencial | Manter integralmente |
| `supabase/migrations/`, `functions/`, `tests/` | Essencial | Manter; separar claramente o que foi implantado do que é preparação |
| Documentos canônicos em `projects/businessmind-ai/docs/` | Essencial | Manter como fonte atual |
| `versions/v0.3/` | Histórico útil | Manter enquanto demonstra evolução; considerar tag/release em limpeza futura |
| `docs/businessmind-ai/` | Histórico/governança | Manter o índice; avaliar arquivamento de versões redundantes em uma pasta `archive/` |
| `ARCHITECTURE_V0.4.md` e proposta técnica v0.4 | Superados, mas rastreáveis | Preservar como histórico ou mover em operação posterior autorizada |
| ZIPs e artefatos temporários | Não rastreados no projeto atual | Não adicionar ao Git; preservar externamente se necessários como fonte |
| Previews antigos | Úteis para comparação | Documentar apenas os relevantes; não tratá-los como produção |

Nenhum arquivo foi excluído nesta etapa.
