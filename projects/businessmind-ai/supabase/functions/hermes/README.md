# Hermes com Gemini — Supabase Edge Function

Esta função valida o JWT, confirma no servidor a associação entre usuário e empresa e consulta movimentações com a publishable key e o token do próprio usuário. As policies RLS continuam sendo a autoridade de acesso. Cálculos financeiros são feitos por código; somente agregados limitados podem ser enviados ao Gemini.

## Segredos de servidor

- `GEMINI_API_KEY`: chave privada criada no Google AI Studio.
- `GEMINI_MODEL`: modelo aprovado; padrão `gemini-3.5-flash-lite`.
- `HERMES_DATA_SHARING_APPROVED`: deve ser exatamente `true` após autorização explícita para enviar agregados.
- `ALLOWED_ORIGINS`: origens permitidas, separadas por vírgula.

`SUPABASE_URL` e `SUPABASE_ANON_KEY` são fornecidos pelo ambiente. Nenhuma chave privada pertence ao frontend ou ao Git. Não use `service_role`: a função precisa respeitar a RLS do usuário.

## Controles

- pergunta: até 500 caracteres;
- resposta: até 500 tokens e 4.000 caracteres;
- timeout do Gemini: 12 segundos;
- limite básico por instância: 10 requisições por usuário/minuto;
- consulta: até 5.000 movimentações, agregadas antes do provedor;
- CORS por allowlist, resposta `no-store` e ausência de logs financeiros.

O rate limit em memória reduz abuso casual, mas não é global entre instâncias. Um limite distribuído exigirá infraestrutura aprovada antes de produção.

A consulta solicita até 5.001 linhas e rejeita resultados que excedam 5.000: o assistente não apresenta totais parciais como totais da empresa. A proteção depende também do limite de 5.000 movimentações existente no schema; se a API truncar antes de 5.001 linhas, é necessária agregação/paginação controlada.

## Validação local

Na pasta desta função, com Deno 2.5.6:

```bash
deno check index.ts index_test.ts
deno test --allow-env index_test.ts
```

Os testes substituem cliente Supabase e requisição Gemini por mocks. Usam somente dados financeiros fictícios e não fazem chamadas remotas.

## Ativação controlada

O código não foi implantado e nenhum secret foi configurado. Antes de usar dados reais:

1. aprovar formalmente o tratamento de agregados pelo Gemini e os termos do tier escolhido;
2. configurar os secrets somente na Edge Function;
3. definir `HERMES_DATA_SHARING_APPROVED=true` e as origens autorizadas;
4. implantar e testar com dados fictícios/agregados;
5. somente depois, alterar `hermesGenerativeEnabled` no frontend.

Sem aprovação, chave ou disponibilidade do provedor, a função e a interface preservam o fallback determinístico.
