# VERVO · producto
<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

El usuario delegó arquitectura y después autorizó implementar una demo navegable. Se eligió React + TypeScript + Vite para una experiencia local y alojamiento estático, con rutas hash que sobreviven recargas. npm y lockfile con versiones exactas. Sin servidor, autenticación, IA o pagos reales.

## Users

Adultos hispanohablantes que comprenden frases básicas de inglés, aproximadamente A2–B1, y necesitan practicar. Interfaz/ayudas en español, práctica en inglés, móvil y escritorio, alternativa escrita. El nivel es público orientativo, no resultado de una evaluación.

## Product Purpose

Situación concreta → conversación → corrección prioritaria → nuevo intento → repaso. La primera conversión es completar una práctica útil; actividad y aprendizaje se interpretan por separado.

## Operating Context

Inicio → acceso local con nombre opcional y dos casillas → cuatro pasos → diagnóstico opcional → sesión → revisión → repaso → progreso. Regreso por Hoy o biblioteca, continuación de turnos confirmados y cuaderno. El avance persiste en este navegador; no hay sincronización entre equipos.

## Capabilities and Constraints

| Área | Demo implementada |
| --- | --- |
| P01–P04 | Inicio, método, planes, ayuda y guía de prueba |
| A01–A03 | Acceso local, recuperación explicada, configuración y diagnóstico preparado |
| A04–A06 | Hoy, 24 situaciones, filtros/detalle, sesión por turnos, texto/pistas/traducción |
| Audio | Captura y medidor reales si hay MediaRecorder; reproducción/guardado voluntario local. Sin STT ni evaluación de pronunciación |
| A07–A09 | Correcciones de reglas limitadas, práctica de frase, cuaderno editable, ruta y actividad propia |
| A10 | Preferencias, audios, exportación/borrado, simulación de plan y cancelación |
| Legal | Términos, privacidad y cookies públicos; casillas independientes y enlaces; registro de versión/fecha |

El tutor usa preguntas preparadas; las reglas cubren ejemplos específicos, no evalúan libremente el inglés. El diagnóstico no asigna nivel. El perfil local no constituye identidad/autenticación. Los pagos no cobran. Estas limitaciones se muestran dentro de la interfaz y la guía.

Las 24 situaciones son contenido editorial de demo pendiente de revisión docente. Trabajo y Viajes aparecen como Próximamente. Fuera del lanzamiento previsto: certificados, tutores humanos, videoavatares, llamadas entre usuarios y conversación simultánea.

## Open Decisions

Nombre VERVO provisional. Precio propuesto 299 MXN/mes y 180 minutos, sin aprobación comercial; no se ofrece una compra real. Oferta, impuestos, cómputo/devolución de minutos y costes deben aprobarse antes de activar pagos.

Pendientes: proveedores de auth, BD, almacenamiento, STT/tutor/TTS, correo y pagos; claves de servidor; soporte y revisión pedagógica; responsable legal, países, retención y transferencias. No pedir esos secretos para probar esta demo.

## Brand Commitments

La voz toma forma, con tono adulto y alentador. La referencia DESIGN.md posterior cambia el sistema visual del brief a serif, blanco, tinta y melocotón. La resolución y trazabilidad están en DESIGN.md de raíz. Sin cifras, testimonios, instituciones, resultados o certificaciones inventados.

## Evidence on Hand

Brief V1.1 completo de 18 páginas y referencia original DESIGN.md en docs/references/. Código navegable y evidencia automatizada en tests/app/ y evidence/app/. La revisión de voz se prueba con captura sintética; no sustituye hardware real. Figma omitido por petición del usuario.

## Product Principles

1. Primer valor con pocos datos.
2. Una conversación comprensible antes que efectos.
3. Evidencia propia sin inventar dominio.
4. Recuperar errores y conservar turnos confirmados.
5. Separar procesamiento de voz y elección de guardar audio.

## Accessibility & Inclusion

Objetivo WCAG 2.2 AA: teclado, foco, labels, errores asociados, texto seleccionable, reflujo, movimiento reducido y alternativa escrita. Las pruebas y límites se documentan; no se declara conformidad total por una captura o escaneo automático.
