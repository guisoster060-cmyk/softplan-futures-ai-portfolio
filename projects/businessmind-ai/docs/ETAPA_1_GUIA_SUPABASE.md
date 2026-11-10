# Etapa 1 — Configurar o Supabase e validar o banco (pelo celular)

Status: **guia escrito, ainda não executado.** Os nomes de botões do Supabase podem variar um pouco; se algo não bater, envie um print.

## Regras de ouro (custo e segurança)
- Use sempre o plano **Free**. Se o Supabase pedir **cartão de crédito**, pare e me avise.
- Nunca clique em "Upgrade", "Pro" ou "Spend cap".
- A **senha do banco** e as chaves `service_role` / `secret` são só suas: não envie para mim, não cole em chats, não suba para o GitHub.
- A chave **anon / publishable** é pública por desenho (será usada no frontend na etapa seguinte). Ainda não precisa dela agora.

## Parte A — Criar o projeto (≈10 min)
1. No **Chrome** do celular, abra `supabase.com`. Toque no menu ⋮ do Chrome e marque **"Site para computador"** (o painel funciona melhor assim).
2. **Sign up** (pode entrar com sua conta do GitHub).
3. Crie uma **organização** (nome livre, ex.: `Guilherme Portfolio`), tipo **Personal**, plano **Free**.
4. **New project**:
   - Nome: `businessmind-ai`
   - Database password: use **Generate a password**, copie e **guarde no gerenciador de senhas** do Samsung (Samsung Pass / Google). Você não conseguirá ver de novo.
   - Região: **South America (São Paulo)**.
   - Se aparecerem opções sobre "Data API" ou "automatic RLS", deixe o padrão ligado.
5. Aguarde 1 a 2 minutos até o projeto ficar pronto.

## Parte B — Criar as tabelas e regras (≈10 min)
1. Menu lateral > **SQL Editor** > **New query**.
2. Abra o arquivo `supabase/migrations/0001_initial_schema.sql`, **selecione tudo, copie** e **cole** no editor.
3. Toque em **Run**. Resultado esperado: `Success. No rows returned`.
4. Se aparecer erro: **copie a mensagem inteira** e me envie. Não rode de novo sem falar comigo (a migração é feita para rodar uma vez).

## Parte C — Rodar o teste de isolamento (≈5 min)
1. **SQL Editor > New query**.
2. Cole o conteúdo de `supabase/tests/isolation_test.sql` e toque em **Run**.
3. **O resultado aparece como um erro de propósito.** Ele contém o relatório: linhas `OK` e `FALHOU` e, no fim, `Total / OK / FALHAS`.
4. Tire um **print** do relatório inteiro (ou copie o texto) e me envie. Esse teste não deixa dados gravados.

## Parte D — Conferência visual (≈5 min)
1. **Table Editor**: devem existir `profiles`, `companies`, `company_members`, `transactions`, cada uma com indicação de **RLS ativado**. Print.
2. **Advisors > Security** (nome pode variar): print da lista de avisos, se houver.

## O que me enviar ao final
1. Resultado da Parte B (sucesso ou erro).
2. Relatório da Parte C.
3. Prints da Parte D.

Sem esses três itens eu **não** considero o banco validado, e não começamos o login.

## Se não conseguir copiar o SQL do arquivo
Avise: eu envio o SQL no chat em blocos curtos, com botão de copiar.

## Limites do plano Free a lembrar
- Projeto **pausa após 1 semana sem atividade** (reativa-se pelo painel). Abra o projeto alguns dias antes de uma demonstração.
- Sem backups automáticos; 500 MB de banco.
- E-mails de cadastro e recuperação **ainda não funcionam para terceiros** (decisão HIP-01 pendente; resolvemos antes do login).
