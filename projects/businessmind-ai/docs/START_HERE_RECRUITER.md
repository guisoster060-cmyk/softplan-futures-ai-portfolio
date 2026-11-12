# Comece aqui — BusinessMind AI (Softplan Futures)

**Tempo estimado:** 5–10 minutos. **Status:** MVP de portfólio, não produto financeiro em produção. **Dados:** use somente valores fictícios.

## Acesso rápido

- **Prévia com autenticação e Gemini limitado:** https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev
- **Demo pública sem cadastro (dados locais, Hermes determinístico):** https://businessmind-ai-demo.guisoster060.workers.dev
- **Código e documentação:** https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/tree/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai

## Teste guiado

1. Abra a **prévia com autenticação** em uma janela anônima e selecione **Criar uma conta**. Use e-mail válido e senha exclusiva; confirme o link recebido. Se o e-mail não chegar, confira spam e aguarde antes de repetir; o envio gratuito tem limites.
2. Entre, informe seu nome e uma **empresa fictícia**.
3. Acesse **Indicadores → Nova movimentação**. Cadastre uma receita fictícia e uma despesa fictícia. Confira os totais em **Visão geral** e a lista em **Indicadores**; opcionalmente exporte CSV.
4. Em **Inteligência → Assistente**, pergunte: “Analise as receitas, despesas e o resultado da minha empresa e recomende três melhorias”. Verifique o **cálculo local separado da interpretação generativa**. Se o limite de consultas for atingido ou o provedor não estiver disponível, o sistema pode usar modo determinístico e deve sinalizá-lo.
5. Em **Configurações**, confira perfil e empresa. Finalize usando **Sair** no menu.

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
