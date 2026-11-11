import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist-demo');
export function buildDemoPreview() {
  const html = readFileSync(resolve(root, 'app/index.html'), 'utf8');
  const cdn = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.84.0/dist/umd/supabase.min.js" defer></script>';
  if (!html.includes(cdn) || !html.includes('<body>') || !html.includes('<div class="demo-note">')) throw Error('Estrutura do aplicativo mudou; revise o build fictício.');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  cpSync(resolve(root, 'app'), output, { recursive: true });
  const config = "window.BUSINESSMIND_CONFIG = Object.freeze({ supabaseUrl: 'https://demo.invalid', supabasePublishableKey: 'demo-only', hermesGenerativeEnabled: false });\n";
  writeFileSync(resolve(output, 'config.js'), config);
  copyFileSync(resolve(root, 'preview/demo-sdk.js'), resolve(output, 'demo-sdk.js'));
  copyFileSync(resolve(root, 'preview/demo-entry.js'), resolve(output, 'demo-entry.js'));
  copyFileSync(resolve(root, 'preview/demo.css'), resolve(output, 'demo.css'));
  const appScript = readFileSync(resolve(output, 'app.js'), 'utf8')
    .replaceAll('movimentações reais carregadas', 'movimentações fictícias locais');
  if (appScript.includes('movimentações reais carregadas')) throw Error('Texto de dados reais permaneceu na demonstração.');
  writeFileSync(resolve(output, 'app.js'), appScript);
  const result = html.replace(cdn, '<script src="demo-sdk.js" defer></script>')
    .replace('<head>', '<head>\n<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; img-src \'self\' data:; connect-src \'none\'; form-action \'none\'; base-uri \'none\'">\n<link rel="stylesheet" href="demo.css"><script src="demo-entry.js" defer></script>')
    .replace('<body>', '<body>\n<div class="demo-banner" role="note">DEMONSTRAÇÃO FICTÍCIA E LOCAL — sem Supabase ou IA externa. Não informe dados reais. Alterações ficam apenas neste navegador. <button id="demo-reset" type="button">Restaurar dados fictícios</button></div>')
    .replace('<div class="demo-note">', '<button class="primary-btn" id="demo-enter" type="button">Entrar na demonstração</button><div class="demo-note">');
  writeFileSync(resolve(output, 'index.html'), result);
  validateDemoPreview();
  return output;
}

export function validateDemoPreview() {
  const files = ['index.html', 'config.js', 'app.js', 'demo-sdk.js', 'demo-entry.js'];
  const contents = files.map(file => readFileSync(resolve(output, file), 'utf8'));
  if (!contents[0].includes("connect-src 'none'") || !contents[0].includes('DEMONSTRAÇÃO FICTÍCIA E LOCAL') ||
      !contents[1].includes("https://demo.invalid") || !contents[1].includes('hermesGenerativeEnabled: false') ||
      contents[2].includes('movimentações reais carregadas') ||
      contents.some(content => /cqiuryqnsdmsjchejclo|ogypzmxnvjbomamkejkh|sb_(?:secret|publishable)_|service_role|GEMINI_API_KEY|https:\/\/cdn\./i.test(content))) {
    throw Error('Build fictício não isolado; publicação bloqueada.');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildDemoPreview();
  console.log('Demonstração local fictícia gerada em dist-demo; nenhum deploy executado.');
}
