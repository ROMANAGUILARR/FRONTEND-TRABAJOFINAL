import { MENSAJE_FOTOS_NO_VISIBLES } from '../utils/iaDescripcion'
import { MOCK_PUNTOS, MOCK_INSIGNIAS, MOCK_USUARIOS } from './mockData'

function esDemo() {
  const token = localStorage.getItem('token')
  return token === 'demo-token' || token === 'demo-token-admin'
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const MAX_LADO_PX = 1280
const CALIDAD_JPEG = 0.82
function extraerMensajeError(cuerpo, status) {
  if (status === 401 || status === 403) {
    return 'Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.'
  }

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
      return cuerpo || 'Servicio de IA no disponible. Configura GEMINI_API_KEY antes de iniciar el backend.'
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

export async function describirFotosConIA(imagenesBase64) {
  if (esDemo()) return 'Acumulacion de residuos solidos en la via publica. Se observan bolsas de basura rotas con desperdicios dispersos que obstruyen el paso peatonal.'

  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/incidencias/generar-descripcion`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ imagenes: imagenesBase64 })
  })

  const cuerpo = await response.text()

  if (!response.ok) {
    throw new Error(extraerMensajeError(cuerpo, response.status))
  }

  try {
    const data = JSON.parse(cuerpo)
    if (!data.descripcion) {
      throw new Error('La IA no devolvió una descripción.')
    }
    return data.descripcion
  } catch (err) {
    if (err instanceof Error && err.message === 'La IA no devolvió una descripción.') {
      throw err
    }
    throw new Error('Respuesta inválida del servidor.', { cause: err })
  }
}
export function comprimirImagenParaIA(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      const maxLado = Math.max(width, height)

      if (maxLado > MAX_LADO_PX) {
        const escala = MAX_LADO_PX / maxLado
        width = Math.round(width * escala)
        height = Math.round(height * escala)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      const dataUrl = canvas.toDataURL('image/jpeg', CALIDAD_JPEG)
      resolve(dataUrl)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo procesar la imagen.'))
    }

    img.src = url
  })
}

export async function prepararImagenesParaIA(archivos) {
  return Promise.all(archivos.map((file) => comprimirImagenParaIA(file)))
}

export async function subirFotosACloudinary(archivos) {
  if (esDemo()) return archivos.map((_, i) => `https://demo-ecosolido.com/foto-${i + 1}.jpg`)

  const formData = new FormData()
  archivos.forEach((file) => formData.append('fotos', file))
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/incidencias/subir-fotos`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}` 
    },
    body: formData,
  })

  const cuerpo = await response.text()

  if (!response.ok) {
    throw new Error(extraerMensajeError(cuerpo, response.status))
  }

  const data = JSON.parse(cuerpo)
  return data.urls
}

export async function registrarIncidencia(categoria, descripcion, urlsFotos, archivos, direccionTexto, latitud, longitud) {
  if (esDemo()) {
    const puntosActuales = parseInt(localStorage.getItem('puntos') || '0', 10)
    localStorage.setItem('puntos', String(puntosActuales + 15))
    return { mensaje: 'Incidencia registrada exitosamente (modo demo)', puntosGanados: 15 }
  }

  const formData = new FormData();
  const incidenciaBlob = new Blob([
    JSON.stringify({ 
        categoria, 
        descripcion,
        latitud,
        longitud,
        direccionTexto
    })
  ], { type: 'application/json' });
  formData.append('incidencia', incidenciaBlob);
  const token = localStorage.getItem("token");
  
  if (urlsFotos.length > 0) {
    urlsFotos.forEach((url) => formData.append('urlsFotos', url));
  } else {
    archivos.forEach((file) => formData.append('fotos', file));
  }
  
  const response = await fetch(`${API_BASE}/incidencias/registrar`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}` 
    },
    body: formData,
  })

  const cuerpo = await response.text()

  if (!response.ok) {
    throw new Error(extraerMensajeError(cuerpo, response.status))
  }

  try {
    return JSON.parse(cuerpo)
  } catch {
    return { mensaje: cuerpo, puntosGanados: 0 }
  }
}

export async function obtenerPuntosUsuario() {
  if (esDemo()) return parseInt(localStorage.getItem('puntos') || String(MOCK_PUNTOS), 10)

  const token = localStorage.getItem("token");
  console.log('Token puntos:', token)
  const response = await fetch(`${API_BASE}/incidencias/puntos`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })

  const cuerpo = await response.text()

  if (!response.ok) {
    throw new Error(extraerMensajeError(cuerpo, response.status))
  }

  const data = JSON.parse(cuerpo)
  return data.puntos ?? 0
}

export async function obtenerInsigniasUsuario() {
  if (esDemo()) {
    const desbloqueadasLocal = JSON.parse(localStorage.getItem('insigniasDesbloqueadas') || '[]')
    return MOCK_INSIGNIAS.map(ins => ({
      ...ins,
      desbloqueada: ins.desbloqueada || desbloqueadasLocal.includes(ins.nombre)
    }))
  }

  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/insignias/mis-insignias`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })

  const cuerpo = await response.text()

  if (!response.ok) {
    throw new Error(extraerMensajeError(cuerpo, response.status))
  }

  return JSON.parse(cuerpo)
}

export function esErrorTecnicoIA(mensaje) {
  if (!mensaje) return true
  const m = mensaje.toLowerCase()
  return (
    m.includes('hf_token') ||
    m.includes('hugging face') ||
    m.includes('gemini') ||
    m.includes('backend') ||
    m.includes('puerto 8080') ||
    m.includes('502') ||
    m.includes('503') ||
    m.includes('403') ||
    m.includes('sesión ha expirado') ||
    m.includes('error del servidor') ||
    m.includes('error inesperado') ||
    m.includes('error de hugging')
  )
}

export async function obtenerUsuarios() {
  if (esDemo()) return MOCK_USUARIOS

  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE}/usuario/listar`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })

  if (!response.ok) {
    throw new Error('Error al obtener usuarios')
  }

  return response.json()
}

export { MENSAJE_FOTOS_NO_VISIBLES }
