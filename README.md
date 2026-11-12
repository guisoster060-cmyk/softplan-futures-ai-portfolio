# BusinessMind AI — Portfólio Softplan Futures

> **COMECE AQUI (sem cadastro):** [Abrir demonstração imediata](https://businessmind-ai-demo.guisoster060.workers.dev) · [Ver as telas](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/RECRUITER_GALLERY.md) · [Roteiro de 2 minutos](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/START_HERE_RECRUITER.md).

**[Índice da documentação e organização do código](projects/businessmind-ai/docs/INDEX.md)** — ponto de entrada para recrutadores e avaliadores técnicos.

> **Estado da publicação (12/11/2026):** links públicos aprovados no teste HTTP automatizado; o Worker da demo ainda usa implantação de 11/11/2026. A melhoria de perguntas abertas do Hermes foi incorporada ao código da `main`, mas aguarda atualização segura dos assets da Cloudflare. A demo atual permanece disponível.

**Resumo em uma frase:** MVP para organizar receitas e despesas de pequenos negócios, calcular indicadores e ajudar a interpretar os resultados com o assistente Hermes.

**Para avaliar a IA generativa:** [Prévia isolada com cadastro e Gemini limitado](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev). É uma versão distinta da demo imediata; exige confirmação de e-mail, dados fictícios e está sujeita a quotas.

**Documentação preparada para avaliação:** [Resumo executivo](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/RECRUITER_ONE_PAGE.md) · [Plano de validação de impacto](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/BUSINESS_IMPACT_VALIDATION.md) · [Código e documentação da versão completa](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/tree/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai).

**Transparência:** os resultados de impacto financeiro e economia de tempo ainda não foram medidos com empresas reais. As capturas publicadas na galeria mostram a demo fictícia. A prévia Gemini está em branch isolada e **não foi mesclada à `main`**.

---

## Documentação histórica da branch principal


**MVP de gestão e análise financeira para pequenos negócios**, desenvolvido como projeto de portfólio para demonstrar desenvolvimento web, modelagem de dados, segurança e testes.

O sistema permite registrar receitas e despesas, visualizar indicadores financeiros e consultar o **Hermes**, assistente de análises determinísticas. É um MVP técnico, não um produto comercial validado.

## Experimente o projeto

**[Abrir demonstração pública — sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev)**

A demonstração utiliza dados fictícios armazenados no navegador. Permite navegar pelas quatro telas, registrar movimentações ilustrativas e experimentar o Hermes determinístico. **Não utiliza autenticação, banco remoto ou IA generativa.**

**[Abrir ambiente de testes com Supabase](https://businessmind-ai-staging.pages.dev)**

O staging utiliza Supabase Auth e dados persistidos no PostgreSQL. O formulário oferece **Criar uma conta**, mas o cadastro de novos usuários depende da confirmação de e-mail e da configuração de envio SMTP, ainda **não verificadas de ponta a ponta**. Use **somente dados fictícios**. Se não conseguir concluir o cadastro, utilize a demonstração pública sem cadastro acima.

## Interface

| Visão geral | Indicadores |
| --- | --- |
| ![Visão geral](projects/businessmind-ai/screenshots/01-visao-geral.png) | ![Indicadores](projects/businessmind-ai/screenshots/02-indicadores.png) |
| Inteligência | Configurações |
| ![Hermes](projects/businessmind-ai/screenshots/03-inteligencia.png) | ![Configurações](projects/businessmind-ai/screenshots/04-configuracoes.png) |

*Capturas da demonstração com dados fictícios; não comprovam integração remota.*

## Funcionalidades e tecnologias

- **Frontend:** HTML semântico, CSS, JavaScript e SVG; navegação responsiva.
- **Dados:** receitas e despesas, indicadores, séries mensais, categorias e exportação CSV.
- **Backend do staging:** Supabase Auth, PostgreSQL, Row Level Security (RLS) e Edge Functions.
- **Hermes:** análises determinísticas com limites explícitos quando faltam dados.
- **Qualidade:** testes automatizados em Node.js e Deno, verificações de segurança e GitHub Actions.

## Para quem está avaliando

1. Abra a **demonstração pública** acima para conhecer a experiência sem criar conta.
2. Registre uma movimentação fictícia em **Indicadores** e confira o resultado em **Visão geral**.
3. Abra **Inteligência** e faça uma pergunta ao Hermes.
4. Consulte o [código da aplicação](projects/businessmind-ai/app), o [README técnico](projects/businessmind-ai/README.md), o [roteiro de avaliação](projects/businessmind-ai/docs/REVIEW_GUIDE.md) e os [testes](projects/businessmind-ai/tests).

## Estado de validação — 12/11/2026

O Hermes foi validado **uma vez com o Gemini no staging controlado**: registros do servidor confirmaram autorização e resposta aceita pelo provedor, a requisição terminou em HTTP 200 e a interpretação generativa apareceu no navegador, separada do cálculo financeiro local. A autorização de uso único foi consumida. **A demo pública não usa Gemini** e não é necessário acesso ao staging para conhecer o projeto.

- [Relatório técnico da integração Gemini (branch de validação)](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/HERMES_GEMINI_VALIDATION_2026-11-12.md).
- [Guia de avaliação para recrutadores (branch de validação)](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/RECRUITER_HANDOFF_2026-11-12.md).
- [Histórico complementar de prompts de IA](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/PROMPT_LOG_2026-11-12.md) e [histórico anterior](docs/businessmind-ai/PROMPT_LOG.md).
- [Plano de cadastro e limpeza posterior, sem exclusão de usuários](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/RECRUITER_SIGNUP_AND_CLEANUP.md).
- [Verificação automatizada da branch de melhorias](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/actions/workflows/businessmind-ci.yml) (consultar execução/commit antes de afirmar aprovação).

**Limitações:** o cadastro de um usuário novo e a entrega do e-mail de confirmação ainda precisam de teste; a integração Gemini não está aberta a uso irrestrito; validação Windows/Safari ainda pendente. A branch de melhorias não foi incorporada à aplicação de produção.

## Executar localmente

```bash
cd projects/businessmind-ai
npm ci
python3 -m http.server 8080 --directory app
```

Abra `http://localhost:8080`. Para executar as verificações locais, use `npm run verify`. A configuração local pode exigir credenciais públicas de um projeto Supabase autorizado; **não adicione chaves administrativas ou de IA ao frontend**.

---

**Escopo:** MVP de portfólio. Não usar dados reais de clientes no ambiente de testes.
