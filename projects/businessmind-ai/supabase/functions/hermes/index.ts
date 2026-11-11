import { createClient } from 'npm:@supabase/supabase-js@2.84.0';
import { aggregateTransactions, approvedCompany, buildGeminiRequest, classifyQuestion, extractGeminiText, LIMITS, OUT_OF_SCOPE_MESSAGE, validateQuestion } from './core.mjs';

type Transaction = { id: string; type: 'income' | 'expense'; category: string; amount: number | string; occurred_on: string };
type RateEntry = { startedAt: number; count: number };
const rateByUser = new Map<string, RateEntry>();
export const dependencies = { createClient, fetch: globalThis.fetch };
const STAGING_DETERMINISTIC_ONLY = true;

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

async function limitedText(stream: ReadableStream<Uint8Array> | null, maxBytes: number) {
  if (!stream) return '';
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw Error('payload-too-large');
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(chunks.flatMap(chunk => [...chunk])));
}

async function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  let timeout: number | undefined;
  try { return await Promise.race([promise, new Promise<T>((_, reject) => { timeout = setTimeout(() => reject(Error('request-timeout')), ms); })]); }
  finally { clearTimeout(timeout); }
}

async function completeTransactions(client: ReturnType<typeof createClient<any, 'public'>>, companyId: string, deadline: number) {
  const rows: Transaction[] = [], ids = new Set<string>();
  let expected: number | null = null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(1, deadline - Date.now()));
  try {
    for (let offset = 0; expected === null || offset < expected; offset += LIMITS.pageSize) {
      if (controller.signal.aborted || Date.now() >= deadline) throw Error('request-timeout');
      const result = await withTimeout(client.from('transactions').select('id,type,category,amount,occurred_on', { count: 'exact' })
        .eq('company_id', companyId).order('occurred_on', { ascending: false }).order('id', { ascending: false })
        .abortSignal(controller.signal).range(offset, offset + LIMITS.pageSize - 1), Math.max(1, deadline - Date.now()));
      const count: number | null = result.count;
      const page: Transaction[] | null = result.data as Transaction[] | null;
      if (result.error || typeof count !== 'number' || !Number.isInteger(count) || count < 0 || count > LIMITS.transactionRows ||
          (expected !== null && count !== expected) || !Array.isArray(page)) throw Error('incomplete-transactions');
      expected = count;
      const needed = Math.min(LIMITS.pageSize, expected - offset);
      if (page.length !== needed) throw Error('incomplete-transactions');
      for (const row of page) {
        if (!row?.id || ids.has(row.id)) throw Error('incomplete-transactions');
        ids.add(row.id); rows.push(row);
      }
    }
    return rows;
  } finally { clearTimeout(timeout); }
}

