# BUSINESSMIND AI — TECHNICAL DECISIONS

Versão: 1.1
Status: Primeiras decisões aprovadas
Última atualização: 09/11/2026

> Esta é uma **versão proposta** do arquivo. O original no projeto Claude não foi alterado.
> Para oficializar, substitua o conteúdo de `TECHNICAL_DECISIONS.md` por este.

## 1. Objetivo

Registrar todas as decisões técnicas importantes do BusinessMind AI. Este documento é a referência para Claude, ChatGPT, Gemini e demais agentes.

## 2. Regras de decisão

Toda decisão relevante apresenta: identificador, data, área, problema, alternativas, vantagens e desvantagens, solução escolhida, justificativa, impactos, responsável pela aprovação e status.

## 3. Estado atual

Em 09/11/2026 o responsável pelo projeto aprovou a proposta técnica da v0.4 (DEC-001 a DEC-009). Nada abaixo está **implementado ou validado** ainda, salvo onde indicado. Hipóteses e itens pendentes ficam na seção 5, separados das decisões.

## 4. Decisões aprovadas

### DEC-001 — Supabase como plataforma de autenticação e banco de dados
Data: 09/11/2026 · Área: Backend/Banco · Status: **Aprovada**
Necessidade: autenticação real e persistência sem manter servidor próprio, dentro de planos gratuitos.
Alternativas: Firebase (banco NoSQL, pior para consultas financeiras); backend próprio em Node + Postgres (mais operação e segurança a cargo do projeto, sem ganho para o portfólio).
Justificativa: reúne login, PostgreSQL (SQL real para indicadores) e funções de servidor; boa documentação.
Impactos e limites do plano Free (verificados em fontes em 09/11/2026): 500 MB de banco, 50 mil usuários ativos, 2 projetos; projetos inativos por uma semana são **pausados**; sem backups. Risco para demonstrações: abrir o app dias antes e reativar o projeto pelo painel se pausar.
Aprovação: Guilherme Soster Santeti.

### DEC-002 — Cloudflare Pages para hospedagem do frontend
Data: 09/11/2026 · Área: Infraestrutura · Status: **Aprovada**
Alternativa considerada: GitHub Pages (equivalente para site estático; limites não verificados).
Justificativa: plano gratuito com builds mensais limitados (500), requisições estáticas e banda sem limite informado; endereço `*.pages.dev` sem custo de domínio.
Aprovação: Guilherme Soster Santeti.

### DEC-003 — HTML, CSS e JavaScript puro, aproveitando a v0.3
Data: 09/11/2026 · Área: Frontend · Status: **Aprovada**
Justificativa: preservar identidade visual, logo e as quatro telas já validadas; poucas dependências; sem etapa de build.
Impactos: a v0.3 é mantida como versão de referência (pasta `versions/v0.3/` e tag git `v0.3`). A v0.4 é criada em paralelo. Biblioteca `supabase-js` será carregada com versão fixada (a definir na etapa de login).
Aprovação: Guilherme Soster Santeti.

### DEC-004 — Autenticação real por e-mail e senha (Supabase Auth)
Data: 09/11/2026 · Área: Segurança · Status: **Aprovada**
Impactos: a chave pública (`anon`) pode ficar no frontend por desenho; a chave `service_role` nunca vai ao frontend nem ao repositório. O envio de e-mails (cadastro/recuperação) depende de HIP-01 (pendente).
Aprovação: Guilherme Soster Santeti.

### DEC-005 — Persistência em PostgreSQL (Supabase)
Data: 09/11/2026 · Área: Banco · Status: **Aprovada**
Modelo inicial: `profiles`, `companies`, `company_members`, `transactions` (ver `supabase/migrations/0001_initial_schema.sql`). Indicadores calculados por consulta/view, nunca gravados.
Aprovação: Guilherme Soster Santeti.

### DEC-006 — Isolamento entre empresas com RLS
Data: 09/11/2026 · Área: Segurança · Status: **Aprovada (modelo). Validação pendente.**
Regra: toda linha de dados pertence a uma empresa; só membros da empresa a lêem ou alteram. Reforço: privilégios mínimos por coluna e uma única função para criar empresas.
Evidência: **nenhuma ainda**. A migração e o teste `supabase/tests/isolation_test.sql` foram escritos, mas não executados em um Supabase real. Esta decisão só será considerada validada após o relatório de testes.
Aprovação: Guilherme Soster Santeti.

