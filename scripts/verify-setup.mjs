import assert from 'node:assert/strict';
import { readFile, lstat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const manifest = JSON.parse(await read('docs/tooling/sources.lock.json'));
const packageJson = JSON.parse(await read('package.json'));
const packageLock = JSON.parse(await read('package-lock.json'));
const registry = JSON.parse(await read('skills-lock.json'));
let checksums = 0;
for (const source of manifest.sources) {
  for (const [relative, expected] of Object.entries(source.files)) {
    const absolute = path.join(root, relative);
    assert(!(await lstat(absolute)).isSymbolicLink(), `No se permite depender de un enlace externo: ${relative}`);
    const hash = createHash('sha256').update(await readFile(absolute)).digest('hex');
    assert.equal(hash, expected, `Recurso modificado frente a la copia registrada: ${relative}`);
    checksums++;
  }
}
for (const [relative, expected] of Object.entries(manifest.projectReferences)) {
  assert.equal(createHash('sha256').update(await readFile(path.join(root, relative))).digest('hex'), expected, `Referencia alterada: ${relative}`);
  checksums++;
}
for (const name of ['emil-design-eng', 'choreograph', 'review-animations', 'animation-performance', 'impeccable']) {
  const relative = `.claude/skills/${name}/SKILL.md`;
  const text = await read(relative);
  assert(text.startsWith('---\n'), `Falta frontmatter: ${relative}`);
  assert(new RegExp(`^name: ${name}$`, 'm').test(text), `Nombre de skill incorrecto: ${relative}`);
  for (const [, link] of text.matchAll(/\]\(([^\s)]+\.md(?:#[^\s)]*)?)\)/g)) {
    if (/^https?:/.test(link)) continue;
    const resolved = path.resolve(root, path.dirname(relative), link.split('#')[0]);
    assert(resolved.startsWith(root), `Referencia fuera del repo: ${link}`);
    assert(existsSync(resolved), `Referencia local rota en ${relative}: ${link}`);
  }
  if (name !== 'impeccable') {
    assert.equal(registry.skills[name].ref, manifest.sources[0].commit);
    assert.equal(registry.skills[name].installMode, 'copy');
  }
}
for (const document of ['CLAUDE.md', 'README.md', 'PRODUCT.md', 'DESIGN.md', '.env.example', 'docs/VALIDATION.md', 'docs/legal/REQUISITOS.md', 'docs/legal/terminos.borrador.md', 'docs/legal/privacidad.borrador.md', 'docs/legal/cookies.borrador.md']) {
  assert((await read(document)).trim().length > 40, `Documento vacío: ${document}`);
}
assert.equal((await read('docs/references/Brief_Visual_Contenido_VERVO.txt')).split('\f').filter((page) => page.trim()).length, 18);
for (const [name, version] of Object.entries(packageJson.devDependencies)) {
  assert(/^\d+\.\d+\.\d+$/.test(version), `Versión no exacta: ${name}`);
  assert.equal(packageLock.packages[''].devDependencies[name], version, `Lock desincronizado: ${name}`);
}
for (const [name, version] of Object.entries(packageJson.dependencies || {})) { assert(/^\d+\.\d+\.\d+$/.test(version), `Versión no exacta: ${name}`); assert.equal(packageLock.packages[''].dependencies[name], version); }
assert(packageJson.dependencies.gsap && packageJson.dependencies.lenis, 'La demo requiere GSAP ScrollTrigger y Lenis.');
assert.equal(manifest.figma.status, 'deferred_by_user');
assert.equal(manifest.userReference.status, 'received'); assert.equal(manifest.userReference.originalFilename, 'DESIGN.md');
const settings = JSON.parse(await read('.claude/settings.json'));
for (const phase of ['SessionStart', 'PostToolUse', 'Stop']) {
  assert(settings.hooks[phase]?.length, `Falta hook: ${phase}`);
  for (const group of settings.hooks[phase]) {
    for (const hook of group.hooks) {
      assert(hook.command.includes('${CLAUDE_PROJECT_DIR}/work/impeccable'), `Caché no portable: ${phase}`);
      assert(!hook.command.includes('/workspace/'), `Ruta absoluta en hook: ${phase}`);
    }
  }
}
const engineVersion = (await read('.claude/skills/impeccable/scripts/VERSION')).trim();
assert.equal(engineVersion, manifest.engine.version);
assert.equal(JSON.parse(await read('.impeccable/config.json')).telemetry, false);
const skillEntries = await readdir(path.join(root, '.claude/skills'));
assert.equal(skillEntries.length, 5);
console.log(`Preparación correcta: 5 skills, ${checksums} checksums, referencias locales, 18 páginas del brief, versiones exactas y hooks portables.`);
console.log('Alcance: demo navegable local, referencia DESIGN.md recibida, GSAP y Lenis instalados; Figma aplazado.');
