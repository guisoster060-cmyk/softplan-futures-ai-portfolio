# Capturas do MVP real — 12/11/2026

## Evidência recebida do usuário

Cinco capturas Android fornecidas pelo responsável às 19h49 BRT, referentes à prévia autenticada `fix-hermes-safe-diagnostics.businessmind-ai.pages.dev`:

1. **Visão geral:** receitas do mês R$ 500, despesas R$ 50, lucro R$ 450; cards responsivos.
2. **Menu mobile:** quatro entradas (Visão geral, Indicadores, Inteligência, Configurações) e conta conectada.
3. **Indicadores:** quatro movimentações exibidas no período de seis meses; receita R$ 1.300 no período, despesas R$ 50; botão de nova movimentação e exportação CSV.
4. **Inteligência:** sugestões de perguntas, duas abas, área de conversa Hermes.
5. **Configurações:** perfil, preferências, dados e campos do usuário/empresa.

**Importante:** valores mensais e do período de seis meses não devem ser comparados como se fossem o mesmo intervalo. As capturas de menu e configurações continham e-mail de uma conta de teste; qualquer publicação precisa ocultar o e-mail. Os JPGs originais foram entregues na conversa, mas não foram incorporados ao GitHub por esta integração, que aceita apenas escrita de arquivos UTF-8. Um ZIP com cinco PNGs recortados e com identificação ocultada foi entregue ao responsável no chat para upload posterior. Não afirmar que os PNGs estão no repositório.

## Evidência complementar

- Captura anterior do Hermes com **interpretação generativa** na conta recém-criada, separada do cálculo financeiro; logs do Supabase com `claim=accepted` e `provider=accepted` às 22:45 UTC.
- CI aprovada: [execução #43322922898](https://github.com/guisoster060-cmyk/softplan-futures-ai-portfolio/actions/runs/43322922898).
- Evidências de isolamento: usuário informou que a conta nova não mostrava movimentações da conta anterior. Trata-se de teste funcional, não de auditoria formal.

## Próximas verificações antes de enviar à Softplan

- [ ] Incorporar as capturas tratadas ao repositório e trocar a galeria de imagens antigas, mantendo indicação de origem.
- [x] Cadastro por e-mail, confirmação, login e criação de empresa confirmados pelo usuário com conta nova em 12/11/2026.
- [ ] Verificar CSV, edição/exclusão de movimentações e logout.
- [x] Fallback determinístico observado com 4 movimentações; mínimo reduzido de 5 para 1, e resposta Gemini validada com logs de provedor aceito e quotas (2/20 no dia).
- [ ] Revisar critérios da vaga no anúncio oficial e confrontar requisitos com entregáveis.
- [ ] Garantir que o README do branch escolhido para entrega é o mesmo que o recrutador abrirá no GitHub.
