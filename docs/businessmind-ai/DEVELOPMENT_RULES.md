BUSINESSMIND AI — DEVELOPMENT RULES

Versão: 1.1
Última atualização: 07/11/2026
Status: Regras de governança e desenvolvimento

1. Objetivo

Estabelecer regras obrigatórias para todas as IAs, desenvolvedores e colaboradores envolvidos no BusinessMind AI.

O objetivo é garantir organização, qualidade, segurança, transparência e consistência durante todo o ciclo de vida do projeto.

Estas regras devem ser respeitadas independentemente da ferramenta, linguagem de programação ou tecnologia utilizada.

2. Regras gerais

- Trabalhar sempre com base na documentação atualizada.
- Não presumir informações que não foram confirmadas.
- Não inventar requisitos, resultados, dados, decisões ou funcionalidades.
- Não tomar decisões importantes sem apresentar justificativas e obter aprovação humana.
- Não criar funcionalidades fora do escopo aprovado.
- Priorizar soluções simples, eficientes, seguras e sustentáveis.
- Explicar termos técnicos quando necessário.
- Comunicar riscos, limitações, dependências e incertezas.
- Diferenciar claramente fatos, hipóteses, sugestões e decisões aprovadas.
- Não considerar uma sugestão de uma IA como decisão do projeto sem aprovação humana.
- Preservar o histórico e a rastreabilidade das alterações.

3. Governança, escopo e aprovações

- O usuário responsável pelo projeto mantém a autoridade sobre escopo, prioridades e aprovações.
- As IAs podem pesquisar, analisar, propor alternativas e identificar riscos, mas não devem transformar sugestões em decisões definitivas.
- Requisitos, funcionalidades, prioridades e critérios de aceitação devem ser documentados e validados.
- Hipóteses ainda não validadas devem permanecer identificadas como hipóteses.
- Divergências entre documentos devem ser apontadas e resolvidas antes de orientar atividades dependentes dessas informações.
- Nenhum agente deve ampliar o escopo por iniciativa própria.
- Mudanças relevantes devem apresentar objetivo, justificativa, impacto e necessidade de aprovação.
- Decisões rejeitadas ou substituídas devem ser identificadas no histórico quando forem relevantes para a rastreabilidade.

4. Etapas antes do desenvolvimento

O desenvolvimento de funcionalidades não deverá começar apenas porque existe uma proposta ou uma ideia documentada.

Antes da implementação, devem ser realizadas e aprovadas as etapas aplicáveis de:

- Entendimento e definição do problema.
- Pesquisa e validação de mercado.
- Identificação do público-alvo.
- Business Analysis.
- Levantamento e priorização de requisitos.
- Definição do escopo inicial e do MVP.
- Definição de critérios de aceitação.
- Avaliação de riscos e requisitos de segurança.
- Avaliação e aprovação da arquitetura e das tecnologias.

A conclusão de uma etapa não deve ser presumida. Deve existir evidência documental e validação humana.

Enquanto essas etapas estiverem pendentes, o trabalho deverá permanecer concentrado em pesquisa, análise, documentação, planejamento e avaliação de alternativas.

5. Arquitetura e tecnologias

- Pesquisar alternativas antes de recomendar tecnologias.
- Avaliar custos, desempenho, segurança, escalabilidade, manutenção e complexidade.
- Evitar dependências desnecessárias.
- Considerar separação adequada entre frontend, backend e banco de dados, conforme a arquitetura definida.
- Documentar decisões arquiteturais, alternativas consideradas e justificativas.
- Não alterar tecnologias aprovadas sem justificar os benefícios, riscos e impactos e obter aprovação.
- Não apresentar tecnologias candidatas como escolhas definitivas.
- Não iniciar implementação com base em uma arquitetura ainda não aprovada.

6. Padrões de código

- Escrever código legível, organizado e consistente.
- Utilizar nomes claros para variáveis, funções e arquivos.
- Evitar duplicação de código.
- Separar responsabilidades.
- Tratar erros adequadamente.
- Validar entradas de usuários.
- Criar componentes reutilizáveis quando fizer sentido.
- Manter comentários úteis, sem excesso.
- Evitar soluções complexas sem necessidade.
- Respeitar os padrões e a arquitetura aprovados para o projeto.
- Documentar alterações que afetem o funcionamento ou a manutenção do sistema.

7. Segurança e proteção de dados

- Nunca publicar senhas, tokens, chaves de API ou credenciais.
- Utilizar variáveis de ambiente ou mecanismos seguros equivalentes para informações sensíveis.
- Aplicar autenticação e autorização de forma consistente.
- Aplicar o princípio do menor privilégio.
- Proteger dados empresariais contra acesso, alteração ou divulgação não autorizados.
- Utilizar dados fictícios ou devidamente anonimizados em demonstrações públicas.
- Não utilizar dados reais de empresas em testes ou demonstrações sem autorização adequada.
- Não enviar informações confidenciais a serviços externos sem autorização e avaliação dos riscos.
- Considerar as boas práticas de proteção de dados e os requisitos aplicáveis da LGPD.
- Registrar riscos e incidentes de segurança relevantes e comunicar os responsáveis.

8. Permissões e informações financeiras

As permissões devem ser tratadas como uma preocupação transversal do produto, não como uma funcionalidade isolada de uma tela.

- As permissões definidas para cada perfil devem ser respeitadas em todas as áreas do sistema.
- A autorização deve ser aplicada também a relatórios, exportações, notificações, integrações, histórico e demais formas de acesso aos dados.
- Informações financeiras devem respeitar as restrições de acesso estabelecidas para os perfis autorizados.
- Restringir o acesso não significa apenas ocultar informações na interface: também devem ser impedidas consultas, exportações, respostas da IA e inferências indiretas que revelem dados protegidos.
- Não confiar exclusivamente em controles visuais do frontend para proteger informações.
- Validar permissões também no backend e nas integrações, conforme a arquitetura aprovada.
- Mudanças nas regras de permissão devem ser documentadas, testadas e aprovadas.
- As regras específicas de perfis e permissões do produto permanecem sujeitas à validação funcional.

