# Estratégia e evidências de testes

## Missão 05 — revisão integrada (12/11/2026)

O frontend público do staging respondeu por HTTPS e `app.js`, `config.js` e `index.html` tiveram hashes SHA-256 iguais aos arquivos do PR #24 (`ab1c27c5…`, `5f660d2b…`, `d5cf9dcb…`). A consulta de metadados do Supabase encontrou `hermes` ACTIVE v12 e `verify_jwt=false`; a leitura de fonte confirmou o bloqueio determinístico e ausência da exigência explícita de proprietário presente nesta branch. São observações remotas de leitura, **não** testes de JWT, RLS, chamada ao Gemini ou conteúdo de secrets. A invocação autenticada é um resultado informado pelo responsável e não foi repetida aqui.

`npm ci && npm run verify` aprovou **61/61 testes Node**, análise sintática e 31 documentos; `npm run build:staging-preview && npm run validate:staging-preview` aprovou a configuração isolada. `deno check index.ts index_test.ts` e `deno test --allow-env index_test.ts` aprovaram **44/44 testes Deno com mocks**. O teste novo confirma mês de referência e ausência de total histórico no payload preparado, além de não enviar nomes de categoria ou pergunta livre. `node tests/e2e-local.cjs` e `node tests/e2e-demo.cjs` passaram em Chromium; o primeiro simula Auth/RLS e o segundo usa dados fictícios locais sem requisições externas. `node tests/hermes-one-shot-postgres.mjs` passou com PostgreSQL local: uma reivindicação em duas transações concorrentes, ACL, RLS e repetição. Os testes Deno de concorrência usam uma RPC simulada; não comprovam atomicidade remota. A primeira aquisição de pacotes Deno falhou por CA desconhecida do proxy; `DENO_TLS_CA_STORE=system` permitiu checagem e testes sem desligar a validação TLS.

## Missão 04 — rota remota determinística preparada (12/11/2026)

- `npm ci && npm run verify`: **60/60 testes Node aprovados**, análise sintática e 31 documentos com links internos válidos. Os testes de `ask` cobrem flag local/produção, sessão ausente ou inválida, empresa não associada, 401/403 sem dados, rede/timeout com fallback, resposta generativa recusada, contagem divergente, troca de empresa durante espera e botão liberado.
- `deno check index.ts index_test.ts`: aprovado; `deno test --allow-env index_test.ts`: **28/28 testes Deno com mocks aprovados**, incluindo JWT ausente/inválido, empresa não autorizada e zero chamadas simuladas ao Gemini/RPC com a trava determinística. O código da função não foi alterado nesta missão.
- `npm run build:staging-preview && npm run validate:staging-preview`: aprovados localmente; o validador exige URL e chave pública exatas do staging, modo generativo `false`, controle remoto determinístico `true`, ausência de referência à produção e ausência de padrões de segredos.
- `node tests/e2e-local.cjs`: aprovado em Chromium com SDK e sessão **simulados**. Exercitou login, CRUD, alternância e isolamento simulado de empresas, chat remoto determinístico por mock e layout mobile. `node tests/e2e-demo.cjs`: aprovado em Chromium com demonstração fictícia local e zero requisições externas observadas.
- **Pendente:** teste HTTP real da Edge Function com JWT, RLS e isolamento no staging; confirmação remota de invocações/logs; publicação autorizada do novo pacote. Nenhum deploy, Gemini ou Supabase remoto foi chamado nesta missão.

## Missão 03 — diagnóstico da integração Hermes (12/11/2026)

- `npm ci && npm run verify`: **58/58 testes Node aprovados**, análise sintática e 31 documentos com links internos válidos. Quatro testes novos executam a função `ask` do frontend em contexto local sem SDK: flag desligado, caminho hipotético com empresa ativa, falhas de comunicação/autorização e fallback. Nenhuma chamada externa.
- `node tests/e2e-local.cjs`: aprovado com SDK Supabase simulado; Auth, CRUD, recarga, dashboard, CSV e isolamento entre empresas **simulado**.
- `node tests/e2e-demo.cjs`: aprovado em Chromium com dados fictícios locais, Hermes determinístico e **zero requisições externas observadas**.
- Arquivos públicos do staging `index.html`, `app.js` e `config.js` responderam HTTP 200; hashes SHA-256 coincidem com `new-branch`/config de preview. Isso confirma o código entregue, não o resultado de uma sessão autenticada nem o ID do deploy.
- Os logs com zero invocações foram relatados pelo responsável; não foram consultados nesta missão. Nenhum teste remoto com JWT, autorização/RLS real ou Edge Function foi executado. A proposta de integração permanece sem implementação em [GEMINI_VALIDATION_PLAN.md](GEMINI_VALIDATION_PLAN.md).

