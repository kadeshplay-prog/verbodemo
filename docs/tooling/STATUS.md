# Estado de entrega · demo navegable

Actualizado el 13 de noviembre de 2026, UTC. El usuario autorizó implementar la demo después de completar la preparación. El DESIGN.md posterior se recibió y se conserva íntegro en docs/references/.

## Instalado y comprobado

- Node 24.22.1, npm 11.9.0, Git 2.52.0 y Python 3.12.14. React/TypeScript/Vite con npm y lockfile, sin instalaciones globales necesarias.
- Cuatro skills oficiales de Emil fijadas al commit 4061b67b8d976a186aca118594f54b638c5f718a; Impeccable 4.8.2/motor 0.1.21. Recursos/licencias en el repo. Integridad: 5 skills y 75 checksums.
- GSAP 3.15.1 con ScrollTrigger y Lenis 1.3.27 implementados, sincronizados y limpiados al navegar. Tres actos reversibles, lectura sin animación y adaptación a movimiento reducido/móvil.
- Demo con páginas públicas y recorridos interiores, dos casillas legales, almacenamiento local, grabador opcional y pagos explícitamente simulados. README contiene instrucciones, fuentes y limitaciones.
- Compilación/TypeScript/formato correctos. Playwright: **26 aprobadas, 6 omisiones previstas, 0 fallidas**; fixture técnica 12/12. Capturas/vídeo inspeccionados. Axe: seis rutas en escritorio/móvil, sin violaciones detectadas.
- Chromium, Firefox y WebKit abren realmente. Las 13 bibliotecas Debian necesarias se extraen en work/ con hashes y comprobación dinámica, sin sudo ni modificaciones del sistema.
- npm audit --omit=optional: 0 vulnerabilidades informadas. No equivale a auditoría de seguridad de producción.
- Rama chore/vervo-project-preparation y PR #1; sin fusión automática. ZIP desde la rama, excluidos node_modules, dist, binarios, secretos y temporales.

## Configurado, pendiente de comprobar

- Claude Code: skills, rutas y motor comprobados por terminal. Este entorno no incluye el cliente claude; abrir el repo allí para verificar carga de comandos/hooks.
- Micrófono físico, altavoces/auriculares y Safari/iPhone real: deben probarse en el dispositivo del usuario. La prueba automatizada usa señal Web Audio y MediaRecorder real; el capturador del host no está disponible. La práctica escrita funciona.
- Revisión humana de accesibilidad, pedagogía y usos con personas. Alcance documentado en docs/VALIDATION.md.
- Alojamiento privado preparado en Sites: https://vervo-demo-kadesh.insightfullyre2.chatgpt.site. El resultado final y su versión se registran en la PR. Acceso con la cuenta propietaria; sin dominio personalizado.

## Bloqueado y qué falta para resolverlo

- Servicios de producción: elegir proveedores y configurar secretos del lado servidor para identidad, BD, STT/tutor/TTS, correo y pagos. No hacen falta claves para probar la demo.
- Documentos comerciales definitivos: faltan responsable/contacto, países, oferta aprobada, proveedores, transferencias, retenciones, impuestos y reembolsos. Los textos públicos describen la demo, sin inventar esos datos.
- Archivo adjunto local: la carpeta de salida bajo /codex no es escribible. GitHub ofrece el ZIP del proyecto versionado como alternativa.

Figma queda **omitido por decisión del usuario**. No se afirma acceso autenticado o verificación de frames. El brief y el .md original sí están presentes, leídos y relacionados con PRODUCT.md/DESIGN.md.
