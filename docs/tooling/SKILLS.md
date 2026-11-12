# Skills oficiales y uso en Claude Code

Se conservan copias completas dentro de `.claude/skills/`; no son enlaces a una carpeta temporal ni una instalación global. `sources.lock.json` registra SHA-256 de cada recurso. `skills-lock.json` fija también el commit de Emil. Las licencias están en `third_party/`.

| Skill / origen | Uso previsto |
| --- | --- |
| Emil `emil-design-eng` | Jerarquía, respuesta de controles, frecuencia, foco y acabado |
| Emil `choreograph` | Roles, tabla de timeline, solapamiento, reversibilidad e interrupciones |
| Emil `review-animations` | Revisión estricta de movimiento, tabla Before/After/Why; invocar explícitamente |
| Emil `animation-performance` | Identificar causa del coste, propiedades y medición; no inventar resultados de fluidez |
| Impeccable `impeccable` | Diseño y comandos `critique`, `audit`, `adapt`, `harden`, `optimize`, `polish`, `typeset`, `layout`, entre otros |

Emil se instaló con su CLI oficial `skills@1.8.1`, selección de las cuatro skills, `--agent claude-code --copy --yes`, desde el commit `4061b67b8d976a186aca118594f54b638c5f718a`. Incluye `choreograph/RECIPES.md` y `review-animations/STANDARDS.md`. Los cheatsheets complementarios y la licencia MIT están en `third_party/emil/`.

Impeccable se instaló mediante el método del [tutorial oficial](https://impeccable.style/tutorials/getting-started/): CLI local `impeccable@4.8.2 install --providers=claude --scope=project --yes`. La distribución instalada declara skill 4.8.2 y motor **0.1.21**; no confundir la versión del CLI con la del motor. Se conserva el bundle oficial de Claude y sus referencias, scripts y agentes. No se afirma que el bundle sea idéntico al HEAD cambiante del repositorio fuente.

## En un checkout nuevo

```bash
npm ci
npm run tools:prepare
npm run setup:check
```

`tools:prepare` descarga solo el motor fijado en `scripts/VERSION` desde la release oficial, verifica el SHA-256 del manifiesto oficial y lo coloca en `.claude/skills/impeccable/scripts/bin/<plataforma>/`. No descarga las skills de nuevo, no usa el directorio personal y no modifica `PRODUCT.md` o `DESIGN.md`. El ejecutable es una dependencia reinstalable ignorada por Git y excluida del ZIP; sus fuentes de descarga y checksums quedan versionados.

Reabrir Claude Code desde la raíz del repo y permitir los hooks del proyecto cuando Claude lo solicite. Este entorno no incluye el ejecutable `claude`: se verificaron archivos, referencias y motor por terminal, pero la carga de slash commands/hooks dentro de Claude Code queda pendiente de probar allí.

Ejemplos en el chat de Claude Code (no en bash):

```text
/emil-design-eng revisa los estados del formulario de registro
/choreograph planifica los tres actos de la escena pública conforme a DESIGN.md
/review-animations revisa el diff de movimiento, incluida la marcha atrás
/animation-performance analiza los frames lentos de la portada
/impeccable critique la revisión de una sesión
/impeccable audit el registro y sus consentimientos
/impeccable adapt la sesión a 390 px
/impeccable polish la pantalla de cuenta
```

Impeccable 4.8.2 agrupa sus capacidades bajo `/impeccable <comando>`: no se han inventado skills separadas `/audit` o `/polish`. Para cargar su contexto por terminal: `npm run tools:context`. En esta fase se ejecutó el contexto de Impeccable y se leyeron sus reglas de producto; no se atribuyen auditorías visuales a una web inexistente. El producto y la delegación de decisiones técnicas ya están descritos explícitamente por el usuario/brief.

Los hooks oficiales se guardan en `.claude/settings.json` con una adaptación de rutas: caché dentro de `work/impeccable`, telemetría desactivada y aplicación de ediciones de Live en el chat. No hay permisos para saltar confirmaciones. Los agentes suministrados son recursos instalados; no se han ejecutado subagentes en esta preparación.

## Mantenimiento deliberado

`npm run skills:emil` reinstala el commit fijado, no `latest`. `npm run skills:impeccable -- --yes` ejecuta el instalador oficial; usarlo solo para una actualización revisada, pues puede cambiar la distribución y generar settings locales. Revisar los diffs y licencias, consolidar hooks portables, actualizar `sources.lock.json` y volver a validar. No ejecutar actualizaciones automáticas durante una revisión visual.

Fuentes: [Emil Kowalski](https://github.com/emilkowalski/skills), [Impeccable](https://github.com/pbakaus/impeccable), [instalación y comandos](https://impeccable.style/tutorials/getting-started/).
