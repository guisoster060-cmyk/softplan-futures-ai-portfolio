'use strict';

const { chromium } = require('playwright');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { resolve, extname } = require('node:path');
const assert = require('node:assert/strict');

const root = resolve(__dirname, '../app');
const fixtures = { users: {}, companies: {}, rows: [], session: null, nextId: 1 };
const mock = `window.supabase = { createClient() {
  const db = window.__fixture;
  const save = () => localStorage.setItem('__e2e_fixture', JSON.stringify(db));
  let listener;
  const emit = () => listener?.('SIGNED_IN', db.session);
  const client = {
    auth: {
      onAuthStateChange(fn) { listener = fn; setTimeout(emit, 0); return { data: { subscription: { unsubscribe() {} } } }; },
      async signUp({ email, password, options }) { if (db.users[email]) return { error: { message: 'User already registered' } }; db.users[email] = { id: email, email, password, user_metadata: options.data }; save(); return { data: { session: null }, error: null }; },
      async signInWithPassword({ email, password }) { const u = db.users[email]; if (!u || u.password !== password) return { error: { message: 'Invalid login credentials' } }; db.session = { user: u }; save(); emit(); return { error: null }; },
      async signOut() { db.session = null; save(); emit(); return { error: null }; },
      async resetPasswordForEmail() { return { error: null }; }
    },
    rpc(name, args) { const id = 'company-' + db.nextId++; db.companies[id] = { id, name: args.p_name, owner: db.session.user.id }; save(); return Promise.resolve({ data: id, error: null }).then(result => { emit(); return result; }); },
    from(table) {
      const q = { filters: {}, operation: 'select', payload: null };
      const run = () => {
        const uid = db.session?.user.id;
        if (!uid) return { data: null, error: { message: 'JWT inválido' } };
        let list = table === 'profiles' ? [{ id: uid, display_name: db.users[uid].user_metadata.display_name }] :
          table === 'company_members' ? Object.values(db.companies).filter(c => c.owner === uid).map(c => ({ company_id: c.id, user_id: uid })) :
          table === 'companies' ? Object.values(db.companies).filter(c => c.owner === uid) :
          db.rows.filter(r => db.companies[r.company_id]?.owner === uid);
        list = list.filter(r => Object.entries(q.filters).every(([k,v]) => r[k] === v) && Object.entries(q.inFilters || {}).every(([k,values]) => values.includes(r[k])));
        if (q.operation === 'insert') { if (db.companies[q.payload.company_id]?.owner !== uid) return { data: null, error: { message: 'RLS' } }; const row = { ...q.payload, id: 'tx-' + db.nextId++ }; db.rows.push(row); save(); return { data: row, error: null }; }
        if (q.operation === 'update') { const row = list[0]; if (row) Object.assign(row, q.payload); save(); return { data: row || null, error: null }; }
        if (q.operation === 'delete') { for (const row of list) db.rows.splice(db.rows.indexOf(row), 1); save(); return { data: null, error: null }; }
        return { data: list, count: q.count ? list.length : null, error: null };
      };
      const b = {
        select(_columns, options) { q.count = options?.count === 'exact'; return b; }, eq(k,v) { q.filters[k] = v; return b; }, in(k,values) { (q.inFilters ||= {})[k] = values; return b; }, limit() { return b; }, order() { return b; },
        async range(start,end) { const result = run(); return { ...result, data: result.data?.slice(start,end + 1) }; },
        insert(v) { q.operation = 'insert'; q.payload = v; return b; }, update(v) { q.operation = 'update'; q.payload = v; return b; }, delete() { q.operation = 'delete'; return b; },
        async single() { const r = run(); return { ...r, data: Array.isArray(r.data) ? r.data[0] || null : r.data }; },
        then(ok, fail) { return Promise.resolve(run()).then(ok, fail); }
      }; return b;
    }
  }; return client;
} };`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(root + '/') && file !== root) { res.writeHead(403).end(); return; }
  try { const body = await readFile(file); res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[extname(file)] || 'text/html'); res.end(body); }
  catch { res.writeHead(404).end(); }
});

