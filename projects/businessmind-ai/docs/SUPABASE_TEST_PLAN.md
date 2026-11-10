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

O ambiente Codex atual não possui secret binding configurado. O menor passo manual seguro é cadastrar os seis valores de e-mail/senha das três contas como **secrets de runtime do ambiente Codex** (não como texto do chat, arquivo do repositório ou secret de GitHub Actions), usando os nomes acima. URL, ref, confirmação e publishable key também podem ser configurados nesse painel. Depois de salvar, informe apenas que os secrets estão prontos; não envie seus valores. O agente deve conferir que os bindings estão `ready` antes de executar. Caso o painel não ofereça secrets de runtime, use um gerenciador de segredos local no seu computador e execute o script lá; não copie credenciais para a conversa.

## Critérios de aprovação

| Fluxo | Resultado esperado |
| --- | --- |
| Auth | Duas contas confirmadas autenticam com JWTs e IDs distintos. |
| Onboarding | Cada conta obtém empresa própria via `create_company` ou associação existente. |
| CRUD | Cada conta cria, lê, edita e exclui movimentação fictícia. |
| Persistência | Releitura por nova requisição retorna o registro criado. |
| RLS | Leitura, edição e exclusão cruzadas retornam zero linhas; inserção cruzada é rejeitada. |
| Terceira conta | Sem associação inicial; não enxerga membros ou movimentações nem altera, exclui ou insere nas empresas A/B. |
| Limpeza | Movimentações criadas pelo script são removidas; contas e empresas ficam para revisão/limpeza humana. |

Falha de qualquer critério impede declarar aprovação. Registre data, ref do projeto de teste, commit, comandos e saída sem senhas/JWTs. A migration e os 34 testes SQL de isolamento já foram executados no staging; os testes HTTP continuam pendentes.

## Limpeza segura

O script remove apenas as movimentações que criou, identificadas pelos IDs retornados. Confira no painel se restou alguma linha com descrição `bm-e2e-...`; elimine-a apenas no projeto de teste. Para remover contas e empresas, confirme o ref no painel, registre os IDs exatos e faça a exclusão manual no projeto de teste após guardar a evidência. Não use exclusão em massa ou comandos com alvo amplo.
