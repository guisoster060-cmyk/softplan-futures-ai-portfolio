(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BusinessMindDomain = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const validIsoDate = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };

  function validateTransaction(input) {
    const description = String(input.description || '').trim();
    const category = String(input.category || '').trim();
    const amount = Number(input.amount);
    if (!['income', 'expense'].includes(input.type)) return 'Selecione um tipo válido.';
    if (!description) return 'Informe a descrição.';
    if (description.length > 80) return 'A descrição deve ter até 80 caracteres.';
    if (!category || category.length > 40) return 'Selecione uma categoria válida.';
    if (!Number.isFinite(amount) || amount <= 0) return 'Informe um valor maior que zero.';
    if (amount > 999999999.99) return 'Valor acima do limite permitido.';
    if (!validIsoDate(input.occurred_on)) return 'Informe uma data válida.';
    return '';
  }

  function mapTransaction(row) {
    return {
      id: row.id,
      type: row.type,
      desc: row.description,
      category: row.category,
      amount: Number(row.amount),
      date: row.occurred_on
    };
  }

  function totals(list) {
    const incomeCents = list.filter(item => item.type === 'income').reduce((sum, item) => sum + Math.round(Number(item.amount) * 100), 0);
    const expenseCents = list.filter(item => item.type === 'expense').reduce((sum, item) => sum + Math.round(Number(item.amount) * 100), 0);
    const income = incomeCents / 100, expense = expenseCents / 100;
    return { income, expense, profit: (incomeCents - expenseCents) / 100, margin: incomeCents > 0 ? ((incomeCents - expenseCents) / incomeCents) * 100 : null };
  }

  function groupByCategory(list, type) {
    const grouped = {};
    list.filter(item => item.type === type).forEach(item => { grouped[item.category] = (grouped[item.category] || 0) + Math.round(Number(item.amount) * 100); });
    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);
    return Object.entries(grouped).map(([name, cents]) => ({ name, value: cents / 100, share: total ? (cents / total) * 100 : 0 })).sort((a, b) => b.value - a.value);
  }

  return Object.freeze({ validIsoDate, validateTransaction, mapTransaction, totals, groupByCategory });
}));
