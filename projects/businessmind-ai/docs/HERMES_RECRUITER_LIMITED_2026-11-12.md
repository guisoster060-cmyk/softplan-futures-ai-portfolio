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
- **Validação real aprovada em 12/11/2026 às 22:09 UTC:** `OPTIONS /functions/v1/hermes-recruiter` HTTP 204, log `claim=accepted`, log `provider=accepted`, `POST /functions/v1/hermes-recruiter` HTTP 200. O usuário confirmou na interface o cálculo local separado da interpretação generativa.
- **Quota após o teste:** 1 consulta global consumida em 12/11/2026 (UTC). Não foram expostos identificadores de usuários.
- **Pendente:** validar cadastro e confirmação de e-mail de uma conta nova, conferir CI do commit final e revisar o acesso do recrutador em janela anônima.

## Evidência anterior
A consulta única anterior ao Gemini foi validada na função `hermes`, e está documentada em [HERMES_GEMINI_VALIDATION_2026-11-12.md](HERMES_GEMINI_VALIDATION_2026-11-12.md). Ela não é prova de que o novo endpoint já foi exercitado por um recrutador.

## Limpeza posterior
Não excluir usuários automaticamente. Após a avaliação, preservar a conta de demonstração definida pelo proprietário, obter autorização específica e executar a limpeza segura conforme [RECRUITER_SIGNUP_AND_CLEANUP.md](RECRUITER_SIGNUP_AND_CLEANUP.md).

## Ajuste para contas recém-criadas — 12/11/2026, 19h44 BRT

Um teste com conta nova exibiu **4 movimentações**, resposta determinística e indicação explícita de que o Gemini não foi utilizado. A função de recrutamento v1 exigia pelo menos **5 movimentações**, impedindo essa conta de usar a IA. O limite mínimo foi reduzido para **1 movimentação**, mantendo autenticação, RLS, controle de compartilhamento e quotas por usuário e global. A função `hermes-recruiter` **v2** foi publicada no staging com status `ACTIVE`. **Ainda é necessário repetir uma consulta com a conta nova para comprovar a resposta generativa**; a publicação isolada não é evidência de uso do provedor.

## Aceite do usuário novo e CI

- Captura Android de 19h45 BRT: conta nova, 4 movimentações, cálculo local separado da interpretação generativa.
- Logs de 22:45:11 UTC `claim=accepted` e 22:45:12 UTC `provider=accepted`; quota global de 2 consultas em 12/11/2026.
- CI: [GitHub Actions #43322922898](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/actions/runs/43322922898), conclusão `success`, commit `175520d`.
- O usuário confirmou que os dados da conta antiga não apareciam na conta nova. Isso é uma verificação funcional manual; não substitui uma auditoria independente de RLS.
- A captura de Gemini foi enviada na conversa pelo usuário; ainda não há imagem nova do staging publicada neste repositório.
