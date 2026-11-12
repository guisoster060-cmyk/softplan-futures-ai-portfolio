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

## Revisão local de preparação (12/11/2026)

- A função usa a chave pública e encaminha o JWT recebido ao cliente Supabase; `auth.getUser` valida a identidade no servidor. A associação a `company_members` é consultada antes de `transactions`, ambas sob o JWT do usuário. O `companyId` do navegador não é aceito como autorização. A migration de staging limita movimentações ao proprietário; a RPC de uso único também exige proprietário. Esta revisão passou a exigir `role='owner'` antes da leitura financeira. Validar essa regra com contas fictícias no staging antes de habilitar IA.
- `STAGING_DETERMINISTIC_ONLY=true` retorna após a classificação e os cálculos, antes de ler os gates generativos, reivindicar a RPC ou chamar o provedor. `app/config.js` e `preview/staging-config.js` mantêm `hermesGenerativeEnabled=false`. O frontend usa resposta local nesse estado. Nenhum ajuste de ativação foi feito nesta revisão.
- A consulta financeira verifica contagem exata por página, IDs únicos e limite de 5.000 linhas; a agregação usa centavos inteiros. Paginação entre requisições não fornece snapshot transacional quando houver escritas concorrentes. Erros detectados impedem resposta com totais parciais.
- O payload preparado para o provedor usa intenção derivada, totais e meses agregados; não inclui pergunta livre, descrições, nomes de categorias, e-mails ou UUIDs. Agregados de uma empresa pequena ainda podem ser sensíveis. A resposta generativa não deve ser tratada como cálculo confiável.
- Limites: corpo de 2.048 bytes, pergunta de 500 caracteres, 20 s por requisição, 12 s no provedor, resposta de 16 KiB/4.000 caracteres e 10 requisições por usuário/minuto **por instância**. Esse último controle não limita globalmente custo ou abuso; a trava persistente de uso único é indispensável para o ensaio. CORS exige origem permitida para navegador, mas clientes sem `Origin` continuam sujeitos ao JWT e à autorização.
- Os mocks comprovam o bloqueio atual e o fallback determinístico. Com o bloqueio compilado como `true`, eles **não exercitam** o ramo que chama Gemini nem comprovam timeout/quota/fallback após uma chamada real. Antes de um ensaio, revisar uma alteração mínima e separada do servidor, testar o ramo desbloqueado isoladamente com mocks, e manter o frontend desativado. Confirmar modelo, elegibilidade ao nível gratuito e custo na documentação oficial na data do ensaio.

**Pendências para uma única tentativa segura:** confirmar por leitura o estado da função, de `verify_jwt`, da RPC e de `claimed_at`; verificar a origem fictícia de todos os registros da empresa; obter aprovação explícita para os agregados e um teto de custo; definir como o JWT do proprietário será fornecido sem exposição; testar isolamento real da Edge Function com outra empresa; registrar revogação imediata dos dois gates. Esta revisão não consultou o staging nem leu secrets.

## Preparação experimental isolada (12/11/2026)

O PR de preparação mantém `STAGING_DETERMINISTIC_ONLY=true` no handler publicado por padrão. O ramo desbloqueado é exercitado **somente por testes locais com mocks**, através de `createHermesHandler(false)`. Mesmo nesse ramo, a função exige `SUPABASE_URL` exatamente igual a `https://ogypzmxnvjbomamkejkh.supabase.co` antes de ler os gates ou chamar `claim_hermes_test_once`. A consulta de associação exige `role='owner'` antes de ler movimentações. Nenhum ajuste do frontend é necessário para uma chamada HTTP direta controlada; `hermesGenerativeEnabled=false` permanece.

### Modelo e limites oficiais consultados em 12/11/2026

- [Catálogo oficial de modelos](https://ai.google.dev/gemini-api/docs/models): `gemini-3.5-flash-lite` aparece como **Stable**, com esse identificador exato.
- [Tabela oficial de preços](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite): entrada e saída Standard aparecem como **Free of charge** no Free Tier; no nível pago, US$ 0,30 por milhão de tokens de entrada e US$ 2,50 por milhão de tokens de saída, incluindo thinking tokens. A tabela indica que dados do Free Tier podem ser usados para melhorar produtos do Google. Não enviar dados reais de clientes nesse nível.
- [Limites oficiais](https://ai.google.dev/gemini-api/docs/rate-limits): medidos por requisições/minuto, tokens/minuto e requisições/dia, **por projeto**; cotas efetivas variam e devem ser conferidas no [AI Studio](https://aistudio.google.com/rate-limit?timeRange=last-28-days) pela pessoa responsável antes da tentativa. Uma única reivindicação persistente limita este ensaio a uma tentativa de rede, independentemente da cota da conta; não garante que a chave tenha acesso ou que o projeto esteja sem faturamento.

### Ações humanas necessárias antes da única chamada

1. Aprovar expressamente o envio de **agregados exclusivamente fictícios** da empresa de teste, a versão exata do código, o modelo, os termos do Free Tier e um teto de custo de zero. Confirmar no painel Google AI Studio que a chave pertence a projeto no Free Tier, com cota disponível e faturamento não habilitado para o ensaio. Não compartilhar a chave com o agente ou em logs.
2. No painel do Supabase, confirmar a referência `ogypzmxnvjbomamkejkh`, `verify_jwt=true`, versão atual da função, policies RLS de proprietário e que a linha de `hermes_test.one_shot` da empresa `53ec445f-610a-4d80-a6d7-da4acd9c14e1` ainda tem `claimed_at IS NULL`. Confirmar que **todos** os lançamentos e seus agregados são fictícios e pertencem a ela. Essa verificação não foi feita neste PR.
3. Revisar e autorizar um **commit e deploy separados**, exclusivamente da função no staging, que altere `STAGING_DETERMINISTIC_ONLY` para `false`. Conferir que o guard da URL exata, a verificação do proprietário e a RPC atômica permanecem. Não alterar `app/config.js`, Cloudflare ou produção. A aprovação deste PR, sozinha, não ativa o Gemini.
4. Reconfirmar os testes remotos sem ativar os gates: JWT ausente/inválido, proprietário, usuário de outra empresa e membro não proprietário. Usar contas fictícias e canal seguro para o JWT, sem mostrá-lo em chat ou logs. Isso testa RLS da Edge Function; os mocks locais não substituem essa etapa.
5. Após aprovação específica para a tentativa, ativar temporariamente **ambos** `HERMES_DATA_SHARING_APPROVED=true` e `HERMES_APPROVED_COMPANY_IDS` contendo somente a empresa fictícia; manter a chave apenas nos Custom secrets do staging. Enviar **uma** pergunta empresarial genérica com JWT do proprietário diretamente à função. Registrar apenas horário, versão, status HTTP e `mode`, sem imprimir a resposta financeira, JWT, pergunta ou chave. Não repetir mesmo se ocorrer timeout ou erro.
6. Imediatamente definir `HERMES_DATA_SHARING_APPROVED=false` e retirar a empresa da allowlist. Confirmar por leitura que a linha foi consumida e que uma nova requisição retorna modo determinístico. Fazer rollback do código para `STAGING_DETERMINISTIC_ONLY=true` somente em operação autorizada; **não** limpar nem rearmar `claimed_at`.

**Bloqueios que interrompem o ensaio:** dado ou consentimento não comprovado; projeto/versão incorretos; `claimed_at` já preenchido; ausência de cota gratuita confirmada; qualquer erro de autorização/RLS; alteração de build que habilite o frontend; divergência no diff do deploy. Não executar a chamada para “descobrir” qual pré-condição falhou.
