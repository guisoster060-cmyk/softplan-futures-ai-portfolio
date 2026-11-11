'use strict';
const { chromium } = require('playwright');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { resolve, extname } = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

const project = resolve(__dirname, '..');
execFileSync(process.execPath, ['scripts/build-demo-preview.mjs'], { cwd: project, stdio: 'ignore' });
const root = resolve(project, 'dist-demo');
const server = createServer(async (req, res) => {
  const path = resolve(root, '.' + (new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname));
  if (!path.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  try { const body = await readFile(path); res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[extname(path)] || 'text/html'); res.end(body); }
  catch { res.writeHead(404).end(); }
});
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();
  const remote = [], errors = [];
  page.on('request', request => { if (!request.url().startsWith(`http://127.0.0.1:${server.address().port}/`)) remote.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.locator('#app').waitFor({ state: 'visible' });
    assert.match(await page.locator('.demo-banner').innerText(), /FICTÍCIA E LOCAL/);
    assert.match(await page.locator('#overview-kpis').innerText(), /R\$\s*3\.600,00/);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('#mobile-menu').click();
    assert.equal(await page.locator('#mobile-menu').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('[data-page=indicators]').first().click();
    await page.locator('#new-tx').click();
    await page.locator('#tx-desc').fill('Venda de demonstração');
    await page.locator('#tx-amount').fill('100');
    await page.locator('#tx-form button[type=submit]').click();
    await page.getByText('Venda de demonstração').waitFor();
    await page.reload();
    await page.locator('#app').waitFor({ state: 'visible' });
    await page.locator('[data-page=indicators]').first().click();
    await page.getByText('Venda de demonstração').waitFor();
    await page.locator('[data-page=intelligence]').first().click();
    await page.locator('#chat-input').fill('Qual foi o lucro deste mês?');
    await page.locator('#chat-form button[type=submit]').click();
    await page.locator('#chat-log .msg.bot').last().filter({ hasText: /lucro/i }).waitFor();
    await page.locator('#logout').click();
    await page.locator('#login-screen').waitFor({ state: 'visible' });
    await page.locator('#demo-enter').click();
    await page.locator('#app').waitFor({ state: 'visible' });
    assert.deepEqual(remote, []);
    assert.deepEqual(errors, []);
    console.log('E2E demo: dados fictícios, CRUD local, recarga, mobile, Hermes determinístico, logout e reentrada; zero requisições externas.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
