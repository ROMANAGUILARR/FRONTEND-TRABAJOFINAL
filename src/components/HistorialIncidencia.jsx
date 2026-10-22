import { useEffect, useState } from 'react'
import { obtenerHistorial } from '../services/cuadrillasApi'
import { ESTADO_LABEL } from '../utils/incidenciaConstants'
import './Cuadrillas.css'

export function formatearFechaHora(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

function textoDe(item) {
  if (item.tipo === 'ESTADO') {
    const nuevo = ESTADO_LABEL[item.estadoNuevo] || item.estadoNuevo
    const anterior = ESTADO_LABEL[item.estadoAnterior] || item.estadoAnterior
    return anterior ? `Estado: ${anterior} → ${nuevo}` : `Estado: ${nuevo}`
  }
  return item.detalle || (item.tipo === 'EVIDENCIA' ? 'Se adjuntó evidencia' : 'Cambio de asignación')
}

const ICONO = { ESTADO: 'fa-solid fa-arrows-rotate', ASIGNACION: 'fa-solid fa-people-group', EVIDENCIA: 'fa-solid fa-camera' }

/**
 * Línea de tiempo de una incidencia: registro + cambios guardados en el historial.
 * mostrarAutor: el admin ve quién hizo cada cambio; el ciudadano no.
 */
export default function HistorialIncidencia({ incidencia, mostrarAutor = false }) {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vigente = true
    obtenerHistorial(incidencia.idIncidencia)
      .then((data) => { if (vigente) setItems(data || []) })
      .catch((e) => { if (vigente) setError(e.message) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [incidencia.idIncidencia])

  return (
    <div className="historial">
      <h4 className="historial__titulo">Historial</h4>
      {cargando && <p className="historial__vacio">Cargando historial…</p>}
      {error && <p className="historial__error">{error}</p>}
      {!cargando && !error && (
        <ol className="historial__lista">
          <li className="historial__item historial__item--REGISTRO">
            <span className="historial__icono"><i className="fa-solid fa-flag" aria-hidden="true"></i></span>
            <div>
              <p className="historial__texto">Incidencia registrada{incidencia.reportadoPor ? ` por ${incidencia.reportadoPor}` : ''}</p>
              <p className="historial__meta">{formatearFechaHora(incidencia.fecha)}</p>
            </div>
          </li>
          {items.map((item, i) => (
            <li key={i} className={`historial__item historial__item--${item.tipo}`}>
              <span className="historial__icono"><i className={ICONO[item.tipo] || 'fa-solid fa-circle'} aria-hidden="true"></i></span>
              <div>
                <p className="historial__texto">{textoDe(item)}</p>
                {item.tipo === 'ESTADO' && item.detalle && <p className="historial__nota">“{item.detalle}”</p>}
                <p className="historial__meta">
                  {formatearFechaHora(item.fecha)}
                  {mostrarAutor && item.realizadoPor ? ` · ${item.realizadoPor}` : ''}
                </p>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="historial__vacio">Aún no hay cambios registrados.</li>
          )}
        </ol>
      )}
    </div>
  )
}
