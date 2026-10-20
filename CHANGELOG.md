# Registro de cambios

Formato de versiones: MAJOR.MINOR.PATCH (versionado semántico).

- MAJOR: cambios incompatibles con la versión anterior.
- MINOR: funcionalidades nuevas compatibles.
- PATCH: correcciones de errores.

## [1.0.0] - 2026-10-19

### Añadido
- Aplicación React 19 con Vite, Tailwind y rutas protegidas por rol.
- Rol Ciudadano: registrar incidencias con fotos y mapa, seguimiento, recompensas e insignias, y educación ambiental.
- Rol Administrador: gestión de incidencias y ciudadanos, y panel de estadísticas.
- Cliente central para la API con el token Bearer y `VITE_API_URL`.
- Modo demostración con datos simulados.
- Despliegue como Static Site en Render.

### Corregido
- Ortografía en la interfaz ("Seleccione") y formato del README.
- Insignias del resumen de ciudadano según sus incidencias reales.
