# Validação manual da demonstração pública — 13/11/2026

## Escopo e método

Teste exploratório manual realizado pelo responsável pelo projeto em smartphone Android, acessando a demonstração pública [BusinessMind AI](https://businessmind-ai-demo.guisoster060.workers.dev) no navegador móvel. Os resultados abaixo foram relatados pelo responsável e/ou conferidos em capturas de tela compartilhadas durante a sessão. Não houve instrumentação automatizada nesta sessão nem inspeção independente do armazenamento do navegador. Os dados utilizados são fictícios.

**Ambiente testado:** demonstração pública Cloudflare Workers, com armazenamento local e Hermes determinístico. **Não é teste da autenticação Supabase, PostgreSQL/RLS, Edge Function remota ou Gemini.**

## Cenários e evidências

| ID | Cenário | Evidência observada | Situação |
| --- | --- | --- | --- |
| M01 | Navegar pelas quatro telas | Capturas de Visão geral, Indicadores, Inteligência e Configurações no celular | Aprovado visualmente |
| M02 | Criar receita | Receita fictícia `Teste` de R$ 1.000,00 exibida; indicadores atualizados | Aprovado |
| M03 | Editar receita | `Teste de venda` alterada para R$ 700,00; mensagem “Movimentação salva.” e margem recalculada | Aprovado |
| M04 | Excluir receita | `Teste de venda` desapareceu; mensagem “Movimentação excluída.”; margem retornou a 86,3% | Aprovado |
| M05 | Persistir após recarga | Responsável confirmou que as movimentações permaneceram após atualizar a página | Aprovado por relato |
| M06 | Exportar CSV | Responsável enviou arquivo e conferiu o resultado durante a sessão; a exclusão não reapareceu | Aprovado na sessão; arquivo não anexado a este relatório |
| M07 | Hermes: lucro do mês | R$ 4.600,00 de receitas − R$ 880,00 de despesas = R$ 3.720,00; 5 movimentações no mês e 6 cadastradas | Aprovado |
| M08 | Hermes: maior despesa | Identificou “Marketing ilustrativo”, R$ 500,00, categoria Marketing, 10/11/2026 | Aprovado |
| M09 | Hermes: previsão sem histórico | Informou insuficiência de dados e exigência de receitas em 3 meses consecutivos; não inventou projeção | Aprovado |
| M10 | Análises e recomendações | Margem 80,9%; Marketing 56,8% das despesas; cenário de economia de 5% = R$ 25,00, explicitamente hipotético | Aprovado |
| M11 | Perfil após recarga | Saudação passou a “Olá, Empresa teste!” após alteração e recarga | Aprovado |
| M12 | Preferências após recarga | Responsável confirmou persistência de modo compacto, redução de animações e alertas | Aprovado por relato |
| M13 | Criar segunda empresa | Empresa nova apresentou indicadores inicialmente zerados | Aprovado |
| M14 | Criar receita na segunda empresa | “Teste empresa 2” de R$ 200,00 exibida, margem de 100%, gráfico atualizado | Aprovado |
| M15 | Alternar para empresa original | Captura mostrou novamente as movimentações originais e não exibiu a receita da segunda empresa na parte visível | Evidência positiva parcial; verificar lista completa para conclusão rigorosa |

## Conferência aritmética

- Empresa original, mês corrente: receitas **R$ 4.600,00**, despesas **R$ 880,00**, lucro **R$ 3.720,00**, margem **80,9%** (arredondada).
- Empresa original, últimos seis meses: receitas **R$ 6.400,00**, despesas **R$ 880,00**, lucro **R$ 5.520,00**, margem **86,3%** (arredondada).
- Marketing: **R$ 500,00 / R$ 880,00 = 56,8%** (arredondado); redução hipotética de 5% de R$ 500,00 = **R$ 25,00**.
- Empresa 2: receita de **R$ 200,00** e nenhuma despesa visível; margem exibida **100,0%**.

## Limitações e verificações pendentes

1. As capturas documentam **comportamento da interface**, não isolamento de segurança entre usuários. O teste de troca entre empresas não substitui testes de RLS.
2. O CSV foi discutido e validado durante a sessão, mas seu conteúdo não é reproduzido aqui; para auditoria independente, preservar uma cópia sanitizada em evidências separadas.
3. Não foram feitos nesta sessão testes completos de criação/edição de despesas, filtros extremos, limpeza total de dados, recuperação de erro, acessibilidade, Safari/Windows ou múltiplos dispositivos.
4. A pergunta de chat “Quais recomendações você tem?” não foi capturada como resposta; a evidência M10 é da **aba Análises e recomendações**, não da resposta do chat.
5. O Hermes público é **determinístico**, sem chamadas generativas externas. A insuficiência de dados para previsão é comportamento esperado.
6. O navegador local não é garantia de backup, sincronização ou durabilidade após limpeza dos dados do site.
7. Os testes automatizados e as verificações remotas de staging são documentados separadamente em [TESTING.md](TESTING.md); não se devem somar seus resultados como se fossem a mesma execução.

## Conclusão

A demonstração pública apresentou comportamento consistente nos fluxos principais observados em Android: movimentações, cálculos, persistência local, Hermes determinístico, preferências e alternância de empresas. **Aprovação restrita aos cenários acima e às evidências disponíveis**; não implica prontidão para produção, cobertura completa ou validação de Gemini/Supabase nesta sessão.

**Roteiro para reproduzir:** abrir a [demo pública](https://businessmind-ai-demo.guisoster060.workers.dev), cadastrar uma receita fictícia, editar/excluir, recarregar, exportar CSV, perguntar ao Hermes sobre o lucro e testar a alternância de empresas. Não utilizar dados reais.
