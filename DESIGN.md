# VERVO · base de diseño y movimiento

Estado: especificaciones documentales del brief, sin pantallas diseñadas o implementadas. El `.md` de referencia falta; no se cierra todavía la dirección visual. Figma se omite por decisión del usuario.

## Autoridad y trazabilidad

Petición reciente del usuario → brief funcional/visual → `.md` original cuando se reciba → decisiones específicas → criterios de las skills. No hay contradicción funcional material detectada. La solicitud de entrega completa corresponde a una fase futura: la indicación explícita actual limita el trabajo a preparación. Si una recomendación genérica de Impeccable desaconseja fondos cálidos o verdes por frecuentes, prevalece la identidad explícita del brief.

Matriz de requisitos, pantallas y fuentes: `docs/references/README.md`. Registrar allí cada regla del `.md` y el nodo de Figma si se reanuda esa integración. No sustituir una referencia ausente con otra inventada.

## Identidad y composición base

La voz toma forma: una cinta acústica abstracta conecta conversación, corrección y repaso. En portada es una demostración editorial; dentro del estudio solo reacciona al audio real. No representa una persona tutora ni finge escucha.

Composición asimétrica, titulares amplios, espacio y capturas reales del producto cuando existan. Portada: proporción 5/7 entre texto y estudio. Superficies claras para explorar y gestionar; estudio oscuro para conversar. Sin partículas, banderas decorativas, avatares fotorrealistas ni cuadrículas repetidas en cada sección.

| Rol | Valor del brief |
| --- | --- |
| Fondo / superficie | `#F6F7F2` / `#FFFFFF` |
| Texto / secundario | `#15241F` / `#52635B` |
| Marca / hover | `#14634D` / `#0F4F3D` |
| Estudio / panel oscuro | `#0D211C` / `#17382E` |
| Lima / texto en estudio | `#D7F57B` / `#F6F7F2`, `#C4D2CA` |
| Borde funcional / decorativo | `#7A8D83` / `#D8E0D8` |
| Alerta / error | `#8A4B08` / `#B42318`, siempre con texto e icono |

Familia propuesta Manrope 400/500/600/700, alojada localmente cuando se añada con licencia; fallback sistema. Titular principal 80/84 px en escritorio y 44/48 en móvil; sección 48/54 y 32/38; título de pantalla 32/40 y 26/34. Cuerpo público 18/28, app y móvil 16/24; ayudas 14/20. Ajustar de forma fluida sin convertir textos en imágenes.

Máximo público 1280 px; 12 columnas y separación 24 px en escritorio. App: barra lateral 240 px, margen 32 px. Formularios hasta 560 px y lectura hasta 720 px. Móvil: 16–20 px y una columna. Espacios 4, 8, 12, 16, 24, 32, 48, 64, 96; separación entre secciones 96 px / 56 px móvil. Radios: campos 12 px, botones 16 px, paneles 24 px. Profundidad discreta, no vidrio sobre lectura extensa.

## Componentes y estados futuros

Botón público 52 px y app 48 px; estado normal, hover, foco, pulsado, carga y deshabilitado. Campos con etiqueta persistente, ayuda y error asociado. Modales con foco inicial y devolución al cerrar. Tarjetas con categoría, objetivo, dificultad, tiempo, estado y acción inequívoca. Una familia de iconos de 24 px.

Micrófono de 72 px y controles de voz estables: Listo, Grabando, Procesando, Respondiendo, Pausado, No se entendió, Sin conexión y Sin permiso. Cada estado tiene texto y recuperación; no usar porcentajes falsos de procesamiento. El medidor nunca bloquea enviar, cancelar, pausar o salir.

Términos, privacidad y cookies tendrán páginas legibles, enlaces de pie y acceso desde cuenta. Las dos casillas legales serán independientes, sin premarcar, con enlace junto a cada una; foco visible, errores específicos y apertura del documento sin perder el formulario. Detalle semántico y finalidades en `docs/legal/REQUISITOS.md`.

