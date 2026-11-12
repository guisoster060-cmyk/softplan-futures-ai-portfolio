# Validação de impacto de negócio — BusinessMind AI

**Estado:** plano de avaliação e evidências técnicas, **sem estudo de impacto com empresas reais**. Atualizado em 12/11/2026.

## Hipótese e público
Pequenos negócios que registram receitas e despesas manualmente podem gastar tempo consolidando informações e ter dificuldade para identificar o resultado mensal. O MVP propõe centralizar movimentações, calcular indicadores e usar o Hermes para explicar os números e sugerir verificações. **Hipótese não equivale a benefício comprovado.**

## O que foi efetivamente observado
- Cadastro, autenticação, empresa, movimentações e indicadores testados em conta nova.
- Em exemplo fictício, receita mensal de **R$ 500**, despesa de **R$ 50**, resultado de **R$ 450**; em janela de seis meses, **R$ 1.300** de receitas e **R$ 50** de despesas. **Não misturar períodos**.
- Gemini acionado em prévia limitada com registros de autorização e provedor aceitos. Isso comprova integração, **não qualidade, precisão ou utilidade econômica** das recomendações.
- Formulário de validação com donos de negócios foi divulgado, mas **não recebeu respostas válidas**. Não apresentar entrevistas ou feedback inexistentes.

## Protocolo de avaliação futura — sem acesso a dados reais
| Pergunta | Como testar | Métrica | Critério de interpretação |
|---|---|---|---|
| A interface reduz esforço? | Dar o mesmo conjunto fictício de 10 lançamentos para participantes, comparando planilha manual e MVP | Tempo total em minutos e erros de lançamento | Comparar medianas; relatar amostra e experiência prévia |
| O resultado está correto? | Conferir receitas, despesas e resultado com gabarito calculado independentemente | Taxa de acerto dos valores | Esperado 100% em operações determinísticas; investigar qualquer divergência |
| Hermes ajuda a compreender? | Apresentar relatório com e sem interpretação, em ordem alternada | Respostas corretas a perguntas de compreensão; nota de clareza de 1 a 5 | Não confundir satisfação com melhoria de decisão |
| Recomendações são seguras? | Revisar sugestões contra os dados exibidos e premissas explícitas | % de recomendações sustentadas pelos dados; erros e alucinações | Classificar falhas e não fazer alegações de aconselhamento contábil |
| O uso é viável? | Testar login, e-mail, quotas e fallback em janela anônima | Taxa de conclusão e falhas por etapa | Documentar limites da versão gratuita |

## Modelo de registro de resultados (preencher somente após teste)
- Data, cenário, participantes e consentimento:
- Dados utilizados (somente fictícios):
- Tarefas e critérios de sucesso definidos **antes** do teste:
- Tempo manual / tempo MVP:
- Erros manuais / erros MVP:
- Clareza com / sem Hermes:
- Falhas, limitações e fatores de confusão:
- Conclusão restrita à amostra:
- Próxima melhoria sugerida:

## Riscos de interpretação
Sem grupo comparativo, não atribuir ganho de tempo ao produto. Com amostra pequena, não generalizar para MEI/ME/EPP brasileiros. Não utilizar movimentações ou e-mails pessoais nas evidências. O protótipo **não substitui contador ou consultor financeiro**.

## Valor demonstrado hoje
**Capacidade técnica:** reunir registros e produzir cálculos rastreáveis e uma explicação generativa limitada. **Valor de negócio potencial:** menos esforço para leitura de indicadores e maior compreensão dos números. **Impacto medido:** ainda não disponível.

## Cenário reproduzível para o avaliador (dados 100% fictícios)

1. Registre uma receita de **R$ 500,00** e uma despesa de **R$ 50,00** no **mesmo mês**.
2. Confira se a visão geral mostra **receitas R$ 500,00**, **despesas R$ 50,00**, **resultado R$ 450,00** e **margem de resultado 90%**, caso a interface exiba esse indicador.
3. Abra **Inteligência** e peça: “Explique meu resultado e indique riscos com base somente nos lançamentos disponíveis”.
4. **Critério de sucesso:** os números exibidos devem coincidir com os valores de referência; a resposta do assistente deve separar fatos dos dados de hipóteses e não inventar períodos ou lançamentos.
5. **Critério de falha:** total incorreto, ausência de informação sobre período, recomendação afirmada como fato sem sustentação, ou falha de acesso não sinalizada.

**Resultado deste cenário:** este documento define um gabarito matemático e um roteiro de teste; **não comprova que o teste foi executado nesta sessão** nem mede ganho real de produtividade.
