# Guia de avaliação — BusinessMind AI

**Projeto:** MVP web de gestão e análise de resultados para pequenos negócios.  
**Objetivo da demonstração:** comprovar a capacidade de transformar requisitos de negócio em software com autenticação, persistência, isolamento de dados, interface e testes.

## Avaliação em 5 minutos

1. **Produto:** [abrir demonstração de staging](https://businessmind-ai-staging.pages.dev). Ambiente de teste; o acesso a fluxos autenticados requer conta fictícia autorizada. Não há credenciais públicas.
2. **O que funciona:** cadastro/login, onboarding de empresa, receitas e despesas, indicadores calculados, gráficos, CSV e Hermes determinístico. A disponibilidade no instante da avaliação depende do staging.
3. **Como funciona:** [arquitetura e limites de confiança](ARCHITECTURE.md), [requisitos](REQUIREMENTS.md) e [decisões técnicas](TECHNICAL_DECISIONS.md).
4. **Como foi verificado:** [estratégia e evidências](TESTING.md), com separação entre testes locais, mocks, SQL e HTTP/JWT real no staging.
5. **Como a IA foi usada no desenvolvimento:** [método](AI_DEVELOPMENT_METHOD.md) e [tarefas delegadas](PROMPT_LOG.md). As descrições são **especificações técnicas derivadas**, não cópias de prompts originais.

## O que observar no código

- `app/`: HTML, CSS e JavaScript modular em evolução, sem framework de UI.
- `supabase/migrations/`: modelo relacional e políticas RLS.
- `supabase/functions/hermes/`: validação de sessão e empresa, agregação e integração generativa protegida.
- `tests/` e `scripts/`: regressão e verificações automáticas.

## Transparência técnica

O Hermes determinístico foi validado no staging. A integração Gemini generativa está implementada em código, **mas bloqueada** e sem teste remoto de geração. O projeto não afirma uso generativo ativo, prontidão para produção, validação comercial conclusiva ou cobertura completa de segurança. Veja [estado e riscos](PROJECT_STATUS.md).

## Participação humana e ferramentas de IA

O responsável definiu problema, prioridades, escopo, aceitou decisões de produto e autorizou integrações. Ferramentas de IA apoiaram análise, implementação, testes e documentação. A qualidade das entregas é apresentada por artefatos versionados, PRs e resultados verificáveis, não por quantidade de prompts.

O [índice de tarefas delegadas](PROMPT_LOG.md) resume **objetivo → critérios de aceitação → ferramenta/atividade quando comprovada → evidência → limitações**, sem divulgar conversas privadas, segredos ou supostos prompts literais.

## Material interno versus material para avaliação

A trilha principal para o recrutador é: este guia, README, arquitetura, testes, decisões e método de desenvolvimento. Logs detalhados, documentos históricos, migrações e testes continuam no repositório para auditabilidade, mas não precisam ser lidos para compreender o projeto. Nenhum arquivo histórico foi apagado ou ocultado do Git.
