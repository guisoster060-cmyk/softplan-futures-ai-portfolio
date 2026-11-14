# BusinessMind AI — Portfólio Softplan Futures

**MVP web para pequenos negócios:** registro de receitas e despesas, indicadores financeiros e análises explicativas pelo assistente Hermes.

## Experimente o BusinessMind AI — três caminhos

| Acesso | O que testar | Limitações |
| --- | --- | --- |
| **[▶ Demo rápida — sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev)** | Quatro telas, movimentações fictícias, indicadores e Hermes determinístico | Dados locais ao navegador; sem autenticação remota ou Gemini |
| **[▶ Criar conta — staging](https://businessmind-ai-staging.pages.dev)** | Cadastro, confirmação de e-mail, login, criação de empresa, movimentações persistidas no Supabase | Ambiente de testes; e-mails sujeitos a limites; Gemini generativo não é garantido neste endereço |
| **[▶ Testar Gemini — prévia experimental](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev)** | Entrar com conta de teste, criar empresa fictícia, registrar movimentações e solicitar interpretação generativa ao Hermes | Gemini sujeito a quota e disponibilidade; resposta determinística de segurança quando indisponível |

**Roteiro de avaliação em aproximadamente 3 minutos:** (1) abra a demo sem cadastro para conhecer a interface; (2) abra o staging para criar sua própria conta e empresa; (3) na prévia experimental, entre com uma conta de teste, registre uma receita e uma despesa fictícias e pergunte ao Hermes: *“Analise minhas receitas e despesas e sugira duas melhorias para a empresa.”* Verifique se aparece **“Interpretação generativa”**. Se o Hermes informar modo determinístico, o Gemini não foi utilizado naquela resposta.

**Validação em 13/11/2026 (horário de Brasília):** na prévia experimental, uma conta de teste obteve resposta generativa visível às 21h12; os logs da Edge Function `hermes-recruiter` v3 registraram autorização e resposta do provedor aceitas. Uma tentativa anterior às 21h07 retornou fallback determinístico após validação de resposta inválida. **Isto comprova testes pontuais, não disponibilidade geral ou produção.** A quota do endpoint de testes limita até três tentativas por usuário por dia, com intervalo mínimo de sessenta segundos, e vinte tentativas globais por dia; tentativas malsucedidas também podem consumir quota. Utilize somente dados fictícios.


A **demo pública** funciona com **dados fictícios armazenados no navegador**. Não utiliza autenticação, banco remoto nem IA generativa. É a melhor forma de conhecer o projeto rapidamente.

[Ver as quatro telas](#interface) · [Roteiro de avaliação](#como-avaliar-em-3-minutos) · [Validação manual no Android (13/11)](projects/businessmind-ai/docs/MANUAL_VALIDATION_2026-11-13.md) · [Código e documentação técnica](projects/businessmind-ai/README.md) · [Índice técnico](projects/businessmind-ai/docs/INDEX.md)

## O problema e a proposta

Pequenos negócios podem ter dificuldade para reunir movimentações e interpretar seus resultados. O BusinessMind AI explora uma solução simples: organizar receitas e despesas, calcular indicadores e explicar o que os dados permitem concluir. **É um MVP de portfólio, não um produto comercial validado**; ganhos de tempo ou financeiros ainda não foram medidos em empresas reais.

## Como avaliar em 3 minutos

1. Abra a **[demo pública](https://businessmind-ai-demo.guisoster060.workers.dev)**, navegue pelas quatro telas, registre uma movimentação fictícia e consulte o Hermes determinístico.
2. No **[staging](https://businessmind-ai-staging.pages.dev)**, crie uma conta própria, confirme o e-mail quando solicitado e registre uma movimentação em uma empresa fictícia.
3. Na **[prévia Gemini](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev)**, entre com uma conta de teste, selecione a empresa e pergunte: *“Analise minhas receitas e despesas e sugira duas melhorias para a empresa.”* Confirme o rótulo **Interpretação generativa**; se houver fallback determinístico, a chamada generativa não foi utilizada nessa resposta.

O roteiro é uma estimativa de tempo para exploração inicial; cadastro e confirmação de e-mail podem levar mais. Para detalhes, consulte [arquitetura](projects/businessmind-ai/docs/ARCHITECTURE.md), [testes](projects/businessmind-ai/docs/TESTING.md) e [decisões técnicas](projects/businessmind-ai/docs/TECHNICAL_DECISIONS.md).

## Interface

| Visão geral | Indicadores |
| --- | --- |
| ![Visão geral](projects/businessmind-ai/screenshots/01-visao-geral.png) | ![Indicadores](projects/businessmind-ai/screenshots/02-indicadores.png) |
| Inteligência | Configurações |
| ![Hermes](projects/businessmind-ai/screenshots/03-inteligencia.png) | ![Configurações](projects/businessmind-ai/screenshots/04-configuracoes.png) |

*Capturas da demonstração com dados fictícios; não comprovam autenticação ou isolamento remoto.*

## Implementação

- **Frontend:** HTML, CSS, JavaScript e SVG; interface responsiva.
- **Funcionalidades:** movimentações financeiras, indicadores, séries mensais, categorias e exportação CSV.
- **Backend de staging:** Supabase Auth, PostgreSQL, Row Level Security (RLS) e Edge Functions.
- **Hermes na demo:** análises determinísticas; não é um modelo generativo.
- **Qualidade:** testes automatizados em Node.js e Deno, verificações de segurança e workflows GitHub Actions. Consulte os [resultados e limites dos testes](projects/businessmind-ai/docs/TESTING.md), com o workflow de publicação #3 aprovado em 13/11/2026.

## Ambientes e limites

| Ambiente | Finalidade | Restrições |
| --- | --- | --- |
| [Demo pública](https://businessmind-ai-demo.guisoster060.workers.dev) | Avaliação imediata, sem cadastro | Dados fictícios locais; sem Supabase ou Gemini |
| [Staging Supabase](https://businessmind-ai-staging.pages.dev) | Testes de autenticação e persistência remota | Cadastro e confirmação testados manualmente em 11/11 e novamente relatados pelo responsável em 13/11; entrega de e-mail sujeita a limites; use somente dados fictícios |
| [Prévia Gemini isolada](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev) | Exploração experimental da integração generativa | Branch separada, cadastro e quotas; **não integra a demo pública nem a produção** |

A integração Gemini foi validada pontualmente na prévia isolada, inclusive com uma conta nova e resposta aceita nos logs da função `hermes-recruiter` v3 em 13/11, às 21h12 (Brasília). Isso não representa disponibilidade geral nem validação de todos os fluxos. **Publicação confirmada em 13/11/2026:** GitHub Actions #3 aprovado; Cloudflare Workers registrou novo deploy às 23:25 UTC, com 100% do tráfego na nova versão. Isso não substitui testes em Windows e Safari, ainda pendentes.

## Validação manual da demo — 13/11/2026

O responsável testou a demonstração pública em smartphone Android e compartilhou capturas dos fluxos de criação, edição e exclusão de receitas, atualização dos indicadores, respostas do Hermes determinístico, preferências e alternância de empresas. A permanência dos dados após recarga foi confirmada pelo responsável. **Os resultados se limitam à demo local e não comprovam autenticação, RLS ou Gemini.**

**[Consultar cenários, evidências, cálculos e pendências da validação manual](projects/businessmind-ai/docs/MANUAL_VALIDATION_2026-11-13.md)**.

## Documentação e processo

- [README técnico e estrutura do projeto](projects/businessmind-ai/README.md)
- [Índice de documentação](projects/businessmind-ai/docs/INDEX.md)
- [Arquitetura](projects/businessmind-ai/docs/ARCHITECTURE.md) · [Requisitos](projects/businessmind-ai/docs/REQUIREMENTS.md) · [Testes](projects/businessmind-ai/docs/TESTING.md)
- [Método de desenvolvimento com apoio de IA](projects/businessmind-ai/docs/AI_DEVELOPMENT_METHOD.md) · [Histórico e decisões](projects/businessmind-ai/docs/ENGINEERING_LOG.md)
- [Documentação histórica](docs/businessmind-ai/README.md), preservada para rastreabilidade e não como status atual.

Os materiais experimentais de recrutamento e da integração Gemini permanecem em uma [branch de validação separada](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/tree/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs). Esses documentos **não são pré-requisitos para testar a demo**.

## Executar localmente

```bash
cd projects/businessmind-ai
npm ci
python3 -m http.server 8080 --directory app
```

Abra `http://localhost:8080`. Para verificações locais, use `npm run verify`. O ambiente de staging pode exigir configuração pública de Supabase autorizada. **Nunca coloque chaves administrativas ou de IA no frontend.**

---

**Escopo:** projeto de portfólio para demonstrar aprendizado e decisões de engenharia. Não inserir dados reais de clientes nos ambientes de demonstração ou testes.
