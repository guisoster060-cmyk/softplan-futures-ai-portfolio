# Hermes/Gemini — diagnóstico de staging (12/11/2026)

## Evidência remota (somente leitura)
- Supabase staging: `ogypzmxnvjbomamkejkh`; Edge Function `hermes` ativa, versão 23.
- A versão implantada define `STAGING_DETERMINISTIC_ONLY = true` e exporta `handleRequest = createHermesHandler(STAGING_DETERMINISTIC_ONLY)`. Assim, requisições normais retornam `mode: deterministic` antes de consultar o provedor.
- Logs de 12/11 às 20:05 UTC registram `claim: accepted` e `provider: accepted` em uma validação controlada anterior; isto comprova aceitação do provedor, **não** comprova a exibição no navegador.
- Logs de 20:54 UTC registram POST /hermes com HTTP 200, compatível com a consulta exibida no celular; HTTP 200 não identifica sozinho o modo da resposta.
- A autorização persistente de uso único (`claim_hermes_test_third_once`) já foi consumida; não a reinicializar nem substituí-la sem nova autorização explícita.

## Próximas verificações, em ordem
1. Preservar a produção e a demo; trabalhar apenas nesta branch e no Supabase/Cloudflare staging.
2. Sincronizar o código-fonte da versão 23 publicada com a branch de desenvolvimento antes de qualquer deploy. O arquivo `index.ts` da branch ainda contém a versão anterior, incluindo `claim_hermes_test_once`, enquanto o remoto utiliza `claim_hermes_test_third_once`. **Não implantar o arquivo antigo por engano.**
3. Validar localmente com mocks os caminhos `generative`, `deterministic`, timeout, resposta rejeitada, CORS, RLS e autorização consumida.
4. Para teste real futuro, obter autorização explícita para uma nova tentativa limitada; implementar um novo controle atômico, sem rearmar o claim anterior, e só então habilitar o ramo generativo no staging.
5. Verificar a resposta real no navegador e nos logs com marcadores fixos, sem registrar prompts, dados financeiros ou tokens.

## Estado
CI da branch `fix/hermes-safe-diagnostics-20261112` aprovado na execução 43305957583. Nenhuma nova chamada ao Gemini nem publicação realizada nesta auditoria.
