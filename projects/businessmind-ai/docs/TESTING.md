# Estratégia e evidências de testes

## 1. Princípio

Um resultado só é tratado como validado quando existe evidência de execução. Declarações provenientes de arquivos importados ou relatos do responsável são identificadas separadamente de testes reproduzidos nesta branch.

## 2. Suíte automatizada atual

Comando:

```bash
npm ci
npm run verify
```

O comando executa:

1. `node --check` em `app.js`, `config.js` e `domain.js`;
2. Node Test Runner sobre `tests/*.test.js`;
3. verificação documental adicionada em `scripts/check-docs.mjs`.

### Cobertura automatizada

| Grupo | Evidência |
| --- | --- |
| Domínio | Validação de tipo, descrição, categoria, valor e data; limites do schema; mapeamento; totais; agrupamento. |
| Segurança estática | Ausência de chave administrativa; uso de `create_company`; ausência de `created_by`; ausência de credenciais e seed da v0.3. |
| Integração DOM estática | Todos os IDs referenciados por `app.js` existem no HTML. |
| Design system | Tokens, breakpoints, movimento reduzido, ícones e ausência de framework/ECharts. |
| Documentação | Links relativos, documentos canônicos e versão do README. |

### Resultado reproduzido

Em 10/11/2026, após a implementação local do Hermes, `npm run verify` executou **25 testes aprovados e 0 falhas**. A análise sintática também concluiu sem erro e o verificador confirmou 25 arquivos Markdown, links internos válidos e todos os documentos canônicos presentes.

### Cobertura adicionada para Hermes

| Cenário | Tipo de teste | Resultado local |
| --- | --- | --- |
| Pergunta ausente/acima do limite | Unidade | Aprovado |
| Agregados válidos e ausência de dados | Unidade | Aprovado |
| Separação entre cálculo e interpretação | Unidade | Aprovado |
| Extração e rejeição de resposta Gemini | Unidade | Aprovado |
| JWT obrigatório | Inspeção estática automatizada | Aprovado |
| Associação usuário–empresa e consulta sob RLS | Inspeção estática automatizada | Aprovado |
| Timeout, rate limit e fallback | Inspeção estática automatizada | Aprovado |
| Chave apenas no servidor e consentimento desativado | Inspeção estática automatizada | Aprovado |
| Fallback no frontend | Inspeção estática automatizada | Aprovado |

Essas verificações não substituem um teste de integração da função em runtime Deno nem um teste remoto contra Supabase/Gemini.

### Validação Deno da Edge Function — Etapa 2

Em 10/11/2026, `deno check index.ts index_test.ts` concluiu sem erros e `deno test --allow-env index_test.ts` executou **9 testes aprovados, 0 falhas**. O ambiente usou Deno 2.5.6 e mocks em memória, com dados fictícios. A primeira tentativa de `deno check` falhou por ausência de configuração npm; após `deno.json`, a aquisição de dependências exigiu contorno local de certificado do proxy apenas na primeira descarga. A checagem final e os testes rodaram sem desabilitar TLS.

Foram simulados JWT ausente/inválido, empresa não autorizada, RLS via mock de associação, dados completos e truncados, CORS, resposta inválida, indisponibilidade e timeout do Gemini, resposta válida e ausência de descrição individual no payload. Não houve acesso a serviços remotos. A RLS real continua dependente de teste em ambiente Supabase autorizado.

## 3. Teste SQL de isolamento

Arquivo: `supabase/tests/isolation_test.sql`.

O script contém casos de leitura, escrita, isolamento entre empresas, acesso anônimo, criação por RPC, constraints e limite de 5.000 movimentações. Ele termina com erro intencional para reverter os dados de teste e exibir o relatório.

**Evidência disponível:** o responsável informou execução manual com 34 casos aprovados e zero falhas.

**Limite:** o teste não foi reexecutado pelo Codex durante as entregas v0.4, v0.5 ou esta revisão documental. O comentário antigo no SQL que afirma “ainda não executado” está desatualizado em relação ao relato do responsável e foi preservado para não alterar a migração importada.

## 4. Validação visual v0.5

Executada com Chromium controlado pelo Chrome DevTools Protocol:

| Cenário | Viewport | Resultado |
| --- | --- | --- |
| Login desktop | 1440×1000 | Renderizado; sem overflow horizontal. |
| Login mobile | 390×844 | Renderizado; formulário adaptado. |
| Dashboard vazio desktop | 1440×1000 | KPIs zerados, gráfico vazio e estados informativos. |
| Dashboard vazio mobile | 390×844 | Cards empilhados e largura correta. |
| Gaveta mobile | 390×844 | Navegação aberta, overlay e identidade do workspace. |

O dashboard foi renderizado com um mock isolado de sessão e banco vazio apenas para testar a UI. Nenhuma operação atingiu o Supabase remoto. As sessões finais não registraram exceções JavaScript.

## 5. CI/CD

O workflow `.github/workflows/businessmind-ai.yml` executa em pushes fora da `main` e em pull requests que alteram o projeto ou a documentação. Nos PRs #1 e #2, o job `verify` concluiu com sucesso. O Cloudflare Pages também registrou deploy de preview bem-sucedido para a v0.5.

## 6. Evidências históricas não reproduzidas

- O README da v0.3 relata 57 verificações em Chromium headless. Essa é uma evidência histórica importada, não reproduzida nesta branch.
- A execução dos 34 casos SQL foi informada pelo responsável, sem log versionado no repositório.

## 7. Lacunas e próximos testes

- E2E com cadastro, confirmação de e-mail, login, onboarding e CRUD em ambiente de teste.
- Teste automatizado real de RLS no pipeline com projeto efêmero ou banco local.
- Recuperação de senha após configuração SMTP.
- Edge Function Hermes implantada e testada com autenticação e rate limit.
- Auditoria com leitor de tela e ferramentas especializadas de acessibilidade.
- Firefox, Safari/iOS e dispositivos físicos.
- Volume, paginação e desempenho próximo ao limite de 5.000 movimentações.
- Edge Function em runtime Deno local ou ambiente de staging.
- Respostas reais do Gemini para sucesso, `429`, `5xx`, payload inválido e timeout, usando somente dados fictícios.
- Concorrência e rate limit distribuído entre múltiplas instâncias.

## 8. Tentativa de validação visual desta entrega

Foi iniciado servidor HTTP local e Chromium headless em viewports mobile/desktop. O Chromium não concluiu a inicialização no sandbox (erros de diretório persistente/Crashpad e TLS externo), portanto **nenhum teste visual novo foi considerado aprovado**. A validação visual v0.5 anterior permanece como evidência histórica, não como validação do fluxo generativo.

