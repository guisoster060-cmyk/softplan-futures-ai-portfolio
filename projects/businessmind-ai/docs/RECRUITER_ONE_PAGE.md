# BusinessMind AI — resumo executivo para avaliação

**O que é:** MVP de apoio à leitura de indicadores financeiros para pequenos negócios brasileiros. **Escopo:** demonstração técnica, não serviço financeiro de produção.

## Comece pela demonstração — 2 minutos, sem cadastro

1. **[ABRIR BUSINESSMIND AI — DEMO IMEDIATA](https://businessmind-ai-demo.guisoster060.workers.dev)**. Use os dados fictícios locais; se necessário clique em **Entrar na demonstração**.
2. Visite **Visão geral → Indicadores → Inteligência → Configurações**.
3. Registre uma receita fictícia e confira os totais. Na demo, o Hermes é **determinístico**, sem Gemini.
4. Para conferir integração real com autenticação, banco e IA generativa, use a **[PRÉVIA COMPLETA — CADASTRO INDIVIDUAL](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev)**; exige confirmação de e-mail e está sujeita a quotas.

[Guia de avaliação passo a passo](START_HERE_RECRUITER.md) · [Auditoria e limites](RECRUITER_EXPERIENCE_AUDIT_2026-11-12.md).

## Problema → solução → prova
| Questão | Resposta concisa | Evidência |
|---|---|---|
| Que problema aborda? | Informações de receitas e despesas dispersas dificultam acompanhar resultado | [Hipótese e plano de validação](BUSINESS_IMPACT_VALIDATION.md) |
| O que foi construído? | Login, empresa, movimentações, indicadores, CSV e assistente Hermes | [Projeto](../README.md) |
| Onde entra IA? | Interpretação textual e recomendações a partir dos indicadores | [Validação Gemini](HERMES_RECRUITER_LIMITED_2026-11-12.md) |
| Foi testado? | Testes automatizados e verificação manual com conta nova | [Testes](TESTING.md) |
| Qual impacto medido? | **Ainda não medido em empresas reais** | [Protocolo de impacto](BUSINESS_IMPACT_VALIDATION.md) |
| Como foi feito? | HTML/CSS/JS, Supabase, PostgreSQL/RLS, Edge Functions, Cloudflare | [Arquitetura](ARCHITECTURE.md) |

## Decisões e aprendizados
- Diferenciar **cálculo confiável** de **interpretação probabilística**.
- Reduzir custo de infraestrutura com serviços gratuitos e quotas.
- Corrigir mínimo de lançamentos e validar login e isolamento entre contas.
- Documentar limitações e preservar o ambiente original.

## Leitura complementar
[Requisitos Softplan](SOFTPLAN_FUTURES_REQUIREMENTS_CHECK_2026-11-12.md) · [Histórico de prompts](PROMPT_LOG_2026-11-12.md) · [Guia técnico](REVIEW_GUIDE.md) · [Preparação para entrevista](POST_APPLICATION_NEXT_STEPS.md).

**Atenção:** as capturas atualmente publicadas no repositório representam uma demonstração fictícia. As cinco capturas da prévia autenticada estão documentadas no [plano de imagens](RECRUITER_SCREENSHOT_PLAN_2026-11-12.md), mas ainda não estão incorporadas ao GitHub.
