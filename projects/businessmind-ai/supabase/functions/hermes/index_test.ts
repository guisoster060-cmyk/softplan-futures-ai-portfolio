import { assertEquals, assert, assertStringIncludes } from 'jsr:@std/assert@1';
import { dependencies, handleRequest } from './index.ts';

const company = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const originalClient = dependencies.createClient;
const originalFetch = dependencies.fetch;
const originalEnv = Deno.env.get;

function request(token = 'valid', companyId = company, origin = 'https://example.test') {
  return new Request('http://localhost/hermes', { method: 'POST', headers: { Authorization: `Bearer ${token}`, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'Qual é o lucro?', companyId }) });
}
function setup(options: { invalid?: boolean; member?: boolean; rows?: unknown[]; provider?: 'ok' | 'bad' | 'down' | 'timeout'; approved?: boolean } = {}) {
  const calls: string[] = [];
  const rows = options.rows ?? [{ type: 'income', category: 'Vendas', amount: 100, occurred_on: '2026-10-01' }, { type: 'expense', category: 'Custos', amount: 40, occurred_on: '2026-10-02' }];
  dependencies.createClient = (() => ({
    auth: { getUser: async () => options.invalid ? { data: { user: null }, error: Error('invalid') } : { data: { user: { id: 'user-a' } }, error: null } },
    from: (table: string) => {
      calls.push(table);
      const query: Record<string, string> = {};
      const builder = {
        select: () => builder, eq: (key: string, value: string) => { query[key] = value; return builder; },
        order: () => builder, limit: () => Promise.resolve({ data: query.company_id === company ? rows : [], error: null }),
        maybeSingle: () => Promise.resolve({ data: options.member === false || query.company_id !== company ? null : { company_id: company }, error: null })
      };
      return builder;
    }
  })) as unknown as typeof dependencies.createClient;
  dependencies.fetch = (async (_url, init) => {
    calls.push('gemini');
    const body = JSON.parse(String(init?.body));
    assert(!JSON.stringify(body).includes('customer-name'));
    if (options.provider === 'down') throw Error('offline');
    if (options.provider === 'timeout') throw new DOMException('abort', 'AbortError');
    if (options.provider === 'bad') return new Response('{}');
    return Response.json({ candidates: [{ content: { parts: [{ text: 'Receitas superam despesas.' }] } }] });
  }) as typeof dependencies.fetch;
  Deno.env.get = ((key: string) => ({ SUPABASE_URL: 'https://example.test', SUPABASE_ANON_KEY: 'public', ALLOWED_ORIGINS: 'https://example.test', HERMES_DATA_SHARING_APPROVED: options.approved ? 'true' : 'false', GEMINI_API_KEY: 'fictitious-test-key' } as Record<string, string>)[key]) as typeof Deno.env.get;
  return calls;
}
function restore() { dependencies.createClient = originalClient; dependencies.fetch = originalFetch; Deno.env.get = originalEnv; }

Deno.test('JWT ausente ou inválido bloqueia acesso', async () => {
  const calls = setup({ invalid: true });
  try {
    assertEquals((await handleRequest(new Request('http://localhost/hermes', { method: 'POST' }))).status, 401);
    assertEquals((await handleRequest(request())).status, 401);
    assertEquals(calls.includes('transactions'), false);
  } finally { restore(); }
});

Deno.test('empresa não autorizada e RLS bloqueiam transações', async () => {
  const calls = setup({ member: false });
  try {
    assertEquals((await handleRequest(request())).status, 403);
    assertEquals((await handleRequest(request('valid', other))).status, 403);
    assertEquals(calls.includes('transactions'), false);
  } finally { restore(); }
});

Deno.test('dados fictícios completos geram agregados sem chamar Gemini quando desativado', async () => {
  const calls = setup();
  try {
    const result = await (await handleRequest(request())).json();
    assertEquals(result.mode, 'deterministic');
    assertEquals(result.summary.totals.profit, 60);
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

Deno.test('conjunto incompleto impede totais e envio ao provedor', async () => {
  const calls = setup({ rows: Array.from({ length: 5001 }, () => ({ type: 'income', amount: 1, category: 'Vendas', occurred_on: '2026-10-01' })), approved: true });
  try {
    const response = await handleRequest(request());
    assertEquals(response.status, 503);
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

for (const provider of ['bad', 'down', 'timeout'] as const) {
  Deno.test(`falha ${provider} do Gemini mantém fallback`, async () => {
    setup({ provider, approved: true });
    try { assertEquals((await (await handleRequest(request())).json()).mode, 'deterministic'); }
    finally { restore(); }
  });
}

Deno.test('resposta válida separa fatos e interpretação; payload não contém linhas individuais', async () => {
  setup({ approved: true, rows: [{ type: 'income', category: 'Vendas', amount: 100, occurred_on: '2026-10-01', description: 'customer-name' }] });
  try {
    const result = await (await handleRequest(request())).json();
    assertEquals(result.mode, 'generative');
    assertEquals(result.summary.totals.income, 100);
    assertStringIncludes(result.answer, 'Receitas');
  } finally { restore(); }
});

Deno.test('CORS rejeita origem não aprovada', async () => {
  const calls = setup();
  try { assertEquals((await handleRequest(request('valid', company, 'https://evil.test'))).status, 403); assertEquals(calls.length, 0); }
  finally { restore(); }
});
