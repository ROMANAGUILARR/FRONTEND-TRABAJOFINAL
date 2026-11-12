import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/z-index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { obtenerTemaInicial, aplicarTema } from './utils/tema'

// Aplica el tema guardado (claro/oscuro) en todas las pantallas desde el inicio
aplicarTema(obtenerTemaInicial())

// Note: StrictMode is disabled to avoid issues with Leaflet map initialization
// In React 18, StrictMode causes components to mount/unmount twice in development,
// which conflicts with Leaflet's container initialization
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
