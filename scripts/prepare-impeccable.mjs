// Restaura solo el motor fijado por la skill vendorizada; no actualiza las skills.
import { readFile, mkdir, rename, chmod, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const scripts = path.join(root, '.claude/skills/impeccable/scripts');
const version = (await readFile(path.join(scripts, 'VERSION'), 'utf8')).trim();
const platform = { linux: 'linux', darwin: 'darwin', win32: 'windows' }[process.platform];
const arch = process.platform === 'win32' && process.arch === 'arm64' ? 'x64' : process.arch;
if (!platform || !['arm64', 'x64'].includes(arch)) throw new Error('Plataforma no admitida por este motor.');
const executable = process.platform === 'win32' ? 'impeccable.exe' : 'impeccable';
const asset = `impeccable-${platform}-${arch}${process.platform === 'win32' ? '.exe' : ''}`;
const checksums = await readFile(path.join(scripts, 'engine-checksums.txt'), 'utf8');
const row = checksums.split('\n').map((line) => line.trim().split(/\s+/)).find((parts) => parts[0] === version && parts[1] === asset);
if (!row || !/^[a-f0-9]{64}$/.test(row[2])) throw new Error(`Falta checksum oficial de ${asset} ${version}.`);
const destination = path.join(scripts, 'bin', `${platform}-${arch}`, executable);
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
if (!existsSync(destination)) {
  const downloadDir = path.join(root, 'work/impeccable-download');
  await mkdir(downloadDir, { recursive: true });
  const temporary = path.join(downloadDir, `${asset}.part`);
  const url = `https://github.com/pbakaus/impeccable/releases/download/engine-v${version}/${asset}`;
  const result = spawnSync('curl', ['--fail', '--location', '--silent', '--show-error', '--retry', '2', '--max-time', '60', '--output', temporary, url], { stdio: 'inherit' });
  if (result.error || result.status !== 0) throw new Error(`No se pudo descargar ${url}; se requiere curl, HTTPS y CA válidas.`);
  if (sha256(await readFile(temporary)) !== row[2]) {
    await rm(temporary);
    throw new Error('El motor no coincide con el checksum oficial; no se ejecutó.');
  }
  await mkdir(path.dirname(destination), { recursive: true });
  await rename(temporary, destination);
}
if (sha256(await readFile(destination)) !== row[2]) throw new Error(`Integridad incorrecta: ${destination}. No se reemplaza automáticamente.`);
await chmod(destination, 0o755);
const probe = spawnSync(destination, ['engine-probe'], { encoding: 'utf8', env: { ...process.env, DO_NOT_TRACK: '1', IMPECCABLE_HOME: path.join(root, 'work/impeccable') } });
if (probe.status !== 0 || probe.stdout.trim() !== `impeccable-engine ${version}`) throw new Error('El motor no superó engine-probe.');
console.log(`Impeccable engine ${version} verificado dentro del proyecto (${platform}-${arch}).`);
