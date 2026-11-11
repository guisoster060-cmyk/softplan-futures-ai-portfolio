// Teste transacional real. Requer Docker e a imagem postgres:17-alpine local.
// O contêiner é isolado da rede e removido ao final; nunca aponta ao Supabase.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const name = `bm-hermes-pg-${randomBytes(5).toString('hex')}`;
const here = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(join(here, '../supabase/staging-migrations/20261111_hermes_one_shot.sql'));
const fixture = readFileSync(join(here, 'hermes-one-shot-local.sql'));
const company = '53ec445f-610a-4d80-a6d7-da4acd9c14e1';
const owner = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const member = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const outsider = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

function docker(args, input) {
  const result = spawnSync('docker', args, { input, encoding: 'utf8', timeout: 20_000 });
  if (result.error || result.status !== 0) throw Error(`docker ${args[0]} falhou: ${result.error?.message ?? result.stderr?.trim()}`);
  return result.stdout.trim();
}
function sql(query, input) {
  return docker(['exec', '-i', name, 'psql', '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres', ...(query ? ['-c', query] : [])], input);
}
function call(user, companyId = company, hold = false) {
  return `begin; set local role authenticated; set local request.jwt.claim.sub='${user}'; ` +
    `select public.claim_hermes_test_once('${companyId}'); ${hold ? 'select pg_sleep(1);' : ''} commit;`;
}
function asyncSql(query) {
  return new Promise((resolve, reject) => {
    const proc = spawn('docker', ['exec', name, 'psql', '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres', '-c', query]);
    let out = '', err = '';
    proc.stdout.on('data', chunk => { out += chunk; });
    proc.stderr.on('data', chunk => { err += chunk; });
    proc.on('error', reject);
    proc.on('close', code => code === 0 ? resolve(out.trim()) : reject(Error(err.trim())));
  });
}

let started = false;
try {
  docker(['run', '--pull=never', '--rm', '-d', '--network', 'none', '--name', name,
    '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', 'postgres:17-alpine']);
  started = true;
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    const status = spawnSync('docker', ['exec', name, 'pg_isready', '-U', 'postgres'], { encoding: 'utf8' });
    if (status.status === 0) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'PostgreSQL local não ficou pronto');
  sql('', fixture);
  sql('', migration);

  assert.match(sql(call(member)), /^f$/m);
  assert.match(sql(call(outsider)), /^f$/m);
  assert.match(sql(call(owner, '22222222-2222-4222-8222-222222222222')), /^f$/m);

  const first = asyncSql(call(owner, company, true));
  await new Promise(resolve => setTimeout(resolve, 150));
  const second = asyncSql(call(owner));
  const results = await Promise.all([first, second]);
  assert.deepEqual(results.map(value => value.match(/^[tf]$/m)?.[0]).sort(), ['f', 't']);
  assert.match(sql(call(owner)), /^f$/m);
  assert.equal(sql('select (claimed_at is not null and claimed_by = \'' + owner + '\') from hermes_test.one_shot;'), 't');

  const acl = sql("select has_function_privilege('anon','public.claim_hermes_test_once(uuid)','EXECUTE'), has_function_privilege('authenticated','public.claim_hermes_test_once(uuid)','EXECUTE'), has_schema_privilege('authenticated','hermes_test','USAGE'), has_table_privilege('authenticated','hermes_test.one_shot','UPDATE');");
  assert.equal(acl, 'f|t|f|f');
  assert.equal(sql("select relrowsecurity from pg_class where oid='hermes_test.one_shot'::regclass;"), 't');
  console.log('PostgreSQL local: concorrência 1/2, autorização, repetição, ACL e RLS aprovados.');
} finally {
  if (started) docker(['stop', name]);
}
