# BusinessMind AI — Portfólio Softplan Futures

**Projeto principal de Guilherme Soster Santeti**, estudante de Análise e Desenvolvimento de Sistemas (UPF).

O **BusinessMind AI** é um MVP de apoio à gestão financeira de pequenos negócios. A proposta é reunir receitas, despesas, indicadores e recomendações em uma interface simples para apoiar a compreensão dos resultados.

## Comece por aqui

| Recurso | Acesso |
| --- | --- |
| **Demonstração pública — sem cadastro** | [Abrir BusinessMind AI](https://businessmind-ai-demo.guisoster060.workers.dev) |
| **Código e documentação atualizados** | [BusinessMind AI na branch de desenvolvimento consolidada](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/tree/new-branch/projects/businessmind-ai) |
| **Apresentação de 5 minutos** | [Roteiro para recrutadores](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/new-branch/projects/businessmind-ai/docs/RECRUITER_PRESENTATION.md) |
| **Roteiro de avaliação** | [Funcionalidades, testes e limitações](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/new-branch/projects/businessmind-ai/docs/REVIEW_GUIDE.md) |
| **Ambiente de testes com autenticação** | [Staging](https://businessmind-ai-staging.pages.dev) — use somente dados fictícios |

> **Importante:** a implementação e a documentação mais recentes estão na branch `new-branch`. A branch `main` é a página de entrada do portfólio, não a referência para executar o código atualizado.

## Problema e solução

Pequenos empreendedores podem ter dificuldade para consolidar e interpretar movimentações financeiras. O BusinessMind AI reúne os lançamentos em um painel com indicadores, gráficos e alertas. O assistente **Hermes**, na versão atual, produz análises e recomendações **determinísticas baseadas em regras**; **não** é um modelo generativo.

## O que foi desenvolvido

- Interface responsiva com visão geral, indicadores, inteligência e configurações.
- Cadastro e autenticação no ambiente de testes.
- Movimentações financeiras persistidas em PostgreSQL via Supabase.
- Controle de acesso por empresa com políticas Row Level Security (RLS).
- Indicadores, alertas, exportação CSV e Hermes determinístico.
- Testes automatizados e documentação de arquitetura, segurança e limitações.

A demonstração pública funciona com **dados fictícios no navegador** e não depende do banco remoto. O staging permite testar o fluxo real de autenticação e persistência, sujeito aos limites dos serviços gratuitos.

## Por que IA e qual foi meu papel?

A visão futura do produto inclui um assistente generativo que responda a dúvidas com base nos dados autorizados de cada empresa. **Essa integração ainda não está ativa.** A decisão foi priorizar um MVP verificável, com separação de dados, registros financeiros e análises determinísticas.

**Contribuição humana:** definição do problema, escopo, prioridades, decisões de produto, acompanhamento das implementações e validação manual. **Apoio de IA:** pesquisa, planejamento técnico, geração e revisão de código, testes e documentação, utilizando ChatGPT, Claude e Codex.

O projeto demonstra tanto o que foi entregue quanto os limites e aprendizados. Os testes registrados não equivalem a uma auditoria de segurança completa.

## Evidências visuais

As quatro telas podem ser exploradas na [demonstração pública](https://businessmind-ai-demo.guisoster060.workers.dev). Capturas reais da interface e eventual vídeo serão adicionados após registro e conferência, sem substituir imagens por representações artificiais.

## Documentação técnica

Acesse o [README técnico atualizado](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/new-branch/projects/businessmind-ai/README.md) e o [índice de evidências](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/new-branch/projects/businessmind-ai/docs/REVIEW_GUIDE.md).

---

**Autor:** Guilherme Soster Santeti · [GitHub](https://github.com/guisoster060-cmyk)
