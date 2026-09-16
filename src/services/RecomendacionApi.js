//En RecomendacionApi.js
import { MOCK_RECOMENDACIONES, MOCK_RECOMENDACIONES_GENERICAS } from './mockData'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function esDemo() {
  const token = localStorage.getItem('token')
  return token === 'demo-token' || token === 'demo-token-admin'
}

function extraerMensajeError(cuerpo, status) {
  if (status === 502) {
    return (
      'No se pudo conectar con el backend. ' +
      'Abre una terminal en Backend/EcoSolido y ejecuta: .\\mvnw.cmd spring-boot:run'
    )
  }

  if (status === 503) {
    try {
      const data = JSON.parse(cuerpo)
      if (data.message) return data.message
      if (data.error) return data.error
    } catch {
      return cuerpo || 'Servicio de IA no disponible. Configura HF_TOKEN antes de iniciar el backend.'
    }
  }

  if (!cuerpo) {
    return `Error del servidor (${status}).`
  }

  try {
    const data = JSON.parse(cuerpo)
    return data.message ?? data.error ?? cuerpo
  } catch {
    return cuerpo
  }
}
export async function generarRecomendaciones(tipoMaterial,ContextoExtra=""){
    if (esDemo()) return MOCK_RECOMENDACIONES[tipoMaterial] || MOCK_RECOMENDACIONES_GENERICAS

    const token=localStorage.getItem('token')
    const response=await fetch(`${API_BASE}/educacion/recomendaciones`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',  
            'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({tipoMaterial:tipoMaterial,contexto:ContextoExtra})
    })
    const cuerpo=await response.text()
    if (!response.ok) {
        throw new Error(extraerMensajeError(cuerpo, response.status))
    }
    try {
        const data = JSON.parse(cuerpo)
        if (!data.recomendaciones || data.recomendaciones.length === 0) {
                throw new Error('La IA no devolvió recomendaciones.')
        }   
        return data.recomendaciones
    } catch (err) {
        if (err instanceof Error && err.message === 'La IA no devolvió una descripción.') {
            throw err
        }
        throw new Error('Respuesta inválida del servidor.', { cause: err })
  }
}