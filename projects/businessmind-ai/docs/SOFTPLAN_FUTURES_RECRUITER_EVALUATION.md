# Avaliação simulada do portfólio — Softplan Futures

**Data:** 12/11/2026. **Perspectiva:** avaliação crítica orientada pelos critérios públicos, **não representa a Softplan nem sua banca**.

## O que a Softplan realmente valoriza
A descrição oficial destaca: identificar dores de negócio, prototipar e testar soluções de IA, estruturar iniciativas com indicadores, comunicar resultados, colaborar entre áreas, agir com integridade e aprender rápido. Não exige aplicação complexa, mas **um projeto com problema e uso justificável de IA**.

Fontes oficiais:
- https://softplantrainee.gupy.io/jobs/12797771?jobBoardSource=gupy_public_page
- https://softplantrainee.gupy.io/
- https://blog.softplan.com.br/programa-trainee-softplan/

## Minha leitura do projeto como avaliador

| Critério | Evidência verificável no repositório | Limite |
|---|---|---|
| Problema antes da tecnologia | Hipótese de dados financeiros dispersos e métricas de receita/despesa | Não há validação de mercado com respostas válidas |
| IA aplicada | Hermes com interpretação Gemini em prévia limitada | Demo imediata é determinística; quota pode impedir chamada ao vivo |
| Execução e prototipação | Quatro telas, Auth, Postgres/RLS, CSV, deploy e CI | Disponibilidade dos links não foi confirmada nesta rodada |
| Testar e corrigir | Histórico de testes e correção de requisito de movimentações | Não equivale a auditoria completa |
| Impacto e métricas | [Protocolo de validação](BUSINESS_IMPACT_VALIDATION.md) com tempos, erros, compreensão e qualidade | Impacto econômico ainda não medido |
| Comunicação executiva | [Resumo de uma página](RECRUITER_ONE_PAGE.md) e [guia de dois minutos](START_HERE_RECRUITER.md) | O avaliador deve conseguir abrir a demo em navegador limpo |
| Ética e responsabilidade | Dados fictícios, limites de IA, isolamento, documentação de risco | Não apresentar MVP como produto contábil homologado |

## Jornada ideal para recrutador ocupado
**Primeiro clique:** [demo imediata sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev). **Segundo clique:** [resumo de uma página](RECRUITER_ONE_PAGE.md). **Terceiro clique opcional:** [prévia autenticada com Gemini](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev). Se o terceiro link exigir confirmação de e-mail ou Gemini não responder, isso não impede avaliar as quatro telas e o raciocínio do projeto.

## Questões que um entrevistador pode fazer
1. Por que usar IA se os indicadores podem ser calculados sem ela? **Resposta esperada:** IA é para interpretar e explicar; cálculos são determinísticos e auditáveis.
2. Como sabe que pequenos negócios precisam disso? **Resposta:** é hipótese apoiada por pesquisa secundária; formulário sem respostas válidas; falta teste com usuários reais.
3. Como evitar que o Hermes invente números? **Resposta:** calcular indicadores fora do modelo, apresentar origem dos dados, limitar escopo, validar recomendações e usar fallback.
4. Como mediria sucesso? **Resposta:** tempo e erros para completar tarefas, compreensão de relatórios, acurácia e recomendações sustentadas por dados.
5. O que você mesmo decidiu e aprendeu? **Resposta:** explicar escolhas de arquitetura, problemas encontrados, revisões e uso responsável de assistentes de IA, sem atribuir todo o trabalho a si se houve assistência.

## Pendências que não devem ser ocultadas
- Publicar no GitHub as cinco capturas reais tratadas, hoje somente no ZIP entregue no chat; as imagens atuais do GitHub são da demo fictícia.
- Verificar por navegador externo os dois endereços públicos, cadastro, quotas e fluxo de ponta a ponta.
- Confirmar que o link da candidatura corresponde à branch atual. Alterações em branch diferente não aparecem automaticamente no link de outra branch.
- Confirmar requisitos pessoais da vaga (fase da graduação, mudança e disponibilidade).

## Conclusão
**O projeto é compatível com o tipo de portfólio solicitado**, mas não se pode garantir aprovação ou acesso permanente. A melhor apresentação é curta, honesta e centrada no problema, na solução, nas evidências e no aprendizado.
