import { STAGING_REF, PRODUCTION_REF } from './supabase-test-guard.mjs';
import { fetchWithoutRedirect } from './staging-http.mjs';

const env = process.env;
const url = `https://${STAGING_REF}.supabase.co`;
const key = env.BM_TEST_PUBLISHABLE_KEY || '';
if (env.BM_TEST_PROJECT_REF !== STAGING_REF || env.BM_TEST_CONFIRM !== `TEST_ONLY:${STAGING_REF}` ||
    env.BM_TEST_SUPABASE_URL !== url || url.includes(PRODUCTION_REF) ||
    !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key) ||
    !env.BM_TEST_EMAIL_A || !env.BM_TEST_PASSWORD_A || !env.BM_TEST_EMAIL_B || !env.BM_TEST_PASSWORD_B ||
    env.BM_TEST_EMAIL_A === env.BM_TEST_EMAIL_B) throw Error('Configuração isolada de staging incompleta.');

const headers = { apikey: key, 'Content-Type': 'application/json' };
const assert = (condition, label) => {
  if (!condition) throw Error(`FALHOU: ${label}`);
  console.log(`OK: ${label}`);
};
async function login(email, password) {
  const response = await fetchWithoutRedirect(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers, body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw Error(`Login de conta fictícia falhou (HTTP ${response.status}).`);
  const data = await response.json();
  if (!data.access_token || !data.user?.id) throw Error('Sessão de teste inválida.');
  return { jwt: data.access_token, id: data.user.id };
}
async function ownCompany(session) {
  const response = await fetchWithoutRedirect(`${url}/rest/v1/company_members?select=company_id&user_id=eq.${encodeURIComponent(session.id)}&limit=1`, {
    headers: { ...headers, Authorization: `Bearer ${session.jwt}` }
  });
  if (!response.ok) throw Error(`Consulta de associação falhou (HTTP ${response.status}).`);
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1 || !/^[0-9a-f-]{36}$/i.test(rows[0].company_id))
    throw Error('A conta de teste precisa de uma empresa própria no staging.');
  return rows[0].company_id;
}
async function ask(token, companyId) {
  const response = await fetchWithoutRedirect(`${url}/functions/v1/hermes`, {
    method: 'POST', headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ question: 'Qual é o resultado financeiro?', companyId })
  });
  // Nunca imprimir corpo completo: pode conter indicadores financeiros.
  const body = await response.json().catch(() => null);
  return { status: response.status, mode: body?.mode, hasSummary: !!body?.summary,
    hasAnswer: typeof body?.answer === 'string', hasModel: !!body?.model };
}

const a = await login(env.BM_TEST_EMAIL_A, env.BM_TEST_PASSWORD_A);
const b = await login(env.BM_TEST_EMAIL_B, env.BM_TEST_PASSWORD_B);
assert(a.id !== b.id, 'JWTs de usuários distintos');
const companyA = await ownCompany(a), companyB = await ownCompany(b);
assert(companyA !== companyB, 'empresas distintas');
for (const [session, own, other, label] of [[a, companyA, companyB, 'A'], [b, companyB, companyA, 'B']]) {
  const allowed = await ask(session.jwt, own);
  assert(allowed.status === 200 && allowed.mode === 'deterministic' && allowed.hasSummary && !allowed.hasAnswer && !allowed.hasModel,
    `Hermes autorizado e sem Gemini (${label}); HTTP ${allowed.status}`);
  const denied = await ask(session.jwt, other);
  assert(denied.status === 403 && !denied.hasSummary && !denied.hasAnswer,
    `empresa alheia bloqueada (${label}); HTTP ${denied.status}`);
  const malformed = await ask(session.jwt, 'invalid-company-id');
  assert(malformed.status === 400 && !malformed.hasSummary, `identificador inválido (${label}); HTTP ${malformed.status}`);
}
console.log('Teste Hermes concluído sem criar ou alterar dados; nenhuma resposta financeira foi registrada.');
