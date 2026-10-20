# 🌿 EcoSolido

Aplicativo web para el reporte, seguimiento y gestión de incidencias ambientales. Permite a los ciudadanos registrar problemas ecológicos en su comunidad, hacer seguimiento del estado de sus reportes y obtener recompensas por su participación. Los administradores pueden gestionar incidencias, generar reportes en PDF/Excel y visualizar dashboards estadísticos.

---

## 📝 Descripción del proyecto

**EcoSolido** es una plataforma web frontend orientada a la gestión ambiental comunitaria. La aplicación permite a los ciudadanos registrar incidencias ecológicas (acumulación de basura, contaminación del agua, quema de residuos, entre otras), hacer seguimiento en tiempo real del estado de sus reportes y obtener insignias y recompensas por su compromiso ambiental.

Los administradores cuentan con un panel completo para gestionar incidencias, visualizar estadísticas mediante dashboards y generar reportes exportables en PDF y Excel.

---

## 🔴 Problema que soluciona

Las comunidades enfrentan problemas ambientales como acumulación de basura, contaminación del agua y quema ilegal de residuos, pero carecen de un canal formal y accesible para reportar estas incidencias y darles seguimiento.

**EcoSolido** soluciona esto al proporcionar una plataforma digital donde los ciudadanos pueden:
- Reportar incidencias con fotos, descripción y ubicación exacta en un mapa.
- Dar seguimiento al estado de sus reportes (Pendiente → En Proceso → Resuelto).
- Recibir recompensas e insignias por su participación activa.

Y los administradores pueden:
- Gestionar y actualizar el estado de todas las incidencias.
- Administrar los ciudadanos registrados.
- Visualizar estadísticas y generar reportes detallados.

---

## ⚙️ Funcionalidades principales

### 👤 Rol Ciudadano
- Registro e inicio de sesión.
- Registro de incidencias ambientales con fotos, descripción automática por IA y ubicación en mapa interactivo.
- Seguimiento del estado de las incidencias (Pendiente → En Proceso → Resuelto).
- Búsqueda por fecha, título o ubicación (con soporte de voz).
- Visualización de insignias y recompensas obtenidas.
- Educación medio ambiental.

### 🛡️ Rol Administrador
- Dashboard de estadísticas con Power BI.
- Gestión de incidencias (editar, eliminar).
- Gestión de ciudadanos registrados.
- Generación de reportes en PDF y Excel por ciudadano.

---

## 💻 Tecnologías usadas

| Capa | Tecnología |
|------|------------|
| **Framework** | [React](https://react.dev/) 19 |
| **Build Tool** | [Vite](https://vitejs.dev/) 8 |
| **Routing** | React Router DOM 7 |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) 4 + CSS modular |
| **Mapas** | [Leaflet](https://leafletjs.com/) + React Leaflet |
| **PDF** | jsPDF + html2canvas |
| **Excel** | SheetJS (xlsx) |
| **Voz** | react-speech-recognition |
| **IA** | Integración con API de IA para descripción automática |

---

## 🛠️ Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/ROMANAGUILARR/FRONTEND-TRABAJOFINAL.git
cd FRONTEND-TRABAJOFINAL
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:8080
```

---

## ▶️ Ejecución

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Modo producción

```bash
npm run build
npm run preview
```

---

## 📁 Estructura del proyecto

```text
src/
├── assets/                    # Imágenes, logos e insignias
├── components/                # Componentes de React
│   ├── ui/                    #    Componentes reutilizables (Button, Card, Modal, Input)
│   ├── Login.jsx              #    Inicio de sesión
│   ├── Registrarse.jsx        #    Registro de usuarios
│   ├── RegistrarIncidencias.jsx #  Registro de nuevas incidencias
│   ├── SeguimientoIncidencias.jsx # Seguimiento del estado
│   ├── ManejarIncidencias.jsx #    Gestión de incidencias (admin)
│   ├── GestionarCiudadanos.jsx #   Gestión de ciudadanos (admin)
│   ├── Dashboard.jsx          #    Dashboard con Power BI
│   ├── RecompensasCiudadano.jsx #  Sistema de insignias y recompensas
│   ├── ReporteIncidencias.jsx #    Generación de reportes PDF/Excel
│   ├── LocationPicker.jsx     #    Selector de ubicación en mapa
│   └── ...                    #    Otros componentes (modales, sidebar, header)
├── hooks/                     # Hooks personalizados
│   ├── useAuth.js             #    Autenticación y manejo de sesión
│   └── useKeyboardShortcuts.js #   Atajos de teclado
├── services/                  # Capa de comunicación con el backend
│   ├── incidenciasApi.js      #    Funciones API (login, incidencias, puntos, insignias)
│   └── mockData.js            #    Datos de prueba para modo demo
├── styles/                    # Estilos globales
├── utils/                     # Utilidades
│   ├── iaDescripcion.js       #    Descripción automática con IA
│   └── reverseGeocode.js      #    Geocodificación inversa
├── App.jsx                    # Componente principal con rutas
└── main.jsx                   # Punto de entrada
```
