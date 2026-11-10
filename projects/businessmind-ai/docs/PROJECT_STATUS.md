# Estado atual do BusinessMind AI

Atualizado em: 10/11/2026

## Resumo executivo

As entregas v0.4, v0.5 Visual e documentação profissional foram auditadas e integradas em `new-branch` pelos PRs #1, #2 e #3. A `main` não foi alterada. O Hermes com Gemini está implementado em branch própria, mas permanece desativado, sem deploy, secrets ou uso de dados reais.

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
- [x] Gate de consentimento e ativação desabilitado por padrão.

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
| Consentimento para agregados reais | Não concedido/configurado |
| Teste remoto Gemini/Supabase | Não executado |

## Pendências para implantação

1. Revisão humana do PR Hermes e da política de tratamento de dados.
2. Decisão explícita sobre uso do Free Tier, cujos termos permitem uso de dados para melhoria de produtos.
3. Criação da chave no Google AI Studio sem habilitar faturamento.
4. Configuração de `GEMINI_API_KEY`, `GEMINI_MODEL`, `ALLOWED_ORIGINS` e `HERMES_DATA_SHARING_APPROVED` nos secrets da função.
5. Deploy autorizado e testes inicialmente com dados fictícios/agregados.
6. Teste E2E de JWT, RLS, CORS, erro, timeout e fallback.
7. Rate limiting distribuído se o recurso avançar além do MVP.
8. Ativação de `hermesGenerativeEnabled` somente após as etapas anteriores.

## Riscos e limitações

- `app.js` ainda concentra UI, estado e acesso remoto.
- A Edge Function não pôde ser validada em runtime Deno neste ambiente.
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
