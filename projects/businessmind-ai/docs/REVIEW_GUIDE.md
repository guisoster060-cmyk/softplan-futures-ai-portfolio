# Roteiro de avaliação — BusinessMind AI

> **Atualização verificada em 12/11/2026:** o staging recebeu novo deploy e uma consulta Hermes retornou HTTP 200, com resposta determinística observada no Android. A autorização única de teste Gemini foi consumida, mas **não há evidência de resposta generativa**. O Gemini permanece experimental e não deve ser anunciado como validado. As referências históricas abaixo descrevem versões anteriores. [Estado de entrega e evidências](DELIVERY_STATUS_2026-11-12.md).

Estado de referência: staging validado manualmente em 11/11/2026; correção financeira documentada no PR #13 (merge `5b2a5898`). Este roteiro distingue observações atuais de resultados históricos.

## Em poucos minutos

1. **Problema e solução:** o [README principal](../../../README.md) descreve o MVP para registrar receitas e despesas por empresa e analisar somente dados autorizados.
2. **Demonstração:** [demo pública fictícia, sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev) para avaliação rápida; [staging real](https://businessmind-ai-staging.pages.dev) exige conta autorizada e usa Supabase. Os dados da demo ficam somente no navegador e não comprovam Auth/RLS. Em 12/11, os arquivos públicos do staging coincidiram com o PR #24; a função v12 permanece determinística.
3. **Fluxo principal:** autenticação, seleção/criação de empresa, movimentações, indicadores e Hermes determinístico. O [README do projeto](../README.md) explica a execução local.
4. **Engenharia:** [arquitetura](ARCHITECTURE.md), [requisitos](REQUIREMENTS.md) e [decisões](TECHNICAL_DECISIONS.md) mostram componentes, critérios e trade-offs.
5. **Evidência:** [testes](TESTING.md) distinguem Node e Deno com mocks, PostgreSQL local, HTTP com JWT no staging e validação manual. No build da Missão 2, `npm run verify` aprovou 54/54 testes Node e 28/28 Deno com mocks; não são testes remotos.
6. **Transparência:** [estado atual](PROJECT_STATUS.md), [diário](ENGINEERING_LOG.md), [método assistido por IA](AI_DEVELOPMENT_METHOD.md) e [especificações técnicas derivadas](PROMPT_LOG.md) separam implementação, validação e responsabilidades.

## Validação complementar em staging — 11/11/2026

- Duas contas proprietárias de empresas diferentes foram utilizadas manualmente na interface. Login, persistência após recarga, indicadores e resposta determinística do Hermes foram observados; não houve teste com perfil de gerente ou funcionário, que ficam fora do escopo do MVP atual.
- RLS: em consultas PostgreSQL com `SET LOCAL ROLE authenticated` e identidade simulada por `request.jwt.claim.sub`, o proprietário A leu 5 registros próprios e 0 da empresa B; o proprietário B leu 3 próprios e 0 da empresa A (antes da nova movimentação). A edição de um registro próprio afetou 1 linha; edição e exclusão de registros alheios afetaram 0. Os testes de escrita foram revertidos com `ROLLBACK`.
- Quatro políticas de `public.transactions` foram alteradas **somente no Supabase staging** para exigir `is_company_owner(company_id)` em SELECT, INSERT, UPDATE e DELETE; INSERT também exige `created_by = auth.uid()`. A migração correspondente está em `supabase/staging-migrations/20261111_owner_only_financial_transactions.sql`, integrada pelo PR #13. **Não executar em produção sem revisão e autorização específicas.**
- Na empresa fictícia de teste, o banco contém quatro movimentações: despesa de R$ 100.000,00 em outubro; receita de R$ 1.500,00 e despesas de R$ 350,00 e R$ 500,00 em novembro. O Hermes apresentou receitas de R$ 1.500,00, despesas de R$ 850,00, resultado de R$ 650,00 e 3 movimentações no mês (4 cadastradas); o responsável confirmou os mesmos valores nos indicadores.
- Permanecem pendentes testes novos de escrita via HTTP/JWT após a mudança de policies, testes negativos de INSERT em outra empresa e regressão remota da Edge Function. Não declarar auditoria completa ou IA generativa ativa.

## Limites importantes

### Demonstração isolada, também reproduzível localmente

Em `projects/businessmind-ai/`, execute `npm run build:demo-preview` e sirva `dist-demo/` com `python3 -m http.server 8080 --directory dist-demo`. Abra `http://localhost:8080`. O modo entra automaticamente com uma identidade fictícia e movimentações ilustrativas. Crie uma movimentação em **Indicadores**, recarregue, examine **Visão geral** e **Inteligência** (Hermes determinístico), depois use **Sair** e **Entrar na demonstração**. **Restaurar dados fictícios** reinicia os dados locais.

O banner identifica a simulação; `config.js` usa `demo.invalid`, a SDK é substituída por adaptador em `localStorage` e a CSP bloqueia conexões externas. Não há Supabase Auth, PostgreSQL nem RLS reais nesse modo. O mesmo modo está acessível no link público acima; o build local é artefato não versionado e **não deve ser confundido com o staging real**. Este PR não altera hospedagem.

- Gemini está no código, mas bloqueado por `STAGING_DETERMINISTIC_ONLY=true` e pelo frontend; não houve validação generativa remota. O [plano de validação](GEMINI_VALIDATION_PLAN.md) não autoriza ativação.
- A leitura de movimentações valida paginação e completude, mas há limite de 5.000 linhas e não existe snapshot entre páginas.
- Testes locais com mocks não comprovam RLS remoto; o registro de 33 verificações HTTP com JWT é evidência separada.
- Recuperação/confirmação de e-mail depende da configuração do serviço; auditoria formal de acessibilidade e matriz cross-browser ainda faltam.

O histórico v0.3 e os documentos antigos foram preservados para rastreabilidade; consulte os documentos acima para o estado atual.

## Prioridades antes da apresentação

- **P0:** para demonstração remota autenticada, obter acesso temporário a uma conta fictícia por canal seguro sob controle humano; sem isso, usar o modo isolado somente após publicação separada autorizada.
- **P1:** executar auditoria acessível com leitor de tela e testes em Firefox/Safari; automatizar E2E com JWT real em ambiente isolado. Esses itens não são tratados como concluídos por testes com mocks.
