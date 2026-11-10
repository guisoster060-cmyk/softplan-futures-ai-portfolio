# Estado atual do BusinessMind AI

Atualizado em: 10/11/2026  
Versão técnica: v0.5 Visual  
Fonte: branch `codex/businessmind-v0.5-visual`, commits e PRs públicos do repositório.

## Resumo executivo

O BusinessMind AI possui um MVP implementado em branches de revisão. A v0.4 substituiu autenticação e persistência demonstrativas por Supabase; a v0.5 modernizou a interface sem alterar o modelo de dados. As mudanças ainda não foram incorporadas à `main`: os PRs #1 e #2 permanecem abertos.

## Entregas concluídas no código

- [x] Interface v0.3 preservada como referência histórica.
- [x] Cadastro, login, sessão, logout e recuperação de senha pelo Supabase Auth.
- [x] Criação inicial de empresa por RPC segura.
- [x] Perfil e associação usuário–empresa.
- [x] CRUD de receitas e despesas em PostgreSQL.
- [x] RLS, grants por coluna, constraints, índices e triggers no schema.
- [x] KPIs, gráfico mensal, categorias, alertas e CSV baseados em dados carregados.
- [x] Hermes determinístico com fatos, estimativas, riscos e recomendações.
- [x] Design system v0.5 responsivo e acessível em nível inicial.
- [x] Testes automatizados locais e GitHub Actions.
- [x] Previews no Cloudflare Pages.
- [x] Scaffold seguro da Edge Function Hermes.

## Evidências

| Entrega | Commit/PR | Estado |
| --- | --- | --- |
| Importação v0.3 e Etapa 1 | `b79c7fa` | Commit publicado |
| Integração Supabase | `08b2180` | Commit publicado |
| Testes, CI e arquitetura v0.4 | `3cdbc19`, PR #1 | PR aberto |
| Redesign v0.5 | `2a48236` | Commit publicado |
| Testes e documentação visual | `df691b1`, PR #2 | PR aberto |

## Implantação

- Preview imutável da v0.5: `https://1cd5c052.businessmind-ai.pages.dev`
- Preview da branch v0.5: `https://codex-businessmind-v0-5-visu.businessmind-ai.pages.dev`

Os previews são ambientes de revisão e possuem `noindex`; não equivalem a uma versão de produção aprovada.

## Pendências prioritárias

1. Revisão humana e decisão de merge dos PRs #1 e #2.
2. Teste E2E com conta real em ambiente controlado.
3. Verificação do fluxo de confirmação e recuperação de e-mail/SMTP.
4. Registro versionado do relatório dos 34 casos SQL ou nova execução controlada.
5. Escolha de provedor, privacidade, custo e rate limit para Hermes generativo.
6. Deploy e testes da Edge Function somente após aprovação.
7. Paginação e estratégia para volumes maiores.
8. Auditoria de acessibilidade e compatibilidade cross-browser.
9. Continuidade da validação de mercado, ainda não concluída.

## Riscos conhecidos

- Código funcional ainda depende de branches não mescladas.
- `app.js` concentra várias responsabilidades.
- SMTP e Hermes generativo dependem de configuração externa.
- O plano gratuito possui limites operacionais e risco de pausa por inatividade.
- A validação técnica do MVP não equivale à validação de mercado.

## Próxima recomendação

Revisar os PRs em ordem (#1 e depois #2), executar E2E controlado e somente então decidir a promoção do preview para uma branch de produção.

