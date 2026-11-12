# Diagnóstico Gemini — 12/11/2026 (sem chamadas externas)

## Evidência observada
- O deploy Supabase staging `hermes` v17 tem `STAGING_DETERMINISTIC_ONLY=false`, enquanto a revisão protegida do GitHub tem `true`. A branch de diagnóstico mantém `true` e não foi implantada.
- Logs existentes em 12/11/2026 16:18:51–16:18:52 UTC mostram consulta Auth, associação, transações, RPC `claim_hermes_test_once` e HTTP 200 da Edge Function.
- O HTTP 200 da RPC não prova que seu corpo era `true`; o registro de `claimed_at` observado no relatório de entrega indica que a tentativa foi consumida. Não há prova de chamada bem-sucedida ao Gemini.
- A Edge Function atual converte quota, erro de autenticação do provedor, timeout, erro de parse, resposta sem texto e texto rejeitado em fallback determinístico HTTP 200. Isso torna a causa indistinguível nos logs anteriores.
- `verify_jwt=false` no deployment precisa ser revisado; o código faz `auth.getUser` e verifica papel owner e RLS, mas isso não substitui uma decisão explícita de configuração do gateway.

## Mudança proposta
A função registra exclusivamente eventos fixos `hermes_gemini_diagnostic` com `stage` e `result`, sem pergunta, dados financeiros, IDs, chave, tokens, texto do modelo ou resposta bruta. Exemplos: `claim/accepted`, `claim/not_authorized`, `provider/quota`, `provider/provider_auth`, `provider/provider_5xx`, `provider/timeout`, `validation/max_tokens`, `validation/empty_or_rejected`, `provider/accepted`.

Os testes locais com `dependencies.fetch` fictício verificam classificação e ausência de dados sensíveis. A mudança **não corrige retrospectivamente** a tentativa consumida: logs novos só existem depois de eventual deploy e teste especificamente autorizados.

## Próximos passos, sem afetar a entrega
1. Validar CI Node/Deno nesta branch, revisar o diff e o mecanismo de build/deploy automático.
2. Revisar `verify_jwt`, segredos e gates no Supabase sem revelar valores.
3. Manter staging protegido e produção determinística; não rearmar `claim_hermes_test_once` nem enviar nova chamada real.
4. Se houver aprovação futura para novo ensaio, definir nova autorização única, teto de gasto, consentimento e dados fictícios; após o teste, desligar os gates e examinar apenas os eventos sanitizados.
5. Considerar evolução do produto para retornar um código de fallback não sensível ao frontend e disponibilizar telemetria por execução sem identificadores pessoais, após revisão de privacidade.

**Conclusão:** a infraestrutura e o fluxo local com mock podem ser preparados, mas a causa exata do ensaio anterior é indeterminável com a telemetria histórica disponível. Não anunciar Gemini como funcional até receber uma resposta `mode=generative` validada em teste autorizado.
