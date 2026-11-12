# Figma · omitido en esta fase

Estado comprobado antes de la aclaración del usuario: la búsqueda del conector devolvió Figma disponible, con `installed: false`; no había herramientas de Figma invocables. Se propuso habilitarlo, sin instalarlo ni atribuir acceso a un archivo.

Después el usuario indicó omitir Figma por ahora. No es un bloqueo de esta entrega y no se añadieron tokens, `.mcp.json` ni servidores ficticios. Más adelante la superficie de herramientas empezó a exponer operaciones de Figma: `get_design_context`, `get_metadata`, `get_screenshot`, `get_variable_defs`, `get_libraries`, `download_assets`, Code Connect y `whoami`, entre otras. Se comprobó su presencia en el catálogo, pero no se ejecutaron por la instrucción de omitir Figma. Su presencia no acredita autenticación ni acceso a un archivo. No se han consultado frames, variables, componentes o recursos.

Si se reanuda: habilitar el conector oficial y proporcionar una URL real del archivo, preferentemente de la forma `https://www.figma.com/design/<file-key>/<nombre>?node-id=<id>`, con permiso de lectura para la cuenta conectada. Verificar primero identidad/acceso, enumerar las capacidades reales y consultar contexto de diseño, capturas y variables si están disponibles; relacionar P01/A04/A06/A07 con sus node-id. No dar por existente una herramienta por su nombre habitual.

La alternativa de Claude Code requiere configurar y autenticar su servidor MCP oficial en ese entorno: [documentación oficial de Figma MCP](https://developers.figma.com/docs/figma-mcp-server/). No solicitar claves en chat ni guardarlas en Git.
