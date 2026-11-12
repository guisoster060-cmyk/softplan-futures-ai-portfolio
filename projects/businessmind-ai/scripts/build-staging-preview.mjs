import { cpSync, mkdirSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateStagingPreview } from './validate-staging-preview.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'app');
const stagingConfig = resolve(root, 'preview/staging-config.js');
const output = resolve(root, 'dist-staging');

export function buildStagingPreview() {
  const config = readFileSync(stagingConfig, 'utf8');
  if (!config.includes('https://ogypzmxnvjbomamkejkh.supabase.co') ||
      !/sb_publishable_[A-Za-z0-9_-]+/.test(config) ||
      !config.includes('hermesGenerativeEnabled: true') ||
      !config.includes('hermesRemoteDeterministicEnabled: true') ||
      config.includes('cqiuryqnsdmsjchejclo')) throw Error('Configuração de staging inválida.');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  cpSync(source, output, { recursive: true });
  copyFileSync(stagingConfig, resolve(output, 'config.js'));
  try {
    validateStagingPreview(output);
  } catch (error) {
    rmSync(output, { recursive: true, force: true });
    throw error;
  }
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildStagingPreview();
  console.log('Preview isolado de staging gerado em dist-staging.');
}
