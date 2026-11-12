'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const domain = require('../app/domain.js');

test('aceita uma movimentação válida', () => {
  assert.equal(domain.validateTransaction({ type: 'income', description: 'Venda', category: 'Serviços', amount: 100.5, occurred_on: '2026-11-10' }), '');
});

test('rejeita tipo, descrição, categoria, valor e data inválidos', () => {
  const base = { type: 'income', description: 'Venda', category: 'Serviços', amount: 1, occurred_on: '2026-11-10' };
  assert.match(domain.validateTransaction({ ...base, type: 'transfer' }), /tipo válido/);
  assert.match(domain.validateTransaction({ ...base, description: '   ' }), /descrição/);
  assert.match(domain.validateTransaction({ ...base, category: '' }), /categoria/);
  assert.match(domain.validateTransaction({ ...base, amount: 0 }), /maior que zero/);
  assert.match(domain.validateTransaction({ ...base, occurred_on: '2026-02-30' }), /data válida/);
});

test('respeita os limites do schema PostgreSQL', () => {
  const base = { type: 'expense', description: 'x', category: 'x', amount: 1, occurred_on: '2026-11-10' };
  assert.match(domain.validateTransaction({ ...base, description: 'x'.repeat(81) }), /80/);
  assert.match(domain.validateTransaction({ ...base, category: 'x'.repeat(41) }), /categoria/);
  assert.match(domain.validateTransaction({ ...base, amount: 1000000000 }), /limite/);
});

test('mapeia o formato do banco para o formato da interface', () => {
  assert.deepEqual(domain.mapTransaction({ id: '1', type: 'income', description: 'Venda', category: 'Serviços', amount: '12.30', occurred_on: '2026-11-10' }),
    { id: '1', type: 'income', desc: 'Venda', category: 'Serviços', amount: 12.3, date: '2026-11-10' });
});

test('calcula receitas, despesas, lucro e margem sem inventar dados', () => {
  assert.deepEqual(domain.totals([{ type: 'income', amount: 200 }, { type: 'expense', amount: 50 }]), { income: 200, expense: 50, profit: 150, margin: 75 });
  assert.deepEqual(domain.totals([]), { income: 0, expense: 0, profit: 0, margin: null });
  assert.deepEqual(domain.totals([{ type: 'income', amount: 0.1 }, { type: 'income', amount: 0.2 }]),
    { income: 0.3, expense: 0, profit: 0.3, margin: 100 });
});

test('agrupa categorias e calcula participação', () => {
  const result = domain.groupByCategory([
    { type: 'expense', category: 'Marketing', amount: 30 },
    { type: 'expense', category: 'Marketing', amount: 20 },
    { type: 'expense', category: 'Impostos', amount: 50 },
    { type: 'income', category: 'Serviços', amount: 500 }
  ], 'expense');
  assert.deepEqual(result, [
    { name: 'Marketing', value: 50, share: 50 },
    { name: 'Impostos', value: 50, share: 50 }
  ]);
});