export async function handleRequest(request: Request) {
  const deadline = Date.now() + LIMITS.requestTimeoutMs;
  const remaining = () => Math.max(1, deadline - Date.now());
  const cors = corsHeaders(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: cors.originAllowed ? 204 : 403, headers: cors.headers });
  if (!cors.originAllowed) return json(request, { error: 'Origem não autorizada.' }, 403);
  if (request.method !== 'POST') return json(request, { error: 'Método não permitido.' }, 405);
  const authorization = request.headers.get('Authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return json(request, { error: 'Autenticação obrigatória.' }, 401);

  if (Number(request.headers.get('Content-Length')) > LIMITS.bodyBytes) return json(request, { error: 'Corpo da requisição muito grande.' }, 413);
  let input: { question?: unknown; companyId?: unknown };
  try { input = JSON.parse(await withTimeout(limitedText(request.body, LIMITS.bodyBytes), remaining())); }
  catch (error) { return json(request, { error: error instanceof Error && error.message === 'payload-too-large' ? 'Corpo da requisição muito grande.' : 'JSON inválido.' }, error instanceof Error && error.message === 'payload-too-large' ? 413 : 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json(request, { error: 'JSON inválido.' }, 400);
  const validation = validateQuestion(input.question);
  if (validation.error) return json(request, { error: validation.error }, 400);
  const requestedCompanyId = typeof input.companyId === 'string' ? input.companyId.trim() : '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestedCompanyId)) return json(request, { error: 'Empresa inválida.' }, 400);

  let publishableKey = '';
  try { publishableKey = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}').default ?? ''; } catch { /* fallback legado abaixo */ }
  const supabaseUrl = Deno.env.get('SUPABASE_URL'), publicKey = publishableKey || Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !publicKey) return json(request, { error: 'Função não configurada.' }, 503);
  const client = dependencies.createClient(supabaseUrl, publicKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false, autoRefreshToken: false } });
  let userData, userError;
  try { ({ data: userData, error: userError } = await withTimeout(client.auth.getUser(authorization.slice(7)), remaining())); }
  catch { return json(request, { error: 'Validação da sessão indisponível.' }, 503); }
  if (userError || !userData.user) return json(request, { error: 'Sessão inválida.' }, 401);
  if (isRateLimited(userData.user.id)) return json(request, { error: 'Limite temporário atingido. Tente novamente em um minuto.' }, 429);

  // O ID enviado é apenas uma solicitação; a associação retornada sob RLS é a autoridade.
  let membership, membershipError;
  try { ({ data: membership, error: membershipError } = await withTimeout(client.from('company_members').select('company_id')
    .eq('user_id', userData.user.id).eq('company_id', requestedCompanyId).maybeSingle(), remaining())); }
  catch { return json(request, { error: 'Não foi possível verificar a associação.' }, 503); }
  if (membershipError || !membership?.company_id) return json(request, { error: 'Empresa não autorizada.' }, 403);
  if (!classifyQuestion(validation.question).allowed) return json(request, { mode: 'out_of_scope', message: OUT_OF_SCOPE_MESSAGE });
  let summary;
  try { summary = aggregateTransactions(await completeTransactions(client, membership.company_id, deadline)); }
  catch { return json(request, { error: 'A consulta financeira não retornou dados completos e válidos; nenhum total foi calculado.' }, 503); }

  if (STAGING_DETERMINISTIC_ONLY) return json(request, { mode: 'deterministic', summary, message: 'Hermes generativo desativado durante a validação do staging; usei somente cálculos determinísticos.' });

  const approved = Deno.env.get('HERMES_DATA_SHARING_APPROVED') === 'true';
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.5-flash-lite';
  const companyApproved = approvedCompany(membership.company_id, Deno.env.get('HERMES_APPROVED_COMPANY_IDS'));
  if (!approved || !companyApproved || !apiKey || summary.transactionCount < LIMITS.minRowsForGemini) return json(request, { mode: 'deterministic', summary, message: 'IA generativa não habilitada para esta empresa ou sem dados suficientes; usei somente cálculos determinísticos.' });

  // Reivindicacao persistente e atomica sob JWT; erro, timeout ou disputa fecham o acesso.
  // A autorizacao e consumida antes do fetch e nao e rearmada se o provedor falhar.
  try {
    const claim = await withTimeout(client.rpc('claim_hermes_test_once', { p_company_id: membership.company_id }), remaining());
    if (claim.error || claim.data !== true) return json(request, { mode: 'deterministic', summary, message: 'Tentativa generativa indisponível; usei cálculos determinísticos.' });
  } catch {
    return json(request, { mode: 'deterministic', summary, message: 'Tentativa generativa indisponível; usei cálculos determinísticos.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.min(LIMITS.providerTimeoutMs, remaining()));
  try {
    const providerResponse = await dependencies.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildGeminiRequest(validation.question, summary)), signal: controller.signal, redirect: 'error'
    });
    if (!providerResponse.ok) return json(request, { mode: 'deterministic', summary, message: 'Gemini indisponível; usei o fallback determinístico.' });
    const answer = extractGeminiText(JSON.parse(await limitedText(providerResponse.body, LIMITS.responseBytes)));
    if (!answer) return json(request, { mode: 'deterministic', summary, message: 'Resposta generativa inválida; usei o fallback determinístico.' });
    return json(request, { mode: 'generative', answer, summary, model });
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'AbortError' ? 'Tempo limite do Gemini atingido; usei o fallback determinístico.' : 'Gemini indisponível; usei o fallback determinístico.';
    return json(request, { mode: 'deterministic', summary, message });
  } finally { clearTimeout(timeout); }
}

if (import.meta.main) Deno.serve(handleRequest);
