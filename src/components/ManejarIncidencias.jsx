import { useState, useEffect } from 'react'
import './SeguimientoIncidencias.css'
import ChangeStateConfirmModal from './ChangeStateConfirmModal'

const ESTADOS = {
  PENDIENTE: 'pending',
  EN_PROCESO: 'in-progress',
  RESUELTO: 'resolved'
}

const CLASES_ESTADO = {
  pending: 'estado--pending',
  'in-progress': 'estado--progress',
  resolved: 'estado--resolved'
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

export default function ManejarIncidencias() {
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const [busqueda, setBusqueda] = useState('')
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({ titulo: '', descripcion: '', estado: 'PENDIENTE', direccionTexto: '' })

  useEffect(() => {
    async function mostrarIncidencias() {
      if (esDemo()) {
        setIncidencias(leerIncidenciasDemo())
        return
      }
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE}/incidencias/mostrarT`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        setIncidencias(data)
      } catch (error) {
        console.error('Error al obtener incidencias', error)
        setIncidencias([])
      }
    }
    mostrarIncidencias()
  }, [])

  function handleCrear() {
    if (!formulario.titulo || !formulario.descripcion) {
      alert('Completa todos los campos obligatorios.')
      return
    }
    const nueva = {
      idIncidencia: Date.now(),
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      estado: formulario.estado,
      fecha: new Date().toISOString().split('T')[0],
      direccionTexto: formulario.direccionTexto
    }
    const actualizadas = [...incidencias, nueva]
    setIncidencias(actualizadas)
    if (esDemo()) guardarIncidenciasDemo(actualizadas)
    setFormulario({ titulo: '', descripcion: '', estado: 'PENDIENTE', direccionTexto: '' })
    setMostrarFormulario(false)
    window.dispatchEvent(new Event('incidencia-registrada'))
  }

  function handleEditar() {
    if (!formulario.titulo || !formulario.descripcion) {
      alert('Completa todos los campos obligatorios.')
      return
    }
    const actualizadas = incidencias.map(inc =>
      inc.idIncidencia === editando.idIncidencia
        ? { ...inc, titulo: formulario.titulo, descripcion: formulario.descripcion, estado: formulario.estado, direccionTexto: formulario.direccionTexto }
        : inc
    )
    setIncidencias(actualizadas)
    if (esDemo()) guardarIncidenciasDemo(actualizadas)
    setEditando(null)
    setFormulario({ titulo: '', descripcion: '', estado: 'PENDIENTE', direccionTexto: '' })
  }

  function handleEliminar(id) {
    if (!confirm('¿Estás seguro de eliminar esta incidencia?')) return
    const actualizadas = incidencias.filter(inc => inc.idIncidencia !== id)
    setIncidencias(actualizadas)
    if (esDemo()) guardarIncidenciasDemo(actualizadas)
  }

  function abrirEditar(incidencia) {
    setEditando(incidencia)
    setFormulario({
      titulo: incidencia.titulo,
      descripcion: incidencia.descripcion,
      estado: incidencia.estado,
      direccionTexto: incidencia.direccionTexto || ''
    })
    setMostrarFormulario(false)
  }

  function abrirCrear() {
    setEditando(null)
    setFormulario({ titulo: '', descripcion: '', estado: 'PENDIENTE', direccionTexto: '' })
    setMostrarFormulario(true)
  }

  async function handleCambioEstadoIncidencia(id, estado) {
    setIncidenciaSeleccionada(null)
    if (esDemo()) {
      const actualizadas = incidencias.map(inc =>
        inc.idIncidencia === id ? { ...inc, estado } : inc
      )
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
    const coincideBusqueda =
      fechaFormateada.includes(busqueda.toLowerCase()) ||
      (incidencia.titulo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (incidencia.direccionTexto || '').toLowerCase().includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })

  return (
    <main className="seguimiento">
      <h2 className="seguimiento__title">Gestionar Incidencias</h2>

      <div style={{ marginBottom: '16px' }}>
        <button className="seguimiento__cambio-btn" onClick={abrirCrear}>+ Nueva Incidencia</button>
      </div>

      {(mostrarFormulario || editando) && (
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', color: 'var(--color-text)' }}>{editando ? 'Editar Incidencia' : 'Nueva Incidencia'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select
              value={formulario.titulo}
              onChange={e => setFormulario(f => ({ ...f, titulo: e.target.value }))}
              style={{ padding: '8px', border: '2px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-bg-white)', color: 'var(--color-text)' }}
            >
              <option value="">-- Selecciona categoría --</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea
              placeholder="Descripción *"
              value={formulario.descripcion}
              onChange={e => setFormulario(f => ({ ...f, descripcion: e.target.value }))}
              style={{ padding: '8px', border: '2px solid var(--color-border)', borderRadius: '6px', minHeight: '80px', background: 'var(--color-bg-white)', color: 'var(--color-text)' }}
            />
            <input
              placeholder="Dirección"
              value={formulario.direccionTexto}
              onChange={e => setFormulario(f => ({ ...f, direccionTexto: e.target.value }))}
              style={{ padding: '8px', border: '2px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-bg-white)', color: 'var(--color-text)' }}
            />
            <select
              value={formulario.estado}
              onChange={e => setFormulario(f => ({ ...f, estado: e.target.value }))}
              style={{ padding: '8px', border: '2px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-bg-white)', color: 'var(--color-text)' }}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="RESUELTO">Resuelto</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="seguimiento__cambio-btn" onClick={editando ? handleEditar : handleCrear}>
                {editando ? 'Guardar Cambios' : 'Crear Incidencia'}
              </button>
              <button className="seguimiento__filtro-btn" onClick={() => { setMostrarFormulario(false); setEditando(null) }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="seguimiento__controls">
        <div className="seguimiento__search">
          <input type="text" placeholder="Buscar por fecha, titulo o ubicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="seguimiento__search-input" />
        </div>
        <div className="seguimiento__filtros">
          <button className={`seguimiento__filtro-btn ${filtroEstado === 'todos' ? 'seguimiento__filtro-btn--active' : ''}`} onClick={() => setFiltroEstado('todos')}>Todos</button>
          <button className={`seguimiento__filtro-btn ${filtroEstado === 'pending' ? 'seguimiento__filtro-btn--active' : ''}`} onClick={() => setFiltroEstado('pending')}>Pendientes</button>
          <button className={`seguimiento__filtro-btn ${filtroEstado === 'in-progress' ? 'seguimiento__filtro-btn--active' : ''}`} onClick={() => setFiltroEstado('in-progress')}>En Proceso</button>
          <button className={`seguimiento__filtro-btn ${filtroEstado === 'resolved' ? 'seguimiento__filtro-btn--active' : ''}`} onClick={() => setFiltroEstado('resolved')}>Resueltos</button>
        </div>
      </div>

      <div className="seguimiento__lista">
        {incidenciasFiltradas.length === 0 ? (
          <div className="seguimiento__vacio"><p>No se encontraron incidencias.</p></div>
        ) : (
          <div className="seguimiento__tarjetas">
            {incidenciasFiltradas.map(incidencia => (
              <div key={incidencia.idIncidencia} className="incidencia-tarjeta">
                <div className="incidencia-tarjeta__header">
                  <h3 className="incidencia-tarjeta__titulo">{incidencia.titulo}</h3>
                  <span className={`incidencia-tarjeta__estado ${CLASES_ESTADO[ESTADOS[incidencia.estado]] || ''}`}>{incidencia.estado}</span>
                </div>
                <p className="incidencia-tarjeta__fecha">Fecha: {formatearFecha(incidencia.fecha)}</p>
                <p className="incidencia-tarjeta__descripcion">{incidencia.descripcion}</p>
                <p className="incidencia-tarjeta__ubicacion">Ubicación: {incidencia.direccionTexto || 'No se sabe'}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {incidencia.estado !== 'RESUELTO' && (
                    <button className="seguimiento__cambio-btn" onClick={() => setIncidenciaSeleccionada(incidencia)}>Cambiar estado</button>
                  )}
                  <button
                    className="seguimiento__filtro-btn"
                    style={{ background: 'var(--color-btn-warning)', color: 'white', border: 'none' }}
                    onClick={() => abrirEditar(incidencia)}
                  >Editar</button>
                  <button
                    className="seguimiento__filtro-btn"
                    style={{ background: 'var(--color-btn-danger)', color: 'white', border: 'none' }}
                    onClick={() => handleEliminar(incidencia.idIncidencia)}
                  >Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
