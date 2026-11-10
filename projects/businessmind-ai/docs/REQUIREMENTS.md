# Requisitos do BusinessMind AI

Versão documental: 1.0

Base de evidência: código integrado em `new-branch`, migração `0001_initial_schema.sql`, testes automatizados e PRs #1 a #3.

## 1. Escopo do MVP documentado

O MVP permite que uma pessoa crie uma conta, configure sua empresa, registre receitas e despesas e acompanhe indicadores calculados exclusivamente a partir dessas movimentações. O Hermes oferece análises determinísticas e possui integração Gemini preparada, desativada até autorização, configuração e deploy controlados.

## 2. Prioridades

- **Must:** necessário para o fluxo principal e já implementado.
- **Should:** importante para qualidade ou operação; pode estar implementado parcialmente.
- **Could:** evolução possível, sem compromisso de entrega.

## 3. Requisitos funcionais

| ID | Prioridade | Requisito | Critérios de aceitação verificáveis | Estado |
| --- | --- | --- | --- | --- |
| RF-001 | Must | Cadastrar usuário com e-mail, senha e nome. | O frontend chama `signUp`; senha inferior a seis caracteres é rejeitada; o nome é enviado como metadado. | Implementado |
| RF-002 | Must | Autenticar usuário e restaurar sessão. | Login usa `signInWithPassword`; o cliente persiste e renova a sessão; o estado da interface acompanha `onAuthStateChange`. | Implementado |
| RF-003 | Must | Encerrar sessão. | A ação “Sair” chama `signOut` e retorna à tela de login. | Implementado |
| RF-004 | Should | Solicitar recuperação de senha. | O sistema exige e-mail e chama `resetPasswordForEmail`, apresentando feedback. O envio efetivo depende da configuração SMTP. | Implementado com dependência externa |
| RF-005 | Must | Criar a primeira empresa do usuário. | Sem associação existente, o onboarding é exibido; a criação ocorre somente pela RPC `create_company`. | Implementado |
| RF-006 | Must | Carregar perfil, empresa e movimentações autorizadas. | Após autenticação, o sistema consulta `profiles`, `company_members`, `companies` e `transactions`; erros impedem a abertura silenciosa do dashboard. | Implementado |
| RF-007 | Must | Criar movimentação financeira. | Tipo, descrição, categoria, valor e data são validados; a inserção inclui `company_id` e não envia `created_by`. | Implementado |
| RF-008 | Must | Editar movimentação financeira. | Campos permitidos são atualizados por `id`; a interface reflete a linha retornada pelo banco. | Implementado |
| RF-009 | Must | Excluir uma ou todas as movimentações da empresa. | A exclusão individual e a exclusão em lote exigem confirmação e são limitadas pelo RLS. | Implementado |
| RF-010 | Must | Filtrar movimentações por período e tipo. | A lista e os contadores mudam conforme filtros de período e receita/despesa. | Implementado |
| RF-011 | Must | Calcular indicadores com dados reais. | Receitas, despesas, lucro e margem derivam apenas das linhas carregadas; banco vazio apresenta zeros e ausência de base. | Implementado |
| RF-012 | Must | Exibir histórico mensal e composição por categoria. | Série de seis meses e composição por categoria usam as mesmas movimentações autorizadas; não existem seeds na aplicação ativa. | Implementado |
| RF-013 | Should | Exportar a visão filtrada para CSV. | Arquivo usa separador `;`, BOM UTF-8 e neutraliza células iniciadas por caracteres de fórmula. | Implementado |
| RF-014 | Must | Produzir análises determinísticas transparentes. | Hermes identifica a base usada, diferencia fato, estimativa, risco e recomendação e informa insuficiência de dados. | Implementado |
| RF-015 | Should | Atualizar perfil e nome da empresa. | Nome pessoal e nome empresarial são persistidos nas tabelas autorizadas. | Implementado |
| RF-016 | Should | Salvar preferências de interface. | Modo compacto, redução de movimento e exibição de alertas persistem localmente. | Implementado |
| RF-017 | Should | Oferecer análise generativa pelo Hermes. | Edge Function valida JWT, confirma a associação usuário–empresa sob RLS, calcula agregados e chama o Gemini somente quando autorizado e configurado. | Implementado, desativado e não implantado |
| RF-018 | Must | Preservar o Hermes determinístico como fallback. | Ausência de consentimento/configuração, erro, timeout ou resposta inválida mantém uma resposta determinística sem nova chamada externa. | Implementado e testado localmente |
| RF-019 | Must | Distinguir cálculo de interpretação generativa. | A interface rotula os dados calculados pelo sistema separadamente da interpretação do Gemini. | Implementado |
| RF-020 | Must | Limitar uso do assistente. | Perguntas, respostas, timeout, linhas consultadas e requisições por minuto possuem limites explícitos. | Implementado; rate limit global pendente |

