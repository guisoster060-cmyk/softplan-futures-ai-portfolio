# BusinessMind AI — Portfólio Softplan Futures

**MVP web para pequenos negócios:** registro de receitas e despesas, indicadores financeiros e análises explicativas pelo assistente Hermes.

**[▶ Experimentar a demonstração pública — sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev)**

A demonstração funciona com **dados fictícios armazenados no navegador**. Não utiliza autenticação, banco remoto nem IA generativa. É a melhor forma de conhecer o projeto rapidamente.

[Ver as quatro telas](#interface) · [Roteiro de avaliação](#como-avaliar-em-2-minutos) · [Código e documentação técnica](projects/businessmind-ai/README.md) · [Índice técnico](projects/businessmind-ai/docs/INDEX.md)

## O problema e a proposta

Pequenos negócios podem ter dificuldade para reunir movimentações e interpretar seus resultados. O BusinessMind AI explora uma solução simples: organizar receitas e despesas, calcular indicadores e explicar o que os dados permitem concluir. **É um MVP de portfólio, não um produto comercial validado**; ganhos de tempo ou financeiros ainda não foram medidos em empresas reais.

## Como avaliar em 2 minutos

1. Abra a **[demo pública](https://businessmind-ai-demo.guisoster060.workers.dev)**.
2. Navegue por **Visão geral**, **Indicadores**, **Inteligência** e **Configurações**.
3. Registre uma movimentação fictícia e observe os indicadores atualizados.
4. Faça uma pergunta ao **Hermes** e veja a análise determinística.
5. Para detalhes de implementação, consulte [arquitetura](projects/businessmind-ai/docs/ARCHITECTURE.md), [testes](projects/businessmind-ai/docs/TESTING.md) e [decisões técnicas](projects/businessmind-ai/docs/TECHNICAL_DECISIONS.md).

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
- **Qualidade:** testes automatizados em Node.js e Deno, verificações de segurança e workflows GitHub Actions. Consulte os [resultados e limites dos testes](projects/businessmind-ai/docs/TESTING.md), sem pressupor que o CI mais recente passou.

## Ambientes e limites

| Ambiente | Finalidade | Restrições |
| --- | --- | --- |
| [Demo pública](https://businessmind-ai-demo.guisoster060.workers.dev) | Avaliação imediata, sem cadastro | Dados fictícios locais; sem Supabase ou Gemini |
| [Staging Supabase](https://businessmind-ai-staging.pages.dev) | Testes de autenticação e persistência remota | Cadastro e entrega do e-mail de confirmação ainda exigem validação ponta a ponta; use somente dados fictícios |
| [Prévia Gemini isolada](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev) | Exploração experimental da integração generativa | Branch separada, cadastro e quotas; **não integra a demo pública nem a produção** |

A integração Gemini teve **um ensaio controlado documentado**, com resposta HTTP 200 e interpretação exibida no navegador. Isso não representa disponibilidade geral nem validação de todos os fluxos. O deploy público da demo pode estar em versão anterior às correções de código da `main`; **a publicação das últimas alterações ainda precisa ser confirmada**. Testes em Windows e Safari também permanecem pendentes.

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
