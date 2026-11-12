import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(root, '.claude/skills/impeccable/scripts', process.platform === 'win32' ? 'impeccable.cmd' : 'impeccable');
const child = spawn(process.platform === 'win32' ? 'cmd.exe' : 'sh',
  process.platform === 'win32' ? ['/c', script, ...process.argv.slice(2)] : [script, ...process.argv.slice(2)], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, IMPECCABLE_HOME: path.join(root, 'work/impeccable'), IMPECCABLE_LIVE_COPY_AGENT: 'chat', DO_NOT_TRACK: '1' },
  });
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
