export const PRODUCTION_REF = 'cqiuryqnsdmsjchejclo';

export function validateTestConfig(env) {
  const url = new URL(env.BM_TEST_SUPABASE_URL || 'https://invalid.example');
  const match = /^([a-z0-9]{20})\.supabase\.co$/.exec(url.hostname);
  if (url.protocol !== 'https:' || !match || url.pathname !== '/' || url.search || url.hash) throw Error('URL de teste inválida: use a URL raiz HTTPS de um projeto Supabase separado.');
  const ref = match[1];
  if (ref === PRODUCTION_REF) throw Error('Projeto de produção bloqueado.');
  if (env.BM_TEST_PROJECT_REF !== ref) throw Error('BM_TEST_PROJECT_REF deve coincidir com o projeto de teste.');
  if (env.BM_TEST_CONFIRM !== `TEST_ONLY:${ref}`) throw Error('Confirmação explícita do projeto de teste ausente.');
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(env.BM_TEST_PUBLISHABLE_KEY || '')) throw Error('Use apenas a publishable key do projeto de teste.');
  if (!env.BM_TEST_EMAIL_A || !env.BM_TEST_EMAIL_B || env.BM_TEST_EMAIL_A === env.BM_TEST_EMAIL_B) throw Error('Forneça duas contas fictícias distintas.');
  if (!env.BM_TEST_PASSWORD_A || !env.BM_TEST_PASSWORD_B) throw Error('Senhas de teste ausentes.');
  return { url: url.origin, ref, key: env.BM_TEST_PUBLISHABLE_KEY };
}
