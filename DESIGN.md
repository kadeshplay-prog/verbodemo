# VERVO · sistema visual de la demo

Producto/recorridos: docs/references/Brief_Visual_Contenido_VERVO.pdf, leído completo. Referencia estética más reciente: **docs/references/DESIGN.md**, conservada íntegra con el nombre original. Describe Steep y se interpreta como referencia, no como componentes o activos ajenos para copiar.

## Contradicción y decisión

El brief proponía verde, fondo cálido y Manrope como única familia. El .md posterior pide blanco, titulares serif regulares, controles oscuros y melocotón. Siguiendo la prioridad indicada por el usuario, **la demo adopta esa estética posterior** y conserva funciones, contenido, estados y guion de scroll del brief.

El estudio permanece oscuro, ahora en negro tinta. La voz aparece como marca y datos dentro del producto; no se añaden fotos, avatares o ilustraciones decorativas. Figma sigue omitido: no se atribuyen nodos o comparaciones inexistentes.

## Referencia → decisión → pantalla

| Fuente | Decisión | Aplicación |
| --- | --- | --- |
| Signifier regular/itálica | Source Serif 4 local, alternativa libre admitida por la referencia; peso 400 | Titulares públicos/interiores y frases |
| Söhne/UI sobria | Manrope local, continuidad del brief; sin fingir licencias de Signifier/Söhne | Controles, navegación y formularios |
| Blanco/tinta/melocotón | #fff, #17191c, #f2f2f3, #fafafb, #fbe1d1, #5d2a1a | Sistema compartido; acento protagonista escaso |
| Gris secundario | #62646b, más oscuro que el original para legibilidad | Texto secundario y ayudas |
| Fragmentos flotantes | Conversación, corrección y repaso con UI propia y etiqueta de ejemplo | Hero |
| Radios y composición | Paneles 24px, campos 16px, botones cápsula; contenedor 1200px | Público y app |
| Brief pp. 9–12 | Estudio negro, controles estables, audio real y alternativa escrita | Sesión |
| Brief pp. 16–17 y petición reciente | GSAP ScrollTrigger y Lenis efectivos, reversibles y con limpieza | Hero y método |
| Adición legal | Documentos públicos, dos casillas y enlaces/versiones separados | Acceso, cuenta y plan de ejemplo |

Display hasta 96px, serif regular e itálica, móvil 61–68px. Títulos interiores 39–56px, móviles 35–43px. Las fuentes y licencias se sirven localmente. No hay texto convertido en imagen.

La portada combina texto con UI flotante; biblioteca, tarjetas funcionales; ruta, unidades verticales; progreso, evidencia individual; estudio, diálogo y ayudas. No se repite la misma cuadrícula en todas las páginas ni se inventan métricas comerciales.

## Movimiento implementado

| Elemento | Papel y ritmo | Motivo |
| --- | --- | --- |
| Titular y CTA | Estáticos desde el primer render | Lectura y acción inmediatas |
| Hero | Primeros 400px; escala .96→1, y 12→−12px | Un solo movimiento de apoyo |
| Acto 1 | Primer tercio | Frase de demostración |
| Acto 2 | Segundo tercio | go→went y explicación completa |
| Acto 3 | Último tercio | Repaso y CTA de práctica |
| Cambios internos | Hasta 16px, autoAlpha y scrub lineal | Solapamiento reversible, sin colas |
| App | Respuesta inmediata y press/color breves | Uso frecuente sin espera |
| Medidor | Datos AudioContext sobre barras individuales | Solo audio capturado, sin fingir escucha |

MethodStory registra ScrollTrigger y crea una sola instancia Lenis con autoRaf:false. Un ticker GSAP convierte segundos a milisegundos; el scroll se sincroniza con ScrollTrigger. Se recalcula tras fuentes y se limpia instancia/ticker/timeline mediante matchMedia. La fijación dura 180% de la altura visible y solo se activa desde 1200px si cabe bajo el encabezado.

El retroceso devuelve el estado visual sin escribir datos ni reproducir audio. Actos inactivos fuera del foco con inert y aria-hidden. Hay lectura sin animación y salida directa a planes. Las anclas y las teclas de navegación interrumpen la inercia; las anclas también mueven el foco al destino.

Timeline normalizada al recorrido de 180vh (tiempo controlado por scroll, no segundos):

| Elemento | Rol | Inicio | Duración | Movimiento | Relación |
| --- | --- | --- | --- | --- | --- |
| Acto 1 | Protagonista | 0 | Lectura hasta .27 | Estático | Contexto antes de la corrección |
| Salida 1 | Apoyo | .27 | .04 | Opacidad y y −16px | Solapa con entrada 2 |
| Entrada 2 | Protagonista | .29 | .04 | Opacidad y y 16→0px | Completa en .33 |
| Salida 2 | Apoyo | .60 | .04 | Opacidad y y −16px | Solapa con entrada 3 |
| Entrada 3 | Protagonista | .62 | .04 | Opacidad y y 16→0px | Completa en .66 |
| Acto 3 | Protagonista | .66 | Lectura hasta 1 | Estático | Oportunidad para practicar |

Titulares, navegación y controles de práctica permanecen estáticos: se leen y usan repetidamente. La superficie de las tarjetas tampoco se desplaza; conserva contraste durante el solapamiento. Las transiciones revierten desde su posición actual al invertir el scroll. Las pausas al 33% y 66%, la inversión con rueda y la salida durante inercia se comprueban en vídeo/pruebas.

Móvil/tableta: scroll nativo y tres actos verticales completos. Movimiento reducido: sin Lenis, pin, scrub o transformación del hero; cambios de preferencia en vivo. App siempre con scroll nativo. Sin autoplay.

## Revisión

Emil aporta frecuencia apropiada, una entrada por objeto, propiedades baratas, interrupción y retroceso. Impeccable aporta portada editorial, app centrada en operar y documentos de lectura; auditoría, adaptación y pulido sobre capturas reales. Detector y pruebas se registran en docs/VALIDATION.md y evidence/app/.

| Antes | Después | Por qué |
| --- | --- | --- |
| Dos CTA estrechos en móvil | Botones apilados con ancho disponible | Etiquetas completas y objetivos táctiles cómodos |
| La superficie se desvanecía entre actos | Base blanca constante y entrada solapada, completa en .33/.66 | Evitar pausas con texto sin contraste |
| Un gesto anterior podía desplazar un ancla | Destino inmediato en la instancia Lenis y foco al destino | La navegación interrumpe el movimiento |
| Foco oscuro en el estudio | Anillo melocotón sobre tinta | Controles de audio y texto localizables con teclado |

Veredicto: movimiento apto para revisar esta demo tras pruebas de ida/vuelta y preferencia reducida. El vídeo permite juzgar el relevo entre .27–.33 y .60–.66; no se declara una tasa de frames o métrica de rendimiento que no se haya medido.

WCAG 2.2 AA, Web Vitals p75 y latencia de voz siguen siendo objetivos de producción. La automatización no acredita hardware físico, Safari/iPhone real o aprendizaje.
