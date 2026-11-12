# BusinessMind AI — resumo executivo para avaliação

**O que é:** MVP de apoio à leitura de indicadores financeiros para pequenos negócios brasileiros. **Escopo:** demonstração técnica, não serviço financeiro de produção.

## Experimente em 5 minutos
1. [Prévia com autenticação e Gemini limitado](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev) — criar conta, confirmar e-mail, cadastrar empresa fictícia.
2. Em **Indicadores**, lançar receita e despesa fictícias; verificar totais em **Visão geral**.
3. Em **Inteligência**, solicitar análise ao Hermes. Os cálculos são determinísticos; a interpretação generativa é complementar e sujeita a quotas.
4. [Roteiro completo](START_HERE_RECRUITER.md) ou [demo sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev) (sem Gemini).

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
