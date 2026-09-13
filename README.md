# FRONTEND - EcoSolido

Frontend de la aplicacion EcoSolido desarrollado con React + Vite.

## Tecnologias

- React 19
- Vite 8
- React Router DOM 7
- Leaflet (mapas)
- CSS modular por componente

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

## Estructura del proyecto

```
src/
├── assets/          # Imagenes y recursos estaticos
├── components/      # Componentes de React
├── hooks/           # Hooks personalizados (useAuth, useKeyboardShortcuts)
├── services/        # Capa de comunicacion con el backend (API)
├── styles/          # Estilos globales
├── utils/           # Utilidades (IA, geocodificacion)
├── App.jsx          # Componente principal con rutas
└── main.jsx         # Punto de entrada
```

## Variables de entorno

Crear un archivo `.env` basado en `.env.example`:

```
VITE_API_URL=http://localhost:8081
```

## Ramas

- `main` - Rama estable con la version final
- `Dev` - Rama de desarrollo e integracion
- `Feature-Itzair` - Rama de funcionalidades asignadas