### DEC-007 — Assistente em duas camadas
Data: 09/11/2026 · Área: IA · Status: **Aprovada**
Camada 1 (primeiro): análises determinísticas sobre dados reais, rotuladas como "calculado", nunca como IA.
Camada 2 (depois): IA generativa via função de servidor, com chave protegida, envio apenas de dados agregados e limite por usuário. **Provedor, custo e privacidade serão avaliados antes** (HIP-02).
Aprovação: Guilherme Soster Santeti.

### DEC-008 — Gestão simplificada de empresas
Data: 09/11/2026 · Área: Produto/Banco · Status: **Aprovada**
Cada conta cria e administra a própria empresa. A plataforma suporta várias empresas independentes. Não haverá convites, equipes nem permissões complexas agora; a tabela `company_members` deixa a estrutura preparada.
Aprovação: Guilherme Soster Santeti.

### DEC-009 — Restrição de custo zero
Data: 09/11/2026 · Área: Custos · Status: **Aprovada**
Usar apenas planos gratuitos. Nenhum serviço que possa gerar cobrança automática sem autorização expressa. Limites e riscos de cada serviço devem ser documentados.
Aprovação: Guilherme Soster Santeti.

## 5. Hipóteses e itens pendentes (NÃO são decisões)

### HIP-01 — Envio de e-mails de cadastro e recuperação de senha
Status: **Proposta, aguardando decisão**
Fato verificado: o envio padrão do Supabase serve só para testes: limita-se a 2 mensagens por hora e só envia a endereços da equipe do projeto. Com SMTP próprio o limite inicial sobe para 30 por hora.
Opção A (recomendada): SMTP próprio gratuito via Brevo (300 e-mails/dia, sem cartão). Verifica-se o endereço remetente, sem exigir domínio próprio. Riscos: o envio só começa após aprovação da conta pela Brevo; a entrega a partir de um remetente Gmail pode cair em spam (**hipótese não verificada**).
Opção B (plano de contingência): desativar a confirmação de e-mail no cadastro (login imediato) e manter a recuperação pelo envio padrão, que só funciona para e-mails da equipe do projeto (o dono). Aceitável só para demonstração pessoal; documentar a limitação.
Opção C: domínio próprio + provedor. Custo (domínio), **não aprovado**.
Decisão prevista: no início da etapa de login.

### HIP-02 — Provedor de IA generativa
Status: **Pendente.** Critérios: custo, privacidade (uso dos dados para treino), limites, proteção da chave. Observação verificada: no nível gratuito do Gemini, os dados podem ser usados para melhorar produtos do Google, o que exige aviso e uso apenas de dados fictícios. Preços da API da Anthropic não verificados.

### HIP-03 — Versão de `supabase-js`
Status: **Pendente.** Escolher versão fixa e com mais de 14 dias de publicada, na etapa de login.

### HIP-04 — Abuso de cadastro aberto
Status: **Hipótese.** Cadastro público pode encher o plano gratuito. Mitigação já escrita: limite de 5000 movimentações por empresa (a validar). Avaliar limites adicionais depois.

## 6. Histórico

- 09/11/2026: aprovação de DEC-001 a DEC-009; abertura de HIP-01 a HIP-04.

## 7. Revisão de decisões

Decisões aprovadas podem ser revistas por novas necessidades, desempenho, custos ou alternativas melhores. Toda substituição registra a decisão anterior, o motivo e os impactos.

## 8. Regra obrigatória

Nenhuma IA poderá apresentar uma tecnologia como oficialmente escolhida sem aprovação registrada. Recomendações não são decisões aprovadas.

## 9. Referências (consultadas em 09/11/2026)

- Supabase — Auth rate limits: https://supabase.com/docs/guides/auth/rate-limits.md
- Supabase — Production checklist (SMTP próprio, 30 e-mails/hora): https://supabase.com/docs/guides/deployment/going-into-prod.md
- Brevo — integração SMTP com Supabase (envio padrão: 2/hora, só equipe): https://developers.brevo.com/docs/supabase-smtp-integration.md
- Limites do plano Free do Supabase (fontes secundárias): https://automationatlas.io/answers/supabase-free-tier-limits-2026/
- Cloudflare Pages (limites): https://pages.cloudflare.com/
- Gemini API (preços e uso de dados): https://ai.google.dev/gemini-api/docs/pricing