## Preparação do ensaio generativo isolado (12/11/2026)

- `npm ci && npm run verify`: **54/54 testes Node aprovados**, análise sintática e 31 documentos com links válidos.
- `deno check index.ts index_test.ts`: aprovado; `deno test --allow-env index_test.ts`: **44/44 testes Deno aprovados com mocks e dados fictícios**. O handler público mantém o bloqueio determinístico. Os testes exercitam o ramo desbloqueado por `createHermesHandler(false)` apenas em memória, sem chamada à API.
- `node tests/hermes-one-shot-postgres.mjs`: aprovado em PostgreSQL local descartável, incluindo disputa de duas transações (uma única vencedora), ACL, RLS, autorização do proprietário e impossibilidade de repetir a reivindicação. Não comprova o estado da RPC no Supabase staging.
- Cobertura nova: projeto não staging; membro não proprietário; JWT inválido; controles de compartilhamento ausentes; tema fora do escopo e paginação incompleta sem claim; RPC negada/indisponível; uma tentativa de provedor após claim; oito requisições simuladas concorrentes; dados individuais e pergunta livre fora do payload; erro, quota, timeout, redirect e resposta inválida com fallback sem segunda tentativa. Os mocks de concorrência não substituem o teste transacional PostgreSQL.
- **Não executado:** consulta a secrets, chamada real ao Hermes ou Gemini, teste remoto RLS da Edge Function, confirmação de `verify_jwt`/versão/estado da linha de uso único no staging e validação de cobrança/quotas da conta Google. O plano de verificação humana está em [GEMINI_VALIDATION_PLAN.md](GEMINI_VALIDATION_PLAN.md).
## Revisão do Hermes para ensaio generativo (12/11/2026)

- `npm ci && npm run verify`: **54/54 testes Node aprovados**, análise sintática aprovada e 31 documentos conferidos. Sem credenciais ou serviços remotos.
- `deno check index.ts index_test.ts` e `deno test --allow-env index_test.ts`: **29/29 testes Deno aprovados com mocks**, incluindo nova asserção de URL, chave pública e cabeçalho JWT passado ao cliente Supabase; nenhuma chamada ao Hermes ou Gemini remoto. A primeira tentativa de aquisição de pacotes falhou pela CA do proxy; a execução aprovada usou `DENO_DIR=/workspace/.deno DENO_TLS_CA_STORE=system`, mantendo a validação TLS.
- A suíte cobre JWT ausente/inválido, empresa não associada, classificação, CORS, paginação completa/incompleta, valores inválidos, limites e retorno determinístico mesmo com gates simulados ativos. O bloqueio `STAGING_DETERMINISTIC_ONLY=true` impede o acesso ao ramo generativo: os casos nomeados como erro/quota/timeout do provedor comprovam **inacessibilidade do ramo**, não o funcionamento do fallback após uma chamada ao Gemini.
- Esta revisão foi local. Não inspecionou secrets, estado remoto da autorização de uso único, função publicada, RLS remoto ou o provedor. Testes HTTP anteriores de Auth/CRUD/RLS não substituem testes da Edge Function. Pendências e sequência segura constam em [GEMINI_VALIDATION_PLAN.md](GEMINI_VALIDATION_PLAN.md).
## Preparação final do GitHub (12/11/2026)

