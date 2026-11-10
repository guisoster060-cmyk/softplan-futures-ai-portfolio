# Diário de engenharia do BusinessMind AI

Este registro consolida entregas verificáveis do código versionado. Solicitações informais foram convertidas em requisitos técnicos; não são reproduzidas como autoria literal. Resultados manuais informados pelo responsável são identificados como tais.

## ENG-001 — Baseline v0.3 e schema inicial

- **Objetivo técnico:** preservar a interface original e versionar a fundação PostgreSQL/Supabase.
- **Problema ou necessidade:** os artefatos v0.3 e da Etapa 1 existiam fora do repositório.
- **Requisitos e aceite:** preservar os arquivos recebidos; incluir migration, teste SQL e documentação; não executar alterações remotas.
- **Solução:** importação da v0.3 para `versions/v0.3/` e dos artefatos Supabase para `supabase/`.
- **Arquivos principais:** `versions/v0.3/`, `supabase/migrations/20251112143000_initial_schema.sql`, `supabase/tests/001_rls_isolation_test.sql`.
- **Tecnologias:** HTML, CSS, JavaScript, PostgreSQL e Supabase.
- **Decisões:** manter a versão recebida como referência imutável; tratar a migration como fonte versionada do schema.
- **Testes executados:** o responsável informou execução manual anterior de 34 verificações SQL com resultado OK; o relatório bruto não está versionado e o resultado não foi reproduzido nesta entrega.
- **Resultado e limitações:** baseline e schema passaram a ser rastreáveis; não houve validação remota independente.
- **Responsabilidades:** concepção, fornecimento dos artefatos, execução remota e validação humana pelo responsável; organização, importação e documentação assistidas por IA.
- **Referência:** commit `b79c7fa`.

## ENG-002 — MVP v0.4 com persistência real

- **Objetivo técnico:** substituir login e persistência demonstrativos por Supabase Auth e PostgreSQL.
- **Problema ou necessidade:** a v0.3 mantinha sessão e movimentações apenas no navegador.
- **Requisitos e aceite:** cadastro, login, sessão e logout reais; onboarding de empresa; CRUD protegido por RLS; indicadores sem dados fictícios; nenhuma chave administrativa no cliente.
- **Solução:** cliente Supabase com URL e publishable key, RPC `create_company`, consultas autenticadas a `profiles`, `companies`, `company_members` e `transactions`, CRUD e projeções derivadas dos registros carregados.
- **Arquivos principais:** `app/index.html`, `app/app.js`, `app/config.js`, `app/styles.css` e `supabase/migrations/20251112143000_initial_schema.sql`.
- **Tecnologias:** JavaScript ES modules, Supabase JS, Auth, PostgreSQL, RLS e SVG.
- **Decisões:** aplicação estática sem framework; controle de acesso em profundidade pelo JWT e RLS; publishable key pública e ausência de `service_role` no frontend.
- **Testes executados:** suíte Node sem credenciais e verificações estáticas registradas na entrega ENG-003; E2E remoto não foi executado.
- **Resultado e limitações:** fluxos essenciais foram implementados; confirmação/recuperação dependem de SMTP e os fluxos remotos ainda exigem validação controlada.
- **Responsabilidades:** requisitos, ambiente Supabase e validações remotas sob responsabilidade humana; implementação e documentação produzidas com assistência de IA e submetidas à revisão humana.
- **Referência:** commit `08b2180`; PR #1.

## ENG-003 — Testes, CI e preparação segura do Hermes

