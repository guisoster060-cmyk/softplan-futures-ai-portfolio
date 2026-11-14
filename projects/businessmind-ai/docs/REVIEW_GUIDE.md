# Roteiro de avaliação — BusinessMind AI

## Acesso recomendado — atualização de 13/11/2026

| Ambiente | Link | O que é possível avaliar |
| --- | --- | --- |
| Demo pública | [Abrir sem cadastro](https://businessmind-ai-demo.guisoster060.workers.dev) | Quatro telas, CRUD fictício local, indicadores e Hermes determinístico |
| Staging Supabase | [Criar conta e entrar](https://businessmind-ai-staging.pages.dev) | Cadastro, confirmação de e-mail, criação de empresa e movimentações persistidas sob RLS |
| Prévia Gemini experimental | [Testar IA com conta](https://fix-hermes-safe-diagnostics.businessmind-ai.pages.dev) | Interpretação generativa separada dos cálculos, com quota e fallback determinístico |

## Roteiro rápido — aproximadamente 3 minutos

1. Abra a demo pública e percorra **Visão geral**, **Indicadores**, **Inteligência** e **Configurações**. Adicione uma movimentação fictícia e observe os indicadores.
2. Abra o staging e, se quiser avaliar autenticação, crie uma conta própria, confirme o e-mail e crie uma empresa fictícia. O processo de confirmação pode exigir tempo adicional.
3. Na prévia Gemini, entre com conta de teste e empresa fictícia com ao menos uma movimentação; pergunte **“Analise minhas receitas e despesas e sugira duas melhorias para a empresa.”** A seção **Interpretação generativa** indica o modo generativo. Caso a interface indique modo determinístico, o Gemini não foi usado naquela resposta.
4. Para avaliar engenharia, consulte [arquitetura](ARCHITECTURE.md), [testes](TESTING.md), [decisões](TECHNICAL_DECISIONS.md) e [método assistido por IA](AI_DEVELOPMENT_METHOD.md).

## Evidências e limites

- Em 11/11/2026, cadastro com confirmação, login, empresa e movimentações foram testados manualmente no staging. Em 13/11, o responsável relatou novo cadastro bem-sucedido. O serviço de e-mail pode limitar novas confirmações.
- Em 13/11, às **21h07 (Brasília)**, a prévia com conta de teste retornou modo determinístico após rejeição da resposta generativa. Após correção da função `hermes-recruiter` para v3, às **21h12**, houve interpretação generativa exibida no navegador; logs registraram autorização e resposta do provedor aceitas. São testes pontuais, não prova de disponibilidade geral.
- A prévia aplica até **três tentativas por usuário por dia**, intervalo mínimo de **sessenta segundos** e **vinte tentativas globais por dia**. Uma tentativa pode consumir quota mesmo se a resposta generativa for rejeitada.
- A demo pública usa dados locais e **não** comprova Auth, PostgreSQL, RLS ou Gemini. Os testes automatizados com mocks também não comprovam execução remota.
- Em testes SQL controlados anteriores, as policies RLS isolaram movimentações entre empresas, conforme [registro técnico de testes](TESTING.md). Não houve auditoria de segurança independente, teste de carga ou matriz completa Firefox/Safari.
- Use somente dados fictícios. Não compartilhe senhas nem dados de clientes.

## Documentação técnica e histórico

[README técnico](../README.md) · [Índice](INDEX.md) · [Relatório manual Android](MANUAL_VALIDATION_2026-11-13.md) · [Status](PROJECT_STATUS.md) · [Diário de engenharia](ENGINEERING_LOG.md)

As descrições anteriores de demo ainda não publicada e Gemini inteiramente bloqueado se referem a estados históricos anteriores à publicação da demo e à prévia experimental. O staging principal continua determinístico; a função generativa está separada.