- `npm ci` e `npm run verify` na branch de revisão: **54/54 testes Node aprovados**, análise sintática e **31 documentos** com links internos válidos; sem credenciais remotas.
- `node tests/e2e-local.cjs`: aprovado em Chromium com mock do SDK. A primeira execução falhou de forma reproduzível porque o mock disparava `SIGNED_IN` ao concluir a RPC `create_company`, criando duas cargas concorrentes da empresa ativa. O mock foi corrigido para refletir a RPC real; as asserções de criação, alternância e isolamento foram mantidas e passaram.
- `node tests/e2e-demo.cjs`: aprovado em Chromium; Auth fictício, CRUD local, recarga, mobile, Hermes determinístico e logout/reentrada. Zero requisições externas observadas. Não representa teste de RLS remoto.
- `deno check index.ts index_test.ts` e `deno test --allow-env index_test.ts`: **28/28 testes Deno com mocks aprovados**. Não houve chamada remota ao Hermes nem ao Gemini.
- Demonstração pública e staging responderam HTTP 200 em Chromium mobile (591/390 px), sem exceções JavaScript nem rolagem horizontal na tela verificada. O staging foi visto apenas até o login nesta revisão; o teste manual autenticado anterior não foi repetido.
- Quatro JPGs recebidos foram convertidos a PNG com pixels decodificados idênticos; duas capturas adicionais foram obtidas do site público em Chromium, sem edição de valores. Proveniência em `screenshots/README.md`.

O build de demonstração local passou a identificar corretamente o armazenamento fictício em Configurações e no rodapé. O site público ainda precisa de publicação autorizada para refletir essa redação. Nenhum deploy foi realizado nesta revisão.

## Missão 2 — demonstração para avaliação (11/11/2026)

- Site público `businessmind-ai-staging.pages.dev`: `index.html`, `app.js` e `config.js` responderam HTTP 200. `index.html` e `app.js` têm hashes idênticos aos arquivos do commit `d15282a`; `config.js` coincide com `preview/staging-config.js` de `new-branch`. O site carrega a tela de login em Chromium 1440×900 e 390×844, sem exceções JavaScript nem overflow horizontal nessa tela. Nenhuma sessão remota foi usada; não são resultados de fluxo autenticado.
- `npm run verify`: **54/54 testes Node aprovados**, análise sintática e 30 arquivos documentais com links internos válidos.
- `node tests/e2e-demo.cjs`: Chromium com adaptador local e dados fictícios, cobrindo indicadores, criação de receita, recarga, mobile, Hermes determinístico, logout e reentrada; **zero requisições externas observadas**. Não comprova Supabase Auth, RLS ou persistência PostgreSQL.
- `node tests/e2e-local.cjs`: cobre os fluxos existentes com mock do SDK, não com serviço remoto.
- `deno check index.ts index_test.ts` e `deno test --allow-env index_test.ts`: **28/28 testes Deno com mocks aprovados**. A primeira tentativa de `deno check` falhou pela CA do proxy; após `DENO_DIR=/workspace/.deno DENO_TLS_CA_STORE=system`, a verificação e os testes passaram. Nenhuma chamada remota à função ou ao Gemini ocorreu.
- O build `npm run build:demo-preview` usa configuração `demo.invalid`, remove a SDK CDN e aplica CSP `connect-src 'none'`. Nenhum deploy foi executado.

O staging publicado ainda não contém as mudanças de interface do PR #10. Uma apresentação autenticada remota exige conta fictícia controlada por canal seguro e revalidação específica; não se deve publicar credenciais nem declarar Gemini generativo como ativo.

## 1. Princípio

Um resultado só é tratado como validado quando existe evidência de execução. Declarações provenientes de arquivos importados ou relatos do responsável são identificadas separadamente de testes reproduzidos nesta branch.

## 2. Suíte automatizada atual

Comando:

```bash
npm ci
npm run verify
```

O comando executa:

1. `node --check` em `app.js`, `config.js` e `domain.js`;
2. Node Test Runner sobre `tests/*.test.js`;
3. verificação documental adicionada em `scripts/check-docs.mjs`.

### Cobertura automatizada

| Grupo | Evidência |
| --- | --- |
| Domínio | Validação de tipo, descrição, categoria, valor e data; limites do schema; mapeamento; totais; agrupamento. |
| Segurança estática | Ausência de chave administrativa; uso de `create_company`; ausência de `created_by`; ausência de credenciais e seed da v0.3. |
| Integração DOM estática | Todos os IDs referenciados por `app.js` existem no HTML. |
| Design system | Tokens, breakpoints, movimento reduzido, ícones e ausência de framework/ECharts. |
| Documentação | Links relativos, documentos canônicos e versão do README. |

### Resultado reproduzido

Em 11/11/2026, a suíte da branch registrou **51/51 testes Node** e **28/28 testes Deno com mocks**; o teste concorrente em PostgreSQL local também foi aprovado. Login, dashboard, indicadores, movimentações e Hermes determinístico foram validados manualmente no staging. O Hermes v11 está ACTIVE nesse ambiente, com `verify_jwt=true` e `STAGING_DETERMINISTIC_ONLY=true`: retorna antes da RPC de uso único e do fetch ao Gemini. Não houve validação generativa remota. Os resultados anteriores abaixo são preservados como histórico de execução, não como estado atual da suíte.

