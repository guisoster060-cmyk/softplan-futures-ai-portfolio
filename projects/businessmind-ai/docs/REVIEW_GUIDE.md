# Roteiro de avaliação — BusinessMind AI

Estado de referência: `new-branch` após o merge do PR #10 (`1f5cc996`, 11/11/2026). Este roteiro é um índice, não uma nova fonte de resultados.

## Em poucos minutos

1. **Problema e solução:** o [README principal](../../../README.md) descreve o MVP para registrar receitas e despesas por empresa e analisar somente dados autorizados.
2. **Demonstração:** [staging](https://businessmind-ai-staging.pages.dev) carrega publicamente, mas `index.html` e `app.js` servidos correspondem ao commit `d15282a`, anterior ao PR #10. A tela autenticada exige conta autorizada; não há senha pública. Para explorar a interface sem credenciais nem rede, use a demonstração fictícia local abaixo. Ela ainda não está publicada.
3. **Fluxo principal:** autenticação, seleção/criação de empresa, movimentações, indicadores e Hermes determinístico. O [README do projeto](../README.md) explica a execução local.
4. **Engenharia:** [arquitetura](ARCHITECTURE.md), [requisitos](REQUIREMENTS.md) e [decisões](TECHNICAL_DECISIONS.md) mostram componentes, critérios e trade-offs.
5. **Evidência:** [testes](TESTING.md) distinguem Node e Deno com mocks, PostgreSQL local, HTTP com JWT no staging e validação manual. A revisão do PR #10 registrou 52 testes Node e 28 Deno com mocks; não os confunda com execução remota nesta missão.
6. **Transparência:** [estado atual](PROJECT_STATUS.md), [diário](ENGINEERING_LOG.md), [método assistido por IA](AI_DEVELOPMENT_METHOD.md) e [especificações técnicas derivadas](PROMPT_LOG.md) separam implementação, validação e responsabilidades.

## Limites importantes

### Demonstração isolada, somente local nesta revisão

Em `projects/businessmind-ai/`, execute `npm run build:demo-preview` e sirva `dist-demo/` com `python3 -m http.server 8080 --directory dist-demo`. Abra `http://localhost:8080`. O modo entra automaticamente com uma identidade fictícia e movimentações ilustrativas. Crie uma movimentação em **Indicadores**, recarregue, examine **Visão geral** e **Inteligência** (Hermes determinístico), depois use **Sair** e **Entrar na demonstração**. **Restaurar dados fictícios** reinicia os dados locais.

O banner identifica a simulação; `config.js` usa `demo.invalid`, a SDK é substituída por adaptador em `localStorage` e a CSP bloqueia conexões externas. Não há Supabase Auth, PostgreSQL nem RLS reais nesse modo. O build é artefato local não versionado e **não deve ser confundido com o staging real**. Publicá-lo separadamente exigirá autorização e nova verificação do destino; este PR não altera hospedagem.

- Gemini está no código, mas bloqueado por `STAGING_DETERMINISTIC_ONLY=true` e pelo frontend; não houve validação generativa remota. O [plano de validação](GEMINI_VALIDATION_PLAN.md) não autoriza ativação.
- A leitura de movimentações valida paginação e completude, mas há limite de 5.000 linhas e não existe snapshot entre páginas.
- Testes locais com mocks não comprovam RLS remoto; o registro de 33 verificações HTTP com JWT é evidência separada.
- Recuperação/confirmação de e-mail depende da configuração do serviço; auditoria formal de acessibilidade e matriz cross-browser ainda faltam.

O histórico v0.3 e os documentos antigos foram preservados para rastreabilidade; consulte os documentos acima para o estado atual.

## Prioridades antes da apresentação

- **P0:** para demonstração remota autenticada, obter acesso temporário a uma conta fictícia por canal seguro sob controle humano; sem isso, usar o modo isolado somente após publicação separada autorizada.
- **P1:** executar auditoria acessível com leitor de tela e testes em Firefox/Safari; automatizar E2E com JWT real em ambiente isolado. Esses itens não são tratados como concluídos por testes com mocks.
