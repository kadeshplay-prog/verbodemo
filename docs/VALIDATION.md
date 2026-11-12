# Validación por fases

## Ahora: preparación

`npm run setup:check` comprueba integridad de skills y documentos. `npm test` levanta exclusivamente la fixture técnica, abre navegadores, genera capturas, comprueba una interacción, teclado, preferencia de movimiento reducido y lectura a 320/390/768/1024/1440 px. También comprueba ausencia de cookies, peticiones externas y exposición de `.env` en ese servidor.

Las capturas de `evidence/setup/` son de la comprobación del entorno. No son Portada, Hoy, Sesión o Revisión de VERVO. No acreditan todavía accesibilidad, voz, seguridad o fluidez de la futura aplicación.

## Después: aplicación

| Prueba | Evidencia exigida |
| --- | --- |
| Primera visita | Registro → configuración → diagnóstico → sesión → corrección → repaso; todos los CTA con destino |
| Regreso | Preferencias, turnos confirmados, revisión y repasos persisten tras recargar/reconectar |
| Voz | Permiso denegado, grabar/enviar/cancelar, reproducción/pausa, incomprensión, conexión fallida, salida y cambio de pestaña |
| Errores | Sin historial, carga, sesión vacía, límite de minutos, pago fallido y pendiente; reintentos idempotentes |
| Legal | Enlaces públicos y junto a las dos casillas; sin premarcar; errores separados; retorno conserva datos; consentimiento opcional revocable y versionado |
| Cookies | Inventario real; scripts opcionales bloqueados antes de aceptar y tras rechazo/revocación; aceptar/rechazar igualmente accesibles |
| Scroll | Escena al 0/33/66/100%, avance/retroceso, cambio de ruta, anclas, Atrás, salida a planes; sin pin residual |
| Movimiento reducido | Activado al entrar y cambiado durante visita; todos los actos legibles, sin Lenis, pin o scrub |
| Teclado | Foco y orden lógico, formularios etiquetados, menús/modales completos, devolución de foco, controles visibles |
| Adaptación | 320, 390, 768, 1024 y 1440 px; texto largo, zoom 200%, reflujo, teclado móvil y área segura |
| Visual | Portada/Hoy/Sesión/Revisión en 1440 y 390 px con fuentes cargadas y datos estables; inspeccionar antes de aceptar goldens |
| Navegadores | Chromium, Firefox y WebKit; Safari/iPhone y audio/tacto reales por separado |
| Movimiento/rendimiento | Vídeo de scroll normal, rápido y reverso; perfil de tareas y frames; métricas web y latencia de voz separadas |

Etiquetar cada resultado como servicio real, fixture controlada o simulación. Una respuesta predefinida no valida IA, ni una compra ficticia valida un cobro. No aceptar snapshots de forma masiva sin inspección. Después de correcciones, repetir las pruebas afectadas.

Los objetivos y aceptación definitivos proceden del brief pp. 12, 14 y 18. Los ensayos con 10–15 usuarios y la revisión pedagógica aún no se han realizado.