(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ acceptDownloads: true });
  await context.addInitScript(value => { window.__fixture = JSON.parse(localStorage.getItem('__e2e_fixture') || 'null') || value; }, fixtures);
  const page = await context.newPage();
  await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: mock }));
  const url = `http://127.0.0.1:${server.address().port}`;
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  try {
    await page.goto(url); await page.locator('#auth-switch').click();
    await page.locator('#display-name').fill('Teste A'); await page.locator('#email').fill('a@example.invalid'); await page.locator('#password').fill('senha123'); await page.locator('#auth-submit').click();
    await page.getByText('Confirme seu e-mail', { exact: true }).waitFor(); await page.locator('#modal-ok').click();
    await page.locator('#email').fill('a@example.invalid'); await page.locator('#password').fill('senha123'); await page.locator('#auth-submit').click();
    await page.locator('#onboarding-screen').waitFor({ state: 'visible' }); await page.locator('#company-name').fill('Empresa A'); await page.locator('#company-form button[type=submit]').click();
    await page.locator('#app').waitFor({ state: 'visible' }); await page.locator('[data-page=indicators]').first().click();
    await page.locator('#new-tx').click(); await page.locator('#tx-desc').fill('Venda fictícia'); await page.locator('#tx-amount').fill('100'); await page.locator('#tx-form button[type=submit]').click();
    await page.getByText('Venda fictícia').waitFor(); await page.reload(); await page.locator('#app').waitFor({ state: 'visible' });
    await page.locator('[data-page=indicators]').first().click(); await page.getByText('Venda fictícia').waitFor();
    assert.match(await page.locator('#ind-kpis').innerText(), /R\$\s*100,00/);
    await page.locator('[data-act=edit]').first().click(); await page.locator('#tx-desc').fill('Venda editada'); await page.locator('#tx-form button[type=submit]').click();
    await page.getByText('Venda editada').waitFor();
    await page.locator('#new-tx').click(); await page.locator('#tx-type').selectOption('expense'); await page.locator('#tx-desc').fill('Custo fictício'); await page.locator('#tx-amount').fill('40'); await page.locator('#tx-form button[type=submit]').click();
    await page.getByText('Custo fictício').waitFor();
    await page.locator('#f-type').selectOption('expense'); assert.match(await page.locator('#f-count').innerText(), /1 movimentação/);
    await page.locator('#f-type').selectOption('all'); await page.locator('[data-page=overview]').first().click();
    assert.match(await page.locator('#overview-kpis').innerText(), /R\$\s*60,00/);
    assert.match(await page.locator('#alerts-list').innerText(), /categoria|alerta/i);
    assert.ok(await page.locator('#month-chart circle').count() > 0);
    await page.locator('[data-page=indicators]').first().click();
    const download = page.waitForEvent('download'); await page.locator('#export-csv').click(); assert.match((await download).suggestedFilename(), /movimentacoes/);
    page.once('dialog', dialog => dialog.accept()); await page.locator('[data-act=del]').first().click();
    await page.getByText('Custo fictício').waitFor({ state: 'hidden' });
    await page.locator('[data-page=settings]').first().click(); await page.locator('[data-tab=data]').click();
    await page.locator('#new-company-name').fill('Empresa A2'); await page.locator('#new-company-form button[type=submit]').click();
    await page.locator('#user-company').filter({ hasText: 'Empresa A2' }).waitFor();
    await page.locator('#workspace-switch').waitFor({ state: 'visible' });
    await page.locator('#company-select').selectOption({ label: 'Empresa A' });
    await page.locator('[data-page=indicators]').first().click(); await page.getByText('Venda editada').waitFor();
    await page.locator('#company-select').selectOption({ label: 'Empresa A2' });
    await page.locator('[data-page=indicators]').first().click();
    assert.match(await page.locator('#f-count').innerText(), /0 movimentações/);
    await page.locator('#new-tx').click(); await page.locator('#tx-desc').fill('Venda da segunda empresa'); await page.locator('#tx-amount').fill('20'); await page.locator('#tx-form button[type=submit]').click();
    await page.getByText('Venda da segunda empresa').waitFor();
    await page.locator('#company-select').selectOption({ label: 'Empresa A' });
    await page.locator('[data-page=indicators]').first().click(); await page.getByText('Venda editada').waitFor();
    assert.equal(await page.getByText('Venda da segunda empresa').count(), 0);
    await page.locator('#logout').click(); await page.locator('#login-screen').waitFor({ state: 'visible' });
    await page.locator('#email').fill('a@example.invalid'); await page.locator('#password').fill('errada1'); await page.locator('#auth-submit').click();
    await page.getByText('E-mail ou senha incorretos.').waitFor();
    await page.locator('#auth-switch').click(); await page.locator('#display-name').fill('Teste B'); await page.locator('#email').fill('b@example.invalid'); await page.locator('#password').fill('senha123'); await page.locator('#auth-submit').click();
    await page.locator('#modal-ok').click(); await page.locator('#email').fill('b@example.invalid'); await page.locator('#password').fill('senha123'); await page.locator('#auth-submit').click();
    await page.locator('#onboarding-screen').waitFor({ state: 'visible' }); await page.locator('#company-name').fill('Empresa B'); await page.locator('#company-form button[type=submit]').click();
    await page.locator('#app').waitFor({ state: 'visible' }); await page.locator('[data-page=indicators]').first().click();
    assert.match(await page.locator('#f-count').innerText(), /0 movimentações/);
    assert.deepEqual(errors, []); console.log('E2E local: Auth, CRUD, recarga, dashboard, CSV, alternância de empresas e isolamento simulado aprovados.');
  } catch (error) { console.error('UI:', await page.locator('#tx-error').textContent(), 'page errors:', errors); throw error; }
  finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