9. Inteligência Artificial

- As respostas da IA devem utilizar dados disponíveis e verificáveis.
- Não inventar indicadores, valores, causas ou conclusões.
- Informar quando não houver dados suficientes para responder com segurança.
- Explicar quais informações estão faltando e como poderiam ser obtidas.
- Diferenciar fatos, estimativas, hipóteses e recomendações.
- Apresentar limitações e incertezas de maneira clara.
- Não apresentar correlações como causalidade sem evidências adequadas.
- Avaliar custos, limites, segurança e dependências das integrações de IA.
- Evitar enviar dados sensíveis a serviços externos sem autorização.
- Respeitar as permissões do usuário que solicita a análise.
- Não revelar informações protegidas por meio de respostas indiretas ou cruzamento de dados.
- A IA deverá atuar como apoio à análise e à tomada de decisão.
- Ações de alto impacto não devem ser executadas sem aprovação humana explícita.
- Recomendações não devem ser apresentadas como decisões já executadas.
- Registrar limitações relevantes dos modelos e das fontes utilizadas.

10. Testes e qualidade

- Testar funcionalidades antes de considerá-las concluídas.
- Criar testes automatizados quando aplicável.
- Verificar erros, casos extremos e entradas inválidas.
- Testar responsividade e compatibilidade entre módulos.
- Verificar permissões e tentativas de acesso não autorizado.
- Testar a proteção de informações financeiras e confidenciais.
- Avaliar respostas da IA com dados suficientes e insuficientes.
- Verificar se a IA respeita as permissões de cada perfil.
- Registrar problemas encontrados e sua situação.
- Não afirmar que testes foram executados quando não foram.
- Não considerar uma funcionalidade concluída apenas porque o código foi produzido.
- Documentar os resultados efetivamente verificados.

11. GitHub e versionamento

- Utilizar Git para controlar alterações.
- Trabalhar na branch apropriada e respeitar as regras do repositório.
- Criar commits com mensagens descritivas.
- Revisar alterações antes de integrar.
- Não sobrescrever trabalho funcional sem necessidade.
- Não excluir arquivos, histórico ou alterações de outros colaboradores sem autorização.
- Não realizar commits, pushes, merges ou alterações destrutivas sem autorização explícita do responsável pelo projeto.
- Não integrar alterações relevantes sem revisão.
- Não enviar arquivos temporários, credenciais ou informações confidenciais.
- Manter README e documentação atualizados.
- Identificar claramente alterações realizadas por agentes de IA.
- Preservar a rastreabilidade entre tarefas, arquivos, revisões e commits.

12. Trabalho entre agentes

Cada agente deverá respeitar sua responsabilidade e comunicar dependências e conflitos.

Coordenação

- Organizar prioridades.
- Distribuir tarefas.
- Acompanhar o andamento.
- Consolidar análises e resultados.
- Encaminhar decisões para aprovação humana.
- Evitar que atividades sejam iniciadas sem os pré-requisitos necessários.

Arquitetura

- Analisar requisitos aprovados.
- Pesquisar tecnologias e alternativas.
- Planejar estruturas e integrações.
- Avaliar riscos técnicos e de segurança.
- Documentar decisões e justificativas.
- Não declarar aprovada uma arquitetura sem validação humana.

Desenvolvimento

- Implementar funcionalidades autorizadas.
- Seguir a arquitetura aprovada.
- Documentar alterações.
- Informar dependências e limitações.
- Não ampliar o escopo por iniciativa própria.

QA

- Revisar código e documentação.
- Executar testes.
- Identificar falhas.
- Avaliar segurança, permissões e qualidade.
- Registrar evidências e resultados.
- Comunicar bloqueios e riscos.

Todos os agentes devem comunicar conflitos, evitar duplicação desnecessária de trabalho e não modificar decisões de outras áreas sem justificativa e aprovação.

13. Registro de contribuições

Toda contribuição relevante deverá registrar, conforme aplicável:

- Ferramenta ou IA utilizada.
- Modelo utilizado, quando conhecido.
- Data da atividade.
- Objetivo da tarefa.
- Solicitação ou prompt utilizado.
- Análises e alterações realizadas.
- Arquivos envolvidos.
- Testes executados e resultados.
- Limitações identificadas.
- Revisão realizada.
- Aprovação ou rejeição humana.
- Commit relacionado, quando existir.

Registros reconstruídos a partir de conversas devem ser identificados como resumos, não como transcrições literais.

14. Critérios para concluir tarefas

Uma tarefa somente poderá ser considerada concluída quando os critérios aplicáveis forem atendidos:

1. A atividade autorizada estiver realizada.
2. Os resultados forem verificados.
3. Os testes necessários tiverem sido executados.
4. Os riscos e problemas relevantes estiverem registrados.
5. A documentação estiver atualizada.
6. A revisão e a aprovação humana necessárias tiverem ocorrido.
7. As alterações estiverem registradas no GitHub, quando aplicável.

Uma atividade não deverá ser marcada como concluída apenas por ter sido planejada, proposta ou iniciada.

15. Regra principal

A prioridade não é produzir a maior quantidade de código ou funcionalidades, mas construir um produto útil, validado, funcional, seguro, compreensível, documentado e tecnicamente consistente.

A qualidade do processo, a proteção dos dados, a validação das necessidades reais e a aprovação humana devem prevalecer sobre a velocidade de implementação.