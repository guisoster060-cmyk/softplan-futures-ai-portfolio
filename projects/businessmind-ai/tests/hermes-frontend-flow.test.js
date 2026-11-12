'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Executa a função real do frontend em um contexto local, sem SDK ou rede.
const source = fs.readFileSync(path.join(__dirname, '../app/app.js'), 'utf8');
const start = source.indexOf('async function ask(q) {');
const end = source.indexOf('/* ---------- Análises e recomendações ---------- */', start);
assert.ok(start >= 0 && end > start, 'função ask precisa existir');
const askSource = source.slice(start, end);

function harness({ enabled = false, company = { id: 'empresa-ficticia-a' }, rows = [{}], invoke } = {}) {
  const messages = [], calls = [], statuses = [];
  const submit = { disabled: false };
  const context = vm.createContext({
    window: { BUSINESSMIND_CONFIG: { hermesGenerativeEnabled: enabled } },
    transactions: rows,
    currentCompany: company,
    supabase: { functions: { invoke: async (...args) => { calls.push(args); return invoke?.(...args) ?? { data: null, error: Error('indisponível') }; } } },
    addMsg: (role, text) => messages.push({ role, text }),
    answer: () => 'Resultado determinístico local',
    hermesOutOfScope: () => false,
    norm: value => value.toLowerCase(),
    has: (value, ...terms) => terms.some(term => value.includes(term)),
    summaryFacts: () => 'Fatos calculados',
    setHermesStatus: (text, kind) => statuses.push({ text, kind }),
    $: id => { assert.equal(id, 'chat-submit'); return submit; },
    HERMES_SCOPE_MESSAGE: 'Fora do escopo'
  });
  vm.runInContext(`${askSource}\nthis.ask = ask;`, context);
  return { ask: context.ask, messages, calls, statuses, submit };
}

test('configuração publicada mantém Hermes local sem invocar a função', async () => {
  const publishedConfig = fs.readFileSync(path.join(__dirname, '../preview/staging-config.js'), 'utf8');
  assert.match(publishedConfig, /hermesGenerativeEnabled: false/);
  const h = harness();
  await h.ask('lucro do mês');
  assert.equal(h.calls.length, 0);
  assert.equal(h.messages.at(-1).text, 'Resultado determinístico local');
});

test('caminho hipotético habilitado usa empresa ativa e resultado autorizado', async () => {
  const h = harness({ enabled: true, invoke: async () => ({ data: { mode: 'generative', answer: 'Interpretação fictícia', summary: {} }, error: null }) });
  await h.ask('lucro do mês');
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0][0], 'hermes');
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls[0][1].body)), { question: 'lucro do mês', companyId: 'empresa-ficticia-a' });
  assert.match(h.messages.at(-1).text, /Fatos calculados/);
  assert.match(h.messages.at(-1).text, /Interpretação fictícia/);
  assert.equal(h.submit.disabled, false);
});

test('falha de comunicação ou autorização retorna ao Hermes local', async () => {
  for (const error of [Error('rede indisponível'), Error('JWT inválido'), Error('empresa não autorizada')]) {
    const h = harness({ enabled: true, invoke: async () => ({ data: null, error }) });
    await h.ask('lucro do mês');
    assert.equal(h.calls.length, 1);
    assert.equal(h.messages.at(-1).text, 'Resultado determinístico local');
    assert.match(h.statuses.at(-1).text, /fallback determinístico ativo/);
    assert.equal(h.submit.disabled, false);
  }
});

test('resposta determinística da função, ausência de empresa ou dados não chamam Gemini', async () => {
  const fallback = harness({ enabled: true, invoke: async () => ({ data: { mode: 'deterministic', message: 'IA desativada' }, error: null }) });
  await fallback.ask('lucro do mês');
  assert.equal(fallback.calls.length, 1);
  assert.equal(fallback.messages.at(-1).text, 'Resultado determinístico local');

  for (const options of [{ enabled: true, company: null }, { enabled: true, rows: [] }]) {
    const h = harness(options);
    await h.ask('lucro do mês');
    assert.equal(h.calls.length, 0);
    assert.equal(h.messages.at(-1).text, 'Resultado determinístico local');
  }
});
