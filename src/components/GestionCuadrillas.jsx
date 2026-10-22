import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  listarCuadrillas, crearCuadrilla, actualizarCuadrilla, eliminarCuadrilla,
  agregarTrabajador, actualizarTrabajador, eliminarTrabajador,
} from '../services/cuadrillasApi'
import { DISTRITOS_LIMA, normalizarTexto } from '../utils/zonas'
import './ManejarIncidencias.css'
import './Cuadrillas.css'

const CUADRILLA_VACIA = { nombre: '', zona: '', activa: true }
const TRABAJADOR_VACIO = { nombreCompleto: '', dni: '', telefono: '', esJefe: false, activo: true }

function soloDigitos(valor, max) {
  return valor.replace(/\D/g, '').slice(0, max)
}

/** Módulo ADMIN: equipos de limpieza, sus integrantes y su carga de trabajo. */
export default function GestionCuadrillas() {
  const [cuadrillas, setCuadrillas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [verInactivas, setVerInactivas] = useState(false)

  // Formularios: { modo: 'crear' | 'editar', datos, id }
  const [formCuadrilla, setFormCuadrilla] = useState(null)
  const [formTrabajador, setFormTrabajador] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setError(null)
      setCuadrillas(await listarCuadrillas())
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  // Cerrar el formulario abierto con Escape
  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key !== 'Escape' || guardando) return
      setFormCuadrilla(null)
      setFormTrabajador(null)
      setConfirmacion(null)
    }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [guardando])

  function mostrarAviso(texto) {
    setAviso(texto)
    setTimeout(() => setAviso(null), 3000)
  }

  const visibles = useMemo(() => {
    const q = normalizarTexto(busqueda)
    return cuadrillas.filter((c) =>
      (verInactivas || c.activa) &&
      (!q || normalizarTexto(c.nombre).includes(q) || normalizarTexto(c.zona).includes(q) ||
        c.trabajadores.some((t) => normalizarTexto(t.nombreCompleto).includes(q))))
  }, [cuadrillas, busqueda, verInactivas])

  const metricas = useMemo(() => {
    const activas = cuadrillas.filter((c) => c.activa)
    return {
      activas: activas.length,
      integrantes: activas.reduce((n, c) => n + c.trabajadores.filter((t) => t.activo).length, 0),
      enCurso: cuadrillas.reduce((n, c) => n + c.pendientes + c.enProceso, 0),
      resueltas: cuadrillas.reduce((n, c) => n + c.resueltas, 0),
    }
  }, [cuadrillas])

  // ---------- Cuadrillas ----------
  function abrirCrearCuadrilla() {
    setErrorForm(null)
    setFormCuadrilla({ modo: 'crear', datos: { ...CUADRILLA_VACIA } })
  }

  function abrirEditarCuadrilla(c) {
    setErrorForm(null)
    setFormCuadrilla({ modo: 'editar', id: c.idCuadrilla, datos: { nombre: c.nombre, zona: c.zona || '', activa: c.activa } })
  }

  async function guardarCuadrilla(e) {
    e.preventDefault()
    const { modo, id, datos } = formCuadrilla
    if (!datos.nombre.trim()) { setErrorForm('Escribe el nombre de la cuadrilla.'); return }
    setGuardando(true)
    setErrorForm(null)
    try {
      if (modo === 'crear') await crearCuadrilla(datos)
      else await actualizarCuadrilla(id, datos)
      await cargar()
      setFormCuadrilla(null)
      mostrarAviso(modo === 'crear' ? 'Cuadrilla creada' : 'Cuadrilla actualizada')
    } catch (err) {
      setErrorForm(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function cambiarActiva(c) {
    try {
      await actualizarCuadrilla(c.idCuadrilla, { nombre: c.nombre, zona: c.zona, activa: !c.activa })
      await cargar()
      mostrarAviso(c.activa ? 'Cuadrilla desactivada' : 'Cuadrilla activada')
    } catch (err) {
      setError(err.message)
    }
  }

  // ---------- Integrantes ----------
  function abrirCrearTrabajador(c) {
    setErrorForm(null)
    setFormTrabajador({ modo: 'crear', idCuadrilla: c.idCuadrilla, cuadrilla: c.nombre, datos: { ...TRABAJADOR_VACIO, esJefe: c.trabajadores.length === 0 } })
  }

  function abrirEditarTrabajador(c, t) {
    setErrorForm(null)
    setFormTrabajador({
      modo: 'editar', id: t.idTrabajador, cuadrilla: c.nombre,
      datos: { nombreCompleto: t.nombreCompleto, dni: t.dni || '', telefono: t.telefono || '', esJefe: t.esJefe, activo: t.activo },
    })
  }

  async function guardarTrabajador(e) {
    e.preventDefault()
    const { modo, id, idCuadrilla, datos } = formTrabajador
    if (!datos.nombreCompleto.trim()) { setErrorForm('Escribe el nombre del integrante.'); return }
    if (datos.dni && datos.dni.length !== 8) { setErrorForm('El DNI debe tener 8 dígitos.'); return }
    if (datos.telefono && datos.telefono.length !== 9) { setErrorForm('El teléfono debe tener 9 dígitos.'); return }
    setGuardando(true)
    setErrorForm(null)
    try {
      if (modo === 'crear') await agregarTrabajador(idCuadrilla, datos)
      else await actualizarTrabajador(id, datos)
      await cargar()
      setFormTrabajador(null)
      mostrarAviso(modo === 'crear' ? 'Integrante agregado' : 'Integrante actualizado')
    } catch (err) {
      setErrorForm(err.message)
    } finally {
      setGuardando(false)
    }
  }

  // ---------- Eliminar (con confirmación) ----------
  async function confirmar() {
    const { accion, exito } = confirmacion
    setGuardando(true)
    try {
      await accion()
      await cargar()
      setConfirmacion(null)
      mostrarAviso(exito)
    } catch (err) {
      setConfirmacion((c) => ({ ...c, error: err.message }))
    } finally {
      setGuardando(false)
    }
  }

  function pedirEliminarCuadrilla(c) {
    setConfirmacion({
      titulo: `¿Eliminar la cuadrilla "${c.nombre}"?`,
      mensaje: 'También se quitarán sus integrantes. Si tiene incidencias asignadas no se podrá eliminar; en ese caso desactívala.',
      accion: () => eliminarCuadrilla(c.idCuadrilla),
      exito: 'Cuadrilla eliminada',
    })
  }

  function pedirEliminarTrabajador(t) {
    setConfirmacion({
      titulo: `¿Quitar a ${t.nombreCompleto}?`,
      mensaje: 'El integrante dejará de figurar en la cuadrilla.',
      accion: () => eliminarTrabajador(t.idTrabajador),
      exito: 'Integrante quitado',
    })
  }

  return (
    <main className="cuadrillas">
      <div className="cuadrillas__encabezado">
        <div>
          <h2 className="cuadrillas__titulo">Gestión de Cuadrillas</h2>
          <p className="cuadrillas__subtitulo">Equipos de limpieza que atienden las incidencias registradas</p>
        </div>
        <button type="button" className="admin-btn admin-btn--save" onClick={abrirCrearCuadrilla}>
          <i className="fa-solid fa-plus" aria-hidden="true"></i> Nueva cuadrilla
        </button>
      </div>

      <div className="admin-metrics">
        <div className="admin-metric-card admin-metric-card--total">
          <span className="admin-metric-card__numero">{metricas.activas}</span>
          <span className="admin-metric-card__label">Cuadrillas activas</span>
          <i className="fa-solid fa-people-group admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card admin-metric-card--progress">
          <span className="admin-metric-card__numero">{metricas.integrantes}</span>
          <span className="admin-metric-card__label">Integrantes</span>
          <i className="fa-solid fa-helmet-safety admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card admin-metric-card--pending">
          <span className="admin-metric-card__numero">{metricas.enCurso}</span>
          <span className="admin-metric-card__label">Incidencias en curso</span>
          <i className="fa-solid fa-wrench admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card admin-metric-card--resolved">
          <span className="admin-metric-card__numero">{metricas.resueltas}</span>
          <span className="admin-metric-card__label">Resueltas</span>
          <i className="fa-solid fa-circle-check admin-metric-card__icon"></i>
        </div>
      </div>

      <div className="cuadrillas__controles">
        <input
          type="search"
          className="admin-input"
          placeholder="Buscar por cuadrilla, zona o integrante…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar cuadrillas"
        />
        <label className="cuad-check">
          <input type="checkbox" checked={verInactivas} onChange={(e) => setVerInactivas(e.target.checked)} />
          Mostrar inactivas
        </label>
      </div>

      {aviso && <p className="cuad-alerta cuad-alerta--ok" role="status">{aviso}</p>}
      {error && <p className="cuad-alerta cuad-alerta--error">{error}</p>}

      {cargando ? (
        <p className="cuad-vacio">Cargando cuadrillas…</p>
      ) : visibles.length === 0 ? (
        <div className="cuad-vacio cuad-vacio--grande">
          <i className="fa-solid fa-people-group" aria-hidden="true"></i>
          <p>{cuadrillas.length === 0 ? 'Aún no hay cuadrillas registradas.' : 'Ninguna cuadrilla coincide con la búsqueda.'}</p>
          {cuadrillas.length === 0 && (
            <button type="button" className="admin-btn admin-btn--save" onClick={abrirCrearCuadrilla}>Crear la primera cuadrilla</button>
          )}
        </div>
      ) : (
        <div className="cuadrillas__grid">
          {visibles.map((c) => (
            <article key={c.idCuadrilla} className={`cuad-card ${c.activa ? '' : 'cuad-card--inactiva'}`}>
              <header className="cuad-card__cabecera">
                <div>
                  <h3 className="cuad-card__nombre">{c.nombre}</h3>
                  <span className="cuad-card__zona">
                    <i className="fa-solid fa-location-dot" aria-hidden="true"></i> {c.zona || 'Sin zona asignada'}
                  </span>
                </div>
                <span className={`cuad-chip ${c.activa ? 'cuad-chip--activa' : ''}`}>{c.activa ? 'Activa' : 'Inactiva'}</span>
              </header>

              <div className="cuad-card__carga" aria-label="Carga de trabajo">
                <span><strong>{c.pendientes}</strong> Pendientes</span>
                <span><strong>{c.enProceso}</strong> En proceso</span>
                <span><strong>{c.resueltas}</strong> Resueltas</span>
              </div>

              <div className="cuad-card__integrantes">
                <span className="cuad-card__seccion">Integrantes ({c.trabajadores.length})</span>
                {c.trabajadores.length === 0 ? (
                  <p className="cuad-card__sin">Sin integrantes todavía.</p>
                ) : (
                  <ul>
                    {c.trabajadores.map((t) => (
                      <li key={t.idTrabajador} className={t.activo ? '' : 'cuad-integrante--inactivo'}>
                        <div className="cuad-integrante__datos">
                          <span className="cuad-integrante__nombre">
                            {t.nombreCompleto}
                            {t.esJefe && <span className="cuad-chip cuad-chip--jefe">Jefe</span>}
                            {!t.activo && <span className="cuad-chip">Inactivo</span>}
                          </span>
                          <span className="cuad-integrante__meta">
                            {[t.dni && `DNI ${t.dni}`, t.telefono && `Tel. ${t.telefono}`].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
                          </span>
                        </div>
                        <div className="cuad-integrante__acciones">
                          <button type="button" className="cuad-icono" onClick={() => abrirEditarTrabajador(c, t)} aria-label={`Editar a ${t.nombreCompleto}`} title="Editar">
                            <i className="fa-solid fa-pen" aria-hidden="true"></i>
                          </button>
                          <button type="button" className="cuad-icono cuad-icono--peligro" onClick={() => pedirEliminarTrabajador(t)} aria-label={`Quitar a ${t.nombreCompleto}`} title="Quitar">
                            <i className="fa-solid fa-user-minus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" className="cuad-agregar" onClick={() => abrirCrearTrabajador(c)}>
                  <i className="fa-solid fa-user-plus" aria-hidden="true"></i> Agregar integrante
                </button>
              </div>

              <footer className="cuad-card__acciones">
                <button type="button" className="admin-btn admin-btn--edit" onClick={() => abrirEditarCuadrilla(c)}>Editar</button>
                <button type="button" className="admin-btn admin-btn--cancel" onClick={() => cambiarActiva(c)}>
                  {c.activa ? 'Desactivar' : 'Activar'}
                </button>
                <button type="button" className="admin-btn admin-btn--delete" onClick={() => pedirEliminarCuadrilla(c)}>Eliminar</button>
              </footer>
            </article>
          ))}
        </div>
      )}

      {/* Formulario de cuadrilla */}
      {formCuadrilla && (
        <div className="admin-modal-overlay" onClick={() => !guardando && setFormCuadrilla(null)}>
          <form className="admin-modal cuad-modal" onClick={(e) => e.stopPropagation()} onSubmit={guardarCuadrilla} role="dialog" aria-modal="true" aria-labelledby="form-cuadrilla-titulo">
            <h3 className="admin-modal__title" id="form-cuadrilla-titulo">
              {formCuadrilla.modo === 'crear' ? 'Nueva cuadrilla' : 'Editar cuadrilla'}
            </h3>
            {errorForm && <p className="cuad-alerta cuad-alerta--error">{errorForm}</p>}
            <label className="admin-modal__label" htmlFor="cuad-nombre">Nombre <span className="required-asterisk">*</span></label>
            <input
              id="cuad-nombre" className="admin-input" maxLength={100} autoFocus
              placeholder="Ej.: Cuadrilla Norte"
              value={formCuadrilla.datos.nombre}
              onChange={(e) => setFormCuadrilla((f) => ({ ...f, datos: { ...f.datos, nombre: e.target.value } }))}
            />
            <label className="admin-modal__label" htmlFor="cuad-zona">Zona / distrito</label>
            <input
              id="cuad-zona" className="admin-input" list="distritos-lima" maxLength={150}
              placeholder="Ej.: Los Olivos"
              value={formCuadrilla.datos.zona}
              onChange={(e) => setFormCuadrilla((f) => ({ ...f, datos: { ...f.datos, zona: e.target.value } }))}
            />
            <datalist id="distritos-lima">
              {DISTRITOS_LIMA.map((d) => <option key={d} value={d} />)}
            </datalist>
            <span className="cuad-ayuda">Se usa para sugerir esta cuadrilla en las incidencias de su distrito.</span>
            {formCuadrilla.modo === 'editar' && (
              <label className="cuad-check">
                <input
                  type="checkbox" checked={formCuadrilla.datos.activa}
                  onChange={(e) => setFormCuadrilla((f) => ({ ...f, datos: { ...f.datos, activa: e.target.checked } }))}
                />
                Activa (puede recibir incidencias)
              </label>
            )}
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--cancel" onClick={() => setFormCuadrilla(null)} disabled={guardando}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--save" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Formulario de integrante */}
      {formTrabajador && (
        <div className="admin-modal-overlay" onClick={() => !guardando && setFormTrabajador(null)}>
          <form className="admin-modal cuad-modal" onClick={(e) => e.stopPropagation()} onSubmit={guardarTrabajador} role="dialog" aria-modal="true" aria-labelledby="form-trabajador-titulo">
            <h3 className="admin-modal__title" id="form-trabajador-titulo">
              {formTrabajador.modo === 'crear' ? 'Agregar integrante' : 'Editar integrante'}
            </h3>
            <p className="cuad-modal__contexto"><span>{formTrabajador.cuadrilla}</span></p>
            {errorForm && <p className="cuad-alerta cuad-alerta--error">{errorForm}</p>}
            <label className="admin-modal__label" htmlFor="trab-nombre">Nombre completo <span className="required-asterisk">*</span></label>
            <input
              id="trab-nombre" className="admin-input" maxLength={200} autoFocus
              value={formTrabajador.datos.nombreCompleto}
              onChange={(e) => setFormTrabajador((f) => ({ ...f, datos: { ...f.datos, nombreCompleto: e.target.value } }))}
            />
            <div className="admin-modal__form-grid">
              <div>
                <label className="admin-modal__label" htmlFor="trab-dni">DNI</label>
                <input
                  id="trab-dni" className="admin-input" inputMode="numeric" placeholder="8 dígitos"
                  value={formTrabajador.datos.dni}
                  onChange={(e) => setFormTrabajador((f) => ({ ...f, datos: { ...f.datos, dni: soloDigitos(e.target.value, 8) } }))}
                />
              </div>
              <div>
                <label className="admin-modal__label" htmlFor="trab-tel">Teléfono</label>
                <input
                  id="trab-tel" className="admin-input" inputMode="numeric" placeholder="9 dígitos"
                  value={formTrabajador.datos.telefono}
                  onChange={(e) => setFormTrabajador((f) => ({ ...f, datos: { ...f.datos, telefono: soloDigitos(e.target.value, 9) } }))}
                />
              </div>
            </div>
            <label className="cuad-check">
              <input
                type="checkbox" checked={formTrabajador.datos.esJefe}
                onChange={(e) => setFormTrabajador((f) => ({ ...f, datos: { ...f.datos, esJefe: e.target.checked } }))}
              />
              Jefe de cuadrilla <span className="cuad-ayuda">(solo uno por cuadrilla)</span>
            </label>
            {formTrabajador.modo === 'editar' && (
              <label className="cuad-check">
                <input
                  type="checkbox" checked={formTrabajador.datos.activo}
                  onChange={(e) => setFormTrabajador((f) => ({ ...f, datos: { ...f.datos, activo: e.target.checked } }))}
                />
                Activo
              </label>
            )}
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--cancel" onClick={() => setFormTrabajador(null)} disabled={guardando}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--save" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmación de borrado */}
      {confirmacion && (
        <div className="admin-modal-overlay" onClick={() => !guardando && setConfirmacion(null)}>
          <div className="admin-modal cuad-modal cuad-modal--angosto" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="confirmar-titulo">
            <h3 className="admin-modal__title" id="confirmar-titulo">{confirmacion.titulo}</h3>
            <p className="cuad-modal__mensaje">{confirmacion.mensaje}</p>
            {confirmacion.error && <p className="cuad-alerta cuad-alerta--error">{confirmacion.error}</p>}
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--cancel" onClick={() => setConfirmacion(null)} disabled={guardando}>Cancelar</button>
              <button type="button" className="admin-btn admin-btn--delete" onClick={confirmar} disabled={guardando}>
                {guardando ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
