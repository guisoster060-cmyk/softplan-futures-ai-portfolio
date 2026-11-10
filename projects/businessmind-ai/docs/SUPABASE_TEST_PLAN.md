# Validação real em projeto Supabase isolado

Estado: **preparado, não executado**. Este roteiro não autoriza alterações no projeto publicado `cqiuryqnsdmsjchejclo`.

## Preparação humana — possível pelo celular

1. No navegador do celular, abra o painel Supabase e crie um **novo projeto** dedicado a testes. Anote somente o *project ref* e a URL pública; não envie senha ou chave privada por conversa.
2. Em **Authentication → Providers**, habilite Email. Para execução pelo script, confirme manualmente duas contas fictícias distintas, ou configure confirmação por e-mail com caixas controladas para teste.
3. No novo projeto, abra **SQL Editor** e aplique uma única vez `supabase/migrations/0001_initial_schema.sql`. Confira as quatro tabelas, a RPC `create_company`, os triggers e as policies RLS. Não cole o SQL no projeto publicado.
4. Em **Project Settings → API**, copie a URL e a **publishable key** do projeto de teste. Não use `service_role` ou secret key.
5. Crie duas contas de teste com e-mails controlados, confirme-as e guarde as senhas fora do Git. O script usa login por senha; não cria contas automaticamente.
6. Opcionalmente, no SQL Editor do projeto de teste, execute `supabase/tests/isolation_test.sql`. O erro final é intencional e deve mostrar 34 OK, 0 falhas; se outro erro aparecer, registre o texto e interrompa. Esse teste faz rollback das linhas criadas por ele.

No celular, o caminho mais simples para a verificação SQL é abrir o repositório em outra aba, copiar o arquivo `isolation_test.sql` e executá-lo no SQL Editor do **projeto de teste**. O E2E de Auth/CRUD usa o script Node em um computador ou CI isolada; o painel móvel sozinho não reproduz chamadas autenticadas de duas contas com a mesma evidência. Para uma verificação manual móvel, abra a aplicação apontada ao projeto de teste em duas sessões privadas separadas, registre dados fictícios e confirme que não aparecem entre contas. Isso é complementar, não substitui o script.

## Execução automatizada futura

Requisitos: Node.js 20+, URL e publishable key do novo projeto, duas contas fictícias confirmadas. Configure variáveis de ambiente **fora do repositório**:

```text
BM_TEST_SUPABASE_URL=https://<ref-de-teste>.supabase.co
BM_TEST_PROJECT_REF=<ref-de-teste>
BM_TEST_CONFIRM=TEST_ONLY:<ref-de-teste>
BM_TEST_PUBLISHABLE_KEY=<publishable-key-de-teste>
BM_TEST_EMAIL_A=<email-ficticio-a>
BM_TEST_PASSWORD_A=<senha-a>
BM_TEST_EMAIL_B=<email-ficticio-b>
BM_TEST_PASSWORD_B=<senha-b>
```

Execute `node scripts/verify-supabase-test.mjs` na pasta `projects/businessmind-ai/`. O script recusa a referência de produção, URLs que não sejam a raiz HTTPS `*.supabase.co`, chave que não seja publishable, referência divergente e ausência de confirmação. Nenhuma requisição é feita antes desses controles. Não adicione essas variáveis a `.env` rastreado ou ao PR.

## Critérios de aprovação

| Fluxo | Resultado esperado |
| --- | --- |
| Auth | Duas contas confirmadas autenticam com JWTs e IDs distintos. |
| Onboarding | Cada conta obtém empresa própria via `create_company` ou associação existente. |
| CRUD | Cada conta cria, lê, edita e exclui movimentação fictícia. |
| Persistência | Releitura por nova requisição retorna o registro criado. |
| RLS | Leitura, edição e exclusão cruzadas retornam zero linhas; inserção cruzada é rejeitada. |
| Limpeza | Movimentações criadas pelo script são removidas; contas e empresas ficam para revisão/limpeza humana. |

Falha de qualquer critério impede declarar aprovação. Registre data, ref do projeto de teste, commit, comandos e saída sem senhas/JWTs. A migration e o teste SQL não foram executados nesta Etapa 4A.

## Limpeza segura

O script remove apenas as movimentações que criou, identificadas pelos IDs retornados. Confira no painel se restou alguma linha com descrição `bm-e2e-...`; elimine-a apenas no projeto de teste. Para remover contas e empresas, confirme o ref no painel, registre os IDs exatos e faça a exclusão manual no projeto de teste após guardar a evidência. Não use exclusão em massa ou comandos com alvo amplo.
