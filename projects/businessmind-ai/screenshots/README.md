# Capturas reais — BusinessMind AI

Capturas do **modo de demonstração fictícia/local**. **Não representam o staging com banco remoto**, nem comprovam autenticação real, isolamento RLS ou IA generativa.

## Galeria

| Tela | Evidência |
| --- | --- |
| Visão geral | [01-visao-geral.png](01-visao-geral.png) — cartões de receitas, despesas, lucro e margem |
| Indicadores | [02-indicadores.png](02-indicadores.png) — filtros, lançamentos e valores por período |
| Inteligência | [03-inteligencia.png](03-inteligencia.png) — Hermes determinístico e perguntas sugeridas |
| Configurações | [04-configuracoes.png](04-configuracoes.png) — perfil de demonstração |
| Navegação mobile | [05-navegacao-mobile.png](05-navegacao-mobile.png) — menu responsivo |
| Indicadores em detalhe | [06-indicadores-detalhe.png](06-indicadores-detalhe.png) — indicadores financeiros no celular |

As imagens **01, 02, 04 e 05** vieram dos quatro JPGs enviados pelo responsável, capturados em celular Android. Foram convertidos para PNG sem cortes; os pixels decodificados foram comparados e permaneceram idênticos. Como o ZIP com seis PNGs não pôde ser anexado, **03 e 06** foram capturadas diretamente da [demonstração pública](https://businessmind-ai-demo.guisoster060.workers.dev) em Chromium mobile (591 × 1280), sem edição de números. Para aproximar o estado das capturas recebidas, a sessão de navegador usada em 06 criou uma receita **fictícia** de R$ 100 pelo formulário normal; 03 mostra a resposta determinística do Hermes a esse conjunto de seis movimentações. São fontes distintas, não uma única sessão de captura.

A imagem 04 registra uma redação antiga da tela de Configurações que menciona Supabase mesmo no modo local. O build da demonstração foi corrigido nesta revisão para distinguir armazenamento local de Supabase, mas o site público e a captura permanecem históricos até um deploy separado e autorizado. A imagem não foi alterada para ocultar essa limitação.

## Critérios de publicação

- Usar exclusivamente as capturas reais fornecidas pelo autor; não criar telas artificiais.
- Preservar avisos importantes sobre dados fictícios e limitações da demonstração.
- Não incluir credenciais, tokens, e-mails pessoais ou dados financeiros reais.
- Verificar a exibição das seis imagens no GitHub e em viewport mobile.
- Os READMEs exibem as quatro telas principais; navegação mobile e detalhe financeiro permanecem nesta galeria complementar.
- Vídeo de 2–3 minutos é opcional, salvo exigência expressa na etapa de seleção.

## Transparência

O Hermes exibido nesta demonstração utiliza regras determinísticas e dados fictícios locais. A integração generativa está planejada, mas não está ativa.
