# VERVO · instrucciones

- El usuario autorizó una **demo navegable** después de la preparación. Conservar cambios en la rama y actualizar la PR; no fusionar por iniciativa propia.
- Leer PRODUCT.md, DESIGN.md, docs/references/Brief_Visual_Contenido_VERVO.pdf (18 páginas, transcripción al lado) y **docs/references/DESIGN.md**, el original posterior del usuario.
- La referencia posterior cambia la identidad a serif/blanco/tinta/melocotón. DESIGN.md registra la contradicción y su resolución. No modificar los originales.
- Figma se omite por petición expresa. Las instrucciones recientes prevalecen sobre documentos y skills.
- React/TypeScript/Vite con npm: npm ci; npm run dev (5173); npm run build; npm run preview (4174); npm test. Compilar antes de probar: las pruebas usan producción.
- GSAP ScrollTrigger y Lenis están en MethodStory: una instancia/ticker, limpieza al navegar/cambiar preferencia, marcha atrás. Móvil/reduced motion sin pin ni suavizado. App con scroll nativo.
- Skills oficiales en .claude/skills/: cuatro de Emil e Impeccable. Aplicar sus playbooks respetando la referencia. npm run tools:prepare y npm run setup:check restauran/verifican recursos.
- Identificar las simulaciones: tutor preparado, reglas limitadas, diagnóstico sin nivel, perfil local y pagos ficticios. Nunca pedir contraseñas o tarjetas reales.
- localStorage para textos/preferencias tras aceptar; IndexedDB para audio solo por acción explícita. Detener micrófono al pausar, salir, ocultar pestaña o desmontar. No inferir pronunciación desde texto.
- Términos, privacidad y cookies tienen rutas públicas y enlaces. Acceso y plan usan dos casillas sin premarcar con enlaces propios. Conservar elección adicional de guardar voz. Sin banner para analítica inexistente.
- .openai/hosting.json identifica el Site privado: preservar ID y audiencia; credenciales solo en memoria/stdin. Usuario quiere enlace de prueba, sin dominio personalizado o servicio comercial.
- Capturas/vídeo: evidence/app/; pruebas: tests/app/; temporales: work/. Harness original: tests/setup/, npm run test:tooling.
- No incluir secretos, datos de usuarios, dist, node_modules o binarios descargados en Git/ZIP. README y .env.example deben reflejar el estado real.
