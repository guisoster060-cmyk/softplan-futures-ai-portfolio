# Plano de validação futura do Gemini — não executar nesta entrega

Este documento é uma **especificação técnica derivada**, não um prompt literal nem uma aprovação para ativar IA externa. Em 11/11/2026, Hermes v11 no staging permanece determinístico: `STAGING_DETERMINISTIC_ONLY=true` retorna antes da RPC de uso único e do fetch ao Gemini. O frontend mantém `hermesGenerativeEnabled=false`. Nenhuma chave privada deve ir ao navegador.

## Pré-condições e decisão humana

1. Responsável aprova por escrito a finalidade, os dados a compartilhar, o provedor, os termos de tratamento e o teto de custo. Dados financeiros reais de clientes não entram no teste.
2. Conferir no momento da execução a disponibilidade do modelo, Free Tier, limites e preços nas fontes oficiais do Google; não presumir que a configuração atual seja gratuita ou esteja disponível.
3. Usar somente Supabase staging, uma empresa fictícia identificada e agregados fictícios verificados. Confirmar JWT do proprietário, associação sob RLS e isolamento de outra empresa. Não publicar senhas, tokens ou respostas financeiras.
4. Estabelecer consentimento explícito e revogável por empresa. A allowlist manual e o gate global são controles técnicos, mas não constituem sozinhos um registro auditável de consentimento.
5. Revisar o diff do servidor, a trava atômica de uso único e o estado da autorização antes de qualquer deploy ou desbloqueio. Nenhum merge de código deve habilitar o modo generativo por si só.

## Ensaio controlado, somente após autorização específica

- Validar localmente JWT ausente/inválido, empresa alheia, RLS, escopo da pergunta, paginação incompleta, ausência de consentimento, concorrência, erro, quota, timeout e fallback. Distinguir mocks de testes transacionais PostgreSQL e remotos.
- Confirmar que a trava persistente consome **uma tentativa antes** da chamada ao provedor, inclusive se ocorrer erro ou timeout; impedir segunda tentativa ou rearmamento por usuário comum.
- Inspecionar o payload para excluir perguntas livres, descrições de transações, categorias identificáveis, e-mails e IDs pessoais. Usar apenas intenção derivada e agregados necessários.
- Limitar a uma tentativa autorizada, com janela e teto de gasto aprovados. Verificar CORS, tempo máximo, tamanho de entrada/saída e logs sanitizados. Não tratar sucesso HTTP como prova de precisão da recomendação.
- Registrar somente ambiente, versão, data, status, modo e resultado sanitizado. Revisar a resposta humana e comparar todo número com cálculos determinísticos.

## Interrupção e rollback

Se qualquer pré-condição ou verificação falhar, manter o frontend e o servidor bloqueados. Após o ensaio, revogar imediatamente os gates de compartilhamento/allowlist, confirmar que o frontend continua desativado e verificar que a autorização de uso único não pode ser reutilizada. Não restaurar uma autorização consumida como forma de rollback. Se houver publicação acidental, suspender o caminho generativo e revisar logs sem copiar dados sensíveis.

Este plano não configura secrets, não aplica migrations, não publica função e não realiza chamadas à API.

## Diagnóstico do chat no staging — Missão 03 (12/11/2026)

O arquivo público `app.js` no staging tem SHA-256 `994788be3feb16950e6b19e6175483bec3da4dcfda545ba24ce2108c6926b450`, idêntico ao `app/app.js` de `new-branch` e dos PRs #21 e #22. `index.html` também coincide (`d5cf9dcb6cbd5fa76e34038f8c8cf033d99e998b2e20460d070312f336377a12`). O `config.js` público coincide com `preview/staging-config.js` (`b245d88923f88a78c628210772c7e21dd7d96c58a1f3a89ccd59c4aac11df5ae`), que fixa `hermesGenerativeEnabled: false`. A comparação foi somente de leitura por HTTPS; os hashes não identificam, por si sós, o ID de um deployment Cloudflare.

Em `app/app.js`, `ask(q)` chama `answer(q)` diretamente quando esse flag é falso, antes de `supabase.functions.invoke('hermes')`. `answer(q)` usa as movimentações já carregadas da empresa ativa e responde por regras locais. Portanto a resposta de lucro observada é **compatível** com zero invocações da Edge Function; os logs remotos informados pelo responsável não foram consultados nesta missão. Os PRs #21 e #22 alteram testes, documentação e, no #22, código da Edge Function; **não** alteram o frontend publicado nem o flag.

### Correção mínima proposta para uma etapa posterior autorizada

1. Adicionar ao config público um controle **separado** `hermesRemoteDeterministicEnabled`, inicialmente `false`, sem alterar `hermesGenerativeEnabled`. Preparar `preview/staging-config.js` com esse novo controle para staging somente após autorização; manter `app/config.js` de produção desativado. Atualizar a validação estrita de `scripts/validate-staging-preview.mjs` para aceitar somente as propriedades e valores esperados, e bloquear modo generativo.
2. Em `ask(q)`, quando o controle remoto estiver ativo e houver sessão/empresa selecionada, chamar `supabase.functions.invoke('hermes', { body: { question, companyId } })` pelo cliente Supabase da sessão. Não copiar JWT para variáveis globais, logs ou URL. A Edge Function deve manter `verify_jwt=true`, validar `auth.getUser`, associação/papel e consultar movimentações com o JWT do usuário sob RLS. O `companyId` enviado é apenas uma solicitação, não uma autorização.
3. Exibir a resposta determinística da função de forma clara, mantendo `answer(q)` como fallback em erro de rede, 401/403, timeout ou indisponibilidade. Não interpretar um 403 como prova de dados vazios. Bloquear envio duplo durante a espera e comunicar o fallback ao usuário.
4. Acrescentar testes locais do fluxo de sessão, empresa ativa, retorno determinístico, 401/403, erro de rede e timeout; em seguida validar remotamente **somente no staging**, com contas fictícias e autorização específica. A regra `STAGING_DETERMINISTIC_ONLY=true` deve continuar ativa no servidor. Não ativar Gemini nem alterar a autorização `one_shot`.

O teste Node `tests/hermes-frontend-flow.test.js` exercita a função `ask` real em um contexto isolado: confirma zero invocações no config atual e simula sucesso, erro de autorização e falha de comunicação no caminho hipotético. Ele **não** emite JWT nem comprova RLS ou HTTP remoto. A validação remota exigirá deploy autorizado do frontend de staging e conta fictícia controlada, mantendo a função determinística; verificar invocação/HTTP/status sem publicar token, pergunta ou resposta financeira. Nenhum desses passos remotos foi executado nesta missão.
