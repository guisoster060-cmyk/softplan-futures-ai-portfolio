# Decisões técnicas

Este arquivo consolida decisões comprovadas pelo código ou registradas como aprovadas pelo responsável. O arquivo [TECHNICAL_DECISIONS_V0.4_PROPOSTA.md](TECHNICAL_DECISIONS_V0.4_PROPOSTA.md) é preservado como proposta histórica de origem.

## Registro resumido

| ID | Decisão | Status | Evidência |
| --- | --- | --- | --- |
| DT-001 | Supabase para Auth, PostgreSQL e API de dados. | Implementada | Migração e `app/app.js` |
| DT-002 | HTML, CSS e JavaScript puro no frontend. | Implementada | Diretório `app/` |
| DT-003 | Cloudflare Pages para frontend estático. | Implementada em preview | Checks dos PRs #1 e #2 |
| DT-004 | RLS como autoridade de isolamento entre empresas. | Implementada no schema | Migração e teste SQL |
| DT-005 | Criação de empresa somente por RPC. | Implementada | `create_company` e teste estático |
| DT-006 | KPIs calculados, não persistidos. | Implementada | `domain.js` e `app.js` |
| DT-007 | Hermes em camada determinística e camada generativa opcional. | Parcial | Interface ativa e scaffold de Edge Function |
| DT-008 | Dependências mínimas e sem framework. | Implementada | `package.json` sem dependências de runtime |
| DT-009 | Design system próprio e Lucide SVG inline. | Implementada | CSS v0.5 e sprite SVG |
| DT-010 | Não adotar ECharts no escopo atual. | Implementada | `DESIGN_SYSTEM_V0.5.md` |
| DT-011 | CI sem credenciais privadas. | Implementada | Workflow `businessmind-ai.yml` |
| DT-012 | Gemini 3.5 Flash-Lite como motor preparado do Hermes. | Implementada, não implantada | Edge Function e avaliação oficial de 10/11/2026 |
| DT-013 | Consentimento e ativação em duas camadas antes do envio de agregados. | Implementada | Config frontend e secrets da função |

## DT-001 — Supabase como backend gerenciado

**Necessidade:** autenticação e persistência relacional sem operar servidor próprio.

**Alternativas registradas:** Firebase; backend próprio com Node e PostgreSQL.

**Escolha:** Supabase Auth + PostgreSQL + Data API.

**Trade-offs:** reduz operação e acelera o MVP, mas cria dependência da plataforma e de seus limites.

**Aprovação humana:** registrada na proposta técnica de 09/11/2026.

**Implementação assistida por IA:** integração frontend e documentação nos commits `08b2180` e `3cdbc19`.

## DT-002 — Frontend estático sem framework

**Necessidade:** preservar a interface v0.3 e evitar complexidade desnecessária.

**Escolha:** HTML, CSS e JavaScript puro; `supabase-js` fixado em 2.84.0 por CDN.

**Trade-offs:** carregamento e deploy simples; em contrapartida, `app.js` exige disciplina para não se tornar monolítico.

**Evidência:** `app/`, `package.json` e commit `2a48236`.

## DT-003 — RLS e menor privilégio

**Necessidade:** impedir acesso entre empresas mesmo com chamadas diretas à API.

**Escolha:** RLS em todas as tabelas, funções auxiliares e grants por coluna.

**Trade-offs:** segurança próxima dos dados, com maior complexidade de testes SQL e depuração.

**Validação:** o responsável informou execução manual de 34 casos com zero falhas; esta sessão não reproduziu o teste remoto.

## DT-004 — Indicadores derivados

**Necessidade:** não apresentar números sem origem verificável.

**Escolha:** consultar movimentações autorizadas e calcular indicadores no cliente; banco vazio gera estado vazio.

**Trade-offs:** solução adequada ao volume do MVP, mas sem agregação server-side ou paginação para grande escala.

## DT-005 — Hermes em duas camadas

**Necessidade:** oferecer valor analítico antes de contratar ou aprovar um provedor generativo.

**Escolha:** regras determinísticas ativas; Edge Function opcional com dados agregados.

**Trade-offs:** transparência e custo zero agora; linguagem natural limitada até a escolha do provedor.

**Pendente:** privacidade, custo, rate limit, provedor e deploy.

## DT-006 — Design system próprio e gráficos nativos

