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
