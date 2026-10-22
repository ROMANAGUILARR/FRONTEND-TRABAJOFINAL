import { useEffect, useMemo, useState } from 'react'
import { listarCuadrillas, asignarCuadrilla } from '../services/cuadrillasApi'
import { coincideZona } from '../utils/zonas'
import './Cuadrillas.css'

/** Elige la cuadrilla responsable; primero aparecen las de la misma zona que la incidencia. */
export default function AsignarCuadrillaModal({ incidencia, onClose, onAsignada }) {
  const [cuadrillas, setCuadrillas] = useState([])
  const [seleccion, setSeleccion] = useState(incidencia.idCuadrilla ?? null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listarCuadrillas()
      .then((data) => setCuadrillas(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    const alPresionar = (e) => { if (e.key === 'Escape' && !guardando) onClose() }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [onClose, guardando])

  const opciones = useMemo(() => {
    return cuadrillas
      .filter((c) => c.activa || c.idCuadrilla === incidencia.idCuadrilla)
      .map((c) => ({ ...c, sugerida: coincideZona(c.zona, incidencia.direccionTexto) }))
      .sort((a, b) =>
        Number(b.sugerida) - Number(a.sugerida) ||
        (a.pendientes + a.enProceso) - (b.pendientes + b.enProceso) ||
        a.nombre.localeCompare(b.nombre))
  }, [cuadrillas, incidencia])

  async function guardar(idCuadrilla) {
    setGuardando(true)
    setError(null)
    try {
      const actualizada = await asignarCuadrilla(incidencia.idIncidencia, idCuadrilla)
      onAsignada(actualizada)
    } catch (e) {
      setError(e.message)
      setGuardando(false)
    }
  }

  const sinCambios = (seleccion ?? null) === (incidencia.idCuadrilla ?? null)

  return (
    <div className="admin-modal-overlay" onClick={() => !guardando && onClose()}>
      <div className="admin-modal cuad-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="asignar-titulo">
        <h3 className="admin-modal__title" id="asignar-titulo">
          <i className="fa-solid fa-people-group" style={{ marginRight: 8 }}></i>Asignar cuadrilla
        </h3>
        <p className="cuad-modal__contexto">
          <strong>{incidencia.titulo || incidencia.categoria}</strong>
          <span>{incidencia.direccionTexto || 'Sin dirección registrada'}</span>
        </p>

        {error && <p className="cuad-alerta cuad-alerta--error">{error}</p>}
        {cargando ? (
          <p className="cuad-vacio">Cargando cuadrillas…</p>
        ) : opciones.length === 0 ? (
          <p className="cuad-vacio">
            No hay cuadrillas activas. Créalas en <strong>Gestión de Cuadrillas</strong>.
          </p>
        ) : (
          <ul className="cuad-opciones" role="radiogroup" aria-label="Cuadrillas disponibles">
            {opciones.map((c) => {
              const jefe = c.trabajadores.find((t) => t.esJefe)
              const activos = c.trabajadores.filter((t) => t.activo).length
              return (
                <li key={c.idCuadrilla}>
                  <label className={`cuad-opcion ${seleccion === c.idCuadrilla ? 'cuad-opcion--activa' : ''}`}>
                    <input
                      type="radio"
                      name="cuadrilla"
                      checked={seleccion === c.idCuadrilla}
                      onChange={() => setSeleccion(c.idCuadrilla)}
                    />
                    <span className="cuad-opcion__cuerpo">
                      <span className="cuad-opcion__nombre">
                        {c.nombre}
                        {c.sugerida && <span className="cuad-chip cuad-chip--sugerida">Misma zona</span>}
                        {!c.activa && <span className="cuad-chip">Inactiva</span>}
                      </span>
                      <span className="cuad-opcion__meta">
                        {c.zona || 'Sin zona'} · {activos} integrante{activos === 1 ? '' : 's'}
                        {jefe ? ` · Jefe: ${jefe.nombreCompleto}` : ''}
                      </span>
                      <span className="cuad-opcion__meta">
                        Carga actual: {c.pendientes + c.enProceso} en curso
                      </span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}

        <div className="admin-modal__actions cuad-modal__acciones">
          {incidencia.idCuadrilla && (
            <button
              type="button"
              className="admin-btn admin-btn--delete cuad-modal__quitar"
              disabled={guardando}
              onClick={() => guardar(null)}
            >
              Quitar asignación
            </button>
          )}
          <button type="button" className="admin-btn admin-btn--cancel" onClick={onClose} disabled={guardando}>
            Cancelar
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--save"
            disabled={guardando || seleccion == null || sinCambios}
            onClick={() => guardar(seleccion)}
          >
            {guardando ? 'Guardando…' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  )
}