Em 10/11/2026, após a implementação local do Hermes, `npm run verify` executou **25 testes aprovados e 0 falhas**. A análise sintática também concluiu sem erro e o verificador confirmou 25 arquivos Markdown, links internos válidos e todos os documentos canônicos presentes.

### Cobertura adicionada para Hermes

| Cenário | Tipo de teste | Resultado local |
| --- | --- | --- |
| Pergunta ausente/acima do limite | Unidade | Aprovado |
| Agregados válidos e ausência de dados | Unidade | Aprovado |
| Separação entre cálculo e interpretação | Unidade | Aprovado |
| Extração e rejeição de resposta Gemini | Unidade | Aprovado |
| JWT obrigatório | Inspeção estática automatizada | Aprovado |
| Associação usuário–empresa e consulta sob RLS | Inspeção estática automatizada | Aprovado |
| Timeout, rate limit e fallback | Inspeção estática automatizada | Aprovado |
| Chave apenas no servidor e consentimento desativado | Inspeção estática automatizada | Aprovado |
| Fallback no frontend | Inspeção estática automatizada | Aprovado |

Essas verificações não substituem um teste de integração da função em runtime Deno nem um teste remoto contra Supabase/Gemini.

### Validação Deno da Edge Function — Etapa 2

Em 10/11/2026, `deno check index.ts index_test.ts` concluiu sem erros e `deno test --allow-env index_test.ts` executou **9 testes aprovados, 0 falhas**. O ambiente usou Deno 2.5.6 e mocks em memória, com dados fictícios. A primeira tentativa de `deno check` falhou por ausência de configuração npm; após `deno.json`, a aquisição de dependências exigiu contorno local de certificado do proxy apenas na primeira descarga. A checagem final e os testes rodaram sem desabilitar TLS.

Foram simulados JWT ausente/inválido, empresa não autorizada, RLS via mock de associação, dados completos e truncados, CORS, resposta inválida, indisponibilidade e timeout do Gemini, resposta válida e ausência de descrição individual no payload. Não houve acesso a serviços remotos. A RLS real continua dependente de teste em ambiente Supabase autorizado.

### Preparação local do Hermes generativo — correção posterior

Em 10/11/2026, após corrigir a leitura paginada na Edge Function, `deno check index.ts index_test.ts` concluiu sem erros e `deno test --allow-env index_test.ts` executou **21 testes aprovados, 0 falhas** com mocks e dados fictícios. `npm run verify` executou **46 testes aprovados, 0 falhas** e verificou 27 documentos. `npm run build:staging-preview` e `npm run validate:staging-preview` concluíram sem erro. `node tests/e2e-local.cjs` aprovou o cenário de navegador com Auth, CRUD, recarga, dashboard, CSV, alternância e isolamento **simulados**. A aquisição inicial de dependências Deno neste ambiente exigiu reutilizar `DENO_DIR=/workspace/.deno` e `DENO_TLS_CA_STORE=system`; a execução final manteve a validação TLS.

Os casos cobrem 1.201 linhas em três páginas, página truncada, contagem alterada, ID duplicado, linha inválida, limite de 5.000, corpo excessivo, pergunta longa, JWT ausente/inválido, empresa não autorizada, ausência de aprovação por empresa, menos de cinco linhas, rate limit, CORS, quota, redirecionamento, resposta grande/inválida ou numérica, timeout e fallback. O payload simulado não contém pergunta livre, descrição ou nome de categoria. A suíte **não** prova isolamento RLS real na Edge Function, aceite humano do tratamento de dados, disponibilidade do Gemini para uma conta nem operação remota; nenhuma chamada real foi feita.

### E2E local no navegador — Etapa 3

Em 10/11/2026, `node tests/e2e-local.cjs` foi executado com Chromium e Playwright disponíveis no ambiente local. O teste intercepta apenas o carregamento do SDK Supabase e usa duas contas/empresas fictícias em memória persistida no navegador. Resultado: cenário completo aprovado, sem exceções JavaScript. Cobriu cadastro, login, onboarding, criação/edição/exclusão de receita e despesa, recarga, logout, erro de senha, filtros, KPIs, gráfico, alertas, CSV e visibilidade isolada da segunda conta.