## Movimiento previsto · GSAP ScrollTrigger y Lenis

Se añadirán `gsap` (incluye ScrollTrigger) y `lenis` al crear la aplicación con su gestor elegido. No están instalados en este paquete de herramientas. No usar el paquete antiguo `@studio-freight/lenis`.

En público de escritorio desde 1200 px: una instancia Lenis con `autoRaf: false`, `lenis.on('scroll', ScrollTrigger.update)` y un solo ticker GSAP que llama `lenis.raf(time * 1000)`. No duplicar RAF ni combinar suavizadores. Recalcular tras fuentes, imágenes y composición; destruir instancia, ticker, timelines y listeners al cambiar de ruta o preferencia. Comprobar la API oficial antes de implementarlo.

| Elemento / rol | Inicio | Recorrido o duración | Movimiento / relación |
| --- | --- | --- | --- |
| Titular y CTA / estáticos | Primera carga | Siempre disponibles | Sin entrada que retrase lectura o interacción |
| Panel del hero / protagonista | Scroll 0 px | Primeros 400 px de scroll | Escala .96→1, hasta 24 px; sin fijación |
| Cinta / apoyo | Junto al panel | Mismo recorrido | Hasta 40 px por detrás; no cruza textos |
| Situaciones / protagonista | Umbral 85% viewport | 450 ms | Opacidad y hasta 16 px; título y ejemplo solapados, desfase máximo 60 ms |
| Método, acto 1 / protagonista | 0–33% | Una escena de 180% de altura de ventana | Frase: “Yesterday I go to the cinema”; etiqueta Demostración |
| Método, acto 2 / protagonista | 34–66% | Mismo scrub | go→went y explicación visible; no depender del color |
| Método, acto 3 / protagonista | 67–100% | Mismo scrub | Corrección→repaso; nueva pregunta y Practicar con mi voz |
| Planes, FAQ, cierre / estáticos | Lectura normal | Sin espera | Salida al fondo cálido, sin destello ni pantalla completa |

Solo la escena del método se fija si cabe íntegra en la altura útil, bajo el encabezado. Transiciones internas: opacidad, escala .98→1 y hasta 16 px. El retroceso devuelve el estado visual, sin guardar datos ni reiniciar audio. Sin snapping. Ocultos fuera del foco/árbol accesible según corresponda; enlaces Ver los pasos sin animación y Saltar a planes. Revisar anclas, historial y listas de diálogos.

Móvil/tableta: scroll táctil nativo, sin pin/parallax, tres actos verticales completos; entradas opcionales 200–250 ms y hasta 8 px. Movimiento reducido: sin Lenis, pin, scrub ni parallax; todos los actos legibles, cambio inmediato o fundido corto. Responder también a cambios de preferencia durante la visita. App autenticada: scroll nativo y controles inmediatos, sin escenas durante la práctica.

No animar acciones de teclado, micrófono, reproducción o navegación frecuente con retrasos. Botones 120–180 ms; paneles 220–300 ms; nada de `transition: all` ni `scale(0)`. Transform y opacidad por defecto. GSAP sigue utilizando el hilo principal: no afirmar que transform garantiza ejecución fuera de él. Medir antes de añadir `will-change`.

## Aplicación de las skills y revisión posterior

Se han leído los cuatro playbooks de Emil y el contexto/init de Impeccable para preparar estos criterios. `choreograph` aporta roles y solapamientos; `emil-design-eng`, frecuencia y respuesta; `animation-performance`, medición y propiedades; `review-animations`, revisión en tabla Before/After/Why cuando haya código. No hay aún animaciones de VERVO que aprobar.

Impeccable: separar portada persuasiva, aplicación de operación y documentos de lectura. La revisión futura usará `critique`, `audit`, `adapt`, `optimize` y `polish` sobre interfaces ejecutándose. No se atribuyen auditorías ni puntuaciones a pantallas inexistentes.

Validación futura: `docs/VALIDATION.md`; objetivos LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 en p75 y latencia audible mediana experimental <2 s. Pendientes de medir con datos reales.