## 4. Requisitos não funcionais

| ID | Área | Requisito e critério | Estado |
| --- | --- | --- | --- |
| RNF-001 | Segurança | Nenhuma chave `service_role`, secret key ou chave de IA pode existir no frontend. | Coberto por teste estático |
| RNF-002 | Autorização | O isolamento entre empresas deve ser aplicado no PostgreSQL por RLS, não apenas pela interface. | Implementado no schema; execução remota relatada pelo responsável |
| RNF-003 | Menor privilégio | Usuários autenticados recebem apenas privilégios de tabela, coluna e função necessários. | Implementado na migração |
| RNF-004 | Integridade | Valores, tipos, comprimentos e datas devem ser validados no frontend e por constraints no banco. | Implementado e testado localmente |
| RNF-005 | Responsividade | A interface deve operar sem overflow horizontal nos viewports de 1440×1000 e 390×844. | Validado visualmente na v0.5 |
| RNF-006 | Acessibilidade | Deve haver foco visível, navegação por teclado, nomes acessíveis e redução de movimento. | Implementado; auditoria especializada pendente |
| RNF-007 | Desempenho | O frontend deve permanecer estático, sem framework ou bundle de gráficos desnecessário. | Implementado |
| RNF-008 | Compatibilidade | A aplicação requer navegador moderno com JavaScript, SVG e suporte às APIs usadas por `supabase-js`. | Parcialmente validado em Chromium |
| RNF-009 | Observabilidade | Erros de operações devem produzir mensagens ao usuário; monitoramento centralizado não é requisito atual. | Feedback implementado; monitoramento pendente |
| RNF-010 | Custo | A solução deve usar serviços gratuitos e não introduzir cobrança sem aprovação. | Diretriz vigente |
| RNF-011 | Manutenibilidade | Regras de domínio testáveis devem ficar separadas da manipulação do DOM. | Parcial: `domain.js` separado; `app.js` ainda concentra UI e serviços |
| RNF-012 | CI | Verificações sem credenciais privadas devem executar em push e pull request. | Implementado em GitHub Actions |
| RNF-013 | Privacidade | Agregados financeiros só podem sair do Supabase após autorização explícita e ativação independente no servidor e frontend. | Implementado como gate; autorização pendente |
| RNF-014 | Resiliência | Falhas e timeout do Gemini não podem indisponibilizar o Hermes determinístico. | Implementado e testado por unidade/inspeção estática |

## 5. Fora do escopo atual

- Convites, equipes e papéis administrativos completos.
- Importação de planilhas.
- Conciliação bancária e integrações financeiras.
- Cobrança, assinatura ou plano pago.
- IA generativa ativa em produção ou envio de dados reais ao Gemini.
- Aplicativo nativo.
- Garantias de conformidade integral com LGPD.

## 6. Rastreabilidade

- Autenticação e CRUD: `app/app.js`.
- Validação e cálculos: `app/domain.js`.
- Modelo e autorização: `supabase/migrations/0001_initial_schema.sql`.
- Critérios automatizados: `tests/*.test.js`.
- Evidências por entrega: [ENGINEERING_LOG.md](ENGINEERING_LOG.md).