O mock implementa a regra de isolamento para exercitar a interface; **não valida RLS real**. O arquivo `tests/e2e-local.cjs` não integra a CI porque o projeto ainda não declara Playwright/Chromium como dependências reproduzíveis. Sua execução exige Playwright e Chromium locais. O primeiro ajuste do teste corrigiu apenas a navegação após recarga: a aplicação volta à Visão geral, ocultando a lista até entrar em Indicadores.

### Procedimento remoto inicialmente pendente — registro histórico

Na preparação anterior, o procedimento previsto era usar exclusivamente um projeto Supabase separado de produção, com schema equivalente e duas contas de teste criadas por pessoa autorizada. As permissões necessárias eram: acesso de teste ao Auth, leitura/escrita de movimentações das duas empresas e, para o teste SQL de policies, acesso administrativo somente ao projeto isolado. Credenciais deveriam chegar por secret local/CI, nunca por commit ou conversa. O resultado HTTP real posterior está registrado na seção “HTTP real no staging” abaixo; confirmação de entrega de e-mail e testes generativos permanecem fora dessa evidência.

O roteiro reproduzível e a opção de execução pelo celular estão em [SUPABASE_TEST_PLAN.md](SUPABASE_TEST_PLAN.md). Naquela etapa, o script `scripts/verify-supabase-test.mjs` ainda não havia sido executado contra qualquer serviço.

Na Etapa 4A, `npm run verify` executou 29 testes (29 aprovados, 0 falhas), incluindo quatro testes do bloqueio de ambiente de teste; 26 documentos foram verificados. Nenhum teste remoto foi executado.

### Staging real — isolamento SQL

Em 10/11/2026, o arquivo versionado `supabase/tests/isolation_test.sql` foi executado exclusivamente no staging `ogypzmxnvjbomamkejkh`. Relatório retornado: **34 casos OK, 0 falhas**. O erro final `P0001` é intencional e reverte a transação. Consulta posterior confirmou zero usuários de teste, zero perfis, empresas, associações e movimentações; o trigger `enforce_transaction_limit` permaneceu habilitado.

Foram exercitadas as policies de leitura e atualização de perfil; leitura, atualização e exclusão de empresa; leitura de associação; e leitura, inserção, atualização e exclusão de movimentações. O script simula os papéis e claims JWT no PostgreSQL; não autentica usuários por e-mail/senha nem usa JWT emitido pelo Auth. Essa era a limitação do teste SQL: posteriormente, 33 verificações HTTP reais com JWTs individuais foram executadas no staging, conforme registro abaixo. Testes remotos adicionais da Edge Function Hermes, inclusive isolamento e rate limit, continuam pendentes; as verificações HTTP de Auth/CRUD/RLS não os substituem.

### Staging real — preparação dos testes HTTP com três contas

Em 10/11/2026, uma consulta agregada e somente de leitura no projeto `ogypzmxnvjbomamkejkh` retornou **3 usuários Auth, 3 confirmados, 0 não confirmados e 3 perfis**. Nenhum e-mail, identificador de usuário, senha ou token foi consultado. Isso verifica o estado de confirmação registrado no Auth, não a entrega de mensagens de e-mail.

O script HTTP foi preparado para login de três identidades via senha/JWT: A e B como proprietários de empresas distintas; C sem associação inicial, com tentativas de leitura, inserção, edição e exclusão nas duas empresas. O bloqueio de segurança permite somente a referência de staging autorizada. As seis credenciais de teste ainda não estão disponíveis por secret binding no ambiente Codex. **O script HTTP não foi executado**; nenhuma empresa ou movimentação foi criada nesta etapa. O teste de admissão de C como membro de uma empresa não está implementado: o schema atual não oferece fluxo público de convite/associação e a preparação administrativa requer autorização específica.

Após essas mudanças, `npm run verify` executou **30 testes aprovados, 0 falhas** e verificou 26 documentos. Essa suíte é local e não comprova login HTTP ou RLS com JWT real. A execução remota aguarda credenciais em secret binding e autorização explícita para criar dados fictícios.

O workflow `businessmind-staging-http.yml` foi incorporado à `main` pelo PR #5 sem incorporar o Hermes. Sua execução manual única no staging está registrada abaixo; o arquivo continua na branch do PR #4 para manter o checkout fixado e os guardas ao selecionar essa branch.