- **Objetivo técnico:** criar verificações repetíveis e preparar a integração generativa sem expor segredos.
- **Problema ou necessidade:** a integração precisava de evidências automatizadas e de uma fronteira servidor para provedores de IA.
- **Requisitos e aceite:** testes sem credenciais privadas, CI pública, Hermes determinístico preservado e chave de IA somente no servidor.
- **Solução:** testes com `node:test`, análise estática, workflow de GitHub Actions e scaffold de Supabase Edge Function que opera com JWT e agregados.
- **Arquivos principais:** `tests/`, `package.json`, `.github/workflows/businessmind-ai.yml`, `supabase/functions/hermes/` e `docs/ARCHITECTURE_V0.4.md`.
- **Tecnologias:** Node.js, GitHub Actions, Deno/Supabase Edge Functions.
- **Decisões:** não implantar a função nem escolher provedor sem autorização; manter fallback determinístico funcional.
- **Testes executados:** `npm run verify` executado na entrega original; 16 testes automatizados foram registrados como aprovados. A execução será repetida nesta atualização documental.
- **Resultado e limitações:** CI e fronteira segura foram criadas; a função generativa não está implantada e não foi validada contra provedor externo.
- **Responsabilidades:** decisão de provedor, custos, privacidade e deploy reservada ao responsável; automação e scaffold assistidos por IA.
- **Referência:** commit `3cdbc19`; PR #1.

## ENG-004 — Interface v0.5 Visual

- **Objetivo técnico:** modernizar o MVP como dashboard SaaS responsivo sem regressão funcional.
- **Problema ou necessidade:** a interface funcional precisava de hierarquia, legibilidade, feedback e adaptação a diferentes telas.
- **Requisitos e aceite:** preservar Auth, empresa, CRUD, CSV, RLS e Hermes; usar somente dados reais; acessibilidade por teclado e movimento reduzido; evitar framework pesado.
- **Solução:** design system CSS, componentes e estados modernizados, ícones SVG, gráfico SVG aprimorado, navegação responsiva e feedback acessível.
- **Arquivos principais:** `app/index.html`, `app/styles.css`, `app/app.js`, `tests/visual.test.js` e `docs/DESIGN_SYSTEM_V0.5.md`.
- **Tecnologias:** HTML semântico, CSS custom properties, JavaScript e SVG.
- **Decisões:** não adotar React ou ECharts nesta etapa; o SVG existente atendia aos dados e evitava custo de bundle.
- **Testes executados:** `npm run verify`, inspeção em desktop/mobile e verificação do console foram registradas nos commits da v0.5. Consulte `TESTING.md` para o nível de evidência disponível.
- **Resultado e limitações:** preview responsivo publicado; auditoria formal WCAG e matriz cross-browser permanecem pendentes.
- **Responsabilidades:** objetivo, identidade e aprovação visual pertencem ao responsável; implementação, inspeção técnica e documentação foram assistidas por IA.
- **Referência:** commits `2a48236` e `df691b1`; PR #2.

## ENG-005 — Consolidação documental profissional

- **Objetivo técnico:** alinhar documentação, código e histórico para apresentação de engenharia.
- **Problema ou necessidade:** documentos na raiz ainda descreviam planejamento, enquanto a implementação v0.5 estava em branches abertas.
- **Requisitos e aceite:** criar os documentos canônicos solicitados, preservar registros históricos, distinguir especificações derivadas, registrar evidências e automatizar consistência básica.
- **Solução:** documentação canônica em `projects/businessmind-ai/docs/`, atualização dos READMEs, avisos no acervo histórico e verificador local/CI de links e arquivos obrigatórios.
- **Arquivos principais:** os documentos canônicos, `README.md`, `projects/businessmind-ai/README.md`, `scripts/check-docs.js`, `package.json` e `.github/workflows/businessmind-ai.yml`.
- **Tecnologias:** Markdown, Node.js, Git e GitHub Actions.
- **Decisões:** preservar `docs/businessmind-ai/` como acervo histórico e usar a pasta do projeto como fonte canônica do estado implementado.
- **Testes executados:** `npm ci`, `npm run verify` (16 aprovados, 0 falhas; análise sintática e 25 arquivos documentais verificados) e `git diff --check`, em 10/11/2026.
- **Resultado e limitações:** documentação e automação concluídas localmente; referências definitivas de commit e PR são fornecidas pelo histórico Git e pela revisão desta branch.
- **Responsabilidades:** critérios de autoria e foco da candidatura definidos pelo responsável; auditoria, estruturação, verificação e redação assistidas por IA, sujeitas à validação humana.
- **Referência:** branch `codex/businessmind-documentation`; commit/PR desta entrega.

## Regra para próximas entregas

