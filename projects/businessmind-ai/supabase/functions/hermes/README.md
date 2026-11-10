# Hermes — Supabase Edge Function

Esta função consulta movimentações usando o JWT do próprio usuário, portanto as políticas RLS continuam sendo a autoridade de acesso. Somente agregados financeiros são enviados ao provedor de IA.

## Segredos de servidor

- `HERMES_API_URL`: endpoint compatível com Chat Completions.
- `HERMES_API_KEY`: chave privada do provedor.
- `HERMES_MODEL`: modelo aprovado.
- `ALLOWED_ORIGIN`: origem publicada do frontend.

`SUPABASE_URL` e `SUPABASE_ANON_KEY` são fornecidos pelo ambiente da Edge Function. Nenhuma chave privada pertence ao frontend ou ao Git.

O código não foi implantado no projeto remoto. Quando as variáveis do provedor não estão configuradas, a função retorna apenas os agregados determinísticos, sem inventar uma resposta generativa.
