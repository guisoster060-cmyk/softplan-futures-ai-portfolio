# Índice técnico de tarefas delegadas à IA

Este documento não transcreve conversas privadas nem apresenta reformulações como prompts originais. Cada item abaixo é uma **especificação técnica derivada — não é prompt literal**, construída a partir de artefatos, commits e registros disponíveis.

| ID | Classificação | Objetivo verificável | Evidência | Estado |
| --- | --- | --- | --- | --- |
| ETD-001 | Especificação técnica derivada — não é prompt literal | Importar e preservar a interface v0.3 e os artefatos da Etapa 1 | `b79c7fa` | Concluída |
| ETD-002 | Especificação técnica derivada — não é prompt literal | Integrar Auth, empresa, PostgreSQL, RLS e CRUD sem segredo administrativo no cliente | `08b2180`, PR #1 | Implementada, em revisão |
| ETD-003 | Especificação técnica derivada — não é prompt literal | Automatizar testes e preparar Hermes atrás de Edge Function | `3cdbc19`, PR #1 | Implementada, em revisão |
| ETD-004 | Especificação técnica derivada — não é prompt literal | Modernizar o dashboard preservando funcionalidades e dados reais | `2a48236`, `df691b1`, PR #2 | Implementada, em revisão |
| ETD-005 | Especificação técnica derivada — não é prompt literal | Consolidar documentação profissional e verificável | branch `codex/businessmind-documentation` | Em execução |

## ETD-001 — Baseline versionada

- **Necessidade derivada:** trazer para o Git os arquivos-fonte recebidos e preservar sua identidade.
- **Critérios derivados:** estrutura original disponível; migration e teste SQL versionados; nenhuma execução remota implícita.
- **Resultado verificável:** referência v0.3 e artefatos Supabase presentes no commit `b79c7fa`.
- **Divisão de responsabilidades:** materiais e validação humana fornecidos pelo responsável; importação e organização assistidas por IA.

## ETD-002 — Integração Supabase

- **Necessidade derivada:** remover mecanismos demonstrativos e persistir dados por usuário/empresa.
- **Critérios derivados:** Auth completo, onboarding, CRUD, RLS, indicadores reais e somente credenciais públicas no frontend.
- **Resultado verificável:** implementação nos commits `08b2180` e `3cdbc19`; PR #1 aberto.
- **Limitação:** E2E remoto e SMTP ainda dependem de validação humana/controlada.

## ETD-003 — Qualidade e Hermes

- **Necessidade derivada:** repetir verificações sem segredos e definir uma fronteira segura para IA externa.
- **Critérios derivados:** testes locais, CI e função servidor sem deploy automático.
- **Resultado verificável:** testes em `tests/`, workflow e scaffold em `supabase/functions/hermes/`.
- **Limitação:** nenhum provedor generativo foi aprovado ou implantado.

## ETD-004 — v0.5 Visual

- **Necessidade derivada:** elevar legibilidade, hierarquia e responsividade do dashboard.
- **Critérios derivados:** preservar a identidade, todos os fluxos v0.4 e dados reais; suportar teclado e movimento reduzido; evitar dependências injustificadas.
- **Resultado verificável:** commits `2a48236` e `df691b1`; previews e PR #2.
- **Limitação:** validação visual final e promoção a produção dependem do responsável.

## ETD-005 — Documentação de engenharia

- **Necessidade derivada:** substituir a apresentação desatualizada por documentação compatível com a implementação real, sem apagar o histórico.
- **Critérios derivados:** documentos canônicos, autoria transparente, evidências e checagem automatizada.
- **Resultado verificável:** arquivos desta branch e futuro PR de documentação.
- **Limitação:** fatos sobre produto, experiência e validações humanas continuam sujeitos à confirmação do responsável.

## Registros históricos

O acervo anterior permanece em `docs/businessmind-ai/PROMPT_LOG.md` e `docs/businessmind-ai/CHATGPT_PROMPT_HISTORY.md`. Esses arquivos são históricos, podem conter reconstruções narrativas e não são tratados como transcrições literais ou como fonte canônica do estado técnico.
