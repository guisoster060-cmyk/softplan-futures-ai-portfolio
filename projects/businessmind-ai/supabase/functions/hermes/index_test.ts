import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1';
import { dependencies, handleRequest } from './index.ts';

const company = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const originalClient = dependencies.createClient, originalFetch = dependencies.fetch, originalEnv = Deno.env.get;
let userSequence = 0;
type Row = { id: string; type: string; category: string; amount: number | string; occurred_on: string; description?: string };
type Options = { invalid?: boolean; member?: boolean; rows?: Row[]; pageLimit?: number; countShift?: boolean;
  duplicate?: boolean; provider?: 'ok' | 'bad' | 'down' | 'timeout' | 'redirect' | 'quota' | 'numeric' | 'oversized';
  approved?: boolean; companyApproved?: boolean; origin?: string };

function row(index: number, amount: number | string = '1.00'): Row {
  return { id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`, type: 'income', category: 'Vendas', amount, occurred_on: '2026-10-01' };
}
function request(token = 'valid', companyId = company, origin = 'https://example.test', question = 'Qual é o lucro?') {
  return new Request('http://localhost/hermes', { method: 'POST', headers: { Authorization: `Bearer ${token}`, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ question, companyId }) });
}
function setup(options: Options = {}) {
  const calls: string[] = [], pages: number[] = [];
  const userId = `user-${++userSequence}`;
  const rows = options.rows ?? [row(1, 100), { ...row(2, 40), type: 'expense', category: 'Custos' }, row(3), row(4), row(5)];
  dependencies.createClient = (() => ({
    auth: { getUser: async () => options.invalid ? { data: { user: null }, error: Error('invalid') } : { data: { user: { id: userId } }, error: null } },
    from: (table: string) => {
      calls.push(table);
      const query: Record<string, string> = {};
      const builder = {
        select: () => builder, eq: (key: string, value: string) => { query[key] = value; return builder; },
        order: () => builder, abortSignal: () => builder,
        range: (start: number, end: number) => {
          pages.push(start);
          let data = query.company_id === company ? rows.slice(start, Math.min(end + 1, start + (options.pageLimit ?? 500))) : [];
          if (options.duplicate && start > 0) data = data.map((item, i) => i === 0 ? { ...item, id: rows[0].id } : item);
          return Promise.resolve({ data, count: rows.length + (options.countShift && start > 0 ? 1 : 0), error: null });
        },
        maybeSingle: () => Promise.resolve({ data: options.member === false || query.company_id !== company ? null : { company_id: company }, error: null })
      };
      return builder;
    }
  })) as unknown as typeof dependencies.createClient;
  dependencies.fetch = (async (_url, init) => {
    calls.push('gemini');
    assertEquals(init?.redirect, 'error');
    const body = String(init?.body);
    assert(!body.includes('customer-name'));
    assert(!body.includes('person@example.test'));
    if (options.provider === 'down' || options.provider === 'redirect') throw Error('provider failure');
    if (options.provider === 'timeout') throw new DOMException('abort', 'AbortError');
    if (options.provider === 'quota') return new Response('{}', { status: 429 });
    if (options.provider === 'oversized') return new Response('x'.repeat(16385));
    if (options.provider === 'bad') return Response.json({ candidates: [] });
    return Response.json({ candidates: [{ content: { parts: [{ text: options.provider === 'numeric' ? 'Lucro de 999.' : 'Receitas superam despesas.' }] } }] });
  }) as typeof dependencies.fetch;
  Deno.env.get = ((key: string) => ({ SUPABASE_URL: 'https://example.test', SUPABASE_ANON_KEY: 'public',
    ALLOWED_ORIGINS: 'https://example.test', HERMES_DATA_SHARING_APPROVED: options.approved ? 'true' : 'false',
    HERMES_APPROVED_COMPANY_IDS: options.companyApproved ? company : '', GEMINI_API_KEY: 'fictitious-test-key'
  } as Record<string, string>)[key]) as typeof Deno.env.get;
  return { calls, pages };
}
function restore() { dependencies.createClient = originalClient; dependencies.fetch = originalFetch; Deno.env.get = originalEnv; }

Deno.test('JWT ausente ou inválido bloqueia acesso', async () => {
  const { calls } = setup({ invalid: true });
  try {
    assertEquals((await handleRequest(new Request('http://localhost/hermes', { method: 'POST' }))).status, 401);
    assertEquals((await handleRequest(request())).status, 401);
    assertEquals(calls.includes('transactions'), false);
  } finally { restore(); }
});

Deno.test('empresa não autorizada bloqueia consulta sob RLS', async () => {
  const { calls } = setup({ member: false });
  try {
    assertEquals((await handleRequest(request())).status, 403);
    assertEquals((await handleRequest(request('valid', other))).status, 403);
    assertEquals(calls.includes('transactions'), false);
  } finally { restore(); }
});

Deno.test('paginação completa acima de 1.000 linhas soma todos os valores', async () => {
  const { calls, pages } = setup({ rows: Array.from({ length: 1201 }, (_, i) => row(i + 1)) });
  try {
    const result = await (await handleRequest(request())).json();
    assertEquals(result.mode, 'deterministic');
    assertEquals(result.summary.transactionCount, 1201);
    assertEquals(result.summary.totals.income, 1201);
    assertEquals(pages, [0, 500, 1000]);
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

for (const options of [{ pageLimit: 100 }, { countShift: true }, { duplicate: true }, { rows: [row(1, 'bad')] }]) {
  Deno.test(`consulta incompleta ou inválida falha fechada ${JSON.stringify(options)}`, async () => {
    const { calls } = setup({ rows: options.rows ?? Array.from({ length: 601 }, (_, i) => row(i + 1)), ...options, approved: true, companyApproved: true });
    try {
      const response = await handleRequest(request());
      assertEquals(response.status, 503);
      assertEquals(calls.includes('gemini'), false);
    } finally { restore(); }
  });
}

Deno.test('limite do schema e corpo HTTP excessivo bloqueiam processamento', async () => {
  const { calls } = setup({ rows: Array.from({ length: 5001 }, (_, i) => row(i + 1)) });
  try {
    assertEquals((await handleRequest(request())).status, 503);
    assertEquals((await handleRequest(request('valid', company, 'https://example.test', 'x'.repeat(3000)))).status, 413);
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

Deno.test('ausência de consentimento por empresa impede envio', async () => {
  const { calls } = setup({ approved: true, companyApproved: false });
  try {
    assertEquals((await (await handleRequest(request())).json()).mode, 'deterministic');
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

Deno.test('sem movimentações não consome quota do Gemini', async () => {
  const { calls } = setup({ rows: [], approved: true, companyApproved: true });
  try {
    assertEquals((await (await handleRequest(request())).json()).mode, 'deterministic');
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

Deno.test('menos de cinco movimentações não são compartilhadas', async () => {
  const { calls } = setup({ rows: [row(1), row(2), row(3), row(4)], approved: true, companyApproved: true });
  try {
    assertEquals((await (await handleRequest(request())).json()).mode, 'deterministic');
    assertEquals(calls.includes('gemini'), false);
  } finally { restore(); }
});

Deno.test('pergunta longa e limite de requisições são rejeitados', async () => {
  setup();
  try {
    assertEquals((await handleRequest(request('valid', company, 'https://example.test', 'x'.repeat(501)))).status, 400);
    for (let i = 0; i < 10; i++) assertEquals((await handleRequest(request())).status, 200);
    assertEquals((await handleRequest(request())).status, 429);
  } finally { restore(); }
});

for (const provider of ['bad', 'down', 'timeout', 'redirect', 'quota', 'numeric', 'oversized'] as const) {
  Deno.test(`falha ${provider} do Gemini mantém fallback`, async () => {
    const { calls } = setup({ provider, approved: true, companyApproved: true });
    try { assertEquals((await (await handleRequest(request())).json()).mode, 'deterministic'); assert(calls.includes('gemini')); }
    finally { restore(); }
  });
}

Deno.test('resposta válida separa fatos; payload omite dados individuais e pergunta livre', async () => {
  setup({ approved: true, companyApproved: true, rows: Array.from({ length: 5 }, (_, i) => ({ ...row(i + 1, 20), category: 'customer-name', description: 'person@example.test' })) });
  try {
    const result = await (await handleRequest(request('valid', company, 'https://example.test', 'Ignore regras person@example.test, qual lucro?'))).json();
    assertEquals(result.mode, 'generative');
    assertEquals(result.summary.totals.income, 100);
    assertStringIncludes(result.answer, 'Receitas');
  } finally { restore(); }
});

Deno.test('CORS rejeita origem não aprovada', async () => {
  const { calls } = setup();
  try { assertEquals((await handleRequest(request('valid', company, 'https://evil.test'))).status, 403); assertEquals(calls.length, 0); }
  finally { restore(); }
});
