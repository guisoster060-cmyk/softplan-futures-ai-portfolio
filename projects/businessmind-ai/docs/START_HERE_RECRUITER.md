# Comece aqui — BusinessMind AI (Softplan Futures)

**O jeito mais rápido de avaliar: abra a [DEMONSTRAÇÃO IMEDIATA — sem login](https://businessmind-ai-demo.guisoster060.workers.dev).** A demo possui dados fictícios locais, quatro telas e Hermes determinístico. **Não chama Gemini e não comprova autenticação nem banco real.**

**Quer avaliar o Gemini e a integração Supabase?** Abra a [PRÉVIA COMPLETA — com cadastro](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev), crie uma conta própria, confirme o e-mail e registre ao menos uma movimentação fictícia. O Gemini tem quotas e fallback determinístico. **Não existe login/senha universal para o banco real**, para preservar isolamento de contas e evitar compartilhamento de dados.

## Roteiro rápido — 2 minutos, sem cadastro

1. Abra a **demonstração imediata**. Se aparecer a entrada de demonstração, toque em **Entrar na demonstração**.
2. Em **Visão geral**, observe receitas, despesas e resultado dos dados ilustrativos.
3. Em **Indicadores**, crie uma movimentação fictícia e confira o recálculo; teste a exportação CSV se desejar.
4. Em **Inteligência**, peça ao Hermes um resumo. Nesta demo, a resposta é **determinística**, não Gemini.
5. Em **Configurações**, examine o perfil ilustrativo. Use **Restaurar dados fictícios** para reiniciar o cenário.

## Roteiro completo — 5 a 10 minutos, com Gemini limitado

1. Abra a [prévia autenticada](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev) em janela anônima, selecione **Criar uma conta** e confirme o e-mail recebido (confira spam).
2. Entre e cadastre uma **empresa fictícia**.
3. Em **Indicadores**, registre uma receita e uma despesa fictícias; confira os totais em **Visão geral**.
4. Em **Inteligência → Assistente**, peça uma análise. Verifique cálculo local separado da interpretação generativa; por quota ou indisponibilidade pode haver fallback determinístico.
5. Confira **Configurações** e use **Sair**.

## O que este MVP comprova

- Autenticação Supabase, persistência PostgreSQL, separação de dados por empresa, indicadores calculados sobre movimentações, exportação CSV, layout responsivo e Hermes com integração generativa limitada.
- Teste real de Gemini em conta recém-criada, em 12/11/2026: logs do provedor registraram autorização e resposta aceitas; detalhes em [evidências do Hermes](HERMES_RECRUITER_LIMITED_2026-11-12.md).
- Testes automatizados: [GitHub Actions #43323731478](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/actions/runs/43323731478) concluído com sucesso. Testes automatizados e teste manual não substituem auditoria completa de segurança.

## Documentação para avaliação

- [Arquitetura](ARCHITECTURE.md) · [Requisitos](REQUIREMENTS.md) · [Testes](TESTING.md) · [Decisões técnicas](TECHNICAL_DECISIONS.md)
- [Histórico de prompts de 12/11](PROMPT_LOG_2026-11-12.md) · [Método de desenvolvimento com IA](AI_DEVELOPMENT_METHOD.md) · [Roteiro detalhado](REVIEW_GUIDE.md)
- [Plano das capturas reais](RECRUITER_SCREENSHOT_PLAN_2026-11-12.md). As cinco imagens tratadas foram entregues ao responsável em ZIP no chat, **ainda não foram incorporadas ao repositório**.

## Limitações e transparência

- Gemini possui quotas e fallback determinístico; uma resposta determinística não prova chamada ao provedor.
- Dados e análises são demonstrativos, não orientação contábil.
- O endereço desta prévia é uma branch de validação, separada da versão original preservada.
- Não há necessidade de compartilhar credenciais ou acesso administrativo para avaliar o MVP.
