# Método de desenvolvimento assistido por IA

## 1. Objetivo

Este documento explica como ferramentas de IA foram usadas sem atribuir a elas decisões humanas nem atribuir ao responsável implementações que foram produzidas com assistência automatizada.

## 2. Divisão de responsabilidades observada

### Responsável humano

- definiu o objetivo do portfólio e priorizou o BusinessMind AI;
- aprovou escopo, stack e serviços registrados nas decisões técnicas;
- criou e configurou o projeto Supabase;
- executou manualmente a migração e informou o resultado do teste SQL;
- habilitou autenticação por e-mail;
- forneceu a interface v0.3 e os artefatos da Etapa 1 v0.4;
- solicitou a integração, a evolução visual e a reorganização documental;
- mantém a decisão final sobre merge, produção, provedor de IA e mudanças remotas.

### Ferramentas de IA

- analisaram requisitos e riscos;
- inspecionaram o repositório e o histórico;
- produziram ou revisaram código, testes, workflows e documentação;
- executaram verificações locais e visuais disponíveis;
- organizaram commits, branches e pull requests quando autorizadas;
- registraram limitações e itens não validados.

### Responsabilidade compartilhada

- transformar objetivos de produto em requisitos verificáveis;
- revisar decisões e trade-offs;
- interpretar resultados de teste;
- decidir o que será aceito e incorporado ao portfólio.

## 3. Fluxo de uma entrega assistida

1. **Contexto:** consultar código, documentos, diff, commits e PRs relevantes.
2. **Especificação:** converter a solicitação em requisitos e critérios de aceitação.
3. **Risco:** identificar segurança, dados, custo, compatibilidade e ações externas.
4. **Implementação:** alterar somente o escopo autorizado em branch própria.
5. **Verificação:** executar testes aplicáveis e registrar comandos e resultados.
6. **Revisão:** analisar diff, segredos, inconsistências e impacto documental.
7. **Rastreabilidade:** atualizar documentos e relacionar commit e PR.
8. **Validação humana:** submeter o PR sem merge automático.

## 4. Especificações técnicas derivadas

Solicitações informais não são reproduzidas como supostos prompts originais. Para fins de engenharia, elas podem ser convertidas em uma **especificação técnica derivada**, contendo objetivo, requisitos, critérios de aceitação, limites e evidências.

Essa reformulação:

- não é apresentada como texto originalmente escrito pelo responsável;
- não substitui registros históricos existentes;
- não inventa intenções ou aprovações;
- referencia apenas informações disponíveis no repositório ou confirmadas no escopo da entrega.

## 5. Regras de transparência

- Uma recomendação de IA não equivale a decisão aprovada.
- Código produzido com assistência de IA não é atribuído como implementação manual do responsável.
- A aprovação de um PR não prova, por si só, que houve teste em produção.
- Resultados relatados por terceiros ou pelo responsável são identificados como relatos quando não há log versionado.
- Prompts literais, quando preservados, permanecem em arquivos históricos e não são silenciosamente reescritos.
- Credenciais e conversas privadas não integram a automação documental.

## 6. Manutenção documental futura

Ao concluir uma tarefa, o agente deve:

1. executar `git diff --check` e revisar `git diff`;
2. consultar os commits novos e o estado dos PRs;
3. atualizar requisitos, arquitetura, decisões, testes ou status afetados;
4. adicionar uma entrada ao `ENGINEERING_LOG.md` quando houver mudança relevante;
5. adicionar uma entrada ao `PROMPT_LOG.md` como especificação técnica derivada;
6. executar `npm run verify`;
7. incluir código e documentação no mesmo PR quando fizerem parte da mesma entrega.

O workflow valida arquivos e links, mas não cria documentação automaticamente nem acessa conversas privadas.

