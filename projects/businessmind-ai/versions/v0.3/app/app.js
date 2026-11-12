'use strict';
/* BusinessMind AI v0.3 — demonstração funcional (HTML/CSS/JS puro).
   Sem servidor, sem IA externa. Dados fictícios guardados no navegador (localStorage). */

/* ---------- Constantes ---------- */
const KEYS = { tx: 'bm03.transactions', session: 'bm03.session', prefs: 'bm03.prefs', profile: 'bm03.profile' };
// Credencial DEMONSTRATIVA: visível no código-fonte; não protege nada.
const DEMO_USER = { email: 'demo@businessmind.ai', password: 'demo1234' };
const CATEGORIES = {
  income: ['Serviços', 'Produtos', 'Assinaturas', 'Outras receitas'],
  expense: ['Folha e equipe', 'Marketing', 'Ferramentas', 'Aluguel e estrutura', 'Impostos', 'Outras despesas']
};
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const PALETTE = ['#246aff', '#914cff', '#25d0df', '#ffb044', '#42d27e', '#ff647c'];
const SUGGESTIONS = ['Qual foi meu lucro este mês?', 'Qual minha maior despesa?', 'Como está a tendência da receita?', 'Qual a previsão do próximo mês?', 'Quais recomendações você tem?'];
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const pad = n => String(n).padStart(2, '0');
const fmtPct = v => (v == null ? '—' : v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%');
const fmtDate = s => s.split('-').reverse().join('/');
const $ = id => document.getElementById(id);

/* ---------- Estado e armazenamento ---------- */
let transactions = [];
let prefs = { compact: false, reduceMotion: false, showAlerts: true };
let profile = { name: 'Empresário', company: 'Empresa Exemplo' };
let editingId = null;
let storageWarned = false;

const store = {
  area(kind) { try { return kind === 'session' ? window.sessionStorage : window.localStorage; } catch (e) { return null; } },
  get(kind, key, fallback) { try { const a = this.area(kind); const raw = a && a.getItem(key); return raw == null ? fallback : JSON.parse(raw); } catch (e) { return fallback; } },
  set(kind, key, value) {
    try { const a = this.area(kind); if (!a) throw new Error('indisponível'); a.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { if (!storageWarned) { storageWarned = true; toast('Armazenamento local indisponível: as alterações não serão salvas.'); } return false; }
  },
  del(kind, key) { try { const a = this.area(kind); if (a) a.removeItem(key); } catch (e) { /* ignora */ } }
};

/* ---------- Dados ---------- */
const isoOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const validIso = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00'));
const newId = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function sanitize(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(t => t && (t.type === 'income' || t.type === 'expense') && typeof t.id === 'string' &&
    typeof t.desc === 'string' && typeof t.category === 'string' && Number.isFinite(t.amount) && t.amount > 0 && validIso(t.date))
    .map(t => ({ id: t.id, type: t.type, desc: t.desc.slice(0, 80), category: t.category.slice(0, 40), amount: Math.round(t.amount * 100) / 100, date: t.date }));
}

// Dados 100% fictícios, gerados de forma determinística para os últimos 6 meses.
function seedTransactions() {
  const now = new Date(); const out = []; let n = 1;
  const inc = [['Consultoria empresarial', 'Serviços', 18000], ['Mentoria premium', 'Serviços', 9500], ['Venda de licenças', 'Produtos', 12000], ['Assinaturas mensais', 'Assinaturas', 6500], ['Treinamento in company', 'Serviços', 7000]];
  const exp = [['Folha de pagamento', 'Folha e equipe', 21000], ['Aluguel do escritório', 'Aluguel e estrutura', 4200], ['Campanhas de anúncios', 'Marketing', 5200], ['Ferramentas e software', 'Ferramentas', 2300], ['Impostos do mês', 'Impostos', 6800]];
  for (let m = 5; m >= 0; m--) {
    const first = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const incGrowth = 1 + (5 - m) * 0.05, expGrowth = 1 + (5 - m) * 0.02;
    const add = (list, type, growth, offset) => list.forEach(([desc, category, base], i) => {
      const factor = 1 + (((i * 7 + m * 3 + offset) % 9) - 4) / 100;
      let day = 3 + ((i * 5 + m * 2 + offset) % 24);
      if (m === 0) day = Math.min(day, now.getDate());
      out.push({ id: 's' + n++, type, desc, category, amount: Math.round(base * growth * factor * 100) / 100, date: isoOf(new Date(first.getFullYear(), first.getMonth(), day)) });
    });
    add(inc, 'income', incGrowth, 0); add(exp, 'expense', expGrowth, 4);
  }
  return out;
}

function loadState() {
  const stored = store.get('local', KEYS.tx, null);
  transactions = stored === null ? seedTransactions() : sanitize(stored);
  if (stored === null) saveTx();
  const p = store.get('local', KEYS.prefs, {}), f = store.get('local', KEYS.profile, {});
  prefs = { compact: !!p.compact, reduceMotion: !!p.reduceMotion, showAlerts: p.showAlerts !== false };
  if (typeof f.name === 'string' && f.name.trim()) profile.name = f.name.slice(0, 40);
  if (typeof f.company === 'string' && f.company.trim()) profile.company = f.company.slice(0, 60);
}
const saveTx = () => store.set('local', KEYS.tx, transactions);

/* ---------- Cálculos ---------- */
const sumOf = (list, type) => list.filter(t => t.type === type).reduce((a, t) => a + t.amount, 0);
function totals(list) {
  const income = sumOf(list, 'income'), expense = sumOf(list, 'expense');
  return { income, expense, profit: income - expense, margin: income > 0 ? ((income - expense) / income) * 100 : null };
}
const monthInfo = off => { const d = new Date(new Date().getFullYear(), new Date().getMonth() + off, 1); return { key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, label: MONTHS[d.getMonth()], date: d }; };
const monthTx = off => { const k = monthInfo(off).key; return transactions.filter(t => t.date.startsWith(k)); };
function byMonth(n) {
  const rows = [];
  for (let i = n - 1; i >= 0; i--) { const mi = monthInfo(-i); const t = totals(monthTx(-i)); rows.push({ key: mi.key, label: mi.label, income: t.income, expense: t.expense }); }
  return rows;
}
function groupByCategory(list, type) {
  const map = {}; list.filter(t => t.type === type).forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
  const total = Object.values(map).reduce((a, b) => a + b, 0);
  return Object.entries(map).map(([name, value]) => ({ name, value, share: total ? (value / total) * 100 : 0 })).sort((a, b) => b.value - a.value);
}
const change = (cur, prev) => (prev > 0 ? ((cur - prev) / prev) * 100 : null);
function extreme(list, type) { return list.filter(t => t.type === type).sort((a, b) => b.amount - a.amount)[0] || null; }

function analyze() {
  const cur = monthTx(0), prev = monthTx(-1);
  const months = byMonth(6);
  return { cur, prev, c: totals(cur), p: totals(prev), months, monthsWithData: months.filter(m => m.income || m.expense).length, enough: transactions.length >= 5 };
}
// Projeção linear simples sobre os últimos 3 meses (exige receita nos 3).
function forecast(a) {
  const last3 = a.months.slice(-3);
  if (last3.some(m => m.income <= 0)) return null;
  const est = last3[2].income + (last3[2].income - last3[0].income) / 2;
  return Math.max(0, est);
}
function buildAlerts(a) {
  const out = [];
  if (!transactions.length) return ['Não há movimentações cadastradas. Cadastre receitas e despesas em Indicadores para gerar alertas.'];
  if (!a.cur.length) out.push('Nenhuma movimentação registrada no mês atual.');
  if (a.cur.length && a.c.profit < 0) out.push(`Despesas (${brl.format(a.c.expense)}) superiores às receitas (${brl.format(a.c.income)}) no mês atual.`);
  if (a.c.margin != null && a.c.margin >= 0 && a.c.margin < 15) out.push(`Margem do mês em ${fmtPct(a.c.margin)}, abaixo de 15%.`);
  const eg = change(a.c.expense, a.p.expense);
  if (eg != null && eg > 15) out.push(`Despesas do mês ${fmtPct(eg)} acima do mês anterior.`);
  const top = groupByCategory(a.cur, 'expense')[0];
  if (top && top.share > 40) out.push(`A categoria "${top.name}" concentra ${fmtPct(top.share)} das despesas do mês.`);
  return out.length ? out : ['Nenhum alerta com base nas regras atuais e nos dados cadastrados.'];
}

/* ---------- Utilitários de interface ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
let toastTimer;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }
function showModal(title, message) { $('modal-title').textContent = title; $('modal-message').textContent = message; $('modal').classList.add('open'); $('modal-ok').focus(); }
const closeModal = () => $('modal').classList.remove('open');

function deltaHtml(cur, prev, goodWhenUp) {
  const g = change(cur, prev);
  if (g == null) return '<small class="muted">sem base de comparação</small>';
  const good = goodWhenUp ? g >= 0 : g <= 0;
  return `<small class="${good ? 'positive' : 'negative'}">${g >= 0 ? '↑' : '↓'} ${fmtPct(Math.abs(g))} <em>vs mês anterior</em></small>`;
}
const kpi = (label, icon, cls, value, delta) => `<article class="kpi"><div class="kpi-label"><span class="kpi-icon ${cls}">${icon}</span>${esc(label)}</div><strong>${esc(value)}</strong>${delta}</article>`;

/* ---------- Renderização: Visão geral ---------- */
function renderOverview() {
  const a = analyze();
  $('greet-name').textContent = profile.name;
  $('today-label').textContent = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const mDelta = a.c.margin != null && a.p.margin != null ? a.c.margin - a.p.margin : null;
  $('overview-kpis').innerHTML =
    kpi('Receitas (mês)', '＄', 'blue', brl.format(a.c.income), deltaHtml(a.c.income, a.p.income, true)) +
    kpi('Despesas (mês)', '＄', 'violet', brl.format(a.c.expense), deltaHtml(a.c.expense, a.p.expense, false)) +
    kpi('Lucro (mês)', '▣', 'green', brl.format(a.c.profit), deltaHtml(a.c.profit, a.p.profit, true)) +
    kpi('Margem (mês)', '▣', 'cyan', fmtPct(a.c.margin), mDelta == null ? '<small class="muted">sem base de comparação</small>' : `<small class="${mDelta >= 0 ? 'positive' : 'negative'}">${mDelta >= 0 ? '↑' : '↓'} ${Math.abs(mDelta).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} p.p. <em>vs mês anterior</em></small>`);

  const bigIn = extreme(a.cur, 'income'), bigEx = extreme(a.cur, 'expense'), incCount = a.cur.filter(t => t.type === 'income').length;
  const rows = [['Movimentações no mês', String(a.cur.length)], ['Maior receita', bigIn ? `${brl.format(bigIn.amount)}` : '—'], ['Maior despesa', bigEx ? `${brl.format(bigEx.amount)}` : '—'], ['Ticket médio das receitas', incCount ? brl.format(a.c.income / incCount) : '—']];
  const qr = $('quick-rows'); qr.textContent = '';
  rows.forEach(([k, v]) => { const r = el('div', 'quick-row'); r.append(el('span', '', k), el('b', '', v)); qr.append(r); });

  renderMonthChart(a.months);

  const g = change(a.c.income, a.p.income);
  $('insight-text').textContent = !a.cur.length ? 'Sem movimentações no mês atual para analisar.'
    : g == null ? `Receitas do mês: ${brl.format(a.c.income)}. Não há receitas no mês anterior para comparar.`
    : `Receitas do mês: ${brl.format(a.c.income)}, ${fmtPct(Math.abs(g))} ${g >= 0 ? 'acima' : 'abaixo'} do mês anterior (${brl.format(a.p.income)}). Lucro do mês: ${brl.format(a.c.profit)}.`;
  const topEx = groupByCategory(a.cur, 'expense')[0];
  $('opp-text').textContent = !topEx ? 'Sem despesas no mês atual para analisar.'
    : `"${topEx.name}" é a maior categoria de despesa do mês (${fmtPct(topEx.share)}). Cenário hipotético: reduzir 5% dela economizaria ${brl.format(topEx.value * 0.05)} no mês.`;

  const alerts = buildAlerts(a), real = alerts.length && !alerts[0].startsWith('Nenhum alerta');
  const ul = $('alerts-list'); ul.textContent = ''; alerts.forEach(t => ul.append(el('li', '', t)));
  $('alerts-dot').hidden = !(real && prefs.showAlerts);
  $('alerts-panel').hidden = !prefs.showAlerts;
}

function niceMax(v) { if (v <= 0) return 1000; const p = Math.pow(10, Math.floor(Math.log10(v))); return Math.ceil(v / p * 2) / 2 * p; }
const shortMoney = v => (v >= 1000 ? (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k' : String(Math.round(v)));
function renderMonthChart(data) {
  const max = niceMax(Math.max(0, ...data.flatMap(d => [d.income, d.expense])));
  const x = i => (data.length === 1 ? 300 : (i * 600) / (data.length - 1)), y = v => 220 - (v / max) * 220;
  const pts = key => data.map((d, i) => `${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`);
  const line = key => 'M' + pts(key).join(' L');
  $('month-chart').innerHTML =
    '<defs><linearGradient id="bluefill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1769ff" stop-opacity=".4"/><stop offset="1" stop-color="#1769ff" stop-opacity="0"/></linearGradient></defs>' +
    `<path class="chart-area" d="${line('income')} L600 220 L0 220Z"/><path class="chart-line" d="${line('income')}"/><path class="chart-line exp" d="${line('expense')}"/>`;
  $('chart-y').innerHTML = [1, .75, .5, .25, 0].map(f => `<span>${shortMoney(max * f)}</span>`).join('');
  $('chart-x').innerHTML = data.map(d => `<span>${esc(d.label)}</span>`).join('');
}

/* ---------- Renderização: Indicadores ---------- */
function periodStart() {
  const n = Number($('f-period').value); if (!n) return '0000-00-00';
  const d = new Date(new Date().getFullYear(), new Date().getMonth() - (n - 1), 1); return isoOf(d);
}
const inPeriod = () => { const s = periodStart(); return transactions.filter(t => t.date >= s); };
function filteredTx() {
  const type = $('f-type').value;
  return inPeriod().filter(t => type === 'all' || t.type === type).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));
}
function renderIndicators() {
  const per = inPeriod(), t = totals(per), list = filteredTx();
  $('ind-kpis').innerHTML =
    kpi('Receitas', '＄', 'blue', brl.format(t.income), '<small class="muted">no período</small>') +
    kpi('Despesas', '＄', 'violet', brl.format(t.expense), '<small class="muted">no período</small>') +
    kpi('Lucro', '▣', 'green', brl.format(t.profit), `<small class="${t.profit >= 0 ? 'positive' : 'negative'}">${t.profit >= 0 ? 'resultado positivo' : 'resultado negativo'}</small>`) +
    kpi('Margem', '▣', 'cyan', fmtPct(t.margin), '<small class="muted">lucro ÷ receitas</small>');
  $('f-count').textContent = `${list.length} movimentaç${list.length === 1 ? 'ão' : 'ões'} exibida${list.length === 1 ? '' : 's'}`;

  const box = $('tx-list'); box.textContent = '';
  if (!list.length) box.append(el('div', 'empty', transactions.length ? 'Nenhuma movimentação para os filtros escolhidos.' : 'Nenhuma movimentação cadastrada. Use “Nova movimentação” para começar.'));
  list.forEach(tx => {
    const row = el('div', 'tx-row');
    const desc = el('span', 'tx-desc'); desc.append(document.createTextNode(tx.desc), el('small', '', tx.category));
    const type = el('span', 'tx-type'); type.append(el('span', 'badge ' + tx.type, tx.type === 'income' ? 'Receita' : 'Despesa'));
    const amt = el('span', 'tx-amount ' + (tx.type === 'income' ? 'positive' : 'negative'), (tx.type === 'income' ? '+ ' : '− ') + brl.format(tx.amount));
    const act = el('span', 'tx-actions');
    [['edit', 'Editar', ''], ['del', 'Excluir', ' danger']].forEach(([a, label, extra]) => { const b = el('button', 'secondary-btn' + extra, label); b.type = 'button'; b.dataset.act = a; b.dataset.id = tx.id; b.setAttribute('aria-label', `${label} movimentação ${tx.desc}`); act.append(b); });
    row.append(el('span', 'tx-date', fmtDate(tx.date)), desc, type, amt, act); box.append(row);
  });

  const catType = $('f-type').value === 'expense' ? 'expense' : 'income';
  $('cat-title').textContent = catType === 'income' ? 'Receitas por categoria' : 'Despesas por categoria';
  const cats = groupByCategory(per, catType), leg = $('cat-legend'); leg.textContent = '';
  let acc = 0; const stops = [];
  cats.forEach((c, i) => { const col = PALETTE[i % PALETTE.length]; stops.push(`${col} ${acc.toFixed(2)}% ${(acc + c.share).toFixed(2)}%`); acc += c.share;
    const s = el('span'); const dot = el('i'); dot.style.background = col; const b = el('b', '', `${brl.format(c.value)} · ${fmtPct(c.share)}`); s.append(dot, document.createTextNode(c.name), b); leg.append(s); });
  $('cat-donut').style.background = stops.length ? `conic-gradient(${stops.join(',')})` : '#152542';
  if (!cats.length) leg.append(el('div', 'empty', 'Sem dados nesta categoria de movimentação.'));
}

/* ---------- Formulário de movimentações ---------- */
function fillCategories(type, selected) {
  const sel = $('tx-cat'); sel.textContent = '';
  const opts = CATEGORIES[type].slice(); if (selected && !opts.includes(selected)) opts.push(selected);
  opts.forEach(c => { const o = el('option', '', c); o.value = c; sel.append(o); }); if (selected) sel.value = selected;
}
function openTxForm(tx) {
  editingId = tx ? tx.id : null;
  $('tx-form-title').textContent = tx ? 'Editar movimentação' : 'Nova movimentação';
  $('tx-type').value = tx ? tx.type : 'income'; fillCategories($('tx-type').value, tx && tx.category);
  $('tx-desc').value = tx ? tx.desc : ''; $('tx-amount').value = tx ? tx.amount : ''; $('tx-date').value = tx ? tx.date : isoOf(new Date());
  $('tx-error').textContent = ''; $('tx-form').hidden = false; $('tx-desc').focus(); $('tx-form').scrollIntoView({ behavior: prefs.reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
}
const closeTxForm = () => { $('tx-form').hidden = true; editingId = null; };
function submitTx(e) {
  e.preventDefault();
  const desc = $('tx-desc').value.trim(), amount = Number($('tx-amount').value), date = $('tx-date').value;
  const err = !desc ? 'Informe a descrição.' : !Number.isFinite(amount) || amount <= 0 || $('tx-amount').value === '' ? 'Informe um valor maior que zero.' : amount > 1e9 ? 'Valor acima do limite permitido.' : !validIso(date) ? 'Informe uma data válida.' : '';
  if (err) { $('tx-error').textContent = err; return; }
  const rec = { type: $('tx-type').value, desc: desc.slice(0, 80), category: $('tx-cat').value, amount: Math.round(amount * 100) / 100, date };
  if (editingId) { const i = transactions.findIndex(t => t.id === editingId); if (i >= 0) transactions[i] = { id: editingId, ...rec }; } else transactions.push({ id: newId(), ...rec });
  saveTx(); closeTxForm(); renderAll(); toast('Movimentação salva.');
}
function onTxListClick(e) {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const tx = transactions.find(t => t.id === b.dataset.id); if (!tx) return;
  if (b.dataset.act === 'edit') openTxForm(tx);
  else if (window.confirm(`Excluir "${tx.desc}" (${brl.format(tx.amount)})?`)) { transactions = transactions.filter(t => t.id !== tx.id); saveTx(); renderAll(); toast('Movimentação excluída.'); }
}

/* ---------- CSV ---------- */
function csvCell(v) { let s = String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
function toCSV(list) {
  const head = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)'];
  const rows = list.map(t => [fmtDate(t.date), t.type === 'income' ? 'Receita' : 'Despesa', t.desc, t.category, t.amount.toFixed(2).replace('.', ',')]);
  return '\ufeff' + [head, ...rows].map(r => r.map(csvCell).join(';')).join('\r\n');
}
function exportCSV() {
  const list = filteredTx(); if (!list.length) { toast('Não há movimentações para exportar com os filtros atuais.'); return; }
  const url = URL.createObjectURL(new Blob([toCSV(list)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `movimentacoes-${isoOf(new Date())}.csv`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`CSV exportado (${list.length} linhas).`);
}

/* ---------- Assistente demonstrativo (regras locais) ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const has = (n, ...words) => words.some(w => n.includes(w));
function answer(q) {
  const n = norm(q), a = analyze();
  if (has(n, 'ajuda', 'o que voce', 'o que vc', 'pode fazer')) return 'Posso responder, com base nas movimentações cadastradas, sobre: lucro, receitas, despesas, margem, maiores receitas/despesas, categorias, tendência, previsão simples e recomendações.\nSou um assistente demonstrativo de regras locais, não uma IA conectada a modelo externo.';
  if (!transactions.length) return 'Ainda não há movimentações cadastradas, então não tenho dados para analisar. Cadastre receitas e despesas em Indicadores ou restaure os dados de demonstração em Configurações.';
  const base = `\n\nBase: ${transactions.length} movimentações cadastradas (${a.cur.length} no mês atual).`;
  if (has(n, 'previs', 'projec', 'proximo mes')) {
    const f = forecast(a);
    if (f == null) return 'Não há dados suficientes para estimar: preciso de receitas nos últimos 3 meses seguidos.' + base;
    const l3 = a.months.slice(-3).map(m => `${m.label}: ${brl.format(m.income)}`).join(' · ');
    return `Estimativa simples (não é garantia): receita do próximo mês perto de ${brl.format(f)}.\nMétodo: continua a variação média dos últimos 3 meses, sem sazonalidade nem fatores externos.\n${l3}` + base;
  }
  if (has(n, 'tendencia', 'evolu', 'cresc', 'historico')) {
    const m = a.months.filter(x => x.income > 0);
    if (m.length < 3) return 'Não há dados suficientes para falar de tendência: preciso de receitas em pelo menos 3 meses.' + base;
    const first = m[0], last = m[m.length - 1], g = change(last.income, first.income);
    return `Fato: a receita foi de ${brl.format(first.income)} em ${first.label} para ${brl.format(last.income)} em ${last.label} (${g >= 0 ? '+' : '−'}${fmtPct(Math.abs(g))} no período com dados).` + base;
  }
  if (has(n, 'maior despesa', 'maior gasto', 'despesa mais alta')) { const t = extreme(a.cur, 'expense'); return t ? `A maior despesa do mês atual é "${t.desc}": ${brl.format(t.amount)} (${t.category}, ${fmtDate(t.date)}).` + base : 'Não há despesas no mês atual.' + base; }
  if (has(n, 'maior receita', 'maior venda')) { const t = extreme(a.cur, 'income'); return t ? `A maior receita do mês atual é "${t.desc}": ${brl.format(t.amount)} (${t.category}, ${fmtDate(t.date)}).` + base : 'Não há receitas no mês atual.' + base; }
  if (has(n, 'margem')) return a.c.margin == null ? 'Não há receitas no mês atual, então a margem não pode ser calculada.' + base : `A margem do mês é ${fmtPct(a.c.margin)} (lucro ${brl.format(a.c.profit)} ÷ receitas ${brl.format(a.c.income)}).` + base;
  if (has(n, 'lucro', 'resultado')) { if (!a.cur.length) return 'Sem movimentações no mês atual para calcular o lucro.' + base; const g = change(a.c.profit, a.p.profit); return `Lucro do mês: ${brl.format(a.c.profit)} (receitas ${brl.format(a.c.income)} − despesas ${brl.format(a.c.expense)}).${g == null ? '' : `\nMês anterior: ${brl.format(a.p.profit)} (${g >= 0 ? '+' : '−'}${fmtPct(Math.abs(g))}).`}` + base; }
  if (has(n, 'categoria')) { const r = groupByCategory(a.cur, 'income')[0], d = groupByCategory(a.cur, 'expense')[0]; return !r && !d ? 'Sem movimentações no mês atual.' + base : `No mês atual: ${r ? `maior categoria de receita é "${r.name}" (${fmtPct(r.share)})` : 'sem receitas'}; ${d ? `maior categoria de despesa é "${d.name}" (${fmtPct(d.share)})` : 'sem despesas'}.` + base; }
  if (has(n, 'despesa', 'gasto', 'custo')) { const g = change(a.c.expense, a.p.expense), d = groupByCategory(a.cur, 'expense')[0]; return `Despesas do mês: ${brl.format(a.c.expense)}.${g == null ? '' : `\nVariação vs mês anterior: ${g >= 0 ? '+' : '−'}${fmtPct(Math.abs(g))}.`}${d ? `\nMaior categoria: "${d.name}" (${fmtPct(d.share)}).` : ''}` + base; }
  if (has(n, 'receita', 'faturamento', 'vendas', 'venda')) { const g = change(a.c.income, a.p.income); return `Receitas do mês: ${brl.format(a.c.income)}.${g == null ? '\nNão há receitas no mês anterior para comparar.' : `\nVariação vs mês anterior: ${g >= 0 ? '+' : '−'}${fmtPct(Math.abs(g))}.`}` + base; }
  if (has(n, 'recomend', 'dica', 'sugest', 'melhorar', 'o que fazer')) {
    const items = buildAnalysis(a).filter(i => i.kind === 'Recomendação' || i.kind === 'Risco');
    return items.length ? items.map(i => `• [${i.kind}] ${i.title}: ${i.text}`).join('\n') + '\n\nSão regras simples sobre os dados cadastrados, não consultoria.' + base : 'Não há dados suficientes para gerar recomendações (preciso de pelo menos 5 movimentações).' + base;
  }
  return 'Não entendi a pergunta. Tente algo como: "lucro do mês", "maior despesa", "tendência da receita", "previsão" ou "recomendações". Digite "ajuda" para ver o que sei responder.';
}
function addMsg(role, text) { const m = el('div', 'msg ' + role, text); $('chat-log').append(m); $('chat-log').scrollTop = $('chat-log').scrollHeight; }
function ask(q) { q = q.trim(); if (!q) return; addMsg('user', q); addMsg('bot', answer(q)); }

/* ---------- Análises e recomendações ---------- */
function buildAnalysis(a) {
  const out = [];
  if (!a.enough) return out;
  const topEx = groupByCategory(a.cur, 'expense')[0], topIn = groupByCategory(a.cur, 'income')[0];
  if (a.cur.length) out.push({ kind: 'Fato', title: 'Resultado do mês', text: `Receitas ${brl.format(a.c.income)}, despesas ${brl.format(a.c.expense)}, lucro ${brl.format(a.c.profit)}${a.c.margin != null ? ` (margem ${fmtPct(a.c.margin)})` : ''}.`, basis: `${a.cur.length} movimentações do mês atual.` });
  const ms = a.months.filter(m => m.income > 0);
  if (ms.length >= 3) { const g = change(ms[ms.length - 1].income, ms[0].income); out.push({ kind: 'Fato', title: 'Tendência da receita', text: `Receita ${g >= 0 ? 'cresceu' : 'caiu'} ${fmtPct(Math.abs(g))} entre ${ms[0].label} e ${ms[ms.length - 1].label}.`, basis: `${ms.length} meses com receita.` }); }
  const f = forecast(a); if (f != null) out.push({ kind: 'Estimativa', title: 'Receita do próximo mês', text: `Perto de ${brl.format(f)}, projetando a variação média dos últimos 3 meses.`, basis: 'Projeção linear simples, sem sazonalidade. Não é garantia.' });
  if (a.cur.length && a.c.margin != null && a.c.margin < 20) out.push({ kind: 'Recomendação', title: 'Revisar margem', text: `Margem de ${fmtPct(a.c.margin)} no mês. Vale revisar preços e custos principais.`, basis: 'Regra: margem abaixo de 20%.' });
  if (topEx && topEx.share > 40) out.push({ kind: 'Recomendação', title: `Revisar "${topEx.name}"`, text: `Concentra ${fmtPct(topEx.share)} das despesas do mês. Uma redução de 5% economizaria ${brl.format(topEx.value * 0.05)} (cenário hipotético).`, basis: 'Regra: categoria acima de 40% das despesas.' });
  if (topIn && topIn.share > 60) out.push({ kind: 'Risco', title: 'Receita concentrada', text: `"${topIn.name}" responde por ${fmtPct(topIn.share)} das receitas do mês.`, basis: 'Regra: categoria acima de 60% das receitas.' });
  if (a.cur.length && a.c.profit < 0) out.push({ kind: 'Risco', title: 'Resultado negativo', text: `As despesas superam as receitas em ${brl.format(Math.abs(a.c.profit))} no mês.`, basis: 'Regra: lucro do mês abaixo de zero.' });
  return out;
}
function renderAnalysis() {
  const box = $('analysis-list'); box.textContent = '';
  const items = buildAnalysis(analyze());
  if (!items.length) { const e = el('div', 'empty', 'Dados insuficientes: cadastre pelo menos 5 movimentações para gerar análises.'); e.style.gridColumn = '1/-1'; box.append(e); return; }
  items.forEach(i => { const c = el('article', 'panel analysis-item'); c.append(el('span', 'badge ' + i.kind, i.kind), el('h4', '', i.title), el('p', '', i.text), el('small', '', 'Base: ' + i.basis)); box.append(c); });
}

/* ---------- Configurações ---------- */
function applyPrefs() {
  document.body.classList.toggle('compact', prefs.compact); document.body.classList.toggle('reduce-motion', prefs.reduceMotion);
  $('pref-compact').checked = prefs.compact; $('pref-motion').checked = prefs.reduceMotion; $('pref-alerts').checked = prefs.showAlerts;
}
function renderSettings() {
  $('pf-name').value = profile.name; $('pf-company').value = profile.company; $('user-company').textContent = profile.company;
  $('data-info').textContent = `${transactions.length} movimentações armazenadas neste navegador.`;
}

/* ---------- Sessão (demonstrativa) e navegação ---------- */
function currentSession() { return store.get('session', KEYS.session, null) || store.get('local', KEYS.session, null); }
function showApp(email) {
  $('login-screen').hidden = true; $('app').hidden = false; $('user-email').textContent = email; $('pf-email').value = email;
  renderAll(); navigate('overview');
}
function showLogin() { $('app').hidden = true; $('login-screen').hidden = false; $('password').value = ''; $('login-error').textContent = ''; $('email').focus(); }
function onLogin(e) {
  e.preventDefault();
  const email = $('email').value.trim().toLowerCase(), pw = $('password').value;
  if (!email || !pw) { $('login-error').textContent = 'Informe e-mail e senha.'; return; }
  if (email !== DEMO_USER.email || pw !== DEMO_USER.password) { $('login-error').textContent = 'E-mail ou senha incorretos (use as credenciais de demonstração).'; return; }
  const s = { email, at: Date.now() };
  store.del('session', KEYS.session); store.del('local', KEYS.session);
  store.set($('keep').checked ? 'local' : 'session', KEYS.session, s);
  showApp(email);
}
function logout() { store.del('session', KEYS.session); store.del('local', KEYS.session); closeDrawer(); showLogin(); }
function navigate(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('.nav').forEach(n => n.classList.toggle('active', n.dataset.page === id));
  window.scrollTo(0, 0); closeDrawer();
}
function openDrawer() { $('sidebar').classList.add('open'); $('drawer-backdrop').hidden = false; }
function closeDrawer() { $('sidebar').classList.remove('open'); $('drawer-backdrop').hidden = true; }
function activateTab(btn) {
  const scr = btn.closest('.screen');
  scr.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b === btn));
  scr.querySelectorAll('.intel-pane,.settings-pane').forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
}
function renderAll() { renderOverview(); renderIndicators(); renderAnalysis(); renderSettings(); }

/* ---------- Eventos ---------- */
function bind() {
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-page]'); if (nav) { e.preventDefault(); navigate(nav.dataset.page); }
    const tab = e.target.closest('[data-tab]'); if (tab) activateTab(tab);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeDrawer(); } });
  $('login-form').addEventListener('submit', onLogin);
  $('toggle-pw').addEventListener('click', () => { const p = $('password'), show = p.type === 'password'; p.type = show ? 'text' : 'password'; $('toggle-pw').textContent = show ? 'Ocultar' : 'Mostrar'; $('toggle-pw').setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha'); });
  $('forgot').addEventListener('click', () => showModal('Recuperação de senha', 'Indisponível nesta demonstração: não há servidor nem contas reais.\nUse as credenciais de demonstração exibidas na tela de login.'));
  $('logout').addEventListener('click', logout);
  $('mobile-menu').addEventListener('click', openDrawer); $('drawer-backdrop').addEventListener('click', closeDrawer);
  $('modal-close').addEventListener('click', closeModal); $('modal-ok').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  $('alerts-btn').addEventListener('click', () => showModal('Alertas', buildAlerts(analyze()).join('\n\n')));
  $('new-tx').addEventListener('click', () => openTxForm(null)); $('tx-cancel').addEventListener('click', closeTxForm);
  $('tx-form').addEventListener('submit', submitTx);
  $('tx-type').addEventListener('change', () => fillCategories($('tx-type').value));
  $('tx-list').addEventListener('click', onTxListClick);
  $('f-period').addEventListener('change', renderIndicators); $('f-type').addEventListener('change', renderIndicators);
  $('export-csv').addEventListener('click', exportCSV);
  SUGGESTIONS.forEach(s => { const b = el('button', 'secondary-btn', s); b.type = 'button'; b.addEventListener('click', () => ask(s)); $('chips').append(b); });
  $('chat-form').addEventListener('submit', e => { e.preventDefault(); const i = $('chat-input'); ask(i.value); i.value = ''; });
  $('profile-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('pf-name').value.trim(), company = $('pf-company').value.trim();
    if (!name || !company) { $('pf-error').textContent = 'Informe nome e empresa.'; return; }
    $('pf-error').textContent = ''; profile = { name: name.slice(0, 40), company: company.slice(0, 60) }; store.set('local', KEYS.profile, profile); renderAll(); toast('Perfil salvo.');
  });
  [['pref-compact', 'compact'], ['pref-motion', 'reduceMotion'], ['pref-alerts', 'showAlerts']].forEach(([id, k]) => $(id).addEventListener('change', e => { prefs[k] = e.target.checked; store.set('local', KEYS.prefs, prefs); applyPrefs(); renderOverview(); }));
  $('reset-demo').addEventListener('click', () => { if (window.confirm('Substituir todas as movimentações pelos dados fictícios de demonstração?')) { transactions = seedTransactions(); saveTx(); renderAll(); toast('Dados de demonstração restaurados.'); } });
  $('clear-data').addEventListener('click', () => { if (window.confirm('Apagar TODAS as movimentações deste navegador?')) { transactions = []; saveTx(); renderAll(); toast('Movimentações apagadas.'); } });
}

function init() {
  loadState(); applyPrefs(); bind();
  addMsg('bot', 'Olá! Sou o assistente demonstrativo do BusinessMind AI. Respondo com base nas movimentações cadastradas, usando regras locais (não sou uma IA externa). Digite "ajuda" ou toque em uma sugestão.');
  const s = currentSession();
  if (s && s.email === DEMO_USER.email) showApp(s.email); else showLogin();
}
document.addEventListener('DOMContentLoaded', init);
