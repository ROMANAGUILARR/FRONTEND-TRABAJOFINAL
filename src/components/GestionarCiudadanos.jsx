import { useState, useEffect } from 'react'
import { obtenerUsuarios, obtenerIncidenciasPorUsuario } from '../services/incidenciasApi'
import './ManejarIncidencias.css'
import ReporteIncidencias from './ReporteIncidencias'

const ESTADO_BADGE = {
  PENDIENTE: 'admin-badge--pending',
  EN_PROCESO: 'admin-badge--progress',
  RESUELTO: 'admin-badge--resolved',
}

const ESTADO_LABEL = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  RESUELTO: 'Resuelto',
}

export default function GestionarCiudadanos() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('TODOS')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [incidenciasUsuario, setIncidenciasUsuario] = useState([])
  const [cargandoIncidencias, setCargandoIncidencias] = useState(false)
  const [mostrandoReporte, setMostrandoReporte] = useState(false)
  const [usuarioReporte, setUsuarioReporte] = useState(null)
  const [incidenciasReporte, setIncidenciasReporte] = useState([])

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const data = await obtenerUsuarios()
        setUsuarios(data)
      } catch (err) {
        console.error('Error al cargar usuarios:', err)
        setUsuarios([])
      } finally {
        setCargando(false)
      }
    }
    cargarUsuarios()
  }, [])

  async function verRegistros(usuario) {
    if (usuarioSeleccionado?.idUsuario === usuario.idUsuario) {
      setUsuarioSeleccionado(null)
      setIncidenciasUsuario([])
      return
    }
    setUsuarioSeleccionado(usuario)
    setCargandoIncidencias(true)
    try {
      const data = await obtenerIncidenciasPorUsuario(usuario.idUsuario)
      setIncidenciasUsuario(data)
    } catch (err) {
      console.error('Error al cargar incidencias:', err)
      setIncidenciasUsuario([])
    } finally {
      setCargandoIncidencias(false)
    }
  }

  async function abrirReporte(usuario) {
    setUsuarioReporte(usuario)
    try {
      const data = await obtenerIncidenciasPorUsuario(usuario.idUsuario)
      setIncidenciasReporte(data)
    } catch {
      setIncidenciasReporte([])
    }
    setMostrandoReporte(true)
  }

  const formatearFecha = (fechaString) => {
    if (!fechaString) return ''
    const fecha = new Date(fechaString)
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha).replace(/\//g, '-')
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideRol = filtroRol === 'TODOS' || u.rol === filtroRol
    const texto = busqueda.toLowerCase()
    const coincideBusqueda =
      (u.nombreCompleto || '').toLowerCase().includes(texto) ||
      (u.apellidoCompleto || '').toLowerCase().includes(texto) ||
      (u.dni || '').includes(texto) ||
      (u.correoElectronico || '').toLowerCase().includes(texto) ||
      (u.nombreUsuario || '').toLowerCase().includes(texto)
    return coincideRol && coincideBusqueda
  })

  const totalCiudadanos = usuarios.filter(u => u.rol === 'CIUDADANO').length
  const totalAdmins = usuarios.filter(u => u.rol === 'ADMIN').length

  return (
    <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: 'var(--color-bg)' }}>

      {mostrandoReporte && usuarioReporte ? (
        <ReporteIncidencias
          usuario={usuarioReporte}
          incidencias={incidenciasReporte}
          onVolver={() => { setMostrandoReporte(false); setUsuarioReporte(null) }}
        />
      ) : (
      <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px' }}>
        Gestión de Ciudadanos
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Visualiza los ciudadanos registrados y sus incidencias
      </p>

      {/* Métricas */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Usuarios', value: usuarios.length, color: 'var(--color-text)' },
          { label: 'Ciudadanos', value: totalCiudadanos, color: '#000000' },
          { label: 'Administradores', value: totalAdmins, color: 'var(--color-text)' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 24px', flex: '1', minWidth: '150px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>{m.label}</span>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: m.color, margin: '4px 0 0' }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Buscador y filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Buscar por nombre, DNI, email o usuario..."
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="admin-input" style={{ flex: 1, minWidth: '250px' }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {['TODOS', 'CIUDADANO', 'ADMIN'].map(rol => (
            <button key={rol} onClick={() => setFiltroRol(rol)} className="admin-btn" style={{
              background: filtroRol === rol ? 'var(--color-eco-primary, #2E7D32)' : 'var(--color-bg-white)',
              color: filtroRol === rol ? '#fff' : 'var(--color-text)',
              border: filtroRol === rol ? 'none' : '1px solid var(--color-border)',
            }}>
              {rol === 'TODOS' ? 'Todos' : rol === 'CIUDADANO' ? 'Ciudadanos' : 'Admins'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {cargando ? (
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '40px' }}>Cargando usuarios...</p>
      ) : usuariosFiltrados.length === 0 ? (
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No se encontraron usuarios.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {usuariosFiltrados.map(usuario => {
            const isSelected = usuarioSeleccionado?.idUsuario === usuario.idUsuario
            return (
              <div key={usuario.idUsuario}>
                {/* Tarjeta de usuario */}
                <div style={{
                  background: 'var(--color-bg-white)', border: isSelected ? '2px solid var(--color-eco-primary, #2E7D32)' : '1px solid var(--color-border)',
                  borderRadius: '12px', padding: '20px 24px', boxShadow: isSelected ? '0 4px 12px rgba(46,125,50,0.1)' : '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', gap: '20px',
                }}>
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {usuario.nombreCompleto} {usuario.apellidoCompleto}
                      </h3>
                      <span className={`admin-badge ${usuario.rol === 'ADMIN' ? 'admin-badge--progress' : 'admin-badge--resolved'}`}>{usuario.rol}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                      <span>DNI: <strong style={{ color: 'var(--color-text)' }}>{usuario.dni}</strong></span>
                      <span>Tel: <strong style={{ color: 'var(--color-text)' }}>{usuario.telefono}</strong></span>
                      <span>Email: <strong style={{ color: 'var(--color-text)' }}>{usuario.correoElectronico}</strong></span>
                      <span>Usuario: <strong style={{ color: 'var(--color-text)' }}>{usuario.nombreUsuario}</strong></span>
                      <span>Puntos: <strong style={{ color: 'var(--color-eco-primary, #2E7D32)' }}>{usuario.puntos}</strong></span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => verRegistros(usuario)} className={`admin-btn ${isSelected ? 'admin-btn--primary' : ''}`} style={{
                    background: isSelected ? undefined : '#E8F5E9',
                    color: isSelected ? undefined : '#2E7D32',
                    border: isSelected ? undefined : '1px solid #A5D6A7',
                  }}>
                    {isSelected ? 'Ocultar Registros' : 'Ver Registros'}
                  </button>
                  <button onClick={() => abrirReporte(usuario)} className="admin-btn admin-btn--edit">
                    Reporte
                  </button>
                  </div>
                </div>

                {/* Panel de registros */}
                {isSelected && (
                  <div style={{
                    background: 'var(--color-bg-white)', border: '2px solid var(--color-eco-primary, #2E7D32)',
                    borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '20px 24px',
                    marginTop: '-1px', boxShadow: '0 4px 12px rgba(46,125,50,0.1)',
                  }}>
                    <h4 style={{ margin: '0 0 12px', color: 'var(--color-text)', fontSize: '0.95rem' }}>
                      Registros de {usuario.nombreCompleto} {usuario.apellidoCompleto}
                    </h4>
                    {cargandoIncidencias ? (
                      <p style={{ color: 'var(--color-text-secondary)' }}>Cargando registros...</p>
                    ) : incidenciasUsuario.length === 0 ? (
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Este usuario no tiene registros de incidencias.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {incidenciasUsuario.map(inc => {
                          const badgeClass = ESTADO_BADGE[inc.estado] || 'admin-badge--pending'
                          const badgeLabel = ESTADO_LABEL[inc.estado] || inc.estado
                          return (
                          <div key={inc.id} style={{
                            padding: '12px 16px', border: '1px solid var(--color-border)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px',
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{inc.categoria}</strong>
                                <span className={'admin-badge ' + badgeClass}>
                                  {badgeLabel}
                                </span>
                              </div>
                              <p style={{ margin: '0', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>{inc.descripcion}</p>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                                {formatearFecha(inc.fecha)} — {inc.direccionTexto || 'Sin ubicación'}
                              </span>
                            </div>
                          </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      </>
      )}
    </main>
  )
}
