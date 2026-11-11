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

O código não foi implantado e nenhum secret foi configurado. Antes de usar dados reais:

1. aprovar formalmente o tratamento de agregados pelo Gemini e os termos do tier escolhido;
2. configurar os secrets somente na Edge Function;
3. obter e registrar aprovação específica de cada empresa; só então, em etapa futura autorizada, definir `HERMES_DATA_SHARING_APPROVED=true`, `HERMES_APPROVED_COMPANY_IDS` e as origens autorizadas;
4. implantar e testar com dados fictícios/agregados;
5. somente depois, alterar `hermesGenerativeEnabled` no frontend.

Sem aprovação, chave ou disponibilidade do provedor, a função e a interface preservam o fallback determinístico.