Toda alteração relevante deve acrescentar uma seção com objetivo, necessidade, requisitos, solução, arquivos, tecnologias, decisões, testes efetivamente executados, resultados, limitações, responsabilidades e referência Git. O registro deve ser atualizado no mesmo PR quando a documentação for afetada.

## ENG-006 — Auditoria e integração dos PRs #1–#3

- **Objetivo técnico:** validar e consolidar v0.4, v0.5 e documentação em uma base única.
- **Problema ou necessidade:** os três PRs formavam uma cadeia de bases intermediárias e ainda estavam abertos.
- **Requisitos e aceite:** conferir commits, diffs, checks, dependências e segredos; preservar histórico; não alterar `main`.
- **Solução:** reprodução de `npm run verify`, inspeção de diffs e credenciais, merge sequencial com retargeting para `new-branch`.
- **Arquivos modificados:** nenhum arquivo de produção durante os merges; os commits originais foram preservados.
- **Tecnologias:** Git, GitHub CLI/API e GitHub Actions.
- **Decisões:** usar merge commits e destino `new-branch`; não habilitar merge automático.
- **Testes executados:** 16/16 testes antes da integração, análise sintática e verificação documental; checks remotos dos PRs estavam aprovados.
- **Resultados e limitações:** PRs #1, #2 e #3 integrados; espaços finais existentes na documentação foram identificados para correção nesta branch; nenhum E2E remoto foi executado.
- **Contribuição:** prioridade e autorização condicional definidas pelo responsável; auditoria, retargeting e merges realizados com assistência de IA.
- **Referências:** PRs #1–#3; merges `5ee367a`, `209120b` e `5744db2`.

## ENG-007 — Hermes com Gemini

- **Objetivo técnico:** oferecer interpretação generativa segura sem transferir cálculos financeiros ao modelo.
- **Problema ou necessidade:** o scaffold existente era genérico, confiava no `companyId` apenas via filtro/RLS e não integrava a interface.
- **Requisitos e aceite:** JWT, autorização por empresa, agregação em código, Gemini atual, limites, fallback e bloqueio de dados reais até consentimento.
- **Solução:** core determinístico testável, validação explícita em `company_members`, API `generateContent`, timeout, limite básico, CORS allowlist, gates de ativação e cliente com estados/fallback.
- **Arquivos principais:** `app/app.js`, `app/config.js`, `app/index.html`, `app/style.css`, `supabase/functions/hermes/`, `tests/hermes.test.js` e documentação canônica.
- **Tecnologias:** JavaScript, TypeScript/Deno, Supabase Edge Functions, PostgreSQL/RLS e Gemini API.
- **Decisões:** `gemini-3.5-flash-lite`; sem `service_role`; sem deploy, secret, faturamento ou dados reais nesta entrega.
- **Testes executados:** `npm run verify` com 25/25 testes; tentativa visual headless inconclusiva e não aprovada; runtime Deno/remoto não disponível.
- **Resultados e limitações:** implementação pronta para revisão/configuração; rate limit em memória não é distribuído e a política de dados requer decisão humana.
- **Contribuição:** arquitetura-alvo e limites de autorização definidos pelo responsável; pesquisa oficial, código, testes e documentação produzidos com assistência de IA.
- **Referência:** branch `codex/businessmind-hermes-gemini`; commit e PR desta entrega.

## ENG-008 — Validação local Deno do Hermes

- **Objetivo:** validar a função em runtime Deno e impedir totais baseados em leitura truncada.
- **Problema:** a consulta limitada a 5.000 linhas podia apresentar resultados parciais como totais; a CI cobria apenas Node.
- **Aceite:** `deno check`, testes simulados de autenticação/autorização/falhas, rejeição de conjunto incompleto e CI sem secrets.
- **Solução:** `deno.json`, função exportada para testes, dependências substituíveis, busca de até 5.001 linhas com rejeição de excesso e testes Deno com mocks.
- **Arquivos:** `supabase/functions/hermes/index.ts`, `index_test.ts`, `deno.json`, workflow e documentação.
- **Tecnologias:** Deno 2.5.6, TypeScript, Supabase JS e GitHub Actions.
- **Decisão:** falhar de modo explícito ao detectar truncamento; RLS segue como autoridade no banco.
- **Testes executados:** `deno check index.ts index_test.ts` sem erros; `deno test --allow-env index_test.ts` com 9 aprovados e 0 falhas; `npm run verify` será registrado após execução final.
- **Limites:** mocks não provam RLS do Supabase remoto nem disponibilidade da API Gemini para uma conta.
- **Contribuição:** critérios e restrições definidos pelo responsável; correção, testes e documentação assistidos por IA.
- **Referência:** PR #4, commits adicionais desta etapa.

