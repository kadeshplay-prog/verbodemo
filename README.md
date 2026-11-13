# VERVO · demo navegable

Una conversación cotidiana, una corrección útil y una oportunidad para intentarlo otra vez. Esta demo implementa el recorrido completo con el brief y el [DESIGN.md original del usuario](docs/references/DESIGN.md).

**Es una demo de revisión:** tutor preparado, correcciones limitadas, diagnóstico sin evaluación de nivel, perfil local y pagos simulados. No hay autenticación de VERVO, IA ni cobros reales. El avance se guarda en este navegador; el audio, únicamente si eliges conservarlo en el dispositivo.

## Probar en tu navegador

Demo privada desplegada y verificada: **[Abrir VERVO](https://vervo-demo-kadesh.insightfullyre2.chatgpt.site)**. El alojamiento puede pedir iniciar sesión con la misma cuenta de ChatGPT propietaria del Site; eso es independiente del perfil de práctica.

1. Pulsa **Probar una conversación**.
2. El nombre es opcional. Revisa los documentos, marca **las dos casillas independientes** y pulsa **Entrar a la demo**.
3. Completa la configuración. En audio puedes elegir **Seguir por escrito**, sin permiso de micrófono.
4. Completa u omite el diagnóstico. Abre **¿Qué tal tu fin de semana?**.
5. Escribe `Yesterday I go to the cinema.`, envía y pulsa **Terminar y revisar**.
6. Pulsa **Practicar esta frase** y escribe `Last weekend I went to the park.`. Visita **Repasar** y **Mi progreso**.
7. Recarga: el avance sigue guardado. **Cuenta** permite exportar los textos, borrar audios y restablecer la demo.

La página **Qué puedes probar** contiene la guía. Puedes simular un plan confirmado, pendiente o fallido sin proporcionar datos financieros.

## Ejecutar en tu equipo

Requisitos comprobados: Node **24.22.1**, npm **11.9.0** y Git. No necesitas claves ni una CLI global.

```bash
git clone --branch chore/vervo-project-preparation https://github.com/kadeshplay-prog/verbodemo.git
cd verbodemo
npm ci
npm run dev
```

Abre **http://localhost:5173** en ese mismo equipo. En Codespaces, abre esta rama, ejecuta los comandos npm y reenvía el puerto 5173 desde **Ports**, con visibilidad **Private**. Utiliza la URL HTTPS que genere GitHub: localhost de otra máquina no es accesible desde tu navegador.

Para probar la compilación de producción:

```bash
npm run build
npm run preview
```

Abre **http://localhost:4174**. Las rutas con `#` permiten recargar pantallas interiores en alojamiento estático sin configurar redirecciones.

## Qué funciona

| Recorrido | Implementación de la demo |
| --- | --- |
| Público | Portada, método, situaciones, planes, ayuda y guía de prueba |
| Movimiento | GSAP ScrollTrigger con scrub y retroceso, Lenis en escritorio; tres actos completos sin pin en móvil y movimiento reducido |
| Acceso/configuración | Nombre opcional, dos casillas con enlaces, registro de versión/fecha, cuatro pasos y perfil local |
| Diagnóstico | Pregunta escrita y comprensión preparadas, opción de omitir, sin puntuación de nivel |
| Biblioteca/ruta | 24 situaciones editoriales, búsqueda, filtros, detalle, expresiones y cuatro semanas |
| Sesión | Turnos preparados, texto, pistas, traducción, voz del navegador, pausa, salida y reanudación |
| Audio | MediaRecorder y medidor de audio real donde el navegador los admita; escucha y guardado voluntario local |
| Revisión/repaso | Reglas de ejemplo, nuevo intento, cuaderno, notas y eliminación |
| Progreso | Conversaciones y turnos propios, segundos grabados y repasos; sin porcentaje de fluidez |
| Cuenta/legal | Preferencias, exportación JSON, eliminación de datos, simulación de plan/cancelación y políticas públicas |

Las correcciones reconocen ejemplos de pasado con `go → went`, `I am agree → I agree` y `he don’t → he doesn’t`. No sustituyen un análisis lingüístico; no marcar una observación no significa que la respuesta se haya evaluado como correcta. El audio no se transcribe ni evalúa: para probar sugerencias se escribe también el texto.

## Pruebas

```bash
npm run typecheck
npm run build
npm run browsers:install
npm test
```

En este **Debian 13 amd64 sin sudo**, antes de npm test:

```bash
npm run browsers:deps:debian
```

El instalador extrae 13 paquetes fijados y verificados en work/, comprueba la carga dinámica y enlaza las bibliotecas ausentes dentro del bundle local de WebKit. No cambia el sistema. Su preflight basado en ldconfig se omite solo tras verificar las bibliotecas; los navegadores se abren realmente. En otra distribución, usar el [procedimiento oficial de Playwright](https://playwright.dev/docs/browsers#install-system-dependencies) con el administrador del entorno.

Las pruebas de aplicación usan la **compilación de producción**: ejecutar build antes. APP_BASE_URL permite apuntar a otro servidor de prueba. Cubren recorrido, persistencia, casillas, filtros, fallos, pagos simulados, movimiento reducido, scroll reversible y accesibilidad automática. La prueba de voz aporta una señal sintética de Web Audio a MediaRecorder en Chromium; no acredita el capturador de micrófono físico, que no está disponible en este host, ni Safari/iPhone real.

Capturas y vídeo: evidence/app/. Informes y trazas temporales: work/app-test-results/, work/app-report/, work/a11y/. Resultados y límites: docs/VALIDATION.md. El harness anterior se conserva con `npm run test:tooling` y `npm run preview:setup`; evidence/setup/ pertenece a esa comprobación técnica.

## Arquitectura

React, TypeScript, Vite y React Router con rutas hash. CSS por capas, Lucide y fuentes locales Manrope y Source Serif 4 con sus licencias. localStorage conserva textos/preferencias; IndexedDB, grabaciones elegidas. Pantallas interiores cargadas bajo demanda. No hay backend, analítica ni publicidad en la aplicación.

src/components/ contiene estructura, diálogo, grabador y escena; src/pages/, pantallas; src/lib/, contenido, estado y audio. GSAP y Lenis tienen versiones exactas y lockfile. Una sola instancia Lenis usa el ticker GSAP y se destruye al salir de la portada o activar movimiento reducido. La app utiliza scroll nativo.

Skills oficiales en .claude/skills/, con licencias y checksums. Restaurar el motor es opcional para ejecutar la web:

```bash
npm run tools:prepare
npm run setup:check
```

CLAUDE.md orienta futuras sesiones; PRODUCT.md y DESIGN.md consolidan las decisiones y sus fuentes. Figma sigue omitido por petición del usuario.

## Alojamiento y Git

.openai/hosting.json identifica el Site privado y dist/ como salida estática. Para actualizar: validar/compilar, conservar el código en Git, sincronizar ese commit con el repositorio fuente del Site, empaquetar el manifiesto y dist/, guardar versión y desplegar preservando acceso privado. Credenciales solo en memoria/stdin, nunca en archivos, argumentos o logs. No cambiar ID o audiencia para resolver errores.

La rama y PR conservan preparación e implementación sin fusionar automáticamente. dist, node_modules, motores, grabaciones y temporales se excluyen del ZIP de GitHub. La entrega es una demo alojada privada, sin dominio personalizado ni lanzamiento comercial.

## Pendiente para producción

Autenticación/recuperación reales, backend y sincronización, STT/tutor/TTS, pagos/webhooks idempotentes, soporte, oferta aprobada, revisión docente y audios autorizados. También responsable legal, países, proveedores, transferencias, bases jurídicas y retenciones. Los documentos visibles describen la demo; deben completarse y revisarse antes de recoger datos de producción.

.env.example documenta que la demo no necesita secretos. Las variables de proveedores se definirán con sus adaptadores del lado servidor al elegirlos. No uses contraseñas, datos financieros o información sensible para probarla.
