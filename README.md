# Softplan Futures — BusinessMind AI

Portfólio de engenharia de software centrado no **BusinessMind AI**, um MVP de inteligência empresarial para pequenos negócios. A aplicação transforma receitas e despesas registradas pelo usuário em indicadores, visualizações e análises determinísticas, com autenticação e isolamento de dados pelo Supabase.

> Estado em 10/11/2026: a implementação v0.5 está disponível em branches e pull requests de revisão; ainda não foi incorporada à `main`.

## Funcionalidades implementadas

- cadastro, login, restauração de sessão, recuperação de senha e logout;
- criação inicial de empresa e associação do usuário;
- CRUD de receitas e despesas persistidas no PostgreSQL;
- controle de acesso por JWT, associação à empresa e Row Level Security;
- KPIs, evolução mensal, categorias, alertas e exportação CSV derivados dos dados carregados;
- Hermes determinístico, que separa fatos, estimativas, riscos e recomendações;
- dashboard responsivo com navegação por teclado e suporte a movimento reduzido;
- testes automatizados e integração contínua sem credenciais privadas.

## Tecnologias

HTML semântico, CSS, JavaScript ES modules, SVG, Supabase JS, Supabase Auth, PostgreSQL, RLS, Node.js Test Runner, GitHub Actions e Cloudflare Pages para previews.

Não foram introduzidos React, Vite ou serviço pago. A integração generativa do Hermes possui apenas um scaffold de Edge Function; não está implantada e não expõe chave privada no frontend.

## Arquitetura resumida

O navegador serve a aplicação estática e usa a publishable key para autenticar no Supabase. O JWT da sessão acompanha as consultas; policies RLS limitam o acesso à empresa associada. Indicadores e gráficos são calculados no cliente somente depois da leitura autorizada das movimentações. Consulte a [arquitetura completa](projects/businessmind-ai/docs/ARCHITECTURE.md).

## Demonstração

- [Preview da branch v0.5](https://codex-businessmind-v0-5-visu.businessmind-ai.pages.dev)
- [Preview imutável da v0.5](https://1cd5c052.businessmind-ai.pages.dev)

Os endereços são ambientes de revisão com `noindex`, não uma produção aprovada. Fluxos autenticados exigem uma conta de teste e a disponibilidade do projeto Supabase.

## Executar e verificar

```bash
cd projects/businessmind-ai
npm ci
python3 -m http.server 8080 --directory app
```

Acesse `http://localhost:8080`. Para executar as verificações que não usam credenciais privadas:

```bash
npm run verify
```

## Documentação

| Documento | Finalidade |
| --- | --- |
| [README do projeto](projects/businessmind-ai/README.md) | Execução, estrutura e limitações |
| [Requisitos](projects/businessmind-ai/docs/REQUIREMENTS.md) | Requisitos, prioridades e aceite |
| [Arquitetura](projects/businessmind-ai/docs/ARCHITECTURE.md) | Componentes, fluxos, dados e segurança |
| [Decisões técnicas](projects/businessmind-ai/docs/TECHNICAL_DECISIONS.md) | Decisões e trade-offs |
| [Diário de engenharia](projects/businessmind-ai/docs/ENGINEERING_LOG.md) | Entregas, evidências e responsabilidades |
| [Testes](projects/businessmind-ai/docs/TESTING.md) | Estratégia, resultados e limitações |
| [Método de desenvolvimento com IA](projects/businessmind-ai/docs/AI_DEVELOPMENT_METHOD.md) | Processo e divisão real de responsabilidades |
| [Estado atual](projects/businessmind-ai/docs/PROJECT_STATUS.md) | Concluído, pendências e riscos |
| [Índice de tarefas delegadas](projects/businessmind-ai/docs/PROMPT_LOG.md) | Especificações técnicas derivadas, não prompts literais |
| [Acervo histórico](docs/businessmind-ai/README.md) | Planejamento, validação e registros preservados |

## Autoria e transparência

Guilherme Soster Santeti responde pela concepção, direcionamento, decisões de produto, ambiente externo e validação humana. Ferramentas de IA apoiaram análise, implementação, testes e redação técnica. Todo resultado permanece sujeito a revisão humana; a documentação não atribui experiência profissional ou testes sem evidência.

[Perfil no GitHub](https://github.com/guisoster060-cmyk)
