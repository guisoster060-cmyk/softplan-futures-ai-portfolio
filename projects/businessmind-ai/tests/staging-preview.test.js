'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

test('build staging não altera config de produção e desativa Gemini', async () => {
  const root = resolve(__dirname, '..');
  const productionFile = resolve(root, 'app/config.js');
  const before = readFileSync(productionFile, 'utf8');
  const { buildStagingPreview } = await import('../scripts/build-staging-preview.mjs');
  const output = buildStagingPreview();
  const staged = readFileSync(resolve(output, 'config.js'), 'utf8');
  assert.equal(readFileSync(productionFile, 'utf8'), before);
  assert.match(before, /cqiuryqnsdmsjchejclo\.supabase\.co/);
  assert.doesNotMatch(staged, /cqiuryqnsdmsjchejclo/);
  assert.match(staged, /ogypzmxnvjbomamkejkh\.supabase\.co/);
  assert.match(staged, /sb_publishable_/);
  assert.match(staged, /hermesGenerativeEnabled: false/);
  assert.match(readFileSync(resolve(output, 'index.html'), 'utf8'), /transactions-loader\.js/);
});
