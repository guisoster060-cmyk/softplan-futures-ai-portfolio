# BusinessMind AI v0.5 Visual

## Direção visual

A v0.5 evolui a interface para um dashboard SaaS premium sem alterar a arquitetura funcional da v0.4. A identidade permanece navy, azul, roxo e ciano, com superfícies profundas, contraste controlado e detalhes luminosos discretos.

## Design system

Os tokens ficam em `app/style.css` e cobrem:

- paleta semântica e estados positivos, negativos e de atenção;
- tipografia Manrope e Inter, com fallback para fontes locais do sistema;
- escala de espaçamento;
- raios de borda;
- sombras e elevação;
- duração e curva de movimento;
- largura da sidebar e breakpoints responsivos.

## Componentes modernizados

- Login e onboarding com ambientação visual e hierarquia mais clara.
- Sidebar, navegação ativa e identidade do workspace.
- Cabeçalhos, botões, campos, tabs, modais, toast e loading overlay.
- Cards de KPI com ícones Lucide SVG inline.
- Gráfico mensal SVG com pontos focáveis, descrições e tooltip nativo.
- Tabela responsiva de movimentações e gráfico por categoria.
- Chat Hermes, análises, configurações e estados vazios.

## Acessibilidade

- Link “Pular para o conteúdo”.
- Foco visível de alto contraste.
- Botões de ícone com nomes acessíveis.
- Retorno de foco após fechar modais.
- Pontos do gráfico acessíveis por teclado.
- `prefers-reduced-motion` e preferência interna para reduzir movimento.
- Textos-base ampliados em relação à v0.4.

## Decisão sobre Apache ECharts

O Apache ECharts foi avaliado e não foi adicionado nesta versão. Os gráficos atuais são dois casos simples — série temporal com duas linhas e composição por categoria — já atendidos pelo SVG e `conic-gradient` existentes. Adicionar ECharts aumentaria substancialmente o JavaScript carregado, a superfície de manutenção e a dependência externa sem benefício proporcional para o MVP.

A decisão pode ser revista quando houver zoom, séries numerosas, drill-down, múltiplos eixos ou visualizações que justifiquem uma biblioteca especializada.

## Integridade dos dados

A camada visual não cria seeds nem números estáticos. KPIs, gráficos, alertas e análises continuam derivados exclusivamente das movimentações retornadas pelo Supabase para a empresa autenticada.
