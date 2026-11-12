/* Adaptador exclusivamente local para a apresentação fictícia. Não usa rede. */
(function () {
  'use strict';
  const key = 'businessmind.demo.v1';
  const today = new Date();
  const date = offset => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 10);
    return d.toISOString().slice(0, 10);
  };
  const seed = () => ({
    session: true,
    user: { id: 'demo-user', email: 'demo@example.invalid', user_metadata: { display_name: 'Visitante' } },
    companies: [{ id: 'demo-company', name: 'Empresa fictícia', owner: 'demo-user' }],
    rows: [
      { id: 'demo-1', company_id: 'demo-company', type: 'income', description: 'Venda ilustrativa', category: 'Produtos', amount: 2400, occurred_on: date(0) },
      { id: 'demo-2', company_id: 'demo-company', type: 'income', description: 'Serviço ilustrativo', category: 'Serviços', amount: 1200, occurred_on: date(0) },
      { id: 'demo-3', company_id: 'demo-company', type: 'expense', description: 'Custo ilustrativo', category: 'Ferramentas', amount: 380, occurred_on: date(0) },
      { id: 'demo-4', company_id: 'demo-company', type: 'expense', description: 'Marketing ilustrativo', category: 'Marketing', amount: 500, occurred_on: date(0) },
      { id: 'demo-5', company_id: 'demo-company', type: 'income', description: 'Venda anterior ilustrativa', category: 'Produtos', amount: 1800, occurred_on: date(-1) }
    ]
  });
  let db;
  try { db = JSON.parse(localStorage.getItem(key)) || seed(); } catch { db = seed(); }
  const save = () => { try { localStorage.setItem(key, JSON.stringify(db)); } catch { /* sessão efêmera */ } };
  const session = () => db.session ? { user: db.user } : null;
  let listener;
  const emit = () => listener?.('SIGNED_IN', session());
  window.BusinessMindDemo = Object.freeze({ reset() { db = seed(); save(); location.reload(); } });
  window.supabase = { createClient() {
    const client = {
      auth: {
        onAuthStateChange(fn) { listener = fn; setTimeout(emit, 0); return { data: { subscription: { unsubscribe() {} } } }; },
        async signInWithPassword() { db.session = true; save(); emit(); return { error: null }; },
        async signOut() { db.session = false; save(); emit(); return { error: null }; },
        async signUp() { return { data: { session: null }, error: { message: 'Cadastro indisponível no modo fictício.' } }; },
        async resetPasswordForEmail() { return { error: { message: 'Recuperação indisponível no modo fictício.' } }; }
      },
      functions: { async invoke() { return { error: { message: 'IA externa indisponível na demonstração.' } }; } },
      async rpc(name, args) {
        if (name !== 'create_company' || !db.session) return { data: null, error: { message: 'Operação não permitida.' } };
        const id = crypto.randomUUID(); db.companies.push({ id, name: args.p_name, owner: db.user.id }); save(); return { data: id, error: null };
      },
      from(table) {
        const q = { filters: {}, inFilters: {}, operation: 'select', payload: null, exact: false };
        const run = () => {
          if (!db.session) return { data: null, count: null, error: { message: 'Sessão indisponível.' } };
          const source = table === 'profiles' ? [{ id: db.user.id, display_name: db.user.user_metadata.display_name }]
            : table === 'company_members' ? db.companies.map(c => ({ user_id: c.owner, company_id: c.id }))
            : table === 'companies' ? db.companies : table === 'transactions' ? db.rows : null;
          if (!source) return { data: null, count: null, error: { message: 'Tabela indisponível.' } };
          const visible = source.filter(row => Object.entries(q.filters).every(([k, v]) => row[k] === v) &&
            Object.entries(q.inFilters).every(([k, values]) => values.includes(row[k])));
          if (q.operation === 'insert') {
            if (table !== 'transactions' || !db.companies.some(c => c.id === q.payload.company_id)) return { data: null, error: { message: 'Empresa inválida.' } };
            const row = { ...q.payload, id: crypto.randomUUID() }; db.rows.push(row); save(); return { data: row, error: null };
          }
          if (q.operation === 'update') {
            const row = visible[0];
            if (row) {
              Object.assign(row, q.payload);
              if (table === 'profiles') db.user.user_metadata.display_name = row.display_name;
            }
            save(); return { data: row || null, error: null };
          }
          if (q.operation === 'delete') { visible.forEach(row => source.splice(source.indexOf(row), 1)); save(); return { data: null, error: null }; }
          return { data: visible, count: q.exact ? visible.length : null, error: null };
        };
        const query = {
          select(_fields, options) { q.exact = options?.count === 'exact'; return query; },
          eq(k, v) { q.filters[k] = v; return query; },
          in(k, values) { q.inFilters[k] = values; return query; },
          order() { return query; },
          async range(start, end) { const result = run(); return { ...result, data: result.data?.slice(start, end + 1) }; },
          insert(payload) { q.operation = 'insert'; q.payload = payload; return query; },
          update(payload) { q.operation = 'update'; q.payload = payload; return query; },
          delete() { q.operation = 'delete'; return query; },
          async single() { const result = run(); return { ...result, data: Array.isArray(result.data) ? result.data[0] || null : result.data }; },
          then(ok, fail) { return Promise.resolve(run()).then(ok, fail); }
        };
        return query;
      }
    };
    return client;
  } };
})();
