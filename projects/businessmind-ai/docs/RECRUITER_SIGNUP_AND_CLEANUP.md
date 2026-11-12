# Acesso do recrutador e limpeza posterior — plano seguro

## Ambientes

- **Demo pública sem cadastro:** https://businessmind-ai-demo.guisoster060.workers.dev — somente dados fictícios locais, Hermes determinístico.
- **Staging com cadastro real:** https://businessmind-ai-staging.pages.dev — Supabase Auth, PostgreSQL e RLS; use somente dados fictícios. O formulário oferece **Criar uma conta**, nome, e-mail e senha. Após entrar, cada usuário cria seu próprio workspace.
- **Prévia para avaliação com Gemini limitado:** https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev — branch isolada, não é a versão final da produção. Usa `hermes-recruiter`, não a autorização única antiga. Limites persistentes: 3 chamadas/usuário/dia, mínimo 60 segundos entre chamadas, máximo global de 20/dia; após o limite, retorna análise determinística. **Não compartilhar o link como testado de ponta a ponta antes de validar um novo cadastro e uma resposta real nessa função.**

## Pré-requisitos para cadastro aberto

1. Verificar no dashboard do Supabase staging em **Authentication → Providers → Email** se cadastro por e-mail está habilitado e qual o estado de **Confirm email**.
2. Configurar envio de e-mails transacionais confiável (SMTP personalizado) e conferir limites de taxa; o serviço padrão pode não atender novos usuários.
3. Em **Authentication → URL Configuration**, configurar o Site URL do staging e adicionar **ambos** os endereços de staging e preview à lista de redirecionamento, somente se forem utilizados.
4. Fazer teste de cadastro com **uma conta fictícia nova e autorizada**, confirmar e-mail se necessário, login, criação de empresa, CRUD de movimentação, CSV e isolamento entre contas.
5. Não prometer que cadastro está operacional até o teste de e-mail e confirmação ter sucesso.

## Privacidade e segurança

- Não publicar senha da conta de demonstração no GitHub.
- Não compartilhar contas reais ou movimentações reais; recrutador deve criar conta própria com dados fictícios.
- Não reabrir a autorização única do Gemini; modo determinístico é suficiente para o teste público. Gemini foi validado uma vez na função anterior e está documentado separadamente. A nova função de recrutamento usa uma quota própria e não reabre a autorização antiga.
- Evitar abrir o staging indiscriminadamente antes de verificar cadastro, SMTP, limites de criação de contas e políticas RLS.

## Limpeza posterior (NÃO EXECUTADA)

No inventário de 12/11 havia **5 contas Auth, 5 empresas, 5 vínculos e 11 movimentações** no Supabase staging. Não foi removido nenhum registro.

1. Após a avaliação, listar **IDs e vínculos** e identificar precisamente a conta de demonstração a preservar; não decidir pelo e-mail aparente ou pela ordem dos registros.
2. Obter autorização explícita para excluir as **contas específicas** e os dados vinculados, após backup dos dados fictícios que se deseja preservar.
3. Confirmar impacto de FKs: `company_members.company_id` e `transactions.company_id` referenciam `companies` com `ON DELETE CASCADE`. Exclusão de Auth e exclusão de empresas são ações distintas e podem deixar dados órfãos sem roteiro correto.
4. Revogar sessões quando necessário, apagar registros com estratégia transacional e conferir contagens, integridade e isolamento.
5. Preservar a conta de demonstração somente se ela tiver senha exclusiva e dados fictícios. Não divulgar senha em documentos públicos.

**Não executar DELETE/TRUNCATE nem apagar usuários antes de a seleção ser aprovada.**
