'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Executa a função real do frontend em um contexto local, sem SDK ou rede.
const source = fs.readFileSync(path.join(__dirname, '../app/app.js'), 'utf8');
const start = source.indexOf('// Renderização restrita:');
const helperEnd = source.indexOf('function setHermesStatus(', start);
const askStart = source.indexOf('async function ask(q) {', helperEnd);
const end = source.indexOf('/* ---------- Análises e recomendações ---------- */', start);
assert.ok(start >= 0 && helperEnd > start && askStart > helperEnd && end > askStart, 'função ask precisa existir');
const askSource = source.slice(start, helperEnd) + '\n' + source.slice(askStart, end);
const stagingUrl = 'https://ogypzmxnvjbomamkejkh.supabase.co';
const summary = { transactionCount: 1, totals: { income: 20, expense: 0, profit: 20 } };

function harness({ remote = false, generative = false, url = stagingUrl,
  company = { id: 'empresa-ficticia-a' }, companies, rows = [{}], user = { id: 'usuario-ficticio' },
  session = { access_token: 'token-ficticio-local', user: { id: 'usuario-ficticio' } },
  authError = null, invoke = async () => ({ data: { mode: 'deterministic', summary }, error: null }) } = {}) {
  const messages = [], calls = [], statuses = [];
  const submit = { disabled: false };
  const chatLog = { children: [], append(node) { this.children.push(node); }, scrollTop: 0, scrollHeight: 0 };
  const makeNode = tag => ({ tag, children: [], className: '', textContent: '', append(node) { this.children.push(node); } });
  const context = vm.createContext({
    window: { BUSINESSMIND_CONFIG: { supabaseUrl: url, hermesGenerativeEnabled: generative, hermesRemoteDeterministicEnabled: remote } },
    transactions: rows, currentCompany: company, currentUser: user,
    availableCompanies: companies ?? (company ? [company] : []),
    supabase: {
      auth: { getSession: async () => ({ data: { session }, error: authError }) },
      functions: { invoke: async (...args) => { calls.push(args); return invoke(...args); } }
    },
    addMsg: (role, text) => messages.push({ role, text }),
    el: (tag, cls, value) => { const node = makeNode(tag); node.className = cls || ''; node.textContent = value || ''; return node; },
    document: { createElement: makeNode, createTextNode: value => ({ textContent: value }) },
    answer: () => 'Resultado determinístico local',
    hermesOutOfScope: () => false,
    norm: value => value.toLowerCase(),
    has: (value, ...terms) => terms.some(term => value.includes(term)),
    setHermesStatus: (text, kind) => statuses.push({ text, kind }),
    $: id => { assert.ok(['chat-submit', 'chat-log'].includes(id)); return id === 'chat-submit' ? submit : chatLog; },
    HERMES_SCOPE_MESSAGE: 'Fora do escopo'
  });
  vm.runInContext(`${askSource}\nthis.ask = ask;`, context);
  return { ask: context.ask, context, messages, calls, statuses, submit, chatLog };
}

test('modo local e produção nunca invocam a função', async () => {
  const stagingConfig = fs.readFileSync(path.join(__dirname, '../preview/staging-config.js'), 'utf8');
  const productionConfig = fs.readFileSync(path.join(__dirname, '../app/config.js'), 'utf8');
  assert.match(stagingConfig, /hermesRemoteDeterministicEnabled: true/);
  assert.match(stagingConfig, /hermesGenerativeEnabled: true/);
  assert.ok(productionConfig.includes('ogypzmxnvjbomamkejkh.supabase.co')); // configuração exclusiva de staging
  for (const options of [{}, { remote: true, url: 'https://outro-projeto.invalid' }, { generative: true }]) {
    const h = harness(options);
    await h.ask('lucro do mês');
    assert.equal(h.calls.length, 0);
    assert.equal(h.messages.at(-1).text, 'Resultado determinístico local');
  }
});

