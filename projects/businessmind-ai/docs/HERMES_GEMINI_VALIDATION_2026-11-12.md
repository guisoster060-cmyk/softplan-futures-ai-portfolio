# Validação de ponta a ponta — Hermes + Gemini (12/11/2026)

## Resultado: aprovado em staging
- Função Supabase Edge `hermes` v25, projeto `ogypzmxnvjbomamkejkh`.
- 2026-11-12 21:41:43 UTC: preflight `OPTIONS /functions/v1/hermes` HTTP 204 (CORS liberado para o endereço exato de staging).
- 2026-11-12 21:41:44 UTC: log `hermes_gemini_diagnostic` com `stage=claim,result=accepted`.
- 2026-11-12 21:41:46 UTC: log `hermes_gemini_diagnostic` com `stage=provider,result=accepted` e `POST /functions/v1/hermes` HTTP 200.
- Tabela `hermes_test.fourth_one_shot`: `claimed_at IS NOT NULL` (autorização única consumida).
- Evidência de interface enviada pelo usuário: pergunta sobre melhorar o resultado financeiro, resposta financeira local separada de texto generativo do Hermes, com mensagem de status `Cálculo local e interpretação generativa exibidos separadamente.`.
- Valores da demonstração: receitas R$ 3.700,00; despesas R$ 1.430,00; lucro R$ 2.270,00; cinco movimentações.

## Limitações
- Este resultado confirma **uma** chamada controlada bem-sucedida no staging, não disponibilidade irrestrita do Gemini nem uso em produção.
- A autorização única não deve ser reiniciada nem substituída sem nova aprovação específica.
- A versão de produção não foi modificada durante o teste.
- Ainda é necessário resolver testes automatizados da branch relacionados a diferenças entre configuração de produção e staging, e tratar exibição de Markdown literal na resposta do Hermes.

## Segurança
- Não registrar senha, chave do Gemini, JWT, prompt com dados privados ou dados de usuários reais.
