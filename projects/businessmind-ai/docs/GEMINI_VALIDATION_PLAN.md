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

- A função usa a chave pública e encaminha o JWT recebido ao cliente Supabase; `auth.getUser` valida a identidade no servidor. A associação a `company_members` é consultada antes de `transactions`, ambas sob o JWT do usuário. O `companyId` do navegador não é aceito como autorização. A migration de staging limita movimentações ao proprietário; a RPC de uso único também exige proprietário. A função testa associação, não papel: um membro sem acesso financeiro pode receber um resumo vazio. Validar esse comportamento com duas contas fictícias antes de habilitar IA.
- `STAGING_DETERMINISTIC_ONLY=true` retorna após a classificação e os cálculos, antes de ler os gates generativos, reivindicar a RPC ou chamar o provedor. `app/config.js` e `preview/staging-config.js` mantêm `hermesGenerativeEnabled=false`. O frontend usa resposta local nesse estado. Nenhum ajuste de ativação foi feito nesta revisão.
- A consulta financeira verifica contagem exata por página, IDs únicos e limite de 5.000 linhas; a agregação usa centavos inteiros. Paginação entre requisições não fornece snapshot transacional quando houver escritas concorrentes. Erros detectados impedem resposta com totais parciais.
- O payload preparado para o provedor usa intenção derivada, totais e meses agregados; não inclui pergunta livre, descrições, nomes de categorias, e-mails ou UUIDs. Agregados de uma empresa pequena ainda podem ser sensíveis. A resposta generativa não deve ser tratada como cálculo confiável.
- Limites: corpo de 2.048 bytes, pergunta de 500 caracteres, 20 s por requisição, 12 s no provedor, resposta de 16 KiB/4.000 caracteres e 10 requisições por usuário/minuto **por instância**. Esse último controle não limita globalmente custo ou abuso; a trava persistente de uso único é indispensável para o ensaio. CORS exige origem permitida para navegador, mas clientes sem `Origin` continuam sujeitos ao JWT e à autorização.
- Os mocks comprovam o bloqueio atual e o fallback determinístico. Com o bloqueio compilado como `true`, eles **não exercitam** o ramo que chama Gemini nem comprovam timeout/quota/fallback após uma chamada real. Antes de um ensaio, revisar uma alteração mínima e separada do servidor, testar o ramo desbloqueado isoladamente com mocks, e manter o frontend desativado. Confirmar modelo, elegibilidade ao nível gratuito e custo na documentação oficial na data do ensaio.

**Pendências para uma única tentativa segura:** confirmar por leitura o estado da função, de `verify_jwt`, da RPC e de `claimed_at`; verificar a origem fictícia de todos os registros da empresa; obter aprovação explícita para os agregados e um teto de custo; definir como o JWT do proprietário será fornecido sem exposição; testar isolamento real da Edge Function com outra empresa; registrar revogação imediata dos dois gates. Esta revisão não consultou o staging nem leu secrets.
