# Hermes com Gemini — Supabase Edge Function

Esta função valida o JWT, confirma no servidor a associação entre usuário e empresa e consulta movimentações com a publishable key e o token do próprio usuário. As policies RLS continuam sendo a autoridade de acesso. Cálculos financeiros são feitos por código; somente agregados limitados podem ser enviados ao Gemini.

## Segredos de servidor

- `GEMINI_API_KEY`: chave privada criada no Google AI Studio.
- `GEMINI_MODEL`: modelo aprovado; padrão `gemini-3.5-flash-lite`.
- `HERMES_DATA_SHARING_APPROVED`: deve ser exatamente `true` após autorização explícita para enviar agregados.
- `HERMES_APPROVED_COMPANY_IDS`: lista de UUIDs de empresas com aprovação documentada, separada por vírgulas; vazia/ausente bloqueia todas. Não é um fluxo de consentimento self-service.
- `ALLOWED_ORIGINS`: origens permitidas, separadas por vírgula.

`SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEYS` são fornecidos pelo ambiente; `SUPABASE_ANON_KEY` permanece como fallback legado. Nenhuma chave privada pertence ao frontend ou ao Git. Não use `service_role`: a função precisa respeitar a RLS do usuário. A implantação deve manter a verificação de JWT habilitada.

## Controles

Perguntas fora de gestão empresarial, indicadores e funcionalidades do BusinessMind AI recebem uma resposta padrão antes da leitura financeira e de qualquer chamada ao Gemini. A classificação combina tema e intenção; casos ambíguos sem contexto empresarial são recusados. Trata-se de uma barreira determinística conservadora, não de compreensão semântica perfeita. O frontend também aplica um filtro de experiência, mas a decisão de segurança permanece no servidor. A pergunta original continua fora do payload do provedor.

- corpo HTTP: até 2.048 bytes; pergunta: até 500 caracteres;
- resposta do provedor: até 16.384 bytes, 500 tokens e 4.000 caracteres exibidos;
- timeout do Gemini: 12 segundos;
- requisição: prazo total de 20 segundos (incluindo leitura financeira); provedor limitado adicionalmente a 12 segundos;
- limite básico por instância: 10 requisições por usuário/minuto;
- consulta: páginas de 500 com contagem exata, IDs únicos e no máximo 5.000 movimentações;
- Gemini somente após 5 movimentações e aprovação global **e** por empresa; URL do provedor não segue redirects;
- CORS por allowlist, resposta `no-store` e ausência de logs financeiros.

O rate limit em memória reduz abuso casual, mas não é global entre instâncias. Um limite distribuído exigirá infraestrutura aprovada antes de produção.

**Preparação experimental local (12/11/2026):** o handler público continua com `STAGING_DETERMINISTIC_ONLY=true`. `createHermesHandler(false)` permite testar o ramo generativo apenas com dependências fictícias em Deno. Mesmo nesse ramo, a função exige a URL exata do Supabase staging `ogypzmxnvjbomamkejkh` antes dos gates, da RPC e do provedor; apenas proprietários podem consultar as movimentações. Nenhuma alteração deste PR ativa o frontend ou a função publicada. A sequência humana e as fontes oficiais de modelo, preço e cotas estão em [GEMINI_VALIDATION_PLAN.md](../../../docs/GEMINI_VALIDATION_PLAN.md).

### Trava de uma tentativa — somente staging

`supabase/staging-migrations/20261111_hermes_one_shot.sql` é uma migration separada do fluxo padrão. O histórico do projeto registra sua aplicação somente no staging `ogypzmxnvjbomamkejkh`; o estado remoto não foi reconfirmado nesta revisão. Ela exige a empresa fictícia `53ec445f-610a-4d80-a6d7-da4acd9c14e1`, nome `Empresa teste` e exatamente cinco lançamentos. Cria tabela privada com RLS, sem privilégios diretos para usuários, e uma RPC de claim liberada apenas a usuários autenticados. A RPC confirma que o JWT pertence ao proprietário e faz `UPDATE ... WHERE claimed_at IS NULL`: o bloqueio de linha do PostgreSQL permite só um vencedor, inclusive entre instâncias. A Edge Function exige claim verdadeiro antes da chamada externa; erro, timeout ou conflito retornam fallback. Mesmo se o Gemini falhar, o claim permanece consumido. Chamada direta à RPC por proprietário pode consumir a tentativa sem acionar Gemini, mas não concede segunda tentativa. A tabela da trava não referencia por FK a empresa nem o usuário: isso evita bloquear exclusões que o esquema existente permite. O registro histórico não deve ser apagado nem rearmado.

**Ordem de um ensaio futuro:** (1) reconfirmar projeto, versão publicada, `verify_jwt`, gates e estado da autorização sem revelar segredos; (2) confirmar que todos os registros da empresa são fictícios; (3) revisar e autorizar uma versão de código que remova o bloqueio determinístico somente no staging; (4) validar o modelo e o Free Tier nas fontes oficiais; (5) habilitar os dois gates apenas para a empresa autorizada; (6) executar no máximo uma tentativa com JWT do proprietário e registrar apenas status/mode; (7) desativar imediatamente os dois controles de autorização; (8) confirmar fallback e que o registro continua consumido. Não rearmar a tabela nem repetir após erro. A chave Gemini sozinha não habilita a chamada. O frontend segue desativado.

