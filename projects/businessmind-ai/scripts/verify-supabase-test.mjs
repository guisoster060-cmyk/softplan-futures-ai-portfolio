import { validateTestConfig } from './supabase-test-guard.mjs';
import { fetchWithoutRedirect } from './staging-http.mjs';

// Nenhuma requisição ocorre antes da validação da URL, referência e confirmação.
const { url, key } = validateTestConfig(process.env);
const runId = `bm-e2e-${Date.now()}`;
const headers = { apikey: key, 'Content-Type': 'application/json' };
const fail = message => { throw Error(message); };
const auth = async (email, password) => {
  const response = await fetchWithoutRedirect(`${url}/auth/v1/token?grant_type=password`, { method: 'POST', headers, body: JSON.stringify({ email, password }) });
  const data = await response.json();
  if (!response.ok || !data.access_token) fail(`Login de conta de teste falhou (${response.status}); confirme a conta antes de prosseguir.`);
  return { jwt: data.access_token, user: data.user };
};
const request = async (session, path, options = {}) => {
  const response = await fetchWithoutRedirect(`${url}/rest/v1/${path}`, { ...options, headers: { ...headers, Authorization: `Bearer ${session.jwt}`, Prefer: 'return=representation', ...options.headers } });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return { status: response.status, data };
};
const expect = (condition, label) => { if (!condition) fail(`FALHOU: ${label}`); console.log(`OK: ${label}`); };

const a = await auth(process.env.BM_TEST_EMAIL_A, process.env.BM_TEST_PASSWORD_A);
const b = await auth(process.env.BM_TEST_EMAIL_B, process.env.BM_TEST_PASSWORD_B);
const c = await auth(process.env.BM_TEST_EMAIL_C, process.env.BM_TEST_PASSWORD_C);
expect(new Set([a.user.id, b.user.id, c.user.id]).size === 3, 'três identidades autenticadas distintas');

const thirdMembership = await request(c, `company_members?select=company_id&user_id=eq.${c.user.id}`);
expect(thirdMembership.status === 200 && thirdMembership.data.length === 0, 'terceira conta sem associação inicial');

async function companyFor(session, label) {
  const existing = await request(session, `company_members?select=company_id&user_id=eq.${session.user.id}&limit=1`);
  expect(existing.status === 200, `leitura de associação ${label}`);
  if (existing.data.length) return existing.data[0].company_id;
  const created = await request(session, 'rpc/create_company', { method: 'POST', body: JSON.stringify({ p_name: `${runId}-${label}` }) });
  expect(created.status === 200 && typeof created.data === 'string', `onboarding ${label}`);
  return created.data;
}

const companyA = await companyFor(a, 'A');
const companyB = await companyFor(b, 'B');
expect(companyA !== companyB, 'empresas distintas');
const owned = [];
try {
  for (const [session, company, label] of [[a, companyA, 'A'], [b, companyB, 'B']]) {
    const inserted = await request(session, 'transactions?select=id,amount,company_id', { method: 'POST', body: JSON.stringify({ company_id: company, type: 'income', description: `${runId}-${label}`, category: 'Teste', amount: 100, occurred_on: new Date().toISOString().slice(0, 10) }) });
    expect(inserted.status === 201 && inserted.data.length === 1, `criação de receita ${label}`);
    owned.push({ session, id: inserted.data[0].id, company, label });
  }
  for (const own of owned) {
    const read = await request(own.session, `transactions?select=id,amount&company_id=eq.${own.company}&id=eq.${own.id}`);
    expect(read.status === 200 && read.data.length === 1, `persistência de ${own.label}`);
    const changed = await request(own.session, `transactions?id=eq.${own.id}`, { method: 'PATCH', body: JSON.stringify({ amount: 125 }) });
    expect(changed.status === 200 && changed.data[0]?.amount === 125, `edição de ${own.label}`);
  }
  for (const [self, other] of [[owned[0], owned[1]], [owned[1], owned[0]]]) {
    const read = await request(self.session, `transactions?select=id&id=eq.${other.id}`);
    expect(read.status === 200 && read.data.length === 0, `${self.label} não lê ${other.label}`);
    const edit = await request(self.session, `transactions?id=eq.${other.id}`, { method: 'PATCH', body: JSON.stringify({ amount: 1 }) });
    expect(edit.status === 200 && edit.data.length === 0, `${self.label} não altera ${other.label}`);
    const removal = await request(self.session, `transactions?id=eq.${other.id}`, { method: 'DELETE' });
    expect(removal.status === 200 && removal.data.length === 0, `${self.label} não exclui ${other.label}`);
    const insert = await request(self.session, 'transactions', { method: 'POST', body: JSON.stringify({ company_id: other.company, type: 'expense', description: runId, category: 'Teste', amount: 1, occurred_on: new Date().toISOString().slice(0, 10) }) });
    expect(insert.status >= 400, `${self.label} não insere na empresa ${other.label}`);
  }
  for (const own of owned) {
    const membership = await request(c, `company_members?select=company_id&company_id=eq.${own.company}`);
    expect(membership.status === 200 && membership.data.length === 0, `terceira conta não vê associação ${own.label}`);
    const read = await request(c, `transactions?select=id&id=eq.${own.id}`);
    expect(read.status === 200 && read.data.length === 0, `terceira conta não lê ${own.label}`);
    const edit = await request(c, `transactions?id=eq.${own.id}`, { method: 'PATCH', body: JSON.stringify({ amount: 1 }) });
    expect(edit.status === 200 && edit.data.length === 0, `terceira conta não altera ${own.label}`);
    const removal = await request(c, `transactions?id=eq.${own.id}`, { method: 'DELETE' });
    expect(removal.status === 200 && removal.data.length === 0, `terceira conta não exclui ${own.label}`);
    const insert = await request(c, 'transactions', { method: 'POST', body: JSON.stringify({ company_id: own.company, type: 'expense', description: runId, category: 'Teste', amount: 1, occurred_on: new Date().toISOString().slice(0, 10) }) });
    expect(insert.status >= 400, `terceira conta não insere na empresa ${own.label}`);
  }
} finally {
  for (const own of owned) {
    const result = await request(own.session, `transactions?id=eq.${own.id}`, { method: 'DELETE' });
    expect(result.status === 200 && result.data.length === 1, `limpeza da movimentação ${own.label}`);
  }
}
console.log('Validação remota concluída; contas e empresas de teste permanecem para limpeza humana controlada.');
