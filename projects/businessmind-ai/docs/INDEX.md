# Índice de documentação — BusinessMind AI

**Comece aqui:** [Apresentação para recrutadores](../../../README.md) · [Demonstração sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev)

## Para recrutadores

1. [Resumo e roteiro de 2 minutos](../../../README.md#como-avaliar-em-2-minutos)
2. [Capturas das quatro telas](../../../README.md#interface)
3. [Funcionalidades, ambientes e limitações](../../../README.md#ambientes-e-limites)
4. [Documentação técnica](../README.md)

Os documentos experimentais mais extensos de apresentação e impacto estão na [branch de validação](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/tree/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs). Não são necessários para a avaliação inicial e não devem ser confundidos com a versão da `main`.

## Para avaliadores técnicos

- [Arquitetura](ARCHITECTURE.md)
- [Requisitos](REQUIREMENTS.md)
- [Testes e limitações](TESTING.md)
- [Validação manual no Android — 13/11/2026](MANUAL_VALIDATION_2026-11-13.md)
- [Decisões técnicas](TECHNICAL_DECISIONS.md)
- [Método de desenvolvimento com IA](AI_DEVELOPMENT_METHOD.md)
- [Estado técnico](PROJECT_STATUS.md)

## Organização do código

- `app/`: interface e lógica de frontend
- `preview/`: adaptação para demonstração fictícia
- `scripts/`: builds e verificações
- `tests/`: testes automatizados
- `supabase/`: banco, políticas e funções
- `screenshots/`: capturas visuais
- `docs/`: decisões, relatórios e histórico

## Estado da publicação

**Publicação confirmada em 13/11/2026:** GitHub Actions #3 aprovado e Cloudflare Workers atualizado às 23:25 UTC com 100% do tráfego na nova versão. O PR #33 removeu o emoji da saudação. A demo usa dados fictícios locais e Hermes determinístico. A prévia Gemini permanece isolada; o deploy não comprova validação generativa geral, RLS remoto ou compatibilidade com todos os navegadores.
