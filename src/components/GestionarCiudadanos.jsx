import { useState, useEffect } from 'react'
import { obtenerUsuarios, obtenerIncidenciasPorUsuario } from '../services/incidenciasApi'
import { MOCK_INCIDENCIAS_POR_USUARIO, MOCK_INSIGNIAS } from '../services/mockData'
import { ESTADO_BADGE, ESTADO_LABEL, formatearFecha } from '../utils/incidenciaConstants'
import './ManejarIncidencias.css'
import ReporteIncidencias from './ReporteIncidencias'

const ITEMS_POR_PAGINA = 10

function esDemo() {
  const token = localStorage.getItem('token')
  return token === 'demo-token' || token === 'demo-token-admin'
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
  const [paginaActual, setPaginaActual] = useState(1)

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

  // Reset page to 1 when filters change
  useEffect(() => {
    setPaginaActual(1)
  }, [filtroRol, busqueda])

  async function verResumen(usuario) {
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

  function obtenerConteoIncidencias(usuarioId) {
    if (esDemo()) {
      return (MOCK_INCIDENCIAS_POR_USUARIO[usuarioId] || []).length
    }
    return 0
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

  // Pagination
  const totalPaginas = Math.ceil(usuariosFiltrados.length / ITEMS_POR_PAGINA)
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  )

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
      <div className="admin-metrics">
        <div className="admin-metric-card" style={{ borderLeftColor: '#2E7D32' }}>
          <span className="admin-metric-card__numero" style={{ color: '#2E7D32' }}>{usuarios.length}</span>
          <span className="admin-metric-card__label">Total Usuarios</span>
          <i className="fa-solid fa-users admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card" style={{ borderLeftColor: '#1565C0' }}>
          <span className="admin-metric-card__numero" style={{ color: '#1565C0' }}>{totalCiudadanos}</span>
          <span className="admin-metric-card__label">Ciudadanos</span>
          <i className="fa-solid fa-user admin-metric-card__icon"></i>
        </div>
        <div className="admin-metric-card" style={{ borderLeftColor: '#E65100' }}>
          <span className="admin-metric-card__numero" style={{ color: '#E65100' }}>{totalAdmins}</span>
          <span className="admin-metric-card__label">Administradores</span>
          <i className="fa-solid fa-user-shield admin-metric-card__icon"></i>
        </div>
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
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Incidencias</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.map((usuario, index) => {
                  const isSelected = usuarioSeleccionado?.idUsuario === usuario.idUsuario
                  const conteo = obtenerConteoIncidencias(usuario.idUsuario)
                  return (
                    <tr key={usuario.idUsuario}>
                      <td>{(paginaActual - 1) * ITEMS_POR_PAGINA + index + 1}</td>
                      <td style={{ fontWeight: 500 }}>{usuario.nombreCompleto} {usuario.apellidoCompleto}</td>
                      <td>{usuario.dni}</td>
                      <td>{usuario.correoElectronico}</td>
                      <td>
                        <span className={`admin-badge ${usuario.rol === 'ADMIN' ? 'admin-badge--progress' : 'admin-badge--resolved'}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{conteo}</td>
                      <td>
                        <div className="admin-table__acciones">
                          <button onClick={() => verResumen(usuario)} className={`admin-btn ${isSelected ? 'admin-btn--primary' : ''}`} style={{
                            background: isSelected ? undefined : '#E8F5E9',
                            color: isSelected ? undefined : '#2E7D32',
                            border: isSelected ? undefined : '1px solid #A5D6A7',
                          }}>
                            {isSelected ? 'Ocultar' : 'Ver Resumen'}
                          </button>
                          <button onClick={() => abrirReporte(usuario)} className="admin-btn admin-btn--edit">
                            Reporte
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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

          {/* Panel de resumen */}
          {usuarioSeleccionado && (
            <div style={{
              background: 'var(--color-bg-white)', border: '2px solid var(--color-eco-primary, #2E7D32)',
              borderRadius: '16px', padding: '24px 28px', marginTop: '16px',
              boxShadow: '0 8px 24px rgba(46,125,50,0.12)',
            }}>
              {/* Encabezado */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.05rem', fontWeight: 700 }}>
                  Resumen de {usuarioSeleccionado.nombreCompleto} {usuarioSeleccionado.apellidoCompleto}:
                </h4>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2E7D32' }}>
                  {usuarioSeleccionado.puntos ?? 0}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  puntos acumulados
                </span>
              </div>

              {/* Insignias */}
              <h5 style={{ margin: '0 0 16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <i className="fa-solid fa-trophy" style={{ color: '#FF8F0F', marginRight: '8px' }}></i>
                Insignias
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                {(() => {
                  const numIncidencias = (MOCK_INCIDENCIAS_POR_USUARIO[usuarioSeleccionado.idUsuario] || []).length
                  return MOCK_INSIGNIAS.map((insignia, idx) => {
                    const desbloqueada = numIncidencias >= insignia.requisitoIncidencias
                    const progreso = Math.min(numIncidencias / insignia.requisitoIncidencias, 1)
                    const colores = [
                      { bg: '#e8f5e9', border: '#A5D6A7', icon: '#2E7D32' },
                      { bg: '#E3F2FD', border: '#90CAF9', icon: '#1565C0' },
                      { bg: '#FFF3E0', border: '#FFCC80', icon: '#E65100' },
                      { bg: '#F3E5F5', border: '#CE93D8', icon: '#7B1FA2' },
                      { bg: '#E0F2F1', border: '#80CBC4', icon: '#00695C' },
                    ]
                    const c = colores[idx % colores.length]
                    return (
                      <div key={insignia.idInsignia} style={{
                        background: desbloqueada ? c.bg : 'var(--color-bg, #fafafa)',
                        border: desbloqueada ? `2px solid ${c.border}` : '2px solid var(--color-border, #e0e0e0)',
                        borderRadius: '14px', padding: '16px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        {/* Fondo decorativo */}
                        {desbloqueada && (
                          <div style={{
                            position: 'absolute', top: '-20px', right: '-20px',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: c.border, opacity: 0.15,
                          }} />
                        )}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: '36px', height: '36px', borderRadius: '10px',
                              background: desbloqueada ? c.icon : 'var(--color-border, #bdbdbd)',
                              color: '#fff', fontSize: '0.9rem',
                            }}>
                              <i className={desbloqueada ? 'fa-solid fa-check' : 'fa-solid fa-lock'}></i>
                            </span>
                            <div>
                              <strong style={{ fontSize: '0.9rem', color: desbloqueada ? 'var(--color-text)' : 'var(--color-text-secondary, #9e9e9e)', display: 'block' }}>
                                {insignia.nombre}
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: desbloqueada ? c.icon : 'var(--color-border, #bdbdbd)', fontWeight: 600 }}>
                                {desbloqueada ? 'Desbloqueada' : `${numIncidencias}/${insignia.requisitoIncidencias} incidencias`}
                              </span>
                            </div>
                          </div>
                          <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: desbloqueada ? 'var(--color-text-secondary)' : 'var(--color-border, #bdbdbd)', lineHeight: 1.4 }}>
                            {insignia.descripcion}
                          </p>
                          {/* Barra de progreso */}
                          <div style={{
                            width: '100%', height: '6px', borderRadius: '3px',
                            background: desbloqueada ? `${c.border}40` : 'var(--color-border, #e0e0e0)',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${progreso * 100}%`, height: '100%', borderRadius: '3px',
                              background: desbloqueada ? c.icon : 'var(--color-text-secondary, #9e9e9e)',
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          )}
        </>
      )}
      </>
      )}
    </main>
  )
}
