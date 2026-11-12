import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const cli = path.join(path.dirname(require.resolve('@playwright/test/package.json')), 'cli.js');
const browserLibs = path.join(root, 'work/browser-libs/usr/lib/x86_64-linux-gnu');
const localLibraries = existsSync(browserLibs)
  ? { LD_LIBRARY_PATH: [browserLibs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':') }
  : {};
// La comprobación de dlopen de Playwright consulta ldconfig, que no incluye las
// bibliotecas locales. Solo omitir ese preflight tras verificar su carga real.
if (existsSync(path.join(root, 'work/browser-libs/verified.json'))) {
  localLibraries.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = '1';
}
const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    ...localLibraries,
    PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(root, 'work/playwright-browsers'),
  },
});
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