test('resposta generativa fica separada do cálculo local e exige flag explícito', async () => {
  const response = async () => ({ data: { mode: 'generative', summary, answer: 'As receitas superam as despesas.' }, error: null });
  const enabled = harness({ remote: true, generative: true, invoke: response });
  await enabled.ask('lucro do mês');
  assert.equal(enabled.calls.length, 1);
  assert.equal(enabled.messages.at(-1).text, 'Resultado determinístico local');
  assert.equal(enabled.chatLog.children.length, 1);
  assert.match(enabled.chatLog.children[0].children[0].textContent, /Interpretação generativa/);
  assert.equal(enabled.submit.disabled, false);

  const disabled = harness({ remote: true, invoke: response });
  await disabled.ask('lucro do mês');
  assert.equal(disabled.messages.at(-1).text, 'Resultado determinístico local');
  assert.match(disabled.statuses.at(-1).text, /resposta calculada no navegador/);
  for (const answer of ['Lucro R$ 999', 'Contato teste@example.test', 'https://example.test']) {
    const invalid = harness({ remote: true, generative: true,
      invoke: async () => ({ data: { mode: 'generative', summary, answer }, error: null }) });
    await invalid.ask('lucro do mês');
    assert.equal(invalid.messages.at(-1).text, 'Resultado determinístico local');
    assert.equal(invalid.submit.disabled, false);
  }
});

test('sessão e empresa ativa permitem somente consulta determinística', async () => {
  const h = harness({ remote: true });
  await h.ask('lucro do mês');
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0][0], 'hermes');
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls[0][1].body)), { question: 'lucro do mês', companyId: 'empresa-ficticia-a' });
  assert.equal(h.calls[0][1].timeout, 22000);
  assert.equal(JSON.stringify(h.calls[0]).includes('token-ficticio-local'), false);
  assert.equal(h.messages.at(-1).text, 'Resultado determinístico local');
  assert.match(h.statuses.at(-1).text, /Hermes remoto respondeu em modo determinístico/);
  assert.match(h.statuses.at(-1).text, /Gemini não foi utilizado/);
  assert.equal(h.submit.disabled, false);
});

test('JWT ausente, sessão inválida e empresa não associada impedem invocação', async () => {
  for (const options of [
    { session: null }, { session: { access_token: '', user: { id: 'usuario-ficticio' } } },
    { session: { access_token: 'token-ficticio-local', user: { id: 'outro-usuario' } } },
    { authError: Error('JWT inválido') }, { company: null },
    { companies: [{ id: 'outra-empresa' }] }
  ]) {
    const h = harness({ remote: true, ...options });
    await h.ask('lucro do mês');
    assert.equal(h.calls.length, 0);
    assert.notEqual(h.messages.at(-1).text, 'Resultado determinístico local');
    assert.equal(h.submit.disabled, false);
  }
});

test('401 e 403 não exibem dados locais após rejeição do servidor', async () => {
  for (const status of [401, 403]) {
    const h = harness({ remote: true, invoke: async () => ({ data: null, error: { context: { status } } }) });
    await h.ask('lucro do mês');
    assert.equal(h.calls.length, 1);
    assert.match(h.messages.at(-1).text, /não autorizada/);
    assert.equal(h.messages.some(message => message.text === 'Resultado determinístico local'), false);
    assert.equal(h.submit.disabled, false);
  }
});

test('rede, timeout e resposta inválida preservam fallback local', async () => {
  for (const invoke of [
    async () => { throw Error('rede indisponível'); },
    async () => { throw Error('timeout'); },
    async () => ({ data: { mode: 'generative', answer: 'não exibir' }, error: null }),
    async () => ({ data: { mode: 'deterministic', summary: { ...summary, transactionCount: 2 } }, error: null })
  ]) {
    const h = harness({ remote: true, invoke });
    await h.ask('lucro do mês');
    assert.equal(h.calls.length, 1);
    assert.equal(h.messages.at(-1).text, 'Resultado determinístico local');
    assert.match(h.statuses.at(-1).text, /resposta calculada no navegador/);
    assert.equal(h.submit.disabled, false);
  }
});

test('sem dados não invoca; troca de empresa durante a espera descarta resposta antiga', async () => {
  const empty = harness({ remote: true, rows: [] });
  await empty.ask('lucro do mês');
  assert.equal(empty.calls.length, 0);

  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const h = harness({ remote: true, invoke: () => pending });
  const first = h.ask('lucro do mês');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.calls.length, 1);
  await h.ask('lucro do mês');
  assert.equal(h.calls.length, 1);
  h.context.currentCompany = { id: 'outra-empresa' };
  finish({ data: { mode: 'deterministic', summary }, error: null });
  await first;
  assert.equal(h.messages.filter(message => message.role === 'bot').length, 0);
  assert.equal(h.submit.disabled, false);
});
