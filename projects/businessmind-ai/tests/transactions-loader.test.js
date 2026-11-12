'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadTransactions } = require('../app/transactions-loader.js');

const rows = n => Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, occurred_on: '2026-11-10', type: 'income', amount: 1 }));
function client(source, mutate = (_start, result) => result) {
  return { from(table) {
    assert.equal(table, 'transactions');
    return {
      select(_columns, options) { assert.equal(options.count, 'exact'); return this; },
      eq(field, value) { assert.equal(field, 'company_id'); assert.equal(value, 'company-a'); return this; },
      order() { return this; },
      async range(start, end) { return mutate(start, { data: source.slice(start, end + 1), count: source.length, error: null }); }
    };
  } };
}

test('carrega todas as páginas acima do limite padrão de 1000', async () => {
  const data = rows(1201);
  assert.deepEqual(await loadTransactions(client(data), 'company-a'), data);
});
test('aceita conjunto vazio e página exata', async () => {
  assert.deepEqual(await loadTransactions(client([]), 'company-a'), []);
  assert.equal((await loadTransactions(client(rows(500)), 'company-a')).length, 500);
});
test('rejeita página truncada sem devolver totais parciais', async () => {
  await assert.rejects(loadTransactions(client(rows(1001), (start, result) => start === 500 ? { ...result, data: [] } : result), 'company-a'), /incompleta/);
});
test('rejeita erro de rede, contagem ausente ou alterada', async () => {
  await assert.rejects(loadTransactions(client(rows(1001), (start, result) => start === 500 ? { ...result, error: Error('Falha fictícia') } : result), 'company-a'), /Falha fictícia/);
  await assert.rejects(loadTransactions(client(rows(1), (_start, result) => ({ ...result, count: null })), 'company-a'), /incompleta/);
  await assert.rejects(loadTransactions(client(rows(1001), (start, result) => start === 500 ? { ...result, count: 1000 } : result), 'company-a'), /incompleta/);
});
test('rejeita IDs repetidos e contagem além do limite do schema', async () => {
  await assert.rejects(loadTransactions(client(rows(501), (start, result) => start === 500 ? { ...result, data: [{ ...result.data[0], id: 'row-0' }] } : result), 'company-a'), /inconsistente/);
  await assert.rejects(loadTransactions(client(rows(5001)), 'company-a'), /incompleta/);
});
