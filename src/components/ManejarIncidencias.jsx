import { useState, useEffect, useCallback } from 'react'
import { ESTADO_BADGE, ESTADO_LABEL, CATEGORIAS, formatearFecha } from '../utils/incidenciaConstants'
import { MOCK_USUARIOS, MOCK_INCIDENCIAS_POR_USUARIO } from '../services/mockData'
import './SeguimientoIncidencias.css'
import './ManejarIncidencias.css'
import './AIConfirmModal.css'
import DeleteConfirmModal from './DeleteConfirmModal'

const ITEMS_POR_PAGINA = 10

const ESTADOS = {
  PENDIENTE: 'pending',
  EN_PROCESO: 'in-progress',
  RESUELTO: 'resolved'
}

// Build reverse lookup: incident ID -> reporter name (for demo mode)
const REPORTER_MAP = (() => {
  const map = {}
  MOCK_USUARIOS.forEach(usuario => {
    const incidencias = MOCK_INCIDENCIAS_POR_USUARIO[usuario.idUsuario] || []
    incidencias.forEach(inc => {
      map[inc.id] = `${usuario.nombreCompleto} ${usuario.apellidoCompleto}`
    })
  })
  return map
})()

function esDemo() {
  const token = localStorage.getItem('token')
  return token === 'demo-token' || token === 'demo-token-admin'
}

function leerIncidenciasDemo() {
  // Si hay datos guardados en localStorage, usarlos
  const guardadas = localStorage.getItem('todasIncidenciasDemo')
  if (guardadas) return JSON.parse(guardadas)

  // Datos iniciales mock
  const mock = [
    { idIncidencia: 1, titulo: 'Acumulación y falta de recojo', descripcion: 'Acumulacion de residuos en la esquina de Av. Principal', estado: 'RESUELTO', fecha: '2026-09-10', direccionTexto: 'Av. Principal 123' },
    { idIncidencia: 2, titulo: 'Basura en vía pública', descripcion: 'Vertido de aguas residuales en el canal', estado: 'EN_PROCESO', fecha: '2026-09-11', direccionTexto: 'Jr. San Martin 456' },
    { idIncidencia: 3, titulo: 'Residuos en parques o áreas verdes', descripcion: 'Quema ilegal de basura en terreno baldio', estado: 'PENDIENTE', fecha: '2026-09-12', direccionTexto: 'Calle Los Cedros 789' },
    { idIncidencia: 4, titulo: 'Contenedor dañado o lleno', descripcion: 'Contenedor desbordado en parque', estado: 'RESUELTO', fecha: '2026-09-12', direccionTexto: 'Av. Grau 321' },
    { idIncidencia: 5, titulo: 'Escombros o materiales de construcción', descripcion: 'Escombros abandonados en via publica', estado: 'EN_PROCESO', fecha: '2026-09-13', direccionTexto: 'Panamericana Sur km 15' },
  ]
  const locales = JSON.parse(localStorage.getItem('incidenciasLocales') || '[]')
  const idBase = 100
  const localesConId = locales.map((inc, i) => ({
    idIncidencia: idBase + i,
    titulo: inc.categoria,
    descripcion: inc.descripcion,
    estado: inc.estado || 'PENDIENTE',
    fecha: inc.fecha,
    direccionTexto: inc.direccionTexto
  }))
  const todas = [...mock, ...localesConId]
  localStorage.setItem('todasIncidenciasDemo', JSON.stringify(todas))
  return todas
}

function guardarIncidenciasDemo(incidencias) {
  // Guardar TODAS las incidencias (mock + locales) para persistir cambios
  localStorage.setItem('todasIncidenciasDemo', JSON.stringify(incidencias))
  // También actualizar incidenciasLocales para compatibilidad con otros módulos
  const locales = incidencias.filter(inc => inc.idIncidencia >= 100)
  const originales = locales.map(inc => ({
    categoria: inc.titulo,
    descripcion: inc.descripcion,
    estado: inc.estado,
    fecha: inc.fecha,
    direccionTexto: inc.direccionTexto
  }))
  localStorage.setItem('incidenciasLocales', JSON.stringify(originales))
}

