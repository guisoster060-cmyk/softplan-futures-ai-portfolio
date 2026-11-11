# Validação real em projeto Supabase isolado

Estado em 10/11/2026: migration inicial aplicada **somente** no staging `ogypzmxnvjbomamkejkh`; três usuários e três perfis existem, com e-mail confirmado. Testes HTTP com JWT e dados ainda não executados. Este roteiro não autoriza alterações no projeto publicado `cqiuryqnsdmsjchejclo`.

### Evidência estrutural do staging

A migration versionada `0001_initial_schema.sql` (SHA-256 `f61220649b214599f3d091d6f29d4416936aa8e980d79acf3426d1a071e7ff71`) foi aplicada pela integração Supabase como `businessmind_initial_schema`, versão remota `20261110124952`. Antes da aplicação havia zero tabelas públicas e zero migrations. Depois, as quatro tabelas esperadas existem com zero linhas; RLS está habilitado em todas. Há seis funções públicas, dez policies, 17 constraints e três triggers de aplicação (incluindo `on_auth_user_created` em `auth.users`). Nenhuma conta, empresa ou movimentação foi criada.

## Preparação humana — possível pelo celular

1. No navegador do celular, abra o painel Supabase e crie um **novo projeto** dedicado a testes. Anote somente o *project ref* e a URL pública; não envie senha ou chave privada por conversa.
2. Em **Authentication → Providers**, confirme que Email está habilitado. As três contas fictícias já foram confirmadas pelo responsável; o script não testa entrega de e-mail.
3. A migration já foi aplicada no staging `ogypzmxnvjbomamkejkh`; **não a execute novamente**. Confira as quatro tabelas, a RPC `create_company`, os triggers e as policies RLS. Não cole o SQL no projeto publicado.
4. Em **Project Settings → API**, copie a URL e a **publishable key** do projeto de teste. Não use `service_role` ou secret key.
5. As três contas já foram criadas e confirmadas pelo responsável. Guarde as senhas fora do Git. O script usa login por senha; não cria contas automaticamente.
6. O teste `supabase/tests/isolation_test.sql` já foi executado no staging em 10/11/2026: 34 OK, 0 falhas; rollback e trigger ativo confirmados. Não é necessário repeti-lo sem nova finalidade.

No celular, o caminho mais simples para a verificação SQL é abrir o repositório em outra aba, copiar o arquivo `isolation_test.sql` e executá-lo no SQL Editor do **projeto de teste**. O E2E de Auth/CRUD usa o script Node em um computador ou CI isolada; o painel móvel sozinho não reproduz chamadas autenticadas de duas contas com a mesma evidência. Para uma verificação manual móvel, abra a aplicação apontada ao projeto de teste em duas sessões privadas separadas, registre dados fictícios e confirme que não aparecem entre contas. Isso é complementar, não substitui o script.

## Execução automatizada futura

Requisitos: Node.js 20+, URL e publishable key do staging, três contas fictícias confirmadas. Configure variáveis de ambiente **fora do repositório**:

```text
BM_TEST_SUPABASE_URL=https://<ref-de-teste>.supabase.co
BM_TEST_PROJECT_REF=<ref-de-teste>
BM_TEST_CONFIRM=TEST_ONLY:<ref-de-teste>
BM_TEST_PUBLISHABLE_KEY=<publishable-key-de-teste>
BM_TEST_EMAIL_A=<email-ficticio-a>
BM_TEST_PASSWORD_A=<senha-a>
BM_TEST_EMAIL_B=<email-ficticio-b>
BM_TEST_PASSWORD_B=<senha-b>
BM_TEST_EMAIL_C=<email-ficticio-c>
BM_TEST_PASSWORD_C=<senha-c>
```

Execute `node scripts/verify-supabase-test.mjs` na pasta `projects/businessmind-ai/` somente após autorização para alterar dados de teste. O script recusa a referência de produção, URLs que não sejam a raiz HTTPS `*.supabase.co`, chave que não seja publishable, referência divergente e ausência de confirmação. Nenhuma requisição é feita antes desses controles. Não adicione essas variáveis a `.env` rastreado ou ao PR.