## ENG-009 — E2E local dos fluxos essenciais

- **Objetivo:** exercitar a aplicação em navegador com Auth, empresa e movimentações fictícias.
- **Necessidade:** a suíte anterior verificava domínio e estrutura, mas não o fluxo completo da interface.
- **Aceite:** cadastro, login, sessão, onboarding, CRUD, recarga, filtros, indicadores, gráfico, alertas, CSV, erro e logout.
- **Solução:** cenário Playwright com servidor local e SDK Supabase substituído por mock em memória; duas contas/empresas.
- **Arquivo:** `tests/e2e-local.cjs` e documentação de testes.
- **Tecnologias:** Chromium, Playwright, Node.js e JavaScript.
- **Decisão:** manter a simulação separada da CI até declarar dependências de navegador reproduzíveis; não confundir mock com RLS real.
- **Testes executados:** `node tests/e2e-local.cjs` concluiu com sucesso em 10/11/2026; `npm run verify` e Deno serão registrados na verificação final.
- **Resultados e limites:** sem exceções JavaScript; persistência simulada após recarga; RLS real, SMTP e Supabase remoto não foram testados.
- **Contribuição:** critérios e limites definidos pelo responsável; teste e registro assistidos por IA.
- **Referência:** PR #4, commit desta etapa.

## ENG-010 — Preparação de validação Supabase isolada

- **Objetivo:** tornar reproduzível a validação real de Auth, onboarding, CRUD e RLS.
- **Necessidade:** testes locais usam mocks e não provam policies no PostgreSQL remoto.
- **Aceite:** projeto separado, duas contas fictícias, bloqueio explícito da referência publicada, critérios de aprovação e limpeza.
- **Solução:** script REST/Auth com guard de URL, ref e confirmação; testes unitários do guard; roteiro para painel web/mobile.
- **Arquivos:** `scripts/supabase-test-guard.mjs`, `scripts/verify-supabase-test.mjs`, `tests/supabase-test-guard.test.js`, `docs/SUPABASE_TEST_PLAN.md` e documentação de evidências.
- **Tecnologias:** Node.js, Supabase Auth, PostgREST e PostgreSQL/RLS.
- **Decisão:** contas pré-criadas e confirmadas pelo responsável; o script não usa chave administrativa e limpa apenas movimentações que criou.
- **Testes executados:** `npm run verify` em 10/11/2026: 29 aprovados, 0 falhas; 26 arquivos documentais verificados. Nenhuma chamada remota foi autorizada ou executada.
- **Limitações:** não comprova RLS até execução no projeto isolado; limpeza de contas/empresas é humana e explícita.
- **Contribuição:** escopo e restrições definidos pelo responsável; scripts e documentação assistidos por IA.
- **Referência:** PR #4, commits da Etapa 4A.

## ENG-011 — Schema inicial no staging isolado

