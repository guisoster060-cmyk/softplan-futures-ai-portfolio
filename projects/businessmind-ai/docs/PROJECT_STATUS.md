# Estado atual do BusinessMind AI

Atualizado em: **13/11/2026**. Esta seção é a fonte atual; o restante do documento preserva evidências e decisões históricas.

## Estado atual para a candidatura

- **Demo pública:** https://businessmind-ai-demo.guisoster060.workers.dev — acesso sem cadastro, dados fictícios locais, indicadores e Hermes determinístico. Não usa Supabase remoto nem Gemini generativo.
- **Publicação:** GitHub Actions `Deploy BusinessMind public demo` **#3** aprovado em 13/11/2026. A Cloudflare registrou novo deploy do Worker `businessmind-ai-demo` às **23:25 UTC**, pelo Wrangler, com **100% do tráfego** na nova versão.
- **Correção visual:** remoção do emoji 👋 integrada à `main` pelo PR **#33** antes do deploy.
- **Staging:** Supabase Auth, PostgreSQL e RLS em ambiente de teste separado; as evidências de autenticação, SQL e HTTP documentadas referem-se às execuções históricas, não a um novo E2E remoto nesta revisão.
- **Gemini:** permanece desativado na demo pública e no staging determinístico. Houve **ensaio remoto controlado em prévia isolada**, com HTTP 200 e interpretação no navegador. Não representa validação generativa completa nem ativação geral.
- **Limitações:** testes Windows/Safari, E2E remoto contínuo, e-mail/SMTP, acessibilidade formal e privacidade/consentimento para uso de dados reais continuam pendentes.

## Histórico técnico (até 11/11/2026)

As menções abaixo a branch `new-branch`, demo não publicada e Gemini não testado remotamente descrevem **o estado anterior**, não o estado atual de 13/11/2026.
## Entregas concluídas

- [x] Supabase Auth, sessão, recuperação e logout.
- [x] Onboarding de empresa por RPC e vínculo de usuário.
- [x] CRUD de movimentações com PostgreSQL e RLS.
- [x] Indicadores, gráficos e CSV derivados de dados autorizados.
- [x] Interface v0.5 responsiva e Hermes determinístico.
- [x] Documentação canônica, testes e GitHub Actions.
- [x] Integração dos PRs #1–#4, #8 e #9 em `new-branch`, ainda sem promoção a `main`.
- [x] Cliente Hermes preparado para Edge Function com fallback.
- [x] Edge Function Gemini com JWT, validação de empresa, agregação, timeout e limites.
- [x] Gate de ativação global e allowlist manual por empresa, ambos desabilitados por padrão; opt-in auditável pelo proprietário permanece pendente.
- [x] 33 verificações HTTP reais com JWTs no staging, sem falhas; duas empresas fictícias remanescentes e zero movimentações.
- [x] Paginação completa no frontend, build separado de staging e teste E2E local em Chromium com mocks.
- [x] Paginação da Edge Function, cálculo em centavos e minimização do payload versionados; limite de 5.000 linhas e ausência de snapshot entre páginas permanecem limitações.
- [x] Hermes v11 implantado no staging em modo determinístico; login, dashboard, indicadores, movimentações e Hermes determinístico validados manualmente nesse ambiente.

## Evidências Git

| Entrega | Referência | Estado |
| --- | --- | --- |
| Integração Supabase v0.4 | PR #1, merge `5ee367a` | Integrada em `new-branch` |
| Interface v0.5 | PR #2, merge `209120b` | Integrada em `new-branch` |
| Documentação profissional | PR #3, merge `5744db2` | Integrada em `new-branch` |
| Hermes e proteção determinística | PR #4, merge `6c6c549` | Integrado em `new-branch`; Edge Function v11 implantada no staging |

## Situação operacional do Hermes

| Componente | Situação |
| --- | --- |
| Motor determinístico | Ativo no frontend e validado manualmente no staging |
| Integração frontend–função | Implementada; `hermesGenerativeEnabled=false` no preview |
| Edge Function | v11 ACTIVE no staging, `verify_jwt=true`; não implantada em produção |
| Proteção de staging | `STAGING_DETERMINISTIC_ONLY=true`; retorno antes da RPC e do fetch generativo |
| Gemini | Integração no código, bloqueada e sem teste generativo remoto; presença de chave não equivale a ativação |
| Consentimento para agregados reais | Não aprovado para uso real; controles de servidor não substituem opt-in auditável |
| Testes remotos | Fluxos financeiros e Hermes determinístico validados no staging; Gemini não testado remotamente |

## Pendências para implantação

1. Revisão humana do tratamento de dados antes de qualquer ativação generativa; o merge do PR #4 não autoriza essa ativação.
2. Decisão explícita sobre uso do Free Tier, cujos termos permitem uso de dados para melhoria de produtos.
3. Revisão da configuração da chave no servidor e das condições de uso, sem expor seu valor nem assumir que a presença do secret autoriza chamadas.
4. Definição de um processo auditável de aprovação/retirada por empresa. A allowlist manual `HERMES_APPROVED_COMPANY_IDS` não é um fluxo self-service.
5. Revisão e autorização explícita dos controles de ativação no staging; manter o bloqueio determinístico até um plano de testes generativos aprovado.
6. Validação remota futura do caminho generativo somente com dados fictícios/agregados e autorização específica; o deploy determinístico já ocorreu.
7. Ampliar testes remotos da função para JWT, isolamento, CORS, erro e timeout; os testes locais com mocks não substituem essa validação.
8. Rate limiting distribuído se o recurso avançar além do MVP.
9. Ativação de `hermesGenerativeEnabled` somente após as etapas anteriores.

## Riscos e limitações

- `app.js` ainda concentra UI, estado e acesso remoto.
- A revisão local registrou 52/52 testes Node e 28/28 testes Deno com mocks; o teste concorrente PostgreSQL local passou em validação anterior. Mocks não comprovam o caminho generativo nem todos os cenários remotos de RLS da função.
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