### Workflow manual do GitHub Actions

O arquivo [businessmind-staging-http.yml](../../../.github/workflows/businessmind-staging-http.yml) foi preparado **sem execução**. Ele possui somente `workflow_dispatch`, aceita apenas a branch `codex/businessmind-hermes-gemini` e exige a confirmação literal `TEST_ONLY:ogypzmxnvjbomamkejkh`. O checkout executa o commit auditado `61837d49150abea0f873558c14addfb82c5cba8d`, com persistência de credenciais Git desativada; alterações posteriores na branch não mudam os scripts executados. Para atualizar o código de teste, revise um novo commit e atualize o SHA nos workflows dos PRs #4 e #5 em commits revisados. URL e ref são fixas; o guard do script bloqueia qualquer outro projeto antes da primeira requisição ao Supabase. O token do GitHub tem apenas `contents: read`. A execução cria empresas, se ainda ausentes, e movimentações fictícias; remove as movimentações que criou ao final, mas conserva empresas e contas.

No celular, quando o workflow estiver disponível na aba **Actions**: abra o repositório no navegador (ative “site para computador” se necessário), acesse **Settings → Secrets and variables → Actions**, configure `BM_TEST_EMAIL_A/B/C` e `BM_TEST_PASSWORD_A/B/C` como **Repository secrets** e a publishable key do staging como **Repository variable** `BM_TEST_PUBLISHABLE_KEY`. Não use `service_role`, secret key ou credenciais de produção. Em **Actions → BusinessMind staging HTTP (manual) → Run workflow**, escolha a branch `codex/businessmind-hermes-gemini`, digite a confirmação literal e execute somente após autorização para gerar dados fictícios. O formulário e os logs não devem conter senhas ou JWTs; não ative debug de runner nem acrescente `env`, `set -x` ou logs de requisição. Os logs apresentam apenas rótulos `OK`/`FALHOU`; qualquer falha impede aprovação. Confira posteriormente se não restaram movimentações de teste.

**Limitação de disponibilização:** segundo a [documentação oficial do GitHub](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), um workflow com `workflow_dispatch` precisa existir na **branch padrão** para aparecer e poder ser disparado; depois é possível escolher outra branch na interface. A branch padrão deste repositório é `main`. Portanto, o workflow publicado apenas na branch do PR #4 **não pode ser acionado pela aba Actions agora**, mesmo com os secrets configurados. Não altere a branch padrão nem faça merge apenas para contornar isso. A disponibilização correta exige revisão e incorporação autorizada do arquivo de workflow na branch padrão; o job continua travado para executar somente a branch v1.0 indicada. Até lá, execução local em computador isolado é alternativa, com segredos fornecidos por gerenciador local.

## Critérios de aprovação

| Fluxo | Resultado esperado |
| --- | --- |
| Auth | Três contas confirmadas autenticam com JWTs e IDs distintos. |
| Onboarding | Cada conta obtém empresa própria via `create_company` ou associação existente. |
| CRUD | Cada conta cria, lê, edita e exclui movimentação fictícia. |
| Persistência | Releitura por nova requisição retorna o registro criado. |
| RLS | Leitura, edição e exclusão cruzadas retornam zero linhas; inserção cruzada é rejeitada. |
| Terceira conta | Sem associação inicial; não enxerga membros ou movimentações nem altera, exclui ou insere nas empresas A/B. |
| Limpeza | Movimentações criadas pelo script são removidas; contas e empresas ficam para revisão/limpeza humana. |

Falha de qualquer critério impede declarar aprovação. Registre data, ref do projeto de teste, commit, comandos e saída sem senhas/JWTs. A migration e os 34 testes SQL de isolamento já foram executados no staging; os testes HTTP continuam pendentes.

## Limpeza segura

O script remove apenas as movimentações que criou, identificadas pelos IDs retornados. Confira no painel se restou alguma linha com descrição `bm-e2e-...`; elimine-a apenas no projeto de teste. Para remover contas e empresas, confirme o ref no painel, registre os IDs exatos e faça a exclusão manual no projeto de teste após guardar a evidência. Não use exclusão em massa ou comandos com alvo amplo.