- **Objetivo:** aplicar e verificar o schema versionado em `ogypzmxnvjbomamkejkh`.
- **Necessidade:** validar a estrutura real antes de criar contas ou dados fictícios.
- **Aceite:** staging vazio, migration esperada, quatro tabelas com RLS, funções, constraints e policies presentes, zero linhas.
- **Solução:** inspeção do SQL e do projeto; aplicação exclusiva de `0001_initial_schema.sql` como `businessmind_initial_schema`.
- **Arquivo-fonte:** `supabase/migrations/0001_initial_schema.sql`, SHA-256 `f61220649b214599f3d091d6f29d4416936aa8e980d79acf3426d1a071e7ff71`.
- **Tecnologias:** Supabase PostgreSQL 17, integração Supabase, RLS.
- **Decisão:** executar no staging vazio; os `REVOKE` abrangentes não atingiram tabelas públicas preexistentes.
- **Verificações executadas:** quatro tabelas vazias; RLS habilitado; dez policies; seis funções; 17 constraints; três triggers de aplicação; migration remota `20261110124952`.
- **Limitações:** verificações estruturais não provam comportamento de Auth ou RLS com usuários reais; nenhum teste SQL com inserção foi executado.
- **Contribuição:** escopo e autorização definidos pelo responsável; execução e registro assistidos por IA.
- **Referência:** PR #4, commit documental desta etapa.

## ENG-012 — Isolamento SQL real no staging

- **Objetivo:** exercer RLS e RPC em PostgreSQL real sem dados persistentes.
- **Necessidade:** a validação anterior era estrutural ou baseada em mocks.
- **Aceite:** relatório do script versionado com 34 OK e zero falhas, rollback confirmado.
- **Solução:** execução de `supabase/tests/isolation_test.sql` no projeto `ogypzmxnvjbomamkejkh`, seguida de consulta de contagens e trigger.
- **Tecnologias:** PostgreSQL 17, Supabase RLS, SQL Editor via integração.
- **Resultado:** 34/34 casos aprovados; erro final `P0001` intencional; zero linhas/usuários de teste após rollback; trigger de limite ativo.
- **Limite:** claims e papéis foram simulados dentro do SQL; Auth HTTP com JWT real ainda não foi testado. O cadastro público rejeitou `example.com`, e não foram usadas caixas de e-mail de terceiros.
- **Contribuição:** autorização e escopo humanos; execução e registro assistidos por IA.
- **Referência:** PR #4, commit desta etapa.

## ENG-013 — Preparação segura do Hermes generativo (local)

- **Objetivo:** impedir totais parciais e reduzir exposição de dados antes de qualquer ativação Gemini.
- **Problema:** a consulta única da Edge Function podia ser truncada pelo limite padrão da Data API; cálculo em ponto flutuante, pergunta livre e categorias identificáveis aumentavam risco de erro ou exposição.
- **Aceite:** paginação com contagem exata e falha fechada; valores em centavos; JWT e RLS preservados; limites e fallback; aprovação global e por empresa desativada por padrão; testes locais sem serviços externos.
- **Solução:** páginas de 500 com ID/contagem consistentes, validação de registro, agregação inteira, intenção derivada da pergunta em vez do texto bruto, apenas agregados mensais, limite mínimo de cinco linhas, bloqueio de redirects e respostas suspeitas, allowlist de empresas vazia por padrão.
- **Arquivos:** `supabase/functions/hermes/{index.ts,core.mjs,index_test.ts,README.md}`, `app/domain.js`, `tests/{domain.test.js,hermes.test.js}` e documentação canônica.
- **Tecnologias:** Deno, TypeScript, JavaScript, Supabase Auth/PostgREST e Node Test Runner.
- **Decisão:** nenhum schema novo; a allowlist no servidor exige aprovação documentada fora do aplicativo e não equivale a opt-in self-service auditável. Nenhuma chave ou dado real foi enviado ao Gemini.
- **Testes executados:** `deno check index.ts index_test.ts` sem erros; `deno test --allow-env index_test.ts` com 21 aprovados; `npm run verify` com 46 aprovados e 27 documentos válidos; build/validador de staging sem erro; E2E local de navegador aprovado com mocks (10/11/2026). Os testes Deno usam mocks e dados fictícios.
- **Limites:** consulta paginada não é snapshot transacional; rate limit em memória não é global; RLS real da função e Gemini remoto não foram testados; consentimento/retirada persistente por proprietário exigiria decisão de produto e possivelmente migration autorizada.
- **Contribuição:** requisitos, restrições e decisão de manter o serviço desativado definidos pelo responsável; implementação, testes e documentação assistidos por IA.
- **Referência:** branch `codex/businessmind-hermes-gemini`, diff local não commitado nesta etapa; PR #4 somente após revisão e autorização para push.
