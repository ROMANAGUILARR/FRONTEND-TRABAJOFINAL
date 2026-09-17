# Changelog - EcoSolido

Todas las versiones siguen [Semantic Versioning](https://semver.org/): `Mayor.Menor.Patch`

- **Mayor**: Cambios importantes, nuevas funcionalidades principales
- **Menor**: Nuevas características, mejoras de interfaz
- **Patch**: Correcciones de errores (fixes)

---

## v2.1.0 (2026-09-17)

### Módulos implementados
- `feat(auth)`: Login con autenticación por roles (ciudadano/admin)
- `feat(incidencias)`: Registro de Incidencias con fotos, descripción IA, mapa Leaflet
- `feat(seguimiento)`: Seguimiento de Incidencias con filtros, búsqueda por voz, paginación
- `feat(educacion)`: Educación Medio Ambiental con artículos
- `feat(recompensas)`: Recompensas con insignias dinámicas y barra de progreso
- `feat(ciudadanos)`: Gestión de Ciudadanos (admin) con tabla, filtros, reportes PDF/Excel
- `feat(admin)`: Gestión de Incidencias (admin) con CRUD, métricas, modal edición
- `feat(dashboard)`: Dashboard con estadísticas

### Características
- `feat(dark-mode)`: Dark mode en todos los módulos
- `feat(demo)`: Modo demo sin backend con datos simulados
- `feat(reporte)`: Exportación PDF/Excel de reportes con insignias y firmas
- `feat(ui)`: Iconos Font Awesome, componentes UI atómicos (Button, Input, Card, Modal)
- `feat(responsive)`: Diseño responsive para móvil y desktop
- `style(login)`: Iconos ojo para mostrar/ocultar contraseña
- `fix(progreso)`: Barra de progreso muestra porcentaje correctamente

### Correcciones
- `fix(dark-mode)`: Contraste en módulo de Recompensas
- `fix(reporte)`: PDF multipagina incluye sección de insignias
- `fix(reporte)`: IDs secuenciales para "Reportado por"
- `fix(login)`: Botones link sin borde blanco
- `fix(sesion)`: Persistencia de sesión entre refrescos

---

## v1.0.0 (2026-09-01)

### Versión inicial
- `feat(config)`: Configuración base con React 19, Vite 8, Tailwind CSS 4
- `feat(auth)`: Autenticación y rutas protegidas por rol
- `feat(nav)`: Header, Sidebar y navegación por módulos
- `feat(components)`: Componentes UI atómicos reutilizables
- `feat(api)`: Servicios de comunicación con backend Spring Boot
