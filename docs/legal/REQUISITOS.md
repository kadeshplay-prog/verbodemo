# Requisitos legales y minimización · preparación

Todavía no hay formularios ni páginas de VERVO implementados. Los tres textos de esta carpeta son borradores internos; faltan los datos del responsable, países de oferta, proveedores y plazos reales. Completar y revisar esos puntos antes de publicar textos o recoger datos reales. El uso de MXN en la maqueta no determina por sí solo la ley aplicable.

## Ubicación y aceptación

Reservar rutas `/terminos`, `/privacidad` y `/cookies`, con enlaces en el pie público y en Cuenta. Acceso sin registro, buen ancho de lectura, fecha y versión, texto seleccionable y descarga opcional. Mantener en el servidor la versión histórica que aceptó cada persona.

En registro, contratación y cualquier formulario que solicite aceptación legal, usar dos casillas independientes, vacías inicialmente:

1. «Acepto los Términos y condiciones» + enlace «Leer términos» junto a la casilla.
2. «He leído la Política de privacidad» + enlace «Leer privacidad» junto a la casilla.

La segunda es un acuse de información, no autorización general para todos los usos de los datos. Si una finalidad necesita consentimiento, obtenerlo por separado con finalidad concreta. No añadir aceptación contractual innecesaria al inicio de sesión, recuperación o cada turno de voz. Un contacto de soporte pide solo correo y mensaje; mostrar su aviso de privacidad y las casillas solo cuando corresponda al formulario.

Etiquetas asociadas, objetivos táctiles 48 px, teclado y foco visible. Los enlaces deben poder abrirse sin cambiar la casilla ni perder datos del formulario. Error asociado a cada casilla, sin depender solo del color. Validación también en servidor; registrar ID de usuario, tipo/versión de documento y fecha de aceptación, con datos de prueba hasta conectar identidad real. No recopilar IP, fecha de nacimiento ni identificación oficial por defecto.

## ¿Hace falta consentimiento?

| Finalidad o tecnología | Criterio de implementación futuro |
| --- | --- |
| Crear cuenta y prestar el servicio | Determinar base jurídica según países. Informar previamente. El acuse de privacidad no sustituye esa base ni un consentimiento expreso exigible |
| Micrófono para un turno | Solicitar permiso del navegador tras pulsar Probar micrófono/Hablar, explicar procesamiento y proveedor; el permiso técnico no autoriza conservar grabaciones |
| Guardar audio para comparar | Elección adicional y opcional, desactivada por defecto, revocable desde Cuenta; borrar individualmente y por cuenta. Definir también almacenamiento transitorio del proveedor |
| Marketing, recordatorios opcionales o entrenamiento de modelos | Consentimientos/finalidades separados cuando proceda; no incluirlos en las dos casillas obligatorias ni activarlos en esta fase |
| Cookies estrictamente necesarias | Inventariar y justificar. En el marco español/europeo pueden estar exceptuadas de consentimiento; informar de su uso. No mostrar un banner de aceptación de analítica inexistente |
| Analítica no exceptuada, publicidad o terceros opcionales | Si aplica el régimen europeo/español, bloquear antes de la elección. Aceptar, Rechazar y Configurar al mismo nivel y con visibilidad equivalente; categorías opcionales apagadas, sin consentimiento por continuar o hacer scroll |

Recomendación inicial: operar sin analítica, publicidad ni embeds opcionales. La fixture técnica actual no usa cookies ni almacenamiento, como comprueba Playwright. Eso no acredita el inventario de la aplicación futura: autenticación, pagos, alojamiento, logs y proveedores pueden introducir otras tecnologías.

Si se activa una categoría opcional, conservar preferencia y versión, permitir revocar desde «Configurar cookies» y detener futuras cargas. Revisar también localStorage, SDK, píxeles y peticiones del proveedor. No cargar primero un script y ocultarlo después con un banner. Rechazar no debe impedir la práctica básica.

## Datos mínimos por flujo

| Flujo | Necesarios propuestos | Evitar o hacer opcionales |
| --- | --- | --- |
| Acceso | Correo y credencial gestionada por proveedor seguro | Nombre completo, teléfono, domicilio, documento, datos de voz |
| Configuración | Meta, confianza y minutos de rutina | Perfil largo, empresa, escuela, fecha de nacimiento |
| Conversación | Turnos y contexto estrictamente necesarios, modalidad oral/escrita | Audio permanente por defecto; transcripciones en analítica general |
| Progreso | Sesiones, minutos propios, ayudas, objetivos y correcciones | Inferir identidad biométrica o un porcentaje global de dominio |
| Cobro | Referencia/estado del proveedor; datos fiscales solo si corresponden | Guardar tarjetas o secretos de pago en VERVO |
| Soporte | Correo y mensaje | Grabaciones o datos sensibles como requisito inicial |

## Datos que faltan antes del lanzamiento

Responsable y domicilio/contacto; países a los que se ofrece; canal de derechos y cancelación; encargados de IA/STT/TTS/auth/almacenamiento/pago, regiones y transferencias; plazos separados para turnos, transcripciones, grabaciones voluntarias, logs y facturación; eliminación y copias de seguridad; impuestos, reembolsos y condiciones comerciales aprobadas. No inventarlos ni solicitar claves durante esta preparación.

## Fuentes oficiales consultadas

- [Guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf), apartados 3.1–3.2; [opciones de aceptar y rechazar](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos). Criterio condicionado al ámbito aplicable, no afirmación de jurisdicción de VERVO.
- [RGPD en EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), arts. 3, 5–7 y 13: ámbito, minimización, base, consentimiento e información.
- [Texto oficial mexicano de la LFPDPPP de 2025](https://www.ordenjuridico.gob.mx/Documentos/Federal/html/wo125102.html): aviso, finalidades y consentimiento si México resulta aplicable. Revisar texto vigente y reformas al cerrar las políticas; no basarse en la ley derogada de 2010.

La revisión concreta depende del responsable y del alcance territorial aún desconocidos. Estos criterios son especificaciones de producto para preparar una implementación verificable.
