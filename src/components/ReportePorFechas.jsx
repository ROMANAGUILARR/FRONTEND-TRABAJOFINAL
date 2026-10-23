import { useState } from 'react'
import { obtenerReportePorFechas } from '../services/incidenciasApi'
import './ReportePorFechas.css'

// Fecha local en formato YYYY-MM-DD (el que usa <input type="date">)
const aISO = (d) => d.toLocaleDateString('en-CA')
const aTexto = (iso) => iso ? iso.split('-').reverse().join('/') : ''

function rangoSemana() {
  const hoy = new Date()
  const dia = hoy.getDay() === 0 ? 7 : hoy.getDay()      // lunes = 1 … domingo = 7
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - (dia - 1))
  const viernes = new Date(lunes); viernes.setDate(lunes.getDate() + 4)
  return [aISO(lunes), aISO(viernes)]
}

function rangoMes(mesesAtras = 0) {
  const hoy = new Date()
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, 1)
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
  return [aISO(inicio), aISO(fin)]
}

// Mismo cálculo que el backend, para el modo demo sin servidor
function reporteLocal(incidencias, desde, hasta) {
  const lista = incidencias.filter(i => {
    const f = (i.fecha || '').slice(0, 10)
    return f >= desde && f <= hasta
  })
  const porUsuario = {}
  let resueltas = 0, enProceso = 0, pendientes = 0
  const detalle = lista.map(i => {
    const resuelta = i.estado === 'RESUELTO'
    if (resuelta) resueltas++
    else if (i.estado === 'EN_PROCESO') enProceso++
    else pendientes++
    const u = i.reportadoPor || i.nombreUsuario || 'Sin usuario'
    porUsuario[u] = porUsuario[u] || { usuario: u, reportadas: 0, resueltas: 0, noResueltas: 0 }
    porUsuario[u].reportadas++
    resuelta ? porUsuario[u].resueltas++ : porUsuario[u].noResueltas++
    return resuelta ? i : {
      ...i,
      motivoNoResuelta: i.cuadrillaNombre
        ? `En proceso: la cuadrilla ${i.cuadrillaNombre} la atiende; falta subir la foto de evidencia`
        : 'Pendiente: aún no se asigna una cuadrilla',
    }
  })
  const total = lista.length
  return {
    desde, hasta, totalReportadas: total, resueltas, enProceso, pendientes,
    porcentajeResueltas: total ? Math.round(resueltas * 1000 / total) / 10 : 0,
    porUsuario: Object.values(porUsuario).sort((a, b) => b.reportadas - a.reportadas),
    incidencias: detalle,
  }
}

/**
 * Filtro por rango de fechas: cuántas incidencias se reportaron, cuántas se resolvieron
 * y por qué las demás siguen abiertas. Avisa al padre el rango para filtrar la tabla.
 */
