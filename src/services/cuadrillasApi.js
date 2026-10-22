// Cuadrillas de limpieza, asignación de incidencias, resolución con evidencia e historial
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const MAX_LADO_PX = 1600
const CALIDAD_JPEG = 0.85

async function mensajeDeError(response) {
  if (response.status === 401) {
    return 'Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.'
  }
  const cuerpo = await response.text()
  if (!cuerpo) return `Error del servidor (${response.status}).`
  try {
    const data = JSON.parse(cuerpo)
    return data.message ?? data.error ?? cuerpo
  } catch {
    return cuerpo
  }
}

async function solicitar(ruta, { method = 'GET', json, formData } = {}) {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  let body
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (formData) {
    body = formData
  }
  let response
  try {
    response = await fetch(`${API_BASE}${ruta}`, { method, headers, body })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Si nadie lo usó en un rato, puede tardar hasta 1 minuto en activarse; espera un momento e intenta de nuevo.')
  }
  if (!response.ok) {
    throw new Error(await mensajeDeError(response))
  }
  if (response.status === 204) return null
  return response.json()
}

// ---- Cuadrillas ----
export const listarCuadrillas = () => solicitar('/cuadrillas')
export const crearCuadrilla = (datos) => solicitar('/cuadrillas', { method: 'POST', json: datos })
export const actualizarCuadrilla = (id, datos) => solicitar(`/cuadrillas/${id}`, { method: 'PUT', json: datos })
export const eliminarCuadrilla = (id) => solicitar(`/cuadrillas/${id}`, { method: 'DELETE' })

// ---- Integrantes ----
export const agregarTrabajador = (idCuadrilla, datos) =>
  solicitar(`/cuadrillas/${idCuadrilla}/trabajadores`, { method: 'POST', json: datos })
export const actualizarTrabajador = (idTrabajador, datos) =>
  solicitar(`/cuadrillas/trabajadores/${idTrabajador}`, { method: 'PUT', json: datos })
export const eliminarTrabajador = (idTrabajador) =>
  solicitar(`/cuadrillas/trabajadores/${idTrabajador}`, { method: 'DELETE' })

// ---- Atención de incidencias ----
export const asignarCuadrilla = (idIncidencia, idCuadrilla) =>
  solicitar(`/incidencias/${idIncidencia}/asignar`, { method: 'PATCH', json: { idCuadrilla } })

export const obtenerHistorial = (idIncidencia) => solicitar(`/incidencias/${idIncidencia}/historial`)

export async function resolverIncidencia(idIncidencia, archivos, comentario) {
  const formData = new FormData()
  const comprimidas = await Promise.all(archivos.map(comprimirImagen))
  comprimidas.forEach((archivo) => formData.append('fotos', archivo))
  if (comentario && comentario.trim()) formData.append('comentario', comentario.trim())
  return solicitar(`/incidencias/${idIncidencia}/resolver`, { method: 'POST', formData })
}

// Reduce fotos grandes del celular antes de subirlas (máx. 1600 px, JPEG)
function comprimirImagen(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const maxLado = Math.max(width, height)
      if (maxLado <= MAX_LADO_PX && file.size < 1.5 * 1024 * 1024) {
        resolve(file)
        return
      }
      const escala = Math.min(1, MAX_LADO_PX / maxLado)
      width = Math.round(width * escala)
      height = Math.round(height * escala)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          const nombre = file.name.replace(/\.[^.]+$/, '') + '.jpg'
          resolve(new File([blob], nombre, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        CALIDAD_JPEG
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }
    img.src = url
  })
}
