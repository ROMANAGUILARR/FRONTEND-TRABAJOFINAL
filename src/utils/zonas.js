// Distritos de Lima Metropolitana y Callao, para elegir la zona de una cuadrilla
export const DISTRITOS_LIMA = [
  'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla',
  'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lima',
  'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac',
  'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac',
  'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores',
  'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar',
  'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo',
  'Callao', 'Bellavista', 'La Perla', 'La Punta', 'Ventanilla', 'Carmen de la Legua',
]

// Orden natural de nombres: "Cuadrilla 2" antes que "Cuadrilla 10"; ignora mayúsculas y tildes
export function compararNombres(a, b) {
  return (a || '').localeCompare(b || '', 'es', { numeric: true, sensitivity: 'base' })
}

// Minúsculas y sin tildes, para comparar "Rímac" con "rimac"
export function normalizarTexto(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// ¿La dirección de la incidencia está en la zona de la cuadrilla?
// Se compara cada tramo de la dirección ("..., Los Olivos, Lima, ...") con la zona,
// para que "Miraflores" no coincida con "San Juan de Miraflores".
export function coincideZona(zona, direccion) {
  const z = normalizarTexto(zona)
  if (z.length < 3) return false
  const partes = (direccion || '').split(',').map(normalizarTexto)
  if (z === 'lima' || z === 'cercado de lima') {
    // "Lima" aparece en todas las direcciones (provincia); solo cuenta el Cercado
    return partes.some((p) => p === 'cercado de lima' || p === 'lima cercado')
  }
  return partes.some((p) => p === z)
}
