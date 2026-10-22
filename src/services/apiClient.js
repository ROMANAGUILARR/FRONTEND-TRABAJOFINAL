/**
 * Cliente API centralizado de EcoSolido.
 * Evita duplicar API_BASE en cada componente.
 */
export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : 'https://backend-trabajofinal.onrender.com')

export function authHeaders(extra = {}) {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    ...extra
  }
}

export function authJsonHeaders(extra = {}) {
  return authHeaders({ 'Content-Type': 'application/json', ...extra })
}

export function esDemo() {
  const token = localStorage.getItem('token')
  return token === 'demo-token' || token === 'demo-token-admin'
}
