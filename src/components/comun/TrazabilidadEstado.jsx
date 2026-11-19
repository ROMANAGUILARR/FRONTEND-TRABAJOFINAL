import './Comun.css'

// Etapas por las que pasa un reporte
const ETAPAS = [
  { estado: 'PENDIENTE', titulo: 'Recibido', detalle: 'Tu reporte fue registrado' },
  { estado: 'EN_PROCESO', titulo: 'En proceso', detalle: 'Una cuadrilla lo está atendiendo' },
  { estado: 'RESUELTO', titulo: 'Resuelto', detalle: 'El problema fue solucionado' },
]

export function indiceEtapa(estado) {
  const i = ETAPAS.findIndex((e) => e.estado === String(estado || '').toUpperCase())
  return i === -1 ? 0 : i
}

/**
 * Trazabilidad del estado: las etapas ya alcanzadas se ven en color y
 * las que faltan en gris (deshabilitadas), como las insignias bloqueadas.
 * compacta: versión pequeña para las tarjetas.
 */
export default function TrazabilidadEstado({ estado, compacta = false }) {
  const actual = indiceEtapa(estado)
  return (
    <ol
      className={`trazabilidad ${compacta ? 'trazabilidad--compacta' : ''}`}
      aria-label={`Estado del reporte: ${ETAPAS[actual].titulo}, etapa ${actual + 1} de ${ETAPAS.length}`}
    >
      {ETAPAS.map((etapa, i) => {
        const clase = i < actual ? 'hecha' : i === actual ? 'actual' : 'pendiente'
        return (
          <li key={etapa.estado} className={`trazabilidad__paso trazabilidad__paso--${clase}`}>
            <span className="trazabilidad__marca" aria-hidden="true">
              {i <= actual ? <i className="fa-solid fa-check"></i> : i + 1}
            </span>
            <span className="trazabilidad__textos">
              <span className="trazabilidad__titulo">{etapa.titulo}</span>
              {!compacta && <span className="trazabilidad__detalle">{etapa.detalle}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
