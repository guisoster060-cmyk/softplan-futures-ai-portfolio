import { createClient } from 'npm:@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
});

type Transaction = { type: 'income' | 'expense'; category: string; amount: number | string; occurred_on: string };

function aggregate(rows: Transaction[]) {
  let income = 0;
  let expense = 0;
  const categories: Record<string, number> = {};
  for (const row of rows) {
    const amount = Number(row.amount);
    if (!Number.isFinite(amount)) continue;
    if (row.type === 'income') income += amount;
    else expense += amount;
    categories[`${row.type}:${row.category}`] = (categories[`${row.type}:${row.category}`] ?? 0) + amount;
  }
  return { income, expense, profit: income - expense, transactionCount: rows.length, categories };
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization) return json({ error: 'Autenticação obrigatória.' }, 401);

  let input: { question?: string; companyId?: string };
  try { input = await request.json(); }
  catch { return json({ error: 'JSON inválido.' }, 400); }
  const question = String(input.question ?? '').trim();
  const companyId = String(input.companyId ?? '').trim();
  if (!question || question.length > 500 || !companyId) return json({ error: 'Pergunta ou empresa inválida.' }, 400);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !publicKey) return json({ error: 'Função não configurada.' }, 503);
  const client = createClient(supabaseUrl, publicKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false } });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Sessão inválida.' }, 401);

  // A consulta usa o JWT do usuário. O RLS continua sendo a autoridade de acesso.
  const { data, error } = await client.from('transactions')
    .select('type,category,amount,occurred_on')
    .eq('company_id', companyId)
    .order('occurred_on', { ascending: false })
    .limit(5000);
  if (error) return json({ error: 'Não foi possível consultar os dados autorizados.' }, 403);
  const summary = aggregate((data ?? []) as Transaction[]);

  const apiUrl = Deno.env.get('HERMES_API_URL');
  const apiKey = Deno.env.get('HERMES_API_KEY');
  const model = Deno.env.get('HERMES_MODEL');
  if (!apiUrl || !apiKey || !model) {
    return json({ mode: 'deterministic', summary, message: 'IA generativa não configurada; os agregados reais foram calculados com segurança.' });
  }

  const prompt = [
    'Você é Hermes, assistente de inteligência empresarial.',
    'Responda em português brasileiro, sem inventar dados e explicando limitações.',
    `Pergunta: ${question}`,
    `Agregados autorizados: ${JSON.stringify(summary)}`
  ].join('\n');
  const providerResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.2 })
  });
  if (!providerResponse.ok) return json({ error: 'O provedor de IA não respondeu corretamente.' }, 502);
  const providerBody = await providerResponse.json();
  const answer = providerBody?.choices?.[0]?.message?.content;
  if (typeof answer !== 'string' || !answer.trim()) return json({ error: 'Resposta inválida do provedor de IA.' }, 502);
  return json({ mode: 'generative', answer: answer.trim(), summary });
});
