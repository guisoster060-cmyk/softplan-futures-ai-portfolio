(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BusinessMindTransactionsLoader = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const PAGE_SIZE = 500;
  const MAX_ROWS = 5000;

  async function loadTransactions(client, companyId, pageSize = PAGE_SIZE) {
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > PAGE_SIZE) throw Error('Tamanho de página inválido.');
    const rows = [], ids = new Set();
    let expected = null;
    for (let offset = 0; expected === null || offset < expected; offset += pageSize) {
      const result = await client.from('transactions')
        .select('id,type,description,category,amount,occurred_on', { count: 'exact' })
        .eq('company_id', companyId)
        .order('occurred_on', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + pageSize - 1);
      if (result.error) throw result.error;
      if (!Number.isInteger(result.count) || result.count < 0 || result.count > MAX_ROWS ||
          (expected !== null && result.count !== expected) || !Array.isArray(result.data)) {
        throw Error('Consulta financeira incompleta. Tente atualizar a página.');
      }
      expected = result.count;
      const needed = Math.min(pageSize, expected - offset);
      if (result.data.length !== needed) throw Error('Consulta financeira incompleta. Tente atualizar a página.');
      for (const row of result.data) {
        if (!row?.id || ids.has(row.id)) throw Error('Consulta financeira inconsistente. Tente atualizar a página.');
        ids.add(row.id); rows.push(row);
      }
    }
    return rows;
  }
  return Object.freeze({ loadTransactions, PAGE_SIZE, MAX_ROWS });
}));
