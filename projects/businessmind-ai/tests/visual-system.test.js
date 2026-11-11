'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = path.join(__dirname, '..', 'app');
const css = fs.readFileSync(path.join(app, 'style.css'), 'utf8');
const html = fs.readFileSync(path.join(app, 'index.html'), 'utf8');

test('design system declara tokens essenciais', () => {
  for (const token of ['--navy-950', '--blue-500', '--purple-500', '--cyan-400', '--text', '--border', '--shadow-md', '--radius-lg', '--space-4', '--duration']) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ':'));
  }
});

test('layouts possuem breakpoints de tablet e mobile', () => {
  assert.match(css, /@media\(max-width:1100px\)/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /@media\(max-width:430px\)/);
});

test('movimento reduzido desativa animações e transições', () => {
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /body\.reduce-motion/);
});

test('navegação usa sprite Lucide SVG e mantém rótulos acessíveis', () => {
  for (const id of ['icon-layout-dashboard', 'icon-chart-no-axes', 'icon-sparkles', 'icon-settings', 'icon-log-out', 'icon-bell']) {
    assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-live="polite"/);
});

test('não adiciona ECharts ou framework ao runtime', () => {
  assert.doesNotMatch(html, /echarts|react|next\.js/i);
});

test('rótulos não prometem atualização em tempo real e mantêm leitura mobile', () => {
  assert.match(html, /Dados carregados/);
  assert.doesNotMatch(html, />Ao vivo</);
  assert.match(html, /Alertas calculados por regras simples/);
  assert.match(css, /@media\(max-width:430px\)\{\.product-pill\{font-size:11px\}\}/);
});
