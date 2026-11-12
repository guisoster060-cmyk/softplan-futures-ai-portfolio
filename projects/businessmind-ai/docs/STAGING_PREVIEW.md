# Preview isolado de staging

## Integração determinística preparada localmente (12/11/2026)

O build local desta branch inclui `hermesRemoteDeterministicEnabled: true` apenas em `preview/staging-config.js`, com `hermesGenerativeEnabled: false`. `app/config.js` de produção não foi alterado e não contém o novo controle ativo. O navegador só chama a Edge Function quando a configuração aponta exatamente a `ogypzmxnvjbomamkejkh.supabase.co`, há sessão, empresa associada e movimentações carregadas. O SDK Supabase da sessão envia o JWT; o navegador não o copia para logs ou para o payload. A função publicada deve continuar com `verify_jwt=true` e `STAGING_DETERMINISTIC_ONLY=true`. **Nada nesta branch foi publicado no staging.**

Depois de uma publicação **separadamente autorizada somente em `businessmind-ai-staging`**, usar contas e movimentações fictícias: entrar como proprietário, confirmar a empresa ativa, perguntar sobre lucro e observar uma invocação de `hermes` e `mode=deterministic`, sem inspecionar ou divulgar o cabeçalho Authorization nem o corpo financeiro. Repetir com usuário sem sessão e empresa de outra conta: esperar 401/403 e nenhuma resposta financeira. Testar erro de rede/timeout: o chat deve indicar fallback local e liberar o botão. Trocar de empresa durante uma espera não deve mostrar resposta da empresa anterior. Conferir que `hermes_test.one_shot` permanece não consumida e que não há chamada ao Gemini. Esses testes remotos **não foram executados** nesta branch.

Rollback proposto, mediante autorização de publicação: voltar ao pacote de staging anterior ou substituir o `config.js` do pacote por uma versão validada com `hermesRemoteDeterministicEnabled: false`; manter `hermesGenerativeEnabled: false` e a função determinística. Reexecutar o validador para a configuração escolhida antes de publicar. Não alterar a linha `one_shot`, secrets ou policies. O validador desta branch aceita somente o pacote de ensaio com o controle remoto `true`; um pacote de rollback exige o build/revisão da versão anterior ou ajuste explícito e testado do validador.

Estado em 10/11/2026: build e testes locais preparados; **nenhum preview novo foi publicado**. O arquivo `app/config.js` continua apontando ao projeto existente `cqiuryqnsdmsjchejclo` e não é alterado pelo build.

## Gerar e inspecionar localmente

Na pasta `projects/businessmind-ai/`:

```bash
npm run verify
npm run build:staging-preview
npm run validate:staging-preview
python3 -m http.server 8080 --directory dist-staging
```

O script copia `app/` para `dist-staging/` e troca **apenas na cópia** `config.js` por `preview/staging-config.js`. O próprio comando de build executa a validação **após** a cópia e sai com erro (removendo o diretório gerado) se ela falhar. `npm run validate:staging-preview` permite repetir a checagem isoladamente antes de qualquer publicação. A checagem exige a URL e a publishable key públicas **exatas** do projeto `ogypzmxnvjbomamkejkh`, Hermes generativo desativado e `index.html` presente; percorre todos os arquivos publicados para bloquear referências ao projeto de produção e padrões conhecidos de credenciais privadas. `dist-staging/` é ignorado pelo Git. Abrir a página local não substitui a validação remota do Auth.

## Plano histórico de publicação — requer revisão antes de reutilizar

O projeto isolado `businessmind-ai-staging` já existe e recebe pacotes por publicação manual autorizada. O plano abaixo foi escrito antes dessa criação; **não** criar outro projeto nem conectar GitHub por este documento. Para a integração desta branch, usar o pacote `dist-staging/` validado e solicitar autorização específica antes de qualquer publicação no projeto isolado.

Para não tocar no projeto Cloudflare Pages que hospeda a aplicação existente, configure **outro projeto Pages**, por exemplo `businessmind-ai-staging-preview`, conectado a este repositório e restrito à branch `codex/businessmind-hermes-gemini` após revisão/commit. Defina root directory `projects/businessmind-ai`, build command `npm run build:staging-preview` (que inclui a validação pós-build) e output directory `dist-staging` (relativo ao root). Não use `app` como saída nem altere a production branch/configuração do projeto Pages existente. Restrinja o acesso ao preview se houver dados de teste que não devam ser públicos.

No Supabase **staging** `ogypzmxnvjbomamkejkh`, a URL do preview precisa estar autorizada em Authentication → URL Configuration. Confira o **Site URL** usado pelos links de confirmação de cadastro e adicione a URL HTTPS exata do preview em **Redirect URLs** para recuperação de senha (`resetPasswordForEmail` usa a origem da página). Se forem usados endereços de preview por commit, autorize somente os endereços necessários ou uma regra de wildcard estritamente limitada ao domínio de preview; não inclua a URL de produção por conveniência. Alterações de Auth remoto não estão autorizadas nesta etapa.

Valide no navegador com contas e dados fictícios: cadastro/confirmação de e-mail quando configurada, login, recarga com sessão, criação de empresa por RPC, criação de outra empresa, alternância pelo seletor, CRUD em cada empresa, KPIs/gráfico/CSV correspondentes, logout e erros. Confirme na rede que as chamadas vão somente a `ogypzmxnvjbomamkejkh.supabase.co`. A suíte local usa mocks e não comprova esse fluxo remoto.

## Limites

A validação pós-build é uma barreira local baseada em configuração de formato conhecido e padrões de segredos; não substitui revisão humana nem detecta credenciais arbitrariamente codificadas/ofuscadas. Ela também não controla publicação manual que ignore o comando de build. A consulta de movimentações pagina em blocos de 500 com contagem exata e ordem por data e ID, até o limite de 5.000 do schema. Erro, página truncada, contagem alterada ou ID duplicado interrompem o carregamento sem renderizar totais parciais. Paginação HTTP não constitui snapshot transacional: alterações simultâneas que preservem a contagem ainda podem exigir uma nova leitura. Hermes generativo continua desativado; não implante função nem configure Gemini para publicar este preview.
