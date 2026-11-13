# Validación de la demo VERVO

Ejecución final: 13 de noviembre de 2026, UTC. Resultados y checksums en [evidence/app/results.json](../evidence/app/results.json). Se probó la compilación de producción, sin HMR.

## Resultados comprobados

| Comprobación | Resultado y alcance |
| --- | --- |
| TypeScript y Vite | Compilación de producción correcta; pantallas interiores cargadas bajo demanda |
| Aplicación Playwright | **26 aprobadas, 6 omitidas deliberadamente, 0 fallidas**, sin reintentos |
| Motores | Chromium 158.0.8127.18 escritorio/móvil emulado; Firefox 159.0; WebKit 27.2 |
| Entorno anterior | **12/12** pruebas de la fixture técnica; evidencia separada en evidence/setup/ |
| Integridad | 5 skills, 75 checksums, referencias y versiones exactas verificadas |
| Formato y dependencias | Prettier correcto; npm audit --omit=optional: 0 vulnerabilidades informadas |
| Impeccable | Detector sobre src/: 0 hallazgos; criterios de crítica/adaptación/pulido aplicados a capturas |
| Accesibilidad automática | Axe, seis rutas en Chromium escritorio y móvil: 0 violaciones detectadas; no equivale a certificación WCAG |

Las seis omisiones son: escena fijada en móvil (1, lectura vertical), Axe en Firefox/WebKit (2, análisis concentrado en Chromium), captura de prueba fuera de Chromium escritorio (3). Los cinco recorridos funcionales se ejecutan en los cuatro proyectos.

## Recorridos y estados

- Primera visita: dos casillas independientes, errores separados, configuración, diagnóstico, sesión vacía, envío, recarga, revisión, nuevo intento, cuaderno y progreso persistentes.
- Biblioteca: 24 situaciones, búsqueda/filtros, recuperación del vacío y acceso a términos, privacidad, cookies, ayuda y planes.
- Adaptación a 320, 390, 768, 1024 y 1440px: ausencia de desbordamiento y geometría de botones de portada dentro de la pantalla.
- Fallo del tutor preparado: borrador conservado, reintento sin duplicar turnos. Micrófono denegado/no compatible: explicación y alternativa escrita. Diálogo de pausa/salida y Escape.
- Plan simulado: pendiente sin activación, confirmación, cancelación; restablecer datos exige confirmación. Sin tarjetas o cobros.
- Movimiento reducido inicial y cambiado en vivo; navegación y Atrás eliminan pin, ticker e instancia Lenis de la aplicación.
- Scroll en tres motores: puntos 0/33/66/100%, ida/vuelta con rueda, ancla durante inercia, foco en destino, salida a planes y regreso. No escribe datos ni activa audio.
- Voz: una señal sintética Web Audio alimenta el MediaRecorder real de Chromium. Se comprueban cierre de pistas, reproducción disponible, ausencia de guardado por defecto, guardado elegido, persistencia en IndexedDB y borrado.

La señal de prueba sustituye únicamente getUserMedia. **El capturador físico de este host devuelve NotSupportedError**; no se presenta esa prueba como micrófono real, STT, IA, evaluación de pronunciación o Safari/iPhone.

## Revisión visual y de movimiento

Capturas en [evidence/app/](../evidence/app/): portada, acceso, Hoy, biblioteca, sesión, revisión, repaso, progreso y cuenta, en escritorio y móvil. Se inspeccionaron portada de ambos tamaños, Hoy/sesión móvil, revisión de escritorio y los tres actos. El vídeo [scroll-ida-vuelta.webm](../evidence/app/scroll-ida-vuelta.webm) se revisó mediante fotogramas.

Se corrigieron CTA móviles recortados por el tamaño mínimo de la cuadrícula, texto partido en la ruta semanal, foco del estudio oscuro, contraste de tarjetas entre actos y desplazamiento doble del ancla (Lenis ya respeta scroll-padding). DESIGN.md registra los cambios y el timeline. No se aceptaron snapshots automáticamente ni se inventó una puntuación de diseño.

## Reproducir

```bash
npm ci
npm run build
npm run browsers:install
# En el Debian 13 amd64 de este entorno, sin sudo:
npm run browsers:deps:debian
npm test
npm run test:tooling
npm run setup:check
```

APP_BASE_URL permite un servidor alternativo. Informes/trazas y resultados completos de Axe: work/app-report/, work/app-test-results/ y work/a11y/. Son temporales; el resumen saneado se conserva en Git.

## Límites y pruebas pendientes

No se han validado autenticación, IA/STT/TTS remotos, sincronización, cobros/webhooks, soporte o recuperación real: no están conectados. Tampoco micrófono/auriculares físicos, Safari/iPhone real, lector de pantalla humano, zoom real al 200%, latencia de voz, Web Vitals p75 o perfil de frames. Cambiar el viewport no sustituye esos ensayos.

Los ensayos con 10–15 usuarios, revisión pedagógica y revisión legal dependen de la siguiente fase. El alcance automatizado no afirma seguridad de producción ni conformidad WCAG completa. El alojamiento privado se verifica por la respuesta nativa del despliegue; su autenticación no está incluida en el recorrido local de Playwright.
