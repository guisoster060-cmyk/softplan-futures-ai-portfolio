# BusinessMind AI — v0.3 (demonstração funcional)

Demonstração funcional de uma plataforma de BI para pequenos negócios, feita para portfólio.
**HTML, CSS e JavaScript puros** — sem dependências, sem servidor, sem custo.

> **Não é um produto pronto.** Não há backend, banco de dados remoto, autenticação real nem IA externa.
> Tudo roda no navegador, com **dados 100% fictícios**.

## Como executar
1. Extraia o ZIP e abra `app/index.html` no navegador (duplo toque no celular ou duplo clique no computador).
2. Mantenha os arquivos da pasta `app/` juntos (`index.html`, `style.css`, `app.js` e `assets/logo.svg`).
3. Entre com as credenciais de demonstração:
   - **E-mail:** `demo@businessmind.ai`
   - **Senha:** `demo1234`

## Estrutura
```
businessmind-ai-v0.3/
├── README.md
└── app/
    ├── index.html      login + 4 telas (Visão geral, Indicadores, Inteligência, Configurações)
    ├── style.css       identidade visual do v0.2 + componentes novos (final do arquivo)
    ├── app.js          toda a lógica (dados, cálculos, telas, assistente, CSV)
    └── assets/logo.svg logo do BusinessMind AI
```

## O que está implementado
- **Login demonstrativo:** e-mail e senha, mostrar/ocultar senha, "Manter conectado", botão Sair.
- **Visão geral:** receitas, despesas, lucro e margem do mês (comparados ao mês anterior), resumo, gráfico dos últimos 6 meses, leitura dos dados, ponto de atenção e alertas — tudo calculado das movimentações.
- **Indicadores:** cadastro, edição e exclusão de movimentações; filtros por período e tipo; indicadores e gráfico por categoria atualizados automaticamente; exportação CSV (respeita os filtros).
- **Inteligência:** assistente por **regras locais** (lucro, receitas, despesas, margem, maiores valores, categorias, tendência, previsão simples, recomendações) e aba de análises rotuladas como Fato, Estimativa, Risco ou Recomendação, com a base de cada uma. Informa claramente quando faltam dados.
- **Configurações:** perfil (nome e empresa), preferências de interface (modo compacto, reduzir animações, mostrar alertas) e gerenciamento dos dados locais (restaurar demonstração, apagar tudo).
- **Persistência** em `localStorage`; **responsivo** (no celular o menu ☰ abre uma gaveta de navegação).

## Mudanças em relação ao protótipo v0.2 (e por quê)
O v0.2 era só visual, com números fixos. Para não exibir valores que não vêm dos dados, foram **removidos** os blocos que não podem ser calculados com receitas e despesas: CAC, LTV, funil de vendas, score do negócio, previsões/riscos fictícios, plano Pro/cobrança, integrações e usuários simulados. Foram preservados o visual, as quatro telas e a navegação.
O `@import` do Google Fonts foi removido (sem requisições externas); as fontes caem para Arial.

## Limitações conhecidas
- **Login não é segurança:** a credencial está visível no código-fonte. Serve apenas para demonstrar o fluxo.
- Dados no navegador, sem criptografia e sem backup; limpar os dados do navegador apaga tudo.
- Cada navegador/aparelho tem seus próprios dados (sem sincronização).
- O assistente usa regras fixas (palavras-chave), não entende linguagem livre.
- Previsão é uma projeção linear simples, sem sazonalidade.
- O CSS herdado do v0.2 ainda contém regras de componentes removidos (limpeza pendente).
- Textos pequenos do v0.2 foram ampliados apenas no celular (`zoom`), solução provisória.

## Testes realizados (ambiente de desenvolvimento)
57 verificações automatizadas em Chromium headless (viewports de 1280 px e 390 px), todas aprovadas: login válido/inválido, sessão, CRUD, validações, filtros, KPIs conferidos contra o `localStorage`, persistência, CSV, proteção contra HTML/fórmulas em dados, assistente, estados sem dados, dados corrompidos, menu mobile e ausência de erros de JavaScript.
**Não testado:** Safari/iOS, Firefox, dispositivos reais, leitores de tela, desempenho com muitos dados.

## Próximos passos sugeridos
Nova identidade visual e tela de login, autenticação real, banco de dados, IA real com tratamento de privacidade (LGPD), testes automatizados no repositório, importação de planilhas.
