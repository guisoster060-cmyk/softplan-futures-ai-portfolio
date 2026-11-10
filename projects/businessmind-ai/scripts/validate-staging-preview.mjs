import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stagingUrl = 'https://ogypzmxnvjbomamkejkh.supabase.co';
const stagingPublishableKey = 'sb_publishable_Lq05mBXfQqm9Rt9udW2fww_wXTEL6WM';
const productionRef = 'cqiuryqnsdmsjchejclo';

function publishedFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw Error(`Link simbólico não permitido no build: ${relative(directory, path)}`);
    return entry.isDirectory() ? publishedFiles(path) : [path];
  });
}

function checkConfig(contents) {
  // Aceita somente a declaração pública esperada; código extra ou propriedades duplicadas falham.
  const clean = contents.replace(/^\s*\/\/[^\n]*(?:\n|$)/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const match = clean.match(/^['"]use strict['"];\s*window\.BUSINESSMIND_CONFIG\s*=\s*Object\.freeze\(\{\s*supabaseUrl:\s*(['"])([^'"\r\n]+)\1,\s*supabasePublishableKey:\s*(['"])([^'"\r\n]+)\3,\s*hermesGenerativeEnabled:\s*(true|false)\s*,?\s*\}\);?$/);
  if (!match || match[2] !== stagingUrl || match[4] !== stagingPublishableKey || match[5] !== 'false') {
    throw Error('config.js: configuração pública de staging ausente ou inválida.');
  }
}

function checkSecrets(contents, name) {
  const patterns = [
    /sb_secret_[A-Za-z0-9_-]+/i,
    /(?:service[_-]?role|supabase[_-]?secret[_-]?key|gemini[_-]?api[_-]?key)\s*[:=]\s*['"`]?[^\s'"`,;}]+/i,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /AIza[0-9A-Za-z_-]{30,}/,
    /\bsk-[A-Za-z0-9_-]{20,}\b/
  ];
  if (patterns.some((pattern) => pattern.test(contents))) throw Error(`${name}: possível credencial privada no build.`);
  // Chaves JWT legadas podem identificar o papel administrativo no payload.
  for (const match of contents.matchAll(/\beyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+\b/g)) {
    try {
      if (JSON.parse(Buffer.from(match[1], 'base64url').toString('utf8')).role === 'service_role') {
        throw Error(`${name}: JWT service_role no build.`);
      }
    } catch (error) {
      if (error.message.includes('JWT service_role')) throw error;
    }
  }
}

export function validateStagingPreview(directory = resolve(root, 'dist-staging')) {
  const output = resolve(directory);
  if (!statSync(output).isDirectory()) throw Error('Diretório de staging ausente.');
  const files = publishedFiles(output);
  const configPath = resolve(output, 'config.js');
  if (!files.includes(configPath) || !files.includes(resolve(output, 'index.html'))) {
    throw Error('Build de staging incompleto: config.js ou index.html ausente.');
  }
  for (const file of files) {
    const name = relative(output, file);
    const contents = readFileSync(file, 'utf8');
    if (contents.includes(productionRef)) throw Error(`${name}: referência ao Supabase de produção.`);
    checkSecrets(contents, name);
    if (file === configPath) checkConfig(contents);
  }
  return files.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateStagingPreview();
  console.log('Build de staging validado.');
}
