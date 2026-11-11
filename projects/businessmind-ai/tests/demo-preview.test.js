const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

test('build fictício usa somente recursos locais e identifica claramente a simulação', async () => {
  const { buildDemoPreview, validateDemoPreview } = await import('../scripts/build-demo-preview.mjs');
  const output = buildDemoPreview();
  assert.doesNotThrow(validateDemoPreview);
  const html = readFileSync(resolve(output, 'index.html'), 'utf8');
  const config = readFileSync(resolve(output, 'config.js'), 'utf8');
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /DEMONSTRAÇÃO FICTÍCIA E LOCAL/);
  assert.doesNotMatch(html, /https:\/\/cdn\./);
  assert.match(config, /hermesGenerativeEnabled: false/);
  assert.doesNotMatch(config, /supabase\.co|sb_publishable_|sb_secret_/);
});

test('validação bloqueia produção, segredo e modo generativo no pacote', async () => {
  const { buildDemoPreview, validateDemoPreview } = await import('../scripts/build-demo-preview.mjs');
  const output = buildDemoPreview();
  const configPath = resolve(output, 'config.js');
  const safe = readFileSync(configPath, 'utf8');
  try {
    for (const unsafe of [
      safe.replace('https://demo.invalid', 'https://cqiuryqnsdmsjchejclo.supabase.co'),
      safe.replace('hermesGenerativeEnabled: false', 'hermesGenerativeEnabled: true'),
      safe + '\n// sb_secret_exemplo\n'
    ]) {
      writeFileSync(configPath, unsafe);
      assert.throws(validateDemoPreview, /não isolado/);
    }
  } finally { writeFileSync(configPath, safe); }
});
