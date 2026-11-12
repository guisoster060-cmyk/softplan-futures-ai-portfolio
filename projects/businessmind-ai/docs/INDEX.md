# Índice de documentação — BusinessMind AI

**Comece aqui:** [README principal](../../../README.md) · [Demo pública sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev)

## Para recrutadores (leitura em ordem)
1. [Guia rápido — 2 minutos](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/START_HERE_RECRUITER.md)
2. [Galeria de telas](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/RECRUITER_GALLERY.md)
3. [Resumo executivo](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/RECRUITER_ONE_PAGE.md)
4. [Plano de validação do impacto de negócio](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/blob/fix/hermes-safe-diagnostics-20261112/projects/businessmind-ai/docs/BUSINESS_IMPACT_VALIDATION.md)

## Para avaliadores técnicos
- [Arquitetura](ARCHITECTURE.md)
- [Requisitos](REQUIREMENTS.md)
- [Testes](TESTING.md)
- [Decisões técnicas](TECHNICAL_DECISIONS.md)
- [Método de desenvolvimento com IA](AI_DEVELOPMENT_METHOD.md)

## Organização do código
- `app/`: interface, regras e componentes de frontend
- `preview/`: adaptação para demonstração fictícia e prévia
- `scripts/`: builds e verificações
- `tests/`: testes automatizados
- `supabase/`: banco, políticas e funções
- `screenshots/`: capturas visuais
- `docs/`: decisões, relatórios e histórico

**Importante:** a prévia com Gemini está em uma branch isolada. A demo sem cadastro usa Hermes determinístico. Não mover arquivos executáveis sem atualizar imports, builds e testes.

## Estado de publicação
A correção do Hermes para perguntas abertas está no código da branch `main`, mas **a implantação Cloudflare ainda não foi atualizada nem validada**. Este índice organiza o material sem alterar caminhos da aplicação.
