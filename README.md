# VERVO · preparación del proyecto

Este repositorio contiene las herramientas, el brief, las decisiones iniciales y una prueba de navegador. **Todavía no contiene las pantallas ni la aplicación de práctica de inglés.** Ese límite responde a la instrucción de preparar primero el entorno. Figma se omite por decisión posterior del usuario.

El repositorio `kadeshplay-prog/verbodemo` estaba vacío al inspeccionarlo. Se crea un commit inicial vacío en `main` para disponer de una base de revisión; todos los archivos de esta preparación se proponen en `chore/vervo-project-preparation`, sin fusionarlos.

## Instalar y comprobar

Requisitos: Node **24.22.1**, npm **11.9.0**, Git y curl con CA válidas. Python 3 y `dpkg-deb` solo para la alternativa de bibliotecas locales de Debian. Las dependencias npm son locales y sus versiones están fijadas en `package-lock.json`; no hace falta instalar una CLI global.

```bash
git clone --branch chore/vervo-project-preparation https://github.com/kadeshplay-prog/verbodemo.git
cd verbodemo
npm ci
npm run tools:prepare
npm run setup:check
npm run browsers:install
```

En el entorno cloud utilizado, Debian 13 amd64 sin sudo, faltaban bibliotecas de WebKit. Se preparó esta alternativa local:

```bash
npm run browsers:deps:debian
npm test
```

El script descarga los paquetes fijados en `docs/tooling/debian-browser-libs.lock.json` desde Debian por HTTPS, verifica SHA-256 y extrae en `work/browser-libs/`. No modifica APT ni el sistema. Verifica con carga dinámica las bibliotecas requeridas. Playwright consulta `ldconfig` para parte de su preflight y no ve bibliotecas locales: solo después de esa comprobación se omite ese preflight; las pruebas abren realmente los navegadores con `LD_LIBRARY_PATH` local.

En otros sistemas compatibles, instalar las dependencias mediante el administrador del entorno y el [procedimiento oficial de Playwright](https://playwright.dev/docs/browsers#install-system-dependencies). Por ejemplo, con permisos administrativos: `npm exec -- playwright install-deps chromium firefox webkit`. No ejecutar el script Debian en otra distribución. Si solo se quiere comprobar Chromium: `npm run test:setup`.

`tools:prepare` restaura el motor de Impeccable fijado por la copia versionada de la skill. Las skills, referencias y licencias ya están en el repo; este comando no las actualiza. Los binarios y navegadores reinstalables quedan ignorados por Git. Ningún paso de esta fase requiere una clave o contraseña; `.env.example` documenta el único puerto opcional. Los scripts leen `SETUP_PORT` del entorno, sin cargar `.env` automáticamente.

## Comandos disponibles

| Comando | Resultado |
| --- | --- |
| `npm run setup:check` | Integridad de skills/documentos, rutas, versiones y ausencia de dependencias de app prematuras |
| `npm run tools:prepare` | Motor oficial de Impeccable local con checksum verificado |
| `npm run tools:context` | Contexto del proyecto mediante el launcher de la skill |
| `npm run browsers:install` | Chromium, Firefox y WebKit de la versión de Playwright fijada |
| `npm run browsers:deps:debian` | Bibliotecas de usuario para este Debian 13 amd64 |
| `npm test` | Pruebas técnicas en tres motores; incluye escritorio y móvil en Chromium |
| `npm run test:setup` | Comprobación técnica en Chromium 1440 y 390 px |
| `npm run test:report` | Informe HTML local de la última ejecución |
| `npm run preview:setup` | Servidor de comprobación en puerto 4173; no es la web de VERVO |

La fixture verifica apertura, interacción, teclado, preferencia de movimiento reducido, anchos 320/390/768/1024/1440, ausencia de cookies/peticiones externas y captura. Las imágenes se escriben en `evidence/setup/`; trazas e informes temporales, en `work/`. Resultado real y límites en `docs/tooling/STATUS.md`.

## Revisar desde un navegador

```bash
npm run preview:setup
```

En el mismo equipo: `http://localhost:4173/setup/`. `GET /healthz` devuelve `{"status":"ok","scope":"tooling-only"}`. El servidor solo expone la fixture y salud; no sirve el repositorio, el brief ni `.env`.

Este entorno no ofrece una URL externa/port forwarding verificada para este proceso. No se ha publicado un dominio ni una aplicación. Para una vista previa privada sin dominio, abrir esta rama en GitHub Codespaces, ejecutar los comandos anteriores y `npm run preview:setup`, ir a **Ports → Forward a port → 4173**, conservar visibilidad **Private** y abrir el enlace que Codespaces genere. No confundir `localhost` con un enlace accesible desde otro equipo. Esta vista muestra únicamente la comprobación técnica; la preview de VERVO se preparará cuando exista la aplicación.

El despliegue final no tiene comando aún porque no se ha elegido ni creado la aplicación. Al implementarla se añadirán scripts `dev`, `build`, `start`, variables reales de los adaptadores y un procedimiento de preview del proveedor elegido. No utilizar el servidor de pruebas como servidor de producción ni habilitar publicación automática en esta fase.

## Documentos y recursos

- `CLAUDE.md`: instrucciones breves para continuar en Claude Code.
- `PRODUCT.md`: público, recorridos, P0/P1, decisiones provisionales e integraciones.
- `DESIGN.md`: sistema base del brief y guion de GSAP ScrollTrigger/Lenis.
- `docs/references/`: PDF original, transcripción completa y matriz de trazabilidad. **Falta el `.md` de referencia original.**
- `.claude/skills/`: las cuatro skills oficiales de Emil y el bundle de Impeccable.
- `docs/tooling/SKILLS.md`: uso, versiones y mantenimiento. Claude Code no está instalado en este entorno; sus hooks aún deben comprobarse dentro de ese cliente.
- `docs/tooling/FIGMA.md`: disponibilidad observada, alcance omitido y enlace necesario si se retoma.
- `docs/legal/`: requisitos y borradores internos de términos, privacidad y cookies. Aún no son páginas ni políticas listas para publicar.
- `docs/VALIDATION.md`: aceptación posterior de los recorridos de VERVO.
- `third_party/`: licencias y referencias complementarias.

Las skills de Emil proceden del commit fijado en `skills-lock.json`; Impeccable 4.8.2 se instaló según su [tutorial oficial](https://impeccable.style/tutorials/getting-started/). Su motor de skill es 0.1.21. No se ha usado una instalación global ni enlaces a los clones de investigación.

## Siguiente fase y límites

Antes de cerrar diseño falta el `.md` original. La próxima fase creará la aplicación y añadirá `gsap` y `lenis` a sus dependencias de ejecución; ScrollTrigger forma parte de GSAP. Documentación oficial: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) y [Lenis con GSAP](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).

La portada usará scroll vinculado y reversible conversación→corrección→repaso; la app, móvil y movimiento reducido conservan scroll nativo según el brief. Estos efectos aún no están implementados.

Tampoco existen todavía acceso, voz, diagnóstico, sesiones, correcciones, progreso, cuenta o cobros, reales o simulados. Faltan proveedores y credenciales de servidor, 24 fichas revisadas, audios autorizados, responsable legal, países, retención y oferta aprobada. Solicitar únicamente los datos imprescindibles al iniciar cada integración; nunca secretos en chat o Git.

La entrega completa posterior incluirá código de aplicación, assets, componentes, políticas finales, `.env.example` de los servicios elegidos, recorridos de Playwright, capturas Portada/Hoy/Sesión/Revisión a 1440/390 y vídeo de scroll. Publicación en un dominio solo cuando el usuario la solicite.
