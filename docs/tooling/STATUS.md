# Estado de entrega · preparación

Fecha de referencia del usuario: 11 de noviembre de 2026, America/Mexico_City. Las marcas automáticas de ejecución en `evidence/setup/results.json` están en UTC.

## Instalado y comprobado

- Repositorio `kadeshplay-prog/verbodemo` inspeccionado vacío. Base inicial vacía en `main`; cambios de preparación en `chore/vervo-project-preparation`.
- Node 24.22.1, npm 11.9.0, Git 2.52.0, Python 3.12.14 y Poppler 25.03 disponibles. pnpm 11.25.0 también disponible; este proyecto usa npm. No se necesita una instalación global de las herramientas del proyecto.
- Cuatro skills oficiales de Emil, copiadas con sus recursos desde un commit fijado y verificadas frente al origen; Impeccable skill 4.8.2 instalado con el CLI oficial 4.8.2 y su motor fijado 0.1.21. El CLI `skills list` detecta las cinco en el ámbito del proyecto. Impeccable tiene manifiesto de procedencia propio, porque no se instaló a través de `skills`.
- 74 checksums de recursos y brief, frontmatter, referencias locales y versiones exactas comprobados mediante `npm run setup:check`.
- Restauración desde una copia limpia del índice Git: `npm ci`, descarga del motor fijado con verificación y `setup:check` pasan sin copiar `node_modules`, binarios o cachés existentes.
- Playwright 1.65.0: **12/12 pruebas técnicas pasan**, Chromium escritorio/móvil, Firefox y WebKit. Capturas reales en `evidence/setup/`; las de 1440 y 390 px de Chromium se inspeccionaron visualmente. Incluye teclado, preferencia de movimiento reducido y lectura a cinco anchos. Resumen reproducible en `evidence/setup/results.json`.
- Las dependencias ausentes de WebKit se resolvieron con 13 paquetes Debian fijados, descargados y extraídos localmente, verificación SHA-256, carga dinámica y `ldd`. El wrapper de MiniBrowser sustituye `LD_LIBRARY_PATH`: el instalador enlaza solo bibliotecas ausentes en su `sys/lib` local, sin editar el wrapper oficial. La omisión del preflight basado en `ldconfig` se documenta en README; el lanzamiento real de los tres motores sí se probó.
- `npm audit --omit=optional`: sin vulnerabilidades informadas. No equivale a una auditoría de seguridad de una aplicación futura.
- Brief completo de 18 páginas conservado con su nombre original y transcripción; PRODUCT.md, DESIGN.md, CLAUDE.md, README y `.env.example` preparados.

## Configurado, pendiente de comprobar

- Hooks portables y comandos en Claude Code: archivos y ejecutable comprobados, pero el cliente `claude` no está instalado. Verificar carga de skills y ejecución de hooks al abrir el proyecto en Claude Code.
- GSAP ScrollTrigger y Lenis: guion, sincronización, limpieza, reversibilidad, adaptación y accesibilidad documentados; se instalarán al crear la aplicación. No hay animaciones implementadas aún.
- Términos, privacidad y cookies: borradores internos y especificaciones de páginas, minimización y dos casillas independientes con enlaces. Faltan políticas finales y formularios reales; el acuse de privacidad no se confunde con consentimiento para finalidades opcionales.
- Recorridos de acceso, diagnóstico, voz, revisión, repaso, progreso, cuenta y cobro: plan de aceptación preparado; sin código ni servicios reales o simulados en esta fase.
- Vista previa: servidor técnico comprobado por las pruebas, con pasos de apertura en localhost o Codespaces. No existe todavía una preview de VERVO ni un enlace externo verificado para este entorno. No se ha publicado un dominio.

## Bloqueado y qué falta para resolverlo

- Cierre del diseño conforme al `.md`: falta el archivo original de referencia, que no fue adjuntado ni estaba en el repositorio. Incorporarlo conservando su nombre y completar la matriz de trazabilidad.
- Publicar textos legales definitivos y activar servicios: faltan responsable/contacto y países, proveedores/retenciones, oferta comercial aprobada, contenido pedagógico y audios autorizados. Las claves de los proveedores se configurarán en el servidor al implementar cada integración, sin ponerlas en chat o Git. Esto no bloquea la preparación entregada.
- URL compartida directa: el catálogo actual no ofrece una herramienta de port forwarding comprobada. El README da pasos para obtener una URL privada de prueba en Codespaces cuando se quiera abrir la fixture desde otro equipo.
- La carpeta de salidas indicada por el cliente no es escribible por este usuario (`/codex`: permiso denegado). La rama de GitHub permite descargar el ZIP de los archivos versionados sin `node_modules`, secretos, navegadores ni archivos temporales.

Figma queda **omitido por decisión del usuario**, no bloqueado: se documentaron las herramientas observadas sin afirmar autenticación o acceso a un archivo. No hace falta un enlace de Figma para continuar esta fase.
