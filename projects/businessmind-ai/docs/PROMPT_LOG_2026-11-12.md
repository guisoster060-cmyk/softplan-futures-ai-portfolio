# Registro complementar de prompts e decisões — 12/11/2026

> Complemento do histórico, não transcrição integral das conversas. As citações abaixo são **solicitações literais do usuário visíveis nesta etapa**; descrições das atividades do assistente são resumos e não prompts originais. Não inclui credenciais, dados pessoais ou tokens.

## CHATGPT-020 — Melhorar e preservar a versão de entrega

- **Ferramenta:** ChatGPT (GPT-6); conectores GitHub, Supabase e Cloudflare.
- **Data:** 12/11/2026.
- **Prompt literal do usuário:** “Veja o que precisa ser corrigido para testarmos o gemini e deixa lo funcionando altere o que for precisa apenas me diga o que foi feito mas mantenha o projeto original intacto para nao perdermos a entrega caso nao conseguirmos resolver”.
- **Objetivo:** diagnosticar integração Gemini sem comprometer a versão de apresentação.
- **Resultado observado:** alterações isoladas em `fix/hermes-safe-diagnostics-20261112`, sem alteração da implantação de produção.
- **Validação humana:** usuário autorizou a continuação e enviou capturas dos testes.

## CHATGPT-021 — Diagnóstico do login e do Hermes

- **Ferramenta:** ChatGPT (GPT-6); GitHub, Supabase e Cloudflare.
- **Data:** 12/11/2026.
- **Prompt literal:** “Nao foi nao recebi email verifique o que esta acontecendo e resolva isso”.
- **Objetivo:** recuperar acesso à prévia.
- **Resultado:** identificação da configuração incorreta da URL do Supabase na prévia e correção na branch isolada; usuário confirmou login em captura posterior.
- **Validação:** tela do Hermes aberta pelo usuário.

## CHATGPT-022 — Validação de ponta a ponta do Gemini

- **Ferramenta:** ChatGPT (GPT-6), Supabase e Cloudflare; Gemini como provedor generativo do Hermes.
- **Data:** 12/11/2026.
- **Solicitação:** teste controlado do Hermes no staging, autorizado na conversa; **texto integral da autorização não reproduzido aqui**.
- **Resultado observado:** `OPTIONS` HTTP 204; `POST /functions/v1/hermes` HTTP 200; diagnósticos `claim=accepted` e `provider=accepted`; resposta generativa exibida separadamente do cálculo local.
- **Evidência:** [validação técnica](HERMES_GEMINI_VALIDATION_2026-11-12.md).
- **Limitação:** autorização única consumida; não equivale a Gemini liberado ao público.

## CHATGPT-023 — Formatação e cautela nas recomendações

- **Ferramenta:** ChatGPT (GPT-6).
- **Data:** 12/11/2026.
- **Prompt literal:** “Ok faça isso e depois deixaremos tudo apresentável”.
- **Objetivo:** melhorar a apresentação do texto generativo e reduzir inferências financeiras sem evidência.
- **Resultado:** renderização restrita de títulos, parágrafos, listas e ênfase; instruções para não presumir tendência com um mês ou caixa disponível a partir do lucro.
- **Evidência:** commits na branch de melhorias; testes de CI ainda requerem correção/validação.
- **Validação humana:** ainda pendente para a nova formatação.

## CHATGPT-024 — Preparação para recrutador e auditoria dos prompts

- **Ferramenta:** ChatGPT (GPT-6).
- **Data:** 12/11/2026.
- **Prompt literal:** “Está dando certo isso ai agora faça a próxima etapa e me diga o que esta pronto e o que falta para evidenciar tudo e deixar acessível ao recrutador e tbm quero ver se você lembro de salvar os prompts que é pedido na vaga”.
- **Objetivo:** inventariar a entrega pública, reunir evidências, corrigir desatualização dos registros de IA.
- **Resultado:** inventário do repositório público, seis screenshots, histórico principal e índice técnico, registro complementar e roteiro de avaliação.
- **Validação humana:** pendente.

## Regras de rastreabilidade

- Não apresentar este complemento como exportação integral dos chats.
- Prompts do Claude e outros modelos só devem ser marcados como literais se o texto original estiver disponível.
- Código gerado ou modificado por IA deve ser identificado como trabalho assistido, revisado pelo candidato.
- Nunca registrar senhas, e-mails privados, chaves, JWTs ou dados reais de empresas.

## CHATGPT-025 — Corrigir limite para contas novas e comprovar Gemini

- **Ferramentas:** ChatGPT (GPT-6), GitHub, Supabase; Gemini como provedor de respostas.
- **Data:** 12/11/2026.
- **Prompt literal:** “Faça a próxima etapa então”.
- **Contexto e decisão humana:** após o teste com conta recém-criada e quatro movimentações, o usuário enviou captura mostrando resposta determinística, e depois uma nova captura com interpretação generativa.
- **Resultado verificável:** mínimo de movimentações da função `hermes-recruiter` reduzido de 5 para 1 na branch de testes; função v2 publicada no staging. Logs de 22:45 UTC: autorização `accepted` e provedor `accepted`. Quota global em 2 usos no dia.
- **Limite:** o print foi fornecido pelo usuário, não capturado automaticamente pelo assistente; não inclui credenciais nem identifica o usuário.

## CHATGPT-026 — Finalizar evidências e imagens para recrutamento

- **Ferramentas:** ChatGPT (GPT-6), GitHub.
- **Data:** 12/11/2026.
- **Prompt literal:** “Faça isso e tire você mesmo print das telas necessárias se conseguir”.
- **Resultado:** consulta do GitHub Actions com execução #43322922898 aprovada; revisão dos READMEs e roteiro do recrutador; reutilização da galeria já existente de seis capturas da demonstração fictícia. O ambiente atual não dispõe de navegador autenticado para tirar capturas novas da conta de staging; não apresentar imagens antigas como provas do Gemini.
- **Próximas evidências desejadas:** captura da tela de cadastro/login, dashboard com dados fictícios, indicadores, resposta Gemini e configurações na mesma versão isolada, removendo e-mails e outras informações pessoais antes da publicação.
