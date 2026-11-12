# Gemini limitado para avaliação do recrutador — 12/11/2026

## Escopo
- Ambiente: Supabase staging `ogypzmxnvjbomamkejkh` e prévia Cloudflare da branch `fix/hermes-safe-diagnostics-20261112`.
- Nova função Edge **`hermes-recruiter`**, v1, ativa, sem alterar `hermes` original.
- A função valida JWT com `auth.getUser`, vínculo de proprietário com a empresa, RLS para movimentações, limite de payload, pergunta de escopo empresarial e dados completos antes de consultar o provedor.
- Apenas dados **fictícios** devem ser usados pelo recrutador; o modelo externo recebe contexto financeiro agregado, não credenciais.
- A integração usa a configuração de compartilhamento `HERMES_DATA_SHARING_APPROVED` já existente; se ausente, o Gemini permanece desativado e há fallback determinístico.

## Limites e segurança
- RPC PostgreSQL `public.claim_hermes_recruiter_quota(uuid)` com `security definer`, `search_path=''`, autenticação via `auth.uid()`, verificação de empresa e lock transacional global.
- Máximo de **3 consultas por usuário por dia**, espaçamento mínimo **60 segundos** e máximo **20 consultas totais por dia** no projeto. Quotas consumidas antes de cada tentativa ao provedor, mesmo quando há falha.
- A RPC é executável apenas por `authenticated`; `anon` não tem acesso. As tabelas de quota ficam em schema privado e não são expostas.
- O modelo generativo permanece limitado ao projeto de staging e com resposta determinística de contingência.
- Limites locais adicionais na Edge Function são apenas complementares; quotas globais são persistidas no PostgreSQL.

## Verificações realizadas
- Migração aplicada com sucesso no staging.
- Chamada SQL com contexto não autenticado rejeitada, sem consumir quota; permissões `anon=false`, `authenticated=true`; tabelas de quota vazias na verificação inicial.
- Função Edge `hermes-recruiter` v1 publicada e ativa.
- Interface da branch configurada para invocar `hermes-recruiter` quando `hermesRecruiterEnabled=true`.
- **Pendente:** confirmar CI do commit final, cadastrar uma conta nova com e-mail, validar confirmação e login, e fazer uma única consulta real no novo endpoint com usuário autorizado. Não confundir com a validação anterior de `hermes` v25.

## Evidência anterior
A consulta única anterior ao Gemini foi validada na função `hermes`, e está documentada em [HERMES_GEMINI_VALIDATION_2026-11-12.md](HERMES_GEMINI_VALIDATION_2026-11-12.md). Ela não é prova de que o novo endpoint já foi exercitado por um recrutador.

## Limpeza posterior
Não excluir usuários automaticamente. Após a avaliação, preservar a conta de demonstração definida pelo proprietário, obter autorização específica e executar a limpeza segura conforme [RECRUITER_SIGNUP_AND_CLEANUP.md](RECRUITER_SIGNUP_AND_CLEANUP.md).