Na revisão de segurança posterior, `fetchWithoutRedirect` passou a rejeitar redirecionamentos de login e de chamadas com JWT. Três testes locais cobrem redirecionamento de senha, redirecionamento de JWT e resposta direta; o guard também rejeita porta alternativa e credenciais embutidas na URL. `npm run verify` executou **34 testes aprovados, 0 falhas**, com 26 documentos válidos. O workflow fixa o checkout no commit auditado `61837d49150abea0f873558c14addfb82c5cba8d` e desativa a persistência de credenciais Git. Naquela revisão, o teste HTTP remoto ainda não havia sido executado.

### HTTP real no staging — execução controlada

Em 10/11/2026, a execução manual [42848846297](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/actions/runs/42848846297) concluiu com **33 verificações HTTP aprovadas, 0 falhas**, usando três JWTs individuais no projeto `ogypzmxnvjbomamkejkh`. Cobriu login, duas empresas criadas por RPC, CRUD, releitura, isolamento de leitura/inserção/edição/exclusão entre empresas, terceira conta sem associação e limpeza das movimentações. Consulta agregada posterior encontrou 2 empresas e 2 associações fictícias remanescentes, mas 0 movimentações. Não valida entrega de e-mail nem a Edge Function Gemini.

### P0 local — paginação, seleção de empresa e build isolado

Em 10/11/2026, `npm run verify` executou **40 testes aprovados, 0 falhas**, e verificou 27 documentos após a implementação local de paginação e build de staging. Os testes de paginação simulam 1.201 registros, página truncada, erro, contagem ausente/alterada, IDs repetidos e limite do schema. O teste de build confirma que a configuração da aplicação existente não é alterada, que a cópia aponta ao staging e que Gemini permanece desativado.

`node tests/e2e-local.cjs` foi executado com Chromium/Playwright e mock do SDK Supabase: cenário completo aprovado após corrigir um seletor do próprio teste que encontrava uma opção oculta. Cobriu Auth, CRUD, recarga, dashboard, CSV, duas empresas da mesma conta, alternância e isolamento visual; não acessou Supabase real. O mock foi ampliado para representar `.in()`, `.range()` e contagem exata. Este E2E continua fora da CI porque Playwright/Chromium não estão declarados como dependências reproduzíveis.

## 3. Teste SQL de isolamento

Arquivo: `supabase/tests/isolation_test.sql`.

O script contém casos de leitura, escrita, isolamento entre empresas, acesso anônimo, criação por RPC, constraints e limite de 5.000 movimentações. Ele termina com erro intencional para reverter os dados de teste e exibir o relatório.

**Evidência disponível:** o responsável informou execução manual com 34 casos aprovados e zero falhas.

**Limite:** o teste não foi reexecutado nesta revisão documental. Além do relato histórico do responsável, há o registro de execução no staging descrito acima; a simulação de claims SQL não substitui JWT emitido pelo Auth. O comentário antigo no SQL que afirma “ainda não executado” foi preservado no arquivo histórico.

## 4. Validação visual v0.5

Executada com Chromium controlado pelo Chrome DevTools Protocol:

| Cenário | Viewport | Resultado |
| --- | --- | --- |
| Login desktop | 1440×1000 | Renderizado; sem overflow horizontal. |
| Login mobile | 390×844 | Renderizado; formulário adaptado. |
| Dashboard vazio desktop | 1440×1000 | KPIs zerados, gráfico vazio e estados informativos. |
| Dashboard vazio mobile | 390×844 | Cards empilhados e largura correta. |
| Gaveta mobile | 390×844 | Navegação aberta, overlay e identidade do workspace. |

O dashboard foi renderizado com um mock isolado de sessão e banco vazio apenas para testar a UI. Nenhuma operação atingiu o Supabase remoto. As sessões finais não registraram exceções JavaScript.

## 5. CI/CD

O workflow `.github/workflows/businessmind-ai.yml` executa em pushes fora da `main` e em pull requests que alteram o projeto ou a documentação. Nos PRs #1 e #2, o job `verify` concluiu com sucesso. O Cloudflare Pages também registrou deploy de preview bem-sucedido para a v0.5.

## 6. Evidências históricas não reproduzidas

