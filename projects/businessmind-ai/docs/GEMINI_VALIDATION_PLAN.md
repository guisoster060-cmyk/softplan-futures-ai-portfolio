# Plano de validação futura do Gemini — não executar nesta entrega

Este documento é uma **especificação técnica derivada**, não um prompt literal nem uma aprovação para ativar IA externa. Em 11/11/2026, Hermes v11 no staging permanece determinístico: `STAGING_DETERMINISTIC_ONLY=true` retorna antes da RPC de uso único e do fetch ao Gemini. O frontend mantém `hermesGenerativeEnabled=false`. Nenhuma chave privada deve ir ao navegador.

## Pré-condições e decisão humana

1. Responsável aprova por escrito a finalidade, os dados a compartilhar, o provedor, os termos de tratamento e o teto de custo. Dados financeiros reais de clientes não entram no teste.
2. Conferir no momento da execução a disponibilidade do modelo, Free Tier, limites e preços nas fontes oficiais do Google; não presumir que a configuração atual seja gratuita ou esteja disponível.
3. Usar somente Supabase staging, uma empresa fictícia identificada e agregados fictícios verificados. Confirmar JWT do proprietário, associação sob RLS e isolamento de outra empresa. Não publicar senhas, tokens ou respostas financeiras.
4. Estabelecer consentimento explícito e revogável por empresa. A allowlist manual e o gate global são controles técnicos, mas não constituem sozinhos um registro auditável de consentimento.
5. Revisar o diff do servidor, a trava atômica de uso único e o estado da autorização antes de qualquer deploy ou desbloqueio. Nenhum merge de código deve habilitar o modo generativo por si só.

## Ensaio controlado, somente após autorização específica

- Validar localmente JWT ausente/inválido, empresa alheia, RLS, escopo da pergunta, paginação incompleta, ausência de consentimento, concorrência, erro, quota, timeout e fallback. Distinguir mocks de testes transacionais PostgreSQL e remotos.
- Confirmar que a trava persistente consome **uma tentativa antes** da chamada ao provedor, inclusive se ocorrer erro ou timeout; impedir segunda tentativa ou rearmamento por usuário comum.
- Inspecionar o payload para excluir perguntas livres, descrições de transações, categorias identificáveis, e-mails e IDs pessoais. Usar apenas intenção derivada e agregados necessários.
- Limitar a uma tentativa autorizada, com janela e teto de gasto aprovados. Verificar CORS, tempo máximo, tamanho de entrada/saída e logs sanitizados. Não tratar sucesso HTTP como prova de precisão da recomendação.
- Registrar somente ambiente, versão, data, status, modo e resultado sanitizado. Revisar a resposta humana e comparar todo número com cálculos determinísticos.

## Interrupção e rollback

Se qualquer pré-condição ou verificação falhar, manter o frontend e o servidor bloqueados. Após o ensaio, revogar imediatamente os gates de compartilhamento/allowlist, confirmar que o frontend continua desativado e verificar que a autorização de uso único não pode ser reutilizada. Não restaurar uma autorização consumida como forma de rollback. Se houver publicação acidental, suspender o caminho generativo e revisar logs sem copiar dados sensíveis.

Este plano não configura secrets, não aplica migrations, não publica função e não realiza chamadas à API.