export default function ReportePorFechas({ modoDemo, incidenciasDemo, onCambioRango }) {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function consultar(d = desde, h = hasta) {
    setError(null)
    if (!d || !h) { setError('Elige la fecha de inicio y la fecha de fin.'); return }
    if (d > h) { setError('La fecha de inicio no puede ser posterior a la fecha de fin.'); return }
    setDesde(d); setHasta(h)
    setCargando(true)
    try {
      const datos = modoDemo ? reporteLocal(incidenciasDemo, d, h) : await obtenerReportePorFechas(d, h)
      setReporte(datos)
      onCambioRango?.({ desde: d, hasta: h })
    } catch (e) {
      setError(e.message || 'No se pudo obtener el reporte.')
    } finally {
      setCargando(false)
    }
  }

  function limpiar() {
    setDesde(''); setHasta(''); setReporte(null); setError(null)
    onCambioRango?.(null)
  }

  const noResueltas = reporte ? reporte.incidencias.filter(i => i.estado !== 'RESUELTO') : []

  return (
    <section className="rpf" aria-labelledby="rpf-titulo">
      <div className="rpf__cabecera">
        <h3 id="rpf-titulo" className="rpf__titulo">
          <i className="fa-solid fa-calendar-days" aria-hidden="true"></i> Reporte por rango de fechas
        </h3>
        <p className="rpf__ayuda">Elige desde qué fecha hasta qué fecha quieres ver las incidencias registradas.</p>
      </div>

      <div className="rpf__controles">
        <label className="rpf__campo">
          <span>Fecha de inicio</span>
          <input type="date" className="admin-input" value={desde} max={hasta || undefined}
            onChange={e => setDesde(e.target.value)} />
        </label>
        <label className="rpf__campo">
          <span>Fecha de fin</span>
          <input type="date" className="admin-input" value={hasta} min={desde || undefined}
            onChange={e => setHasta(e.target.value)} />
        </label>
        <div className="rpf__atajos" role="group" aria-label="Rangos rápidos">
          <button type="button" className="rpf__chip" onClick={() => consultar(...rangoSemana())}>Esta semana</button>
          <button type="button" className="rpf__chip" onClick={() => consultar(...rangoMes(0))}>Este mes</button>
          <button type="button" className="rpf__chip" onClick={() => consultar(...rangoMes(2))}>Últimos 3 meses</button>
        </div>
        <div className="rpf__botones">
          <button type="button" className="admin-btn admin-btn--save" onClick={() => consultar()} disabled={cargando}>
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i> {cargando ? 'Consultando…' : 'Consultar'}
          </button>
          {reporte && (
            <button type="button" className="admin-btn admin-btn--cancel" onClick={limpiar}>
              <i className="fa-solid fa-xmark" aria-hidden="true"></i> Quitar filtro
            </button>
          )}
        </div>
      </div>

      {error && <p className="rpf__error" role="alert">{error}</p>}

      {reporte && (
        <div className="rpf__resultado">
          <p className="rpf__rango">
            Del <strong>{aTexto(reporte.desde)}</strong> al <strong>{aTexto(reporte.hasta)}</strong>
          </p>

          <div className="rpf__totales">
            <div className="rpf__total">
              <span className="rpf__numero">{reporte.totalReportadas}</span>
              <span className="rpf__etiqueta">Reportadas</span>
            </div>
            <div className="rpf__total rpf__total--ok">
              <span className="rpf__numero">{reporte.resueltas}</span>
              <span className="rpf__etiqueta">Resueltas ({reporte.porcentajeResueltas}%)</span>
            </div>
            <div className="rpf__total rpf__total--pend">
              <span className="rpf__numero">{reporte.totalReportadas - reporte.resueltas}</span>
              <span className="rpf__etiqueta">No resueltas ({reporte.enProceso} en proceso · {reporte.pendientes} {reporte.pendientes === 1 ? 'pendiente' : 'pendientes'})</span>
            </div>
          </div>

          {reporte.totalReportadas === 0 ? (
            <p className="rpf__vacio">No se registraron incidencias en este rango de fechas.</p>
          ) : (
            <div className="rpf__detalle">
              <div className="rpf__bloque">
                <h4>Por ciudadano</h4>
                <table className="rpf__tabla">
                  <thead>
                    <tr><th>Ciudadano</th><th>Reportadas</th><th>Resueltas</th><th>No resueltas</th></tr>
                  </thead>
                  <tbody>
                    {reporte.porUsuario.map(u => (
                      <tr key={u.usuario}>
                        <td>{u.usuario}</td><td>{u.reportadas}</td><td>{u.resueltas}</td><td>{u.noResueltas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rpf__bloque">
                <h4>No resueltas y por qué</h4>
                {noResueltas.length === 0 ? (
                  <p className="rpf__vacio">Todas las incidencias de este rango están resueltas.</p>
                ) : (
                  <ul className="rpf__motivos">
                    {noResueltas.map(i => (
                      <li key={i.idIncidencia}>
                        <span className="rpf__motivo-titulo">#{i.idIncidencia} · {i.titulo || i.categoria}</span>
                        <span className="rpf__motivo-texto">{i.motivoNoResuelta}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          <p className="rpf__nota">La tabla de abajo también muestra solo las incidencias de este rango.</p>
        </div>
      )}
    </section>
  )
}
