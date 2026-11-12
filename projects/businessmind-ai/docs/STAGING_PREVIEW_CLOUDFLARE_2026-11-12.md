# Prévia Cloudflare de staging

Em 12/11/2026 a configuração do projeto Pages estava com `preview_deployment_setting: none`, fazendo as implantações da branch ficarem em `queued/idle` e exibirem `Nothing is here yet`.

Foi ajustado o escopo de preview para `custom`, incluindo somente `fix/hermes-safe-diagnostics-20261112`, sem modificar a branch de produção.

A função Supabase Hermes v24 está publicada apenas em staging, com a quarta autorização de uso único ainda não consumida na última consulta.

Validar o estado da nova implantação Pages antes de enviar a pergunta ao Hermes. Não repetir a pergunta após consumir o claim.