Os testes Deno simulam concorrência e cenários de falha do provedor, mas a trava determinística impede que esse ramo seja alcançado; não comprovam fallback após uma chamada generativa. Em 11/11/2026 a migration foi aplicada **também em PostgreSQL 17 local descartável**, com fixture `tests/hermes-one-shot-local.sql`: duas transações simultâneas retornaram exatamente um `true` e um `false`; membro, não associado e UUID diverso retornaram `false`; `anon` e escrita direta foram negados; repetição após commit retornou `false`. Uma execução com apenas quatro lançamentos abortou toda a migration. Isso comprova a atomicidade local, não o comportamento remoto do staging. Não há papel `manager` no schema atual; o papel não proprietário existente é `member`.

Teste de concorrência reproduzível a partir de `projects/businessmind-ai`: `docker pull postgres:17-alpine` (uma vez), depois `node tests/hermes-one-shot-postgres.mjs`. O script cria um contêiner sem rede, aplica a fixture e a migration nele, disputa a RPC em duas sessões e remove somente esse contêiner ao final. Não usa credenciais nem serviços remotos do Supabase.

Para uma eventual recriação autorizada do staging, conferir a referência **exata** `ogypzmxnvjbomamkejkh` antes de qualquer operação e seguir a revisão específica da migration. No staging existente, **não reaplicar** o SQL: verificar a tabela `hermes_test.one_shot`, RLS, privilégios da RPC, estado de `claimed_at` e versão da função por consulta de leitura autorizada. O histórico registra Hermes v11 publicado com `verify_jwt=true`; esta revisão não fez deploy nem validação remota.

Rollback seguro após qualquer claim: desligar ambos os gates, manter a função ou substituí-la por fallback determinístico e **manter a linha consumida**. Não executar `DELETE`, `TRUNCATE`, `UPDATE claimed_at = NULL`, recriar a tabela ou reaplicar uma migration que reinsira autorização. Se o claim ainda não ocorreu, desligar os gates e preservar a linha igualmente até decisão explícita. O operador privilegiado de banco pode tecnicamente rearmar o registro; esta proteção é contra usuários comuns e concorrência, não contra administração deliberada.

A consulta pagina sob o JWT do usuário, confere a contagem exata em cada página e rejeita páginas truncadas, IDs repetidos, mudança de contagem, linhas inválidas e excesso de 5.000 registros. Os totais são somados em centavos inteiros. Paginação HTTP não é um snapshot transacional: escritas concorrentes que preservem a contagem podem exigir nova consulta. Nenhum total parcial é devolvido em caso de erro detectado.

O provedor recebe somente intenção analítica derivada da pergunta (não o texto livre), quantidade de linhas, totais e série mensal agregada. Não recebe descrição, nome de categoria, e-mail, UUID ou datas diárias. Cinco registros não garantem anonimização; mesmo agregados podem ser sensíveis. Respostas do modelo com números, moeda, URL ou e-mail são rejeitadas em favor do fallback, enquanto os fatos calculados permanecem separados na interface.

**Consentimento:** sem migration, não há registro auditável de opt-in/retirada pelo proprietário da empresa. A allowlist de servidor é uma preparação manual e começa vazia. Não configure as chaves de ativação nem use dados reais antes de aprovar um processo documentado de consentimento por empresa e o tratamento no Free Tier. A interface staging e a produção continuam com `hermesGenerativeEnabled: false`.

## Validação local

Na pasta desta função, com Deno 2.5.6:

```bash
deno check index.ts index_test.ts
deno test --allow-env index_test.ts
```

Os testes substituem cliente Supabase e requisição Gemini por mocks. Usam somente dados financeiros fictícios e não fazem chamadas remotas. RLS real e o consentimento humano não são comprovados por esses mocks.

## Ativação controlada

O histórico registra Hermes v11 implantado no staging em modo determinístico. Nenhum secret foi lido nesta revisão; o estado atual dos gates remotos precisa ser reconfirmado por procedimento seguro antes de qualquer ensaio. Antes de usar dados reais:

1. aprovar formalmente o tratamento de agregados pelo Gemini e os termos do tier escolhido;
2. configurar os secrets somente na Edge Function;
3. obter e registrar aprovação específica de cada empresa; só então, em etapa futura autorizada, definir `HERMES_DATA_SHARING_APPROVED=true`, `HERMES_APPROVED_COMPANY_IDS` e as origens autorizadas;
4. implantar e testar com dados fictícios/agregados;
5. somente depois, alterar `hermesGenerativeEnabled` no frontend.

Sem aprovação, chave ou disponibilidade do provedor, a função e a interface preservam o fallback determinístico.
