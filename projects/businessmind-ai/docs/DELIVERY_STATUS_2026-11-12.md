# Entrega BusinessMind AI — estado verificado em 12/11/2026

## Escopo e apresentação ao recrutador

BusinessMind AI é um MVP de portfólio, não um SaaS comercial validado. O fluxo demonstrável inclui autenticação no Supabase, empresas e movimentações persistidas com controle de acesso, indicadores financeiros calculados a partir dos registros, exportação CSV e Hermes determinístico. As quatro telas são Visão geral, Indicadores, Inteligência e Configurações.

**Acesso recomendado para avaliação imediata:** [demonstração pública fictícia](https://businessmind-ai-demo.guisoster060.workers.dev), sem cadastro e sem chamadas a banco ou IA externa. Para avaliação técnica do backend, [staging](https://businessmind-ai-staging.pages.dev) com dados exclusivamente fictícios e conta autorizada. Não divulgar credenciais.

## Evidências desta data

- GitHub Actions: duas execuções `verify` aprovadas no commit `f3e0b9de3646eb548953e1954fd0d99fc8571167`; nova execução no commit `fa22db7a31c8ce58c4f2b85a2bc19e698bb79445` aprovada e pacote `businessmind-ai-staging-preview` gerado.
- Cloudflare Pages staging: implantação `705aa700-e9d3-4e5c-878a-63e5e36e8c4f` concluída com status `success` em 12/11/2026 16:13 UTC. **Isso comprova o deploy, não a compatibilidade completa entre navegadores.**
- Android Chrome: o responsável acessou a tela Inteligência e enviou uma pergunta à empresa fictícia. A interface exibiu resposta determinística baseada em cinco movimentações, alertando corretamente que um único mês não permite inferir tendência de três meses.
- Supabase staging: `POST /functions/v1/hermes` respondeu HTTP 200 às 16:18:52 UTC. A RPC `claim_hermes_test_once` respondeu HTTP 200; a linha da empresa fictícia `53ec445f-610a-4d80-a6d7-da4acd9c14e1` registra `claimed_at=2026-11-12 16:18:52 UTC`. A autorização de uso único **foi consumida**.
- **Não confirmado:** se o Google Gemini recebeu ou gerou texto. A captura não exibiu interpretação generativa; HTTP 200 da função não prova chamada ou resposta do provedor. Não declarar Gemini funcional ou validado.

## Limites e pendências

1. **Gemini:** integração experimental; não repetir o teste nem rearmar a trava sem autorização específica. Investigar por que a resposta generativa não apareceu, preferencialmente com inspeção de código, configuração e logs já existentes, sem novas chamadas pagas.
2. **Staging:** `preview/staging-config.js` contém `hermesGenerativeEnabled: true` exclusivamente para o ensaio. O `app/config.js` de produção permanece com `hermesGenerativeEnabled: false`. O backend staging possui trava de uso único já consumida. Antes de novos ensaios, rever consentimento, orçamento e desligamento seguro do modo generativo.
3. **Compatibilidade:** Android Chrome teve validação manual pontual. Windows e Safari/iOS ainda precisam de verificação manual; não declarar matriz cross-browser aprovada.
4. **Visual:** revisões de textos e CSS estão na branch/PR de recuperação; a verificação de todas as quatro telas em todos os tamanhos não está concluída.
5. **Segurança:** testes automatizados e verificações anteriores de RLS não substituem auditoria de segurança ou teste de produção.

## Entrega e rastreabilidade

- [README principal](../../../README.md) e [README do projeto](../README.md).
- [Roteiro de avaliação](REVIEW_GUIDE.md), [arquitetura](ARCHITECTURE.md), [testes](TESTING.md) e [plano Gemini](GEMINI_VALIDATION_PLAN.md).
- PR de revisão e preparação: https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/pull/26
- O staging é **ambiente de testes**, não publicação aprovada para dados reais. Nenhum merge ou deploy em produção é implicado por este documento.

## Critério de encerramento desta entrega

Apresentar a demo pública e o código verificado, com evidências e limitações explícitas. Deixar a ativação generativa do Gemini, validação iOS/Windows e refinamentos remanescentes como próximas versões, sem bloquear a candidatura.
