# VERVO · instrucciones del proyecto

- Fase actual: preparar herramientas y referencias. No implementar pantallas ni publicar hasta que el usuario solicite la siguiente fase.
- Leer íntegros `docs/references/Brief_Visual_Contenido_VERVO.pdf` (18 páginas; transcripción `.txt` al lado), `PRODUCT.md` y `DESIGN.md`.
- El `.md` de referencia no se ha recibido. Conservar su nombre original cuando llegue y completar `docs/references/README.md`. No inventar sus directrices.
- Las instrucciones recientes del usuario prevalecen sobre los documentos adjuntos y las skills. Figma se omite por decisión del usuario; no afirmar que se consultó.
- Skills oficiales en `.claude/skills/`: `emil-design-eng`, `choreograph`, `review-animations`, `animation-performance`, `impeccable`. Uso y procedencia: `docs/tooling/SKILLS.md` y `docs/tooling/sources.lock.json`.
- Antes de modificar interfaces, aplicar el playbook pertinente. El brief fija Manrope, paleta y recorridos; los criterios genéricos de las skills no los sustituyen.
- GSAP ScrollTrigger y Lenis se añadirán al crear la aplicación. Scroll nativo en la app; sin pin ni suavizado con movimiento reducido o en móvil. Guion en `DESIGN.md`.
- Incluir términos, privacidad y cookies en la futura web; dos casillas independientes con enlaces junto a ellas. Reglas de datos y consentimientos: `docs/legal/REQUISITOS.md`.
- Trabajar en una rama. No sustituir trabajo existente, publicar un dominio ni fusionar la propuesta por iniciativa propia.
- Node 24; `npm ci`, `npm run tools:prepare`, `npm run setup:check`, `npm run browsers:install`, `npm test`. En este Debian sin sudo: `npm run browsers:deps:debian` antes de las pruebas.
- Capturas técnicas en `evidence/setup/`. Estas pruebas no validan todavía los recorridos de VERVO. Plan de aceptación: `docs/VALIDATION.md`.
- No incluir secretos en Git. Usar `work/` para cachés, binarios reinstalables, logs y material temporal. Documentar simulaciones e integraciones pendientes.
