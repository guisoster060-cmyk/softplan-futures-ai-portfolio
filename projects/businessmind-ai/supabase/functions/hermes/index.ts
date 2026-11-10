import { createClient } from 'npm:@supabase/supabase-js@2.84.0';
import { aggregateTransactions, buildGeminiRequest, extractGeminiText, LIMITS, validateQuestion } from './core.mjs';

type Transaction = { type: 'income' | 'expense'; category: string; amount: number | string; occurred_on: string };
type RateEntry = { startedAt: number; count: number };
const rateByUser = new Map<string, RateEntry>();

function corsHeaders(request: Request) {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map(value => value.trim()).filter(Boolean);
  const headers: Record<string, string> = { 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
  if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return { headers, originAllowed: !origin || allowed.includes(origin) };
}
function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(request).headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function isRateLimited(userId: string, now = Date.now()) {
  const current = rateByUser.get(userId);
  if (!current || now - current.startedAt >= 60_000) { rateByUser.set(userId, { startedAt: now, count: 1 }); return false; }
  current.count += 1;
  return current.count > LIMITS.requestsPerMinute;
}

Deno.serve(async request => {
  const cors = corsHeaders(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: cors.originAllowed ? 204 : 403, headers: cors.headers });
  if (!cors.originAllowed) return json(request, { error: 'Origem não autorizada.' }, 403);
  if (request.method !== 'POST') return json(request, { error: 'Método não permitido.' }, 405);
  const authorization = request.headers.get('Authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return json(request, { error: 'Autenticação obrigatória.' }, 401);

  let input: { question?: unknown; companyId?: unknown };
  try { input = await request.json(); } catch { return json(request, { error: 'JSON inválido.' }, 400); }
  const validation = validateQuestion(input.question);
  if (validation.error) return json(request, { error: validation.error }, 400);
  const requestedCompanyId = typeof input.companyId === 'string' ? input.companyId.trim() : '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestedCompanyId)) return json(request, { error: 'Empresa inválida.' }, 400);

  const supabaseUrl = Deno.env.get('SUPABASE_URL'), publicKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !publicKey) return json(request, { error: 'Função não configurada.' }, 503);
  const client = createClient(supabaseUrl, publicKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return json(request, { error: 'Sessão inválida.' }, 401);
  if (isRateLimited(userData.user.id)) return json(request, { error: 'Limite temporário atingido. Tente novamente em um minuto.' }, 429);

  // O ID enviado é apenas uma solicitação; a associação retornada sob RLS é a autoridade.
  const { data: membership, error: membershipError } = await client.from('company_members').select('company_id')
    .eq('user_id', userData.user.id).eq('company_id', requestedCompanyId).maybeSingle();
  if (membershipError || !membership?.company_id) return json(request, { error: 'Empresa não autorizada.' }, 403);
  const { data, error } = await client.from('transactions').select('type,category,amount,occurred_on')
    .eq('company_id', membership.company_id).order('occurred_on', { ascending: false }).limit(LIMITS.transactionRows);
  if (error) return json(request, { error: 'Não foi possível consultar os dados autorizados.' }, 403);
  const summary = aggregateTransactions((data ?? []) as Transaction[]);

  const approved = Deno.env.get('HERMES_DATA_SHARING_APPROVED') === 'true';
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.5-flash-lite';
  if (!approved || !apiKey) return json(request, { mode: 'deterministic', summary, message: 'IA generativa não habilitada; usei somente os cálculos determinísticos locais.' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LIMITS.providerTimeoutMs);
  try {
    const providerResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildGeminiRequest(validation.question, summary)), signal: controller.signal
    });
    if (!providerResponse.ok) return json(request, { mode: 'deterministic', summary, message: 'Gemini indisponível; usei o fallback determinístico.' });
    const answer = extractGeminiText(await providerResponse.json());
    if (!answer) return json(request, { mode: 'deterministic', summary, message: 'Resposta generativa inválida; usei o fallback determinístico.' });
    return json(request, { mode: 'generative', answer, summary, model });
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'AbortError' ? 'Tempo limite do Gemini atingido; usei o fallback determinístico.' : 'Gemini indisponível; usei o fallback determinístico.';
    return json(request, { mode: 'deterministic', summary, message });
  } finally { clearTimeout(timeout); }
});
