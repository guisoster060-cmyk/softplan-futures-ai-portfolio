# Roteiro de avaliação — BusinessMind AI

Estado de referência: `new-branch` após o merge do PR #4 (11/11/2026). Este roteiro é um índice, não uma nova fonte de resultados.

## Em poucos minutos

1. **Problema e solução:** o [README principal](../../../README.md) descreve o MVP para registrar receitas e despesas por empresa e analisar somente dados autorizados.
2. **Demonstração:** [staging](https://businessmind-ai-staging.pages.dev), com contas autorizadas e dados fictícios. O site publicado não incorpora automaticamente mudanças desta branch de revisão. Não há senha pública; não use dados financeiros reais.
3. **Fluxo principal:** autenticação, seleção/criação de empresa, movimentações, indicadores e Hermes determinístico. O [README do projeto](../README.md) explica a execução local.
4. **Engenharia:** [arquitetura](ARCHITECTURE.md), [requisitos](REQUIREMENTS.md) e [decisões](TECHNICAL_DECISIONS.md) mostram componentes, critérios e trade-offs.
5. **Evidência:** [testes](TESTING.md) distinguem Node e Deno com mocks, PostgreSQL local, HTTP com JWT no staging e validação manual. Os 52 testes Node e os 28 testes Deno com mocks foram executados nesta revisão; outros resultados datados não devem ser interpretados como reexecução.
6. **Transparência:** [estado atual](PROJECT_STATUS.md), [diário](ENGINEERING_LOG.md), [método assistido por IA](AI_DEVELOPMENT_METHOD.md) e [especificações técnicas derivadas](PROMPT_LOG.md) separam implementação, validação e responsabilidades.

## Limites importantes

- Gemini está no código, mas bloqueado por `STAGING_DETERMINISTIC_ONLY=true` e pelo frontend; não houve validação generativa remota. O [plano de validação](GEMINI_VALIDATION_PLAN.md) não autoriza ativação.
- A leitura de movimentações valida paginação e completude, mas há limite de 5.000 linhas e não existe snapshot entre páginas.
- Testes locais com mocks não comprovam RLS remoto; o registro de 33 verificações HTTP com JWT é evidência separada.
- Recuperação/confirmação de e-mail depende da configuração do serviço; auditoria formal de acessibilidade e matriz cross-browser ainda faltam.

O histórico v0.3 e os documentos antigos foram preservados para rastreabilidade; consulte os documentos acima para o estado atual.
