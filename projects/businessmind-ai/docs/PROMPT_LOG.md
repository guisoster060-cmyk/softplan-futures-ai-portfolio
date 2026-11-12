# Índice técnico de tarefas delegadas à IA

## ETD-009 — Acesso de avaliação sem credenciais (especificação técnica derivada)

- **Objetivo/contexto:** tornar o MVP examinável por recrutador sem distribuir senhas e sem alterar ambientes remotos.
- **Critérios de aceite:** separar a simulação local dos fluxos reais; identificar dados fictícios; bloquear tráfego externo; verificar desktop/mobile e regressões.
- **Atividade e evidências:** build local isolado, teste de navegador e atualização do roteiro; resultados em `TESTING.md` e referência Git no diário de engenharia.
- **Intervenção humana:** responsável definiu finalidade, restrições de segurança e deve aprovar qualquer publicação futura. Texto técnico derivado; não é reprodução literal de solicitação informal.

Este documento não transcreve conversas privadas nem apresenta reformulações como prompts originais. Cada item abaixo é uma **especificação técnica derivada — não é prompt literal**, construída a partir de artefatos, commits e registros disponíveis.

| ID | Classificação | Objetivo verificável | Evidência | Estado |
| --- | --- | --- | --- | --- |
| ETD-001 | Especificação técnica derivada — não é prompt literal | Importar e preservar a interface v0.3 e os artefatos da Etapa 1 | `b79c7fa` | Concluída |
| ETD-002 | Especificação técnica derivada — não é prompt literal | Integrar Auth, empresa, PostgreSQL, RLS e CRUD sem segredo administrativo no cliente | `08b2180`, PR #1 | Integrada em `new-branch` |
| ETD-003 | Especificação técnica derivada — não é prompt literal | Automatizar testes e preparar Hermes atrás de Edge Function | `3cdbc19`, PR #1 | Integrada; evolução Hermes no PR #4 |
| ETD-004 | Especificação técnica derivada — não é prompt literal | Modernizar o dashboard preservando funcionalidades e dados reais | `2a48236`, `df691b1`, PR #2 | Integrada em `new-branch` |
| ETD-005 | Especificação técnica derivada — não é prompt literal | Consolidar documentação profissional e verificável | PR #3 | Integrada em `new-branch` |
| ETD-006 | Especificação técnica derivada — não é prompt literal | Auditar/integrar PRs e preparar Hermes com Gemini sob controles de segurança | PR #4, merge `6c6c549` | Integrada em `new-branch`; Gemini bloqueado |
| ETD-007 | Especificação técnica derivada — não é prompt literal | Facilitar avaliação técnica da candidatura sem ativar IA externa | PR #8, merge `a454fc8` | Integrada em `new-branch`; Gemini bloqueado |
| ETD-008 | Especificação técnica derivada — não é prompt literal | Auditar a entrega atual e corrigir o estado acessível do menu móvel | Esta entrega; PR de revisão | Em validação |

## ETD-001 — Baseline versionada

- **Necessidade derivada:** trazer para o Git os arquivos-fonte recebidos e preservar sua identidade.
- **Critérios derivados:** estrutura original disponível; migration e teste SQL versionados; nenhuma execução remota implícita.
- **Resultado verificável:** referência v0.3 e artefatos Supabase presentes no commit `b79c7fa`.
- **Divisão de responsabilidades:** materiais e validação humana fornecidos pelo responsável; importação e organização assistidas por IA.

## ETD-002 — Integração Supabase

- **Necessidade derivada:** remover mecanismos demonstrativos e persistir dados por usuário/empresa.
- **Critérios derivados:** Auth completo, onboarding, CRUD, RLS, indicadores reais e somente credenciais públicas no frontend.
- **Resultado verificável:** implementação nos commits `08b2180` e `3cdbc19`; PR #1 posteriormente integrado em `new-branch`.
- **Limitação:** SMTP e E2E remoto automatizado ainda dependem de validação controlada; verificações HTTP reais posteriores estão registradas em `TESTING.md`.

## ETD-003 — Qualidade e Hermes

- **Necessidade derivada:** repetir verificações sem segredos e definir uma fronteira segura para IA externa.
- **Critérios derivados:** testes locais, CI e função servidor sem deploy automático.
- **Resultado verificável:** testes em `tests/`, workflow e scaffold em `supabase/functions/hermes/`.
- **Limitação histórica desta entrega:** nenhum provedor generativo foi implantado no PR #1; a evolução do Hermes no staging consta em ETD-006.

