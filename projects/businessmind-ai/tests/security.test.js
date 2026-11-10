'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const project = path.join(__dirname, '..');

test('frontend não contém chaves administrativas ou privadas conhecidas', () => {
  const files = ['app/config.js', 'app/app.js', 'app/index.html'];
  for (const file of files) {
    const content = fs.readFileSync(path.join(project, file), 'utf8');
    assert.doesNotMatch(content, /service_role\s*[:=]\s*['"][^'"]+|HERMES_API_KEY\s*[:=]\s*['"][^'"]+/i, file);
    assert.doesNotMatch(content, /sb_secret_/i, file);
  }
});

test('frontend usa somente a função RPC aprovada para criar empresa', () => {
  const content = fs.readFileSync(path.join(project, 'app/app.js'), 'utf8');
  assert.match(content, /\.rpc\('create_company'/);
  assert.doesNotMatch(content, /from\('companies'\)\.insert/);
  assert.doesNotMatch(content, /from\('company_members'\)\.insert/);
});

test('operações de movimentações não enviam created_by', () => {
  const content = fs.readFileSync(path.join(project, 'app/app.js'), 'utf8');
  assert.doesNotMatch(content, /created_by\s*:/);
});

test('todos os elementos usados pelo JavaScript existem no HTML', () => {
  const script = fs.readFileSync(path.join(project, 'app/app.js'), 'utf8');
  const html = fs.readFileSync(path.join(project, 'app/index.html'), 'utf8');
  const referenced = new Set([...script.matchAll(/\$\('([^']+)'\)/g)].map(match => match[1]));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
  assert.deepEqual([...referenced].filter(id => !ids.has(id)), []);
});

test('aplicação ativa não contém credencial ou seed demonstrativo da v0.3', () => {
  const content = fs.readFileSync(path.join(project, 'app/app.js'), 'utf8');
  assert.doesNotMatch(content, /demo@businessmind\.ai|demo1234|seedTransactions|DEMO_USER/);
});
