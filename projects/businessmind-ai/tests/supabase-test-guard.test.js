'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const guard = import('../scripts/supabase-test-guard.mjs');
const base = { BM_TEST_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co', BM_TEST_PROJECT_REF: 'abcdefghijklmnopqrst', BM_TEST_CONFIRM: 'TEST_ONLY:abcdefghijklmnopqrst', BM_TEST_PUBLISHABLE_KEY: 'sb_publishable_example', BM_TEST_EMAIL_A: 'a@example.invalid', BM_TEST_EMAIL_B: 'b@example.invalid', BM_TEST_PASSWORD_A: 'test-a', BM_TEST_PASSWORD_B: 'test-b' };
test('aceita apenas projeto de teste confirmado', async () => { const { validateTestConfig } = await guard; assert.equal(validateTestConfig(base).ref, base.BM_TEST_PROJECT_REF); });
test('bloqueia produção mesmo com confirmação coincidente', async () => { const { validateTestConfig } = await guard; assert.throws(() => validateTestConfig({ ...base, BM_TEST_SUPABASE_URL: 'https://cqiuryqnsdmsjchejclo.supabase.co', BM_TEST_PROJECT_REF: 'cqiuryqnsdmsjchejclo', BM_TEST_CONFIRM: 'TEST_ONLY:cqiuryqnsdmsjchejclo' }), /produção bloqueado/); });
test('bloqueia divergência de referência e confirmação', async () => { const { validateTestConfig } = await guard; assert.throws(() => validateTestConfig({ ...base, BM_TEST_PROJECT_REF: 'outro' })); assert.throws(() => validateTestConfig({ ...base, BM_TEST_CONFIRM: '' })); });
test('bloqueia URL externa e chave inadequada', async () => { const { validateTestConfig } = await guard; assert.throws(() => validateTestConfig({ ...base, BM_TEST_SUPABASE_URL: 'https://example.com' })); assert.throws(() => validateTestConfig({ ...base, BM_TEST_PUBLISHABLE_KEY: 'service_role' })); });
