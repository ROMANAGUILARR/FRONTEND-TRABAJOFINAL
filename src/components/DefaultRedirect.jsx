import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function DefaultRedirect() {
  const { user, isLoading, isAuthenticated, login } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login('demo', 'demo')
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (user?.rol === 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/registro" replace />
}