import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

/**
 * Redirige al usuario autenticado a su módulo según su rol.
 * Si no está autenticado, lo envía a la landing pública.
 */
export default function DefaultRedirect() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  // Si no está autenticado, ir a la landing pública
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (user?.rol === 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/registro" replace />
}
