# Preview isolado de staging

Estado em 10/11/2026: build e testes locais preparados; **nenhum preview novo foi publicado**. O arquivo `app/config.js` continua apontando ao projeto existente `cqiuryqnsdmsjchejclo` e não é alterado pelo build.

## Gerar e inspecionar localmente

Na pasta `projects/businessmind-ai/`:

```bash
npm run verify
npm run build:staging-preview
python3 -m http.server 8080 --directory dist-staging
```

O script copia `app/` para `dist-staging/` e troca **apenas na cópia** `config.js` por `preview/staging-config.js`. A cópia usa a URL e a publishable key públicas do projeto `ogypzmxnvjbomamkejkh`; Hermes generativo permanece desativado. `dist-staging/` é ignorado pelo Git. Abrir a página local não substitui a validação remota do Auth.

## Publicação futura — requer autorização separada

Para não tocar no projeto Cloudflare Pages que hospeda a aplicação existente, configure **outro projeto Pages**, por exemplo `businessmind-ai-staging-preview`, conectado a este repositório e restrito à branch `codex/businessmind-hermes-gemini` após revisão/commit. Defina root directory `projects/businessmind-ai`, build command `npm run build:staging-preview` e output directory `dist-staging` (relativo ao root). Não use `app` como saída nem altere a production branch/configuração do projeto Pages existente. Restrinja o acesso ao preview se houver dados de teste que não devam ser públicos.

No Supabase **staging** `ogypzmxnvjbomamkejkh`, a URL do preview precisa estar autorizada em Authentication → URL Configuration. Confira o **Site URL** usado pelos links de confirmação de cadastro e adicione a URL HTTPS exata do preview em **Redirect URLs** para recuperação de senha (`resetPasswordForEmail` usa a origem da página). Se forem usados endereços de preview por commit, autorize somente os endereços necessários ou uma regra de wildcard estritamente limitada ao domínio de preview; não inclua a URL de produção por conveniência. Alterações de Auth remoto não estão autorizadas nesta etapa.

Valide no navegador com contas e dados fictícios: cadastro/confirmação de e-mail quando configurada, login, recarga com sessão, criação de empresa por RPC, criação de outra empresa, alternância pelo seletor, CRUD em cada empresa, KPIs/gráfico/CSV correspondentes, logout e erros. Confirme na rede que as chamadas vão somente a `ogypzmxnvjbomamkejkh.supabase.co`. A suíte local usa mocks e não comprova esse fluxo remoto.

## Limites

A consulta de movimentações pagina em blocos de 500 com contagem exata e ordem por data e ID, até o limite de 5.000 do schema. Erro, página truncada, contagem alterada ou ID duplicado interrompem o carregamento sem renderizar totais parciais. Paginação HTTP não constitui snapshot transacional: alterações simultâneas que preservem a contagem ainda podem exigir uma nova leitura. Hermes generativo continua desativado; não implante função nem configure Gemini para publicar este preview.
