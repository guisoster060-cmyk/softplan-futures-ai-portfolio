# Plano de engenharia autêntica — BusinessMind AI

> Referência para uma etapa posterior à entrega funcional da candidatura. Não é evidência de que as melhorias já foram implementadas.

## Objetivo
Evoluir de um protótipo fortemente assistido por IA para software revisado, compreendido, testado e documentado, sem ocultar a colaboração de IA nem inventar autoria manual.

## Prioridade e limites
1. **Primeiro:** garantir release demonstrável, acesso autorizado, staging verificado, testes e material para a candidatura.
2. **Depois:** revisar e aprimorar manutenção, clareza e autenticidade, sem arriscar a versão estável.
3. Mudanças em branch isolada, PR, testes antes/depois, sem deploy ou ativação generativa automática.
4. Não reescrever todo o sistema apenas para parecer “feito à mão”.

## Auditoria futura — critérios verificáveis
- **Compreensão:** mapear arquitetura, autenticação, autorização, empresa, transações, indicadores, Hermes e fluxo de dados; preparar explicações verificáveis.
- **Manutenção:** identificar duplicações, responsabilidades misturadas, código morto, dependências desnecessárias e nomes confusos; refatorar incrementalmente com testes.
- **Qualidade:** cobrir falhas de rede, sessões expiradas, entradas inválidas, paginação, estados vazios e fluxos essenciais; distinguir mocks de integração remota.
- **Segurança:** revisar fronteiras de JWT/RLS, tratamento de dados, segredos, logs e uso de IA; não afirmar segurança comprovada sem testes.
- **Experiência:** revisar linguagem PT-BR natural, mensagens úteis, acessibilidade, consistência visual, mobile e comportamento em erros; preservar identidade visual aprovada.
- **Autenticidade:** registrar problema, hipóteses, decisões, trade-offs, bugs reais, testes e limitações; documentar contribuição humana e assistência de ChatGPT, Claude e Codex sem inventar prompts literais.
- **Entrevista:** conseguir explicar o que foi construído, por quê, como foi validado e o que mudaria com mais tempo.

## Critério de conclusão
Cada melhoria deve ter problema demonstrado, justificativa, diff revisável, teste relevante, resultado e risco de regressão. Não declarar “vibe coding removido” por aparência ou renomeação.

## Referências de pesquisa (11/11/2026)
- Martin Fowler — https://martinfowler.com/bliki/VibeCoding.html
- Google Cloud — https://cloud.google.com/discover/what-is-vibe-coding
- GitHub Docs — https://docs.github.com/en/copilot/tutorials/review-ai-generated-code
- IBM — https://www.ibm.com/br-pt/think/topics/vibe-coding

Este documento é um plano de trabalho, não uma afirmação de autoria ou validação executada.