## ETD-004 — v0.5 Visual

- **Necessidade derivada:** elevar legibilidade, hierarquia e responsividade do dashboard.
- **Critérios derivados:** preservar a identidade, todos os fluxos v0.4 e dados reais; suportar teclado e movimento reduzido; evitar dependências injustificadas.
- **Resultado verificável:** commits `2a48236` e `df691b1`; previews e PR #2 posteriormente integrado em `new-branch`.
- **Limitação:** auditoria visual formal e promoção a produção dependem do responsável.

## ETD-005 — Documentação de engenharia

- **Necessidade derivada:** substituir a apresentação desatualizada por documentação compatível com a implementação real, sem apagar o histórico.
- **Critérios derivados:** documentos canônicos, autoria transparente, evidências e checagem automatizada.
- **Resultado verificável:** documentos canônicos e PR #3 integrado em `new-branch`.
- **Limitação:** fatos sobre produto, experiência e validações humanas continuam sujeitos à confirmação do responsável.

## Registros históricos

O acervo anterior permanece em `docs/businessmind-ai/PROMPT_LOG.md` e `docs/businessmind-ai/CHATGPT_PROMPT_HISTORY.md`. Esses arquivos são históricos, podem conter reconstruções narrativas e não são tratados como transcrições literais ou como fonte canônica do estado técnico.

## ETD-006 — Auditoria e Hermes Gemini

- **Necessidade derivada:** consolidar as três entregas dependentes e substituir o scaffold genérico por uma integração Gemini segura e desativada por padrão.
- **Critérios derivados:** preservar histórico, não alterar `main`, validar JWT/empresa, manter cálculos em código, usar agregados, impor limites e bloquear envio real até consentimento.
- **Resultado verificável:** merges #1–#4 em `new-branch`; Hermes v11 determinístico no staging e evidências discriminadas em `TESTING.md`.
- **Limitações atuais:** integração Gemini bloqueada e sem teste generativo remoto; ativação depende de decisão humana. A redação inicial desta especificação descrevia o estado anterior ao deploy da função.

## ETD-007 — Apresentação para candidatura

- **Objetivo técnico derivado:** permitir que um avaliador encontre rapidamente demonstração, capacidades, arquitetura, testes, decisões e limitações.
- **Contexto derivado:** após o merge do PR #4, parte da documentação ainda dizia que ele estava em revisão; a interface continha rótulos que sugeriam atualização em tempo real sem essa garantia.
- **Critérios de aceitação derivados:** preservar histórico e funcionalidades; criar um roteiro de avaliação; separar evidências locais, remotas e manuais; manter Gemini bloqueado; executar verificações e submeter PR sem merge automático.
- **Atividade realizada com assistência de IA:** revisão do estado de `new-branch`, ajuste pontual de rótulos e legibilidade, atualização documental e plano de validação futura do Gemini.
- **Evidências:** diff, comandos e resultados registrados na entrega correspondente de `ENGINEERING_LOG.md`; PR #8, commits `6c3c7ec` e `dea5f80`, merge `a454fc8`.
- **Intervenção humana:** objetivo da candidatura, prazo, restrições de serviços e decisão final de aceite definidos pelo responsável. Nenhuma aprovação de ativação generativa é inferida.

## ETD-008 — Auditoria final do MVP

- **Objetivo técnico derivado:** conferir os fluxos demonstráveis e remover um problema pontual de acessibilidade sem reescrever o aplicativo.
- **Contexto derivado:** a base `new-branch` recebeu os PRs #8 e #9; o botão do menu móvel não expunha seu estado aberto/fechado a tecnologias assistivas.
- **Critérios de aceitação derivados:** preservar Auth, onboarding, CRUD, indicadores e Hermes determinístico; sincronizar `aria-expanded` com o drawer; testar teclado e mobile com mocks; registrar evidências e pendências separando testes locais de remotos.
- **Atividade assistida por IA:** inspeção do código e dos registros, ajuste pequeno em HTML/JavaScript, ampliação do E2E local e atualização da documentação de entrega.
- **Evidências:** resultados e limitações registrados em `TESTING.md` e `ENGINEERING_LOG.md`; commit e PR desta entrega após publicação.
- **Intervenção humana:** objetivo da candidatura, prazo, restrições sobre serviços e decisão de aprovação definidos pelo responsável; nenhuma validação remota ou ativação Gemini foi inferida.