export default function ManejarIncidencias() {
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const [busqueda, setBusqueda] = useState('')
  const [incidenciaAEliminar, setIncidenciaAEliminar] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({ titulo: '', descripcion: '', estado: 'PENDIENTE', direccionTexto: '' })
  const [paginaActual, setPaginaActual] = useState(1)

  useEffect(() => {
    async function mostrarIncidencias() {
      if (esDemo()) { setIncidencias(leerIncidenciasDemo()); return }
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE}/incidencias/mostrarT`, { headers: { 'Authorization': `Bearer ${token}` } })
        setIncidencias(await response.json())
      } catch (error) {
        console.error('Error al obtener incidencias', error)
        setIncidencias([])
      }
    }
    mostrarIncidencias()
  }, [])

  // Reset page to 1 when filters change
  useEffect(() => {
    setPaginaActual(1)
  }, [filtroEstado, busqueda])

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && editando) {
        setEditando(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editando])

  function handleEditar() {
    if (!formulario.titulo || !formulario.descripcion) { alert('Completa todos los campos obligatorios.'); return }
    const actualizadas = incidencias.map(inc =>
      inc.idIncidencia === editando.idIncidencia
        ? { ...inc, titulo: formulario.titulo, descripcion: formulario.descripcion, estado: formulario.estado, direccionTexto: formulario.direccionTexto }
        : inc
    )
    setIncidencias(actualizadas)
    if (esDemo()) guardarIncidenciasDemo(actualizadas)
    setEditando(null)
  }

  function handleEliminar(id) {
    setIncidenciaAEliminar(id)
  }

  function confirmarEliminar() {
    const id = incidenciaAEliminar
    setIncidenciaAEliminar(null)
    const actualizadas = incidencias.filter(inc => inc.idIncidencia !== id)
    setIncidencias(actualizadas)
    if (esDemo()) guardarIncidenciasDemo(actualizadas)
  }

  function abrirEditar(incidencia) {
    setEditando(incidencia)
    setFormulario({ titulo: incidencia.titulo, descripcion: incidencia.descripcion, estado: incidencia.estado, direccionTexto: incidencia.direccionTexto || '' })
  }

  function obtenerReportadoPor(incidencia) {
    if (esDemo()) {
      return REPORTER_MAP[incidencia.idIncidencia] || '—'
    }
    return incidencia.nombreUsuario || '—'
  }

  const incidenciasFiltradas = incidencias.filter(incidencia => {
    const coincideEstado = filtroEstado === 'todos' || ESTADOS[incidencia.estado] === filtroEstado
    const fechaFormateada = formatearFecha(incidencia.fecha).toLowerCase()
    const coincideBusqueda = fechaFormateada.includes(busqueda.toLowerCase()) ||
      (incidencia.titulo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (incidencia.direccionTexto || '').toLowerCase().includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })

  // Metrics
  const totalIncidencias = incidencias.length
  const pendientesCount = incidencias.filter(inc => inc.estado === 'PENDIENTE').length
  const enProcesoCount = incidencias.filter(inc => inc.estado === 'EN_PROCESO').length
  const resueltosCount = incidencias.filter(inc => inc.estado === 'RESUELTO').length

  // Pagination
  const totalPaginas = Math.ceil(incidenciasFiltradas.length / ITEMS_POR_PAGINA)
  const incidenciasPaginadas = incidenciasFiltradas.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  )

  return (
    <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: 'var(--color-bg)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px' }}>Gestionar Incidencias</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Administra, edita y actualiza el estado de las incidencias registradas
      </p>

      {/* Métricas */}
      <div className="admin-metrics">
        <div className="admin-metric-card admin-metric-card--total">
          <span className="admin-metric-card__numero">{totalIncidencias}</span>
          <span className="admin-metric-card__label">Total Incidencias</span>
          <i className="fa-solid fa-chart-bar admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card admin-metric-card--pending">
          <span className="admin-metric-card__numero">{pendientesCount}</span>
          <span className="admin-metric-card__label">Pendientes</span>
          <i className="fa-solid fa-clock admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card admin-metric-card--progress">
          <span className="admin-metric-card__numero">{enProcesoCount}</span>
          <span className="admin-metric-card__label">En Proceso</span>
          <i className="fa-solid fa-wrench admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card admin-metric-card--resolved">
          <span className="admin-metric-card__numero">{resueltosCount}</span>
          <span className="admin-metric-card__label">Resueltos</span>
          <i className="fa-solid fa-circle-check admin-metric-card__icon"></i>
        </div>
      </div>

      {/* Buscador y filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Buscar por fecha, título o ubicación..."
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="admin-input" style={{ maxWidth: '350px' }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ key: 'todos', label: 'Todos', color: 'var(--color-text)' }, { key: 'pending', label: 'Pendientes', color: '#E65100' }, { key: 'in-progress', label: 'En Proceso', color: '#1565C0' }, { key: 'resolved', label: 'Resueltos', color: '#2E7D32' }].map(f => (
            <button key={f.key} onClick={() => setFiltroEstado(f.key)} className="admin-btn" style={{
              background: filtroEstado === f.key ? f.color : 'var(--color-bg-white)',
              color: filtroEstado === f.key ? '#fff' : 'var(--color-text)',
              border: filtroEstado === f.key ? 'none' : '1px solid var(--color-border)',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      {incidenciasFiltradas.length === 0 ? (
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>No se encontraron incidencias.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Reportado por</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidenciasPaginadas.map((incidencia, index) => (
                  <tr key={incidencia.idIncidencia}>
                    <td>{(paginaActual - 1) * ITEMS_POR_PAGINA + index + 1}</td>
                    <td style={{ fontWeight: 500 }}>{incidencia.titulo}</td>
                    <td>
                      <span className={`admin-badge ${ESTADO_BADGE[incidencia.estado] || 'admin-badge--pending'}`}>
                        {ESTADO_LABEL[incidencia.estado] || incidencia.estado}
                      </span>
                    </td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{incidencia.descripcion}</td>
                    <td>{obtenerReportadoPor(incidencia)}</td>
                    <td>{incidencia.direccionTexto || 'No se sabe'}</td>
                    <td>
                      <div className="admin-table__acciones">
                        <button onClick={() => abrirEditar(incidencia)} className="admin-btn admin-btn--edit">
                          Editar
                        </button>
                        <button onClick={() => handleEliminar(incidencia.idIncidencia)} className="admin-btn admin-btn--delete">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="admin-paginacion">
              <button
                className="admin-paginacion-btn"
                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
              <span className="admin-paginacion-info">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                className="admin-paginacion-btn"
                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de edición */}
      {editando && (
        <div className="admin-modal-overlay" onClick={() => setEditando(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal__title">Editar Incidencia</h3>
            <div className="admin-modal__form-grid">
              <div>
                <label className="admin-modal__label">Categoría</label>
                <select value={formulario.titulo} onChange={e => setFormulario(f => ({ ...f, titulo: e.target.value }))} className="admin-input">
                  <option value="">-- Selecciona --</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-modal__label">Estado</label>
                <select value={formulario.estado} onChange={e => setFormulario(f => ({ ...f, estado: e.target.value }))} className="admin-input">
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="RESUELTO">Resuelto</option>
                </select>
              </div>
              <div className="admin-modal__full-width">
                <label className="admin-modal__label">Descripción</label>
                <textarea value={formulario.descripcion} onChange={e => setFormulario(f => ({ ...f, descripcion: e.target.value }))} className="admin-input" style={{ minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div className="admin-modal__full-width">
                <label className="admin-modal__label">Dirección</label>
                <input value={formulario.direccionTexto} onChange={e => setFormulario(f => ({ ...f, direccionTexto: e.target.value }))} className="admin-input" />
              </div>
            </div>
            <div className="admin-modal__actions">
              <button onClick={() => setEditando(null)} className="admin-btn admin-btn--cancel">Cancelar</button>
              <button onClick={handleEditar} className="admin-btn admin-btn--save">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {incidenciaAEliminar && (
        <DeleteConfirmModal
          onConfirm={confirmarEliminar}
          onCancel={() => setIncidenciaAEliminar(null)}
        />
      )}
    </main>
  )
}