**Necessidade:** interface profissional sem framework ou biblioteca pesada.

**Escolha:** tokens CSS, SVG e `conic-gradient`; ícones Lucide selecionados e incorporados.

**Alternativa:** Apache ECharts.

**Trade-offs:** menor bundle e controle direto; menos recursos avançados de visualização. ECharts deverá ser reavaliado se surgirem zoom, drill-down, múltiplos eixos ou séries extensas.

## DT-007 — Automação verificável

**Necessidade:** impedir que sintaxe quebrada, regressões básicas ou documentação inconsistente cheguem ao PR.

**Escolha:** Node Test Runner e GitHub Actions sem segredos.

**Trade-offs:** execução rápida e gratuita, mas sem teste real do Supabase e sem cobertura E2E completa.

## DT-012 — Gemini 3.5 Flash-Lite

**Data da consulta:** 10/11/2026.

**Escolha:** `gemini-3.5-flash-lite` pelo endpoint oficial `generateContent`.

**Justificativa:** a documentação oficial o recomenda para novos projetos e o descreve como econômico, otimizado para alto volume e processamento simples. O tier Standard informa entrada e saída gratuitas no Free Tier; no Paid Tier, US$ 0,30 por 1 milhão de tokens de entrada e US$ 2,50 por 1 milhão de tokens de saída, incluindo thinking tokens.

**Alternativas avaliadas:**

- `gemini-3.8-flash`: maior capacidade, mas desnecessária para explicações curtas e com custo pago superior;
- `gemini-2.5-flash`: depreciado e com redirecionamento anunciado para 01/12/2026;
- `gemini-2.5-flash-lite`: não depreciado, porém limitado a usuários existentes; a documentação recomenda 3.5 Flash-Lite ou 3.8 Flash para novos projetos.

**Limites consultados:** a API aplica RPM, TPM e RPD por projeto. Os valores ativos dependem do tier/modelo e devem ser confirmados no Google AI Studio; por isso o sistema impõe limites próprios mais restritivos e não assume quota gratuita fixa.

**Privacidade e trade-off:** no Free Tier, a tabela oficial marca que dados podem ser usados para melhorar produtos; no Paid Tier, marca que não. Nenhum faturamento será habilitado e nenhum dado real será enviado até decisão humana sobre termos e tratamento.

**Fontes oficiais:** [modelos Gemini](https://ai.google.dev/gemini-api/docs/models/gemini), [preços](https://ai.google.dev/gemini-api/docs/pricing), [limites](https://ai.google.dev/gemini-api/docs/rate-limits) e [generateContent](https://ai.google.dev/api/generate-content).

## DT-013 — Ativação e consentimento em duas camadas

**Escolha:** frontend desativado por padrão e função condicionada a `HERMES_DATA_SHARING_APPROVED=true`, `GEMINI_API_KEY` e presença da empresa na allowlist `HERMES_APPROVED_COMPANY_IDS`, vazia por padrão. O envio também exige pelo menos cinco movimentações válidas.

**Justificativa:** uma mudança acidental no cliente não pode autorizar o envio. A decisão humana, secrets e deploy permanecem fora do código versionado.

**Trade-off:** exige configuração coordenada e teste controlado, mas reduz o risco de transmissão não autorizada. A allowlist manual não comprova consentimento do proprietário nem oferece retirada self-service; um registro auditável exigiria desenho de produto e possivelmente migration aprovada. Até lá, nenhuma empresa é habilitada nesta etapa.

## DT-014 — Paginação e minimização do Hermes

**Necessidade:** o limite padrão da Data API poderia truncar a leitura única e produzir totais incorretos; pergunta livre e categorias poderiam expor conteúdo identificável ao provedor.

**Escolha:** páginas de 500 com contagem exata, ordenação estável e falha fechada; cálculo inteiro em centavos; envio apenas de intenção derivada e agregados mensais, sem texto bruto, descrição ou categoria; rejeição de resposta que tente citar números, moeda, URL ou e-mail.

**Trade-offs:** maior número de consultas e menor riqueza da resposta generativa, em troca de precisão e menor exposição. A paginação não é snapshot transacional e agregados de grupos pequenos ainda podem ser sensíveis; por isso há mínimo de cinco registros e aprovação manual por empresa antes de qualquer uso externo.
