import { useState, useEffect } from 'react'
import './SeguimientoIncidencias.css'
import ChangeStateConfirmModal from './ChangeStateConfirmModal'

const ESTADOS = {
  PENDIENTE: 'pending',
  EN_PROCESO: 'in-progress',
  RESUELTO: 'resolved'
}

const ESTADO_CONFIG = {
  PENDIENTE: { bg: '#FFF3E0', color: '#E65100', border: '#FF8F0F', label: 'Pendiente' },
  EN_PROCESO: { bg: '#E3F2FD', color: '#1565C0', border: '#42A5F5', label: 'En Proceso' },
  RESUELTO: { bg: '#E8F5E9', color: '#2E7D32', border: '#4CAF50', label: 'Resuelto' },
}

const CATEGORIAS = [
  'Acumulacion de basura',
  'Contaminacion del agua',
  'Contaminacion del aire',
  'Quema de residuos',
  'Derrame de petroleo',
  'Arbol caido',
  'Falta de papelera',
]

function esDemo() {
  const token = localStorage.getItem('token')
  return token === 'demo-token' || token === 'demo-token-admin'
}

function leerIncidenciasDemo() {
  const mock = [
    { idIncidencia: 1, titulo: 'Acumulacion de basura', descripcion: 'Acumulacion de residuos en la esquina de Av. Principal', estado: 'RESUELTO', fecha: '2026-09-10', direccionTexto: 'Av. Principal 123' },
    { idIncidencia: 2, titulo: 'Contaminacion del agua', descripcion: 'Vertido de aguas residuales en el canal', estado: 'EN_PROCESO', fecha: '2026-09-11', direccionTexto: 'Jr. San Martin 456' },
    { idIncidencia: 3, titulo: 'Quema de residuos', descripcion: 'Quema ilegal de basura en terreno baldio', estado: 'PENDIENTE', fecha: '2026-09-12', direccionTexto: 'Calle Los Cedros 789' },
    { idIncidencia: 4, titulo: 'Arbol caido', descripcion: 'Arbol caido bloquea la vereda', estado: 'RESUELTO', fecha: '2026-09-12', direccionTexto: 'Av. Grau 321' },
    { idIncidencia: 5, titulo: 'Derrame de petroleo', descripcion: 'Pequeno derrame de aceite en la pista', estado: 'EN_PROCESO', fecha: '2026-09-13', direccionTexto: 'Panamericana Sur km 15' },
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
  return [...mock, ...localesConId]
}

function guardarIncidenciasDemo(incidencias) {
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

const inputStyle = {
  padding: '10px 12px', border: '2px solid var(--color-border)', borderRadius: '8px',
  background: 'var(--color-bg-white)', color: 'var(--color-text)', fontSize: '0.9rem',
  fontFamily: 'inherit', width: '100%', outline: 'none',
}

const btnBase = {
  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', whiteSpace: 'nowrap',
  minWidth: 'fit-content', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff',
}

export default function ManejarIncidencias() {
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const [busqueda, setBusqueda] = useState('')
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({ titulo: '', descripcion: '', estado: 'PENDIENTE', direccionTexto: '' })

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
    if (!confirm('¿Estás seguro de eliminar esta incidencia?')) return
    const actualizadas = incidencias.filter(inc => inc.idIncidencia !== id)
    setIncidencias(actualizadas)
    if (esDemo()) guardarIncidenciasDemo(actualizadas)
  }

  function abrirEditar(incidencia) {
    setEditando(incidencia)
    setFormulario({ titulo: incidencia.titulo, descripcion: incidencia.descripcion, estado: incidencia.estado, direccionTexto: incidencia.direccionTexto || '' })
  }

  async function handleCambioEstadoIncidencia(id, estado) {
    setIncidenciaSeleccionada(null)
    if (esDemo()) {
      const actualizadas = incidencias.map(inc => inc.idIncidencia === id ? { ...inc, estado } : inc)
      setIncidencias(actualizadas)
      guardarIncidenciasDemo(actualizadas)
      return
    }
    const token = localStorage.getItem("token")
    try {
      const respuesta = await fetch(`${API_BASE}/incidencias/cambiarEstado/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ estado })
      })
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
      const actualizada = await respuesta.json()
      setIncidencias(prev => prev.map(inc => inc.idIncidencia === actualizada.idIncidencia ? actualizada : inc))
    } catch (error) {
      console.error(error)
      alert("Error al cambiar el estado.")
    }
  }

  const formatearFecha = (fechaString) => {
    if (!fechaString) return ''
    const fecha = new Date(fechaString)
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha).replace(/\//g, '-')
  }

  const incidenciasFiltradas = incidencias.filter(incidencia => {
    const coincideEstado = filtroEstado === 'todos' || ESTADOS[incidencia.estado] === filtroEstado
    const fechaFormateada = formatearFecha(incidencia.fecha).toLowerCase()
    const coincideBusqueda = fechaFormateada.includes(busqueda.toLowerCase()) ||
      (incidencia.titulo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (incidencia.direccionTexto || '').toLowerCase().includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })

  return (
    <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: 'var(--color-bg)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px' }}>Gestionar Incidencias</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Administra, edita y actualiza el estado de las incidencias registradas
      </p>

      {/* Formulario de edición */}
      {editando && (
        <div style={{ background: 'var(--color-bg-white)', border: '2px solid var(--color-eco-primary, #2E7D32)', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(46,125,50,0.1)' }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 700 }}>Editar Incidencia</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Categoría</label>
              <select value={formulario.titulo} onChange={e => setFormulario(f => ({ ...f, titulo: e.target.value }))} style={inputStyle}>
                <option value="">-- Selecciona --</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Estado</label>
              <select value={formulario.estado} onChange={e => setFormulario(f => ({ ...f, estado: e.target.value }))} style={inputStyle}>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="RESUELTO">Resuelto</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Descripción</label>
              <textarea value={formulario.descripcion} onChange={e => setFormulario(f => ({ ...f, descripcion: e.target.value }))} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Dirección</label>
              <input value={formulario.direccionTexto} onChange={e => setFormulario(f => ({ ...f, direccionTexto: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button onClick={() => setEditando(null)} style={{ ...btnBase, background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>Cancelar</button>
            <button onClick={handleEditar} style={{ ...btnBase, background: 'var(--color-eco-primary, #2E7D32)', color: '#fff' }}>Guardar Cambios</button>
          </div>
        </div>
      )}

      {/* Buscador y filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Buscar por fecha, título o ubicación..."
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ ...inputStyle, maxWidth: '350px' }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ key: 'todos', label: 'Todos', color: 'var(--color-text)' }, { key: 'pending', label: 'Pendientes', color: '#E65100' }, { key: 'in-progress', label: 'En Proceso', color: '#1565C0' }, { key: 'resolved', label: 'Resueltos', color: '#2E7D32' }].map(f => (
            <button key={f.key} onClick={() => setFiltroEstado(f.key)} style={{
              ...btnBase,
              background: filtroEstado === f.key ? f.color : 'var(--color-bg-white)',
              color: filtroEstado === f.key ? '#fff' : 'var(--color-text)',
              border: filtroEstado === f.key ? 'none' : '1px solid var(--color-border)',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Tarjetas */}
      {incidenciasFiltradas.length === 0 ? (
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>No se encontraron incidencias.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {incidenciasFiltradas.map(incidencia => {
            const cfg = ESTADO_CONFIG[incidencia.estado] || ESTADO_CONFIG.PENDIENTE
            return (
              <div key={incidencia.idIncidencia} style={{
                background: 'var(--color-bg-white)', border: '1px solid var(--color-border)',
                borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: '20px',
              }}>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>{incidencia.titulo}</h3>
                    <span style={{
                      padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    }}>{cfg.label}</span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{incidencia.descripcion}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    <span>Fecha: {formatearFecha(incidencia.fecha)}</span>
                    <span>Ubicación: {incidencia.direccionTexto || 'No se sabe'}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {incidencia.estado !== 'RESUELTO' && (
                    <button onClick={() => setIncidenciaSeleccionada(incidencia)} style={{ ...btnBase, background: 'var(--color-eco-primary, #2E7D32)', color: '#fff', whiteSpace: 'nowrap' }}>
                      Cambiar estado
                    </button>
                  )}
                  <button onClick={() => abrirEditar(incidencia)} style={{ ...btnBase, background: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9' }}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(incidencia.idIncidencia)} style={{ ...btnBase, background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A' }}>
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {incidenciaSeleccionada && (
        <ChangeStateConfirmModal
          onConfirm={() => handleCambioEstadoIncidencia(incidenciaSeleccionada.idIncidencia, incidenciaSeleccionada.estado)}
          onCancel={() => setIncidenciaSeleccionada(null)}
          estado={incidenciaSeleccionada.estado}
        />
      )}
    </main>
  )
}
