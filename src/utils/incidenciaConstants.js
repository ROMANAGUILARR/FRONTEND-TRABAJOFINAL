export const ESTADO_BADGE = {
  PENDIENTE: 'admin-badge--pending',
  EN_PROCESO: 'admin-badge--progress',
  RESUELTO: 'admin-badge--resolved',
}

export const ESTADO_LABEL = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  RESUELTO: 'Resuelto',
}

export const CATEGORIAS = [
  'Acumulación y falta de recojo',
  'Basura en vía pública',
  'Contenedor dañado o lleno',
  'Escombros o materiales de construcción',
  'Residuos en parques o áreas verdes',
  'Otro',
]

export function formatearFecha(fechaString) {
  if (!fechaString) return ''
  const fecha = new Date(fechaString)
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha).replace(/\//g, '-')
}
