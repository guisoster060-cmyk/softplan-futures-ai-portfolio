# Gemini 4xx — correção segura (12/11/2026)

## Evidência
O ensaio real em 12/11/2026 às 19:46 UTC consumiu a autorização independente de staging e registrou `claim/accepted` seguido de `provider/provider_4xx`. O usuário recebeu fallback determinístico; **não** houve resposta generativa validada. O status HTTP exato e a mensagem do provedor não foram retidos. A segunda autorização **não pode ser reutilizada**.

## Hipótese mais provável, ainda não confirmada
O código usa `GEMINI_MODEL` do ambiente ou, quando ausente, `gemini-2.5-flash-lite`. Segundo a documentação oficial atual do Google, o acesso à família 2.5 está restrito a projetos com uso prévio, e projetos novos devem migrar para `gemini-3.5-flash-lite` ou `gemini-3.8-flash`. A documentação pública não comprova qual modelo o ambiente efetivamente usou; um erro 400/403/404 também pode ter outras causas.

## Correções
- Fallback padrão do código alterado para `gemini-3.5-flash-lite`; a variável `GEMINI_MODEL` **continua tendo prioridade**. Se estiver fixada no modelo antigo, deve ser alterada no painel do Supabase pelo proprietário, sem revelar o segredo.
- Diagnóstico agora registra apenas categoria + **código numérico HTTP** (por exemplo `provider_4xx_404`), sem corpo, pergunta, chave ou identificadores.
- Testes simulados incluem erro 404 e a URL padrão nova.
- `STAGING_DETERMINISTIC_ONLY=true` preservado no repositório. Não houve reset da autorização, merge ou novo ensaio com API externa.

## Critério de conclusão
Para declarar Gemini funcional, validar a disponibilidade do modelo para a credencial do projeto, rever preço/cotas, garantir permissão explícita para uma **nova** chamada de teste e obter `mode=generative` no ambiente autorizado. Até lá, exibir apenas Hermes determinístico no portfólio.
