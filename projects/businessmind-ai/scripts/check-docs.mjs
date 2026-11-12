import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(projectRoot, '../..');
const canonicalDocs = [
  'README.md',
  'REQUIREMENTS.md',
  'ENGINEERING_LOG.md',
  'ARCHITECTURE.md',
  'TECHNICAL_DECISIONS.md',
  'TESTING.md',
  'AI_DEVELOPMENT_METHOD.md',
  'PROJECT_STATUS.md',
  'PROMPT_LOG.md'
];

const errors = [];

for (const file of canonicalDocs) {
  const target = file === 'README.md' ? join(projectRoot, file) : join(projectRoot, 'docs', file);
  if (!existsSync(target)) errors.push(`Documento obrigatório ausente: ${target}`);
}

function markdownFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root).flatMap((name) => {
    const target = join(root, name);
    if (statSync(target).isDirectory()) return markdownFiles(target);
    return extname(target).toLowerCase() === '.md' ? [target] : [];
  });
}

const files = [
  join(repositoryRoot, 'README.md'),
  ...markdownFiles(join(repositoryRoot, 'docs', 'businessmind-ai')),
  ...markdownFiles(join(projectRoot, 'docs')),
  join(projectRoot, 'README.md')
];

const linkPattern = /!?(?:\[[^\]]*\])\(([^)]+)\)/g;
for (const file of new Set(files)) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(linkPattern)) {
    let link = match[1].trim();
    if (link.startsWith('<') && link.endsWith('>')) link = link.slice(1, -1);
    if (/^(?:https?:|mailto:|#)/i.test(link)) continue;
    link = link.split('#', 1)[0].split('?', 1)[0];
    if (!link) continue;
    try {
      link = decodeURIComponent(link);
    } catch {
      errors.push(`Link com codificação inválida em ${file}: ${match[1]}`);
      continue;
    }
    const target = resolve(dirname(file), link);
    if (!existsSync(target)) errors.push(`Link interno quebrado em ${file}: ${match[1]}`);
  }
}

const packageData = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const expectedVersion = `v${packageData.version.split('.').slice(0, 2).join('.')}`;
const projectReadme = readFileSync(join(projectRoot, 'README.md'), 'utf8');
if (!projectReadme.includes(expectedVersion)) {
  errors.push(`README do projeto não referencia a versão ${expectedVersion}.`);
}

if (errors.length) {
  console.error(`Verificação documental falhou com ${errors.length} erro(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Documentação verificada: ${new Set(files).size} arquivos, links internos válidos e documentos canônicos presentes.`);
