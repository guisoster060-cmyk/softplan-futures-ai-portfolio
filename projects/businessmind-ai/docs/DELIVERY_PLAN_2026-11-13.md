# Plano de entrega — BusinessMind AI (13/11/2026)

> Documento operacional. Não substitui os documentos canônicos e não constitui evidência de testes não executados.

## 1. Entrega mínima segura

- [x] PR #4 integrado em `new-branch` (merge `6c6c54902297536e99f812931e72ae1fb629e60f`).
- [x] Cloudflare Pages `businessmind-ai`: `new-branch` excluída dos previews automáticos; staging permanece em projeto separado.
- [x] Link de demonstração de staging documentado no README.
- [x] Funcionalidades principais descritas no README: Auth, onboarding, CRUD, indicadores, CSV e Hermes determinístico.
- [x] Evidências anteriores documentadas: 51 testes Node, 28 testes Deno com mocks, PostgreSQL concorrente, 33 verificações HTTP/JWT no staging e validação manual de fluxos.
- [ ] Reexecutar `npm ci && npm run verify` a partir do SHA consolidado de `new-branch` e guardar URL do workflow.
- [ ] Conferir novamente a URL pública de staging em navegador anônimo e em celular, sem publicar dados reais.
- [ ] Confirmar fluxo de cadastro/login com conta fictícia e configuração de confirmação de e-mail; se falhar, documentar conta de demonstração provisionada por canal seguro (nunca senha no Git).
- [ ] Conferir criação/edição/exclusão de movimentações, troca de empresa, atualização de KPIs, CSV e Hermes determinístico no staging.
- [ ] Verificar que `app/config.js` de produção não foi incluído em novo preview de `new-branch`.
- [ ] Criar release/tag e apontar README de entrada do repositório para demo, arquitetura, testes e limitações.
- [ ] Verificar branch padrão do repositório: integração em `new-branch` não significa visibilidade automática na `main`.

## 2. Critérios para declarar a entrega pronta

A entrega é demonstrável quando: (a) o link abre sem erro; (b) uma conta fictícia acessa dados isolados; (c) um CRUD completo atualiza indicadores; (d) CSV é exportado; (e) Hermes responde no modo determinístico; (f) README informa como reproduzir os testes e distingue evidências locais, remotas e mocks. Não declarar Gemini generativo funcional enquanto o bloqueio estiver ativo.

## 3. Refinamento posterior à garantia da entrega

### Design e experiência
- Revisar hierarquia visual, contraste, espaçamentos, estados de erro/vazio e navegação móvel; manter identidade visual aprovada.
- Rodar auditoria de acessibilidade com teclado, leitor de tela e redução de movimento.
- Medir layout em 360/390/768/1440 px e corrigir problemas comprovados antes de introduzir bibliotecas.

### Engenharia — reduzir sinais de “vibe coding”
- Separar gradualmente o `app.js` monolítico em módulos de estado, API, domínio e UI, com testes antes/depois.
- Eliminar duplicação, código morto, placeholders e inconsistências de nomenclatura somente após inventário.
- Adicionar testes E2E reproduzíveis na CI com ambiente mockado e checks estáticos; documentar o que NÃO é validado.
- Não reescrever a aplicação nem trocar o stack na véspera da entrega.

### Gemini — ativação futura condicionada
- Não alterar `STAGING_DETERMINISTIC_ONLY`, `hermesGenerativeEnabled` ou segredos nesta fase.
- Revisar termos de processamento/retensão de dados e aprovar uso de **dados inteiramente fictícios** para primeiro teste.
- Implementar consentimento auditável por empresa e revogação antes de enviar agregados reais a provedor externo.
- Testar remotamente JWT, isolamento, CORS, limite, timeout, quotas, resposta inválida, fallback e consumo; monitorar custo.
- Habilitar somente em staging após autorização específica, com chave exclusivamente no servidor e rollback definido.
- Produção permanece fora do escopo até autorização posterior.

## 4. Restrições operacionais

Não alterar Supabase de produção, Cloudflare de produção, secrets, deploys, `main` ou configuração de Gemini por consequência implícita deste plano. As alterações devem seguir branch de trabalho, PR, CI e revisão.