- O README da v0.3 relata 57 verificações em Chromium headless. Essa é uma evidência histórica importada, não reproduzida nesta branch.
- A execução dos 34 casos SQL foi informada pelo responsável, sem log versionado no repositório.

## 7. Lacunas e próximos testes

- E2E automatizado com cadastro, confirmação de e-mail, login, onboarding e CRUD em ambiente de teste; os testes HTTP reais de Auth/CRUD/RLS e a validação manual dos fluxos no staging já ocorreram.
- Teste automatizado real de RLS no pipeline com projeto efêmero ou banco local.
- Recuperação de senha após configuração SMTP.
- Ampliar validação remota automatizada da Edge Function v11 para autenticação, isolamento e rate limit; sua implantação e validação manual determinística no staging já ocorreram.
- Auditoria com leitor de tela e ferramentas especializadas de acessibilidade.
- Firefox, Safari/iOS e dispositivos físicos.
- Volume, paginação e desempenho próximo ao limite de 5.000 movimentações.
- Verificação de regressão da Edge Function em runtime Deno local com mocks e no staging; mocks não comprovam RLS remoto nem o caminho generativo.
- Respostas reais do Gemini para sucesso, `429`, `5xx`, payload inválido e timeout, usando somente dados fictícios.
- Concorrência e rate limit distribuído entre múltiplas instâncias.

## 8. Tentativa de validação visual desta entrega

Foi iniciado servidor HTTP local e Chromium headless em viewports mobile/desktop. O Chromium não concluiu a inicialização no sandbox (erros de diretório persistente/Crashpad e TLS externo), portanto **nenhum teste visual novo foi considerado aprovado**. A validação visual v0.5 anterior permanece como evidência histórica, não como validação do fluxo generativo.

## 9. Revisão local para apresentação do portfólio — 11/11/2026

- `npm run verify`: **52/52 testes Node aprovados**, 0 falhas; análise sintática aprovada; 29 arquivos Markdown verificados com links internos válidos. O teste novo verifica os rótulos não enganosos e a regra de legibilidade mobile.
- `node tests/e2e-local.cjs`: cenário aprovado com mocks do SDK Supabase; cobriu Auth, CRUD, recarga, dashboard, CSV, alternância e isolamento **simulado**. Não acessou Supabase remoto nem prova RLS.
- `deno check index.ts index_test.ts`: aprovado. `deno test --allow-env index_test.ts`: **28/28 aprovados**, 0 falhas, usando mocks e dados fictícios. Foi usado o binário local `/workspace/.deno/bin/deno`, `DENO_DIR=/workspace/.deno` e `DENO_TLS_CA_STORE=system`; a primeira tentativa sem essa CA falhou no certificado do proxy. Não houve chamada ao Gemini.
- Chromium local: login inspecionado em 1440×900 e 390×844; `scrollWidth` igual à largura do viewport em ambos, rótulo de apoio com 11 px no mobile e nota com 13 px. A carga do SDK externo falhou nesse navegador local por certificado do ambiente; portanto, a captura não valida autenticação remota nem as telas autenticadas. O E2E acima usa mocks.
- `git diff --check`: sem erros após as edições desta revisão.

Os resultados remotos de staging descritos nas seções anteriores são evidências históricas separadas; não foram reexecutados nesta revisão de portfólio. Auditoria formal de acessibilidade, cross-browser e validação generativa permanecem pendentes.

## 10. Missão 1 — auditoria local após os PRs #8 e #9

Em 11/11/2026, `npm run verify` passou com **52/52 testes Node**, análise sintática e 30 arquivos documentais com links internos válidos. `deno check index.ts index_test.ts` passou e `deno test --allow-env index_test.ts` passou com **28/28 testes com mocks**. O cenário `node tests/e2e-local.cjs` passou com SDK Supabase simulado: cadastro, login, onboarding, CRUD, recarga, indicadores, CSV, troca de empresa, logout e menu móvel com Escape; o teste móvel confirmou ausência de overflow a 390×844 e alternância de `aria-expanded`. Hermes determinístico está coberto pela suíte Node/Deno com mocks, não por nova requisição remota nesta missão. `git diff --check` passou.

**Limite:** esta missão não usou credenciais de teste nem alterou o Supabase. Não reexecutou os 33 testes HTTP com JWT, os testes SQL, o teste PostgreSQL concorrente ou a validação manual do staging. O E2E local não é prova de RLS real; Gemini continua bloqueado e sem teste generativo remoto.

