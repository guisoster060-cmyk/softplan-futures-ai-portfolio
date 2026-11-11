# BusinessMind AI — apresentação de 5 minutos para recrutadores

**Projeto:** MVP web de apoio à gestão financeira de pequenos negócios brasileiros.  
**Objetivo:** reunir movimentações financeiras, indicadores e explicações baseadas em dados autorizados.

## Links para avaliação

- **[Demonstração pública sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev)** — dados fictícios locais, sem Supabase e sem IA externa; permite explorar as quatro telas, criar movimentações e perguntar ao Hermes determinístico.
- **[Sistema real de testes (staging)](https://businessmind-ai-staging.pages.dev)** — permite cadastro com confirmação de e-mail, criação de empresa e persistência PostgreSQL sob RLS. Use somente dados fictícios. Entrega de e-mail sujeita aos limites do serviço.
- [Código e documentação](../README.md) · [Testes](TESTING.md) · [Arquitetura](ARCHITECTURE.md) · [Decisões técnicas](TECHNICAL_DECISIONS.md)

## Roteiro sugerido

**0:00–0:40 — Problema.** Pequenos negócios podem ter receitas e despesas dispersas em planilhas e sistemas, dificultando enxergar resultados. BusinessMind AI é um MVP para reunir os dados e tornar a leitura mais clara; não é uma alegação de validação comercial.

**0:40–1:20 — Solução.** Mostrar **Visão geral** com receitas, despesas, resultado e evolução mensal. Explicar que os indicadores são derivados das movimentações cadastradas, não inventados pelo assistente.

**1:20–2:20 — Operação.** Em **Indicadores**, criar uma receita ou despesa fictícia e mostrar a atualização dos números. Os dados da demonstração pública ficam somente no navegador; no staging são persistidos no Supabase.

**2:20–3:10 — Hermes.** Em **Inteligência**, perguntar: “Qual é o resultado deste mês? Mostre receitas, despesas e movimentações consideradas.” Comparar a conta com os indicadores. O Hermes apresentado é **determinístico**, não uma integração generativa Gemini ativa.

**3:10–4:00 — Engenharia.** Explicar a escolha por HTML/CSS/JavaScript, Supabase Auth, PostgreSQL, Row Level Security e Cloudflare. O MVP atual prioriza o perfil **proprietário**; gerente e funcionário são evoluções futuras.

**4:00–5:00 — Qualidade e limites.** Destacar 54 testes Node e 28 Deno com mocks na Missão 2, validações manuais de cadastro e movimentações no staging e verificações de isolamento SQL. Mocks não equivalem a testes remotos. Informar limitações: IA generativa desativada, limites do e-mail, cobertura de navegadores/acessibilidade incompleta e ausência de implantação de produção aprovada.

## Por que IA neste projeto?

O problema central não é apenas somar receitas e despesas, tarefa que deve continuar sendo feita por código determinístico. O desafio é transformar números dispersos em explicações compreensíveis, perguntas em linguagem natural, alertas e hipóteses de ação para quem administra um pequeno negócio.

**O que existe hoje:** o Hermes interpreta perguntas dentro de um conjunto de intenções suportadas e responde com agregados calculados de forma determinística a partir dos dados acessíveis. Isso torna o resultado reproduzível e permite conferir a conta. **Não é correto descrevê-lo como chatbot generativo ou modelo de linguagem ativo.**

**Onde a IA entrou de fato:** ferramentas de IA auxiliaram a pesquisa, a definição de requisitos, a elaboração e revisão de código, a preparação de testes e a documentação. O responsável definiu o escopo, aprovou decisões, realizou configurações externas e validou os resultados. Consulte [método de desenvolvimento assistido por IA](AI_DEVELOPMENT_METHOD.md).

**Evolução planejada, não entregue:** uma camada generativa poderia explicar tendências e comparar cenários com linguagem mais flexível, recebendo apenas agregados autorizados, com controles de privacidade, custo, confiança e revisão humana. A integração Gemini foi preparada no servidor, mas está desativada no staging e não foi validada remotamente.

**Decisão técnica importante:** preferimos primeiro um assistente verificável e um fluxo de dados seguro, em vez de apresentar respostas generativas sem garantias sobre origem dos números. Isso é uma escolha de escopo do MVP, não uma alegação de IA generativa implementada.

## Perguntas técnicas que podem surgir

**Por que Supabase?** Oferece autenticação e PostgreSQL gerenciados, com políticas RLS para limitar o acesso aos dados por empresa.

**Como evita dados inventados pela IA?** Cálculos são feitos a partir de movimentações autorizadas; a resposta determinística apresenta os agregados, sem depender de geração livre de números.

**O que está pronto e o que não está?** Cadastro, criação de empresa, CRUD financeiro, indicadores, exportação CSV, Hermes determinístico e interface responsiva compõem o MVP. Perfis adicionais e Gemini generativo não estão prontos.

**Qual foi o papel das ferramentas de IA no desenvolvimento?** Apoiaram análise, implementação, testes e documentação. Escopo, decisões de produto, aprovação de mudanças e validações externas foram conduzidos pelo responsável pelo projeto.

## Notas de segurança e demonstração

- Não publicar credenciais, senhas, tokens ou chaves privadas.
- Não usar dados reais de clientes nos ambientes de demonstração.
- O modo público é fictício e isolado; o staging é conectado ao Supabase, mas não é produção.
- O roteiro descreve testes observados, sem afirmar auditoria completa de segurança.
