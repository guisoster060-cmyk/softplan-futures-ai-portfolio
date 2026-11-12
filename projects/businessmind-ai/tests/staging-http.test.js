'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

test('login com senha rejeita redirecionamento sem reenviar credenciais', async () => {
  const { fetchWithoutRedirect } = await import('../scripts/staging-http.mjs');
  let calls = 0;
  const mockFetch = async (url, options) => {
    calls++;
    assert.equal(url, 'https://ogypzmxnvjbomamkejkh.supabase.co/auth/v1/token');
    assert.equal(options.redirect, 'error');
    assert.equal(options.body, 'credencial-ficticia');
    return { status: 307, redirected: false };
  };
  await assert.rejects(fetchWithoutRedirect('https://ogypzmxnvjbomamkejkh.supabase.co/auth/v1/token', { method: 'POST', body: 'credencial-ficticia' }, mockFetch), /Redirecionamento HTTP bloqueado/);
  assert.equal(calls, 1);
});

test('requisição com JWT rejeita redirecionamento', async () => {
  const { fetchWithoutRedirect } = await import('../scripts/staging-http.mjs');
  const mockFetch = async (_url, options) => {
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, 'Bearer jwt-ficticio');
    return { status: 200, redirected: true };
  };
  await assert.rejects(fetchWithoutRedirect('https://ogypzmxnvjbomamkejkh.supabase.co/rest/v1/transactions', { headers: { Authorization: 'Bearer jwt-ficticio' } }, mockFetch), /Redirecionamento HTTP bloqueado/);
});

test('resposta direta sem redirecionamento é aceita', async () => {
  const { fetchWithoutRedirect } = await import('../scripts/staging-http.mjs');
  const response = { status: 200, redirected: false };
  assert.equal(await fetchWithoutRedirect('https://ogypzmxnvjbomamkejkh.supabase.co/rest/v1/transactions', {}, async () => response), response);
});
