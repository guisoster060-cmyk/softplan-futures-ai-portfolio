'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { resolve } = require('node:path');

const validConfig = `'use strict';
window.BUSINESSMIND_CONFIG = Object.freeze({
  supabaseUrl: 'https://ogypzmxnvjbomamkejkh.supabase.co',
  supabasePublishableKey: 'sb_publishable_Lq05mBXfQqm9Rt9udW2fww_wXTEL6WM',
  hermesGenerativeEnabled: true,
  hermesRemoteDeterministicEnabled: true
});`;

async function withBuild(config, extra, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), 'businessmind-staging-check-'));
  try {
    writeFileSync(resolve(directory, 'index.html'), '<!doctype html><title>Staging</title>');
    if (config !== null) writeFileSync(resolve(directory, 'config.js'), config);
    if (extra) writeFileSync(resolve(directory, 'app.js'), extra);
    const { validateStagingPreview } = await import('../scripts/validate-staging-preview.mjs');
    callback(() => validateStagingPreview(directory));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('aceita build público isolado com exibição generativa controlada', async () => {
  await withBuild(validConfig, null, (check) => assert.equal(check(), 2));
});

test('rejeita URL de produção no config e em outro arquivo publicado', async () => {
  await withBuild(validConfig.replace('ogypzmxnvjbomamkejkh', 'cqiuryqnsdmsjchejclo'), null,
    (check) => assert.throws(check, /produção/));
  await withBuild(validConfig, 'https://cqiuryqnsdmsjchejclo.supabase.co',
    (check) => assert.throws(check, /produção/));
});

test('rejeita URL não exata, Gemini habilitado e configuração ausente', async () => {
  await withBuild(validConfig.replace('https://ogypzmxnvjbomamkejkh.supabase.co', 'http://ogypzmxnvjbomamkejkh.supabase.co'), null,
    (check) => assert.throws(check, /inválida/));
  await withBuild(validConfig.replace('hermesGenerativeEnabled: true', 'hermesGenerativeEnabled: false'), null,
    (check) => assert.throws(check, /inválida/));
  await withBuild(validConfig.replace('hermesRemoteDeterministicEnabled: true', 'hermesRemoteDeterministicEnabled: false'), null,
    (check) => assert.throws(check, /inválida/));
  await withBuild(null, null, (check) => assert.throws(check, /incompleto/));
  await withBuild(validConfig.replace(/sb_publishable_[A-Za-z0-9_-]+/, 'sb_publishable_invalid'), null,
    (check) => assert.throws(check, /inválida/));
  await withBuild(validConfig.replace('sb_publishable_Lq05mBXfQqm9Rt9udW2fww_wXTEL6WM', 'sb_publishable_sS8suJBU8N-tkIGDbF4JRw_CyU4RU_t'), null,
    (check) => assert.throws(check, /inválida/));
});

test('rejeita chave administrativa e credencial de provedor em qualquer arquivo', async () => {
  await withBuild(validConfig, 'const key = "sb_secret_abcdefghijklmnopqrstuvwxyz";',
    (check) => assert.throws(check, /credencial privada/));
  await withBuild(validConfig, 'const GEMINI_API_KEY = "private-placeholder";',
    (check) => assert.throws(check, /credencial privada/));
  const payload = Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url');
  await withBuild(validConfig, `const key = 'eyJhbGciOiJIUzI1NiJ9.${payload}.signature';`,
    (check) => assert.throws(check, /JWT service_role/));
});

test('rejeita propriedades extras e código fora da configuração pública', async () => {
  await withBuild(`${validConfig}\nwindow.BUSINESSMIND_CONFIG.hermesGenerativeEnabled = true;`, null,
    (check) => assert.throws(check, /inválida/));
});
