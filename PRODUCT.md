# VERVO · producto

<!-- impeccable:product-schema 1 -->

Estado: base documental de preparación, derivada del brief y de la petición. No acredita una aplicación implementada.

## Platform

web

## Stack

El usuario delega la arquitectura y pide inspeccionar antes de construir. El repositorio destino `kadeshplay-prog/verbodemo` estaba vacío. Esta fase usa Node 24 y npm solo para herramientas, con versiones exactas y `package-lock.json`.

Propuesta para la siguiente fase: Next.js con TypeScript, componentes compartidos y adaptadores de servidor para autenticación, persistencia, STT, tutor, TTS y pagos. Mantener contenido editorial separado de los adaptadores. La elección final y las dependencias de aplicación quedan pendientes de esa fase; no se ha creado un scaffold ni una base de datos.

## Users

Adultos hispanohablantes que comprenden frases básicas de inglés, aproximadamente A2–B1, y necesitan ganar soltura al hablar. Interfaz y explicaciones en español; conversación en inglés. Móvil y escritorio, con alternativa escrita cuando no sea posible usar voz.

## Product Purpose

Conectar una situación cotidiana con una conversación fiable, hasta tres correcciones prioritarias y una nueva oportunidad de usar lo aprendido. La primera conversión es completar una práctica y recibir una corrección útil. La evidencia de avance procede de los propios intentos; no de porcentajes de fluidez ni certificaciones.

## Operating Context

Primera visita: Inicio → acceso → configuración de cuatro pasos → diagnóstico de 3–5 minutos → sesión → revisión → próximo repaso. Diagnóstico omitido: dificultad provisional y opción para cambiarla. Demostración opcional con grabación preparada, siempre identificada; nunca fingir que escucha.

Regreso: Hoy → continuar o comenzar práctica → revisión → repaso guardado. El cobro aparece después de entregar el resultado gratuito o al elegir una función de pago. No interrumpir una sesión para cobrar.

## Capabilities and Constraints

| Alcance inicial del brief | Pantallas y comportamiento futuro |
| --- | --- |
| Público P01–P04 | Inicio, cómo funciona, planes, ayuda y contacto |
| A01–A03 | Acceso y recuperación; meta, confianza, rutina y prueba de audio; diagnóstico orientativo |
| A04–A06 | Hoy, biblioteca con filtros, detalle y sesión por turnos: Hablar → Enviar; Cancelar descarta el turno actual |
| A07–A09 | Revisión, repaso, cuaderno y ruta; progreso basado en evidencia comparable |
| A10 | Preferencias, grabaciones, saldo, suscripción y cancelación de renovación |
| Contenido | Vida cotidiana: 24 situaciones de 5–10 minutos, organizadas en cuatro semanas; requiere fichas y revisión pedagógica |
| Adición del usuario | Términos, privacidad y cookies, enlaces permanentes, dos casillas separadas donde se solicite aceptación legal y recogida mínima de datos |

Cada situación necesita ID, objetivo, contexto, apertura, seguimiento, tres expresiones, ayudas graduadas, errores previstos, cierre y dos variantes de repaso. Aún no se han entregado las 24 fichas ni audios con derechos acreditados.

Conservar turnos confirmados, correcciones, preferencias y repasos al regresar. Reintentos y reconexiones no deben duplicar turnos ni consumo. La salida, pausa o cambio de pestaña detienen el micrófono. Las correcciones de pronunciación requieren evidencia de audio; el modo escrito no evalúa expresión oral.

P1: Trabajo, Viajes, situaciones personalizadas, acceso social y comparaciones avanzadas. Mostrar las rutas no disponibles como Próximamente. Fuera del lanzamiento: certificaciones, videotutores, personas tutoras, llamadas entre usuarios, conversación simultánea y cursos completos A1–C2.

## Decisiones provisionales y dependencias

- VERVO es un nombre de trabajo. Falta comprobar disponibilidad comercial y de dominio.
- Oferta propuesta, sin aprobación comercial: 299 MXN/mes y 180 minutos por ciclo. Gratis: diagnóstico y dos prácticas de hasta cinco minutos, sin tarjeta. No presentar estos importes como una oferta activa.
- Se propone contar audio de usuario y tutor; pausas, procesamiento, diagnóstico y fallos técnicos no consumen. Sin acumulación, recargas ni anualidad inicial. Confirmar costes, impuestos, devoluciones y reglas antes de conectar pagos.
- Autenticación/recuperación, base de datos, almacenamiento, STT, tutor IA, TTS, correo y pagos requieren proveedores elegidos y credenciales de servidor. No solicitarlas en esta preparación.
- Falta definir responsable legal, países de oferta, soporte, revisión pedagógica, retención de voz/transcripciones, encargados y transferencias. No conservar grabaciones para comparar sin elección separada del usuario.
- Figma omitido por instrucción posterior del usuario; no se ha validado ninguna conexión ni nodo.
- Falta el archivo `.md` original: bloquea cerrar la dirección visual derivada de esa referencia, no esta preparación.

## Brand Commitments

Identidad editorial contemporánea y una forma abstracta inspirada en la voz. Tono claro, adulto y alentador. No culpar por romper rachas; no inventar testimonios, cifras, logotipos de instituciones ni resultados. Sistema base y decisiones aún abiertas en `DESIGN.md`.

## Evidence on Hand

Brief V1.1 de 18 páginas en `docs/references/Brief_Visual_Contenido_VERVO.pdf`, leído íntegramente. Registro de requisitos y referencias en `docs/references/README.md`. Solo existe una fixture técnica de navegador; no hay conversaciones, pagos ni autenticación reales o simulados en una aplicación.

## Product Principles

1. Llegar pronto a una primera práctica útil con pocos datos.
2. Una conversación fiable tiene prioridad sobre la decoración.
3. Separar actividad, aprendizaje, estimación y certificación.
4. Exponer estados reales y permitir recuperación sin perder avance confirmado.
5. Separar procesamiento de voz necesario y conservación voluntaria.

## Accessibility & Inclusion

Objetivo de implementación: WCAG 2.2 AA, teclado completo, foco visible, subtítulos/transcripción, errores asociados, zoom y reflujo. Áreas táctiles de 48 × 48 px, controles estables y preferencia de movimiento reducido. Son criterios pendientes de validar en la aplicación, no resultados ya conseguidos.
