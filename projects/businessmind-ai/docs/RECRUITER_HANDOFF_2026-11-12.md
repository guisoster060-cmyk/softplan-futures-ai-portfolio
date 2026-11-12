# Guia de avaliação para recrutamento — BusinessMind AI

**Candidatura:** Softplan Futures · **prazo de referência:** 13/11/2026.

## Comece aqui

1. [Repositório público — branch principal](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio).
2. [Demonstração pública sem cadastro, com dados fictícios](https://businessmind-ai-demo.guisoster060.workers.dev). É uma simulação local; não utiliza Supabase nem Gemini.
3. [Capturas de tela do MVP](../screenshots/README.md): quatro áreas, navegação mobile e indicadores.
4. [README técnico](../README.md), [código](../app), [testes](../tests), [roteiro de avaliação](REVIEW_GUIDE.md).
5. [Histórico de prompts](../../../docs/businessmind-ai/PROMPT_LOG.md), [histórico ChatGPT](../../../docs/businessmind-ai/CHATGPT_PROMPT_HISTORY.md), [índice técnico](PROMPT_LOG.md) e [complemento 12/11](PROMPT_LOG_2026-11-12.md).

## Roteiro de avaliação (5 minutos)

- Abrir a demo pública, navegar por **Visão geral**, **Indicadores**, **Inteligência** e **Configurações**.
- Registrar uma receita/despesa fictícia; observar a atualização de indicadores.
- Consultar o Hermes **determinístico** e conferir a base da resposta.
- Examinar exportação CSV, experiência mobile, documentação, código e testes.

## Evidência adicional de integração real

No **staging privado/controlado**, Supabase Auth + PostgreSQL + RLS e Hermes Edge Function foram exercitados. Em 12/11/2026 uma consulta controlada ao Gemini foi confirmada por logs de aceitação do provedor e resposta na interface: [relatório](HERMES_GEMINI_VALIDATION_2026-11-12.md). **Essa integração não é parte da demo pública sem cadastro.** A autorização de uso único foi consumida; não solicitar novas chamadas de Gemini ao recrutador.

## O que está demonstrado e o que não está

| Capacidade | Evidência/estado |
| --- | --- |
| Quatro telas e navegação | Demo pública e seis capturas existentes |
| Indicadores e dados fictícios | Demo pública, testes locais/CI conforme relatório |
| Supabase Auth/Postgres/RLS | Staging controlado; não confundir com demo pública |
| Hermes determinístico | Demo pública e staging |
| Gemini generativo | **Uma** consulta controlada aceita no staging, sem acesso irrestrito |
| Testes automatizados | Há suíte e workflows; branch de melhorias ainda apresenta falhas em CI |
| Pesquisa de mercado | Exploratória, sem alegar validação de produto por clientes |

## Checklist antes de enviar a candidatura

- [ ] Abrir o link da demo pública em janela anônima e no celular.
- [ ] Executar fluxo de cadastro fictício, atualização de KPI, CSV e Hermes na demo.
- [ ] Conferir screenshots e links do README principal.
- [ ] Revisar/confirmar a execução da CI na versão final, sem ocultar falhas.
- [ ] Sincronizar este guia e a atualização de prompts com `main` **somente após revisão/decisão de integração**, sem alterar a produção.
- [ ] Enviar ao recrutador o link da **main**, não o link temporário do staging.

## Segurança e autoria

Nenhuma credencial é publicada. Projeto desenvolvido com assistência de IA (ChatGPT, Claude e outras ferramentas quando documentadas), com decisões e validações humanas; registros reconstruídos são marcados como tal. Não usar dados reais de clientes para avaliação.
