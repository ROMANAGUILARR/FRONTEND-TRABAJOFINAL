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
              borderRadius: '12px', padding: '20px 24px', marginTop: '16px',
              boxShadow: '0 4px 12px rgba(46,125,50,0.1)',
            }}>
              {/* Encabezado en una línea */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1rem', fontWeight: 700 }}>
                  Resumen de {usuarioSeleccionado.nombreCompleto} {usuarioSeleccionado.apellidoCompleto}:
                </h4>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>
                  {usuarioSeleccionado.puntos ?? 0} puntos acumulados
                </span>
              </div>

              {/* Insignias - desbloqueo dinámico según cantidad de incidencias */}
              <h5 style={{ margin: '0 0 12px', color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Insignias
              </h5>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(() => {
                  const numIncidencias = (MOCK_INCIDENCIAS_POR_USUARIO[usuarioSeleccionado.idUsuario] || []).length
                  return MOCK_INSIGNIAS.map(insignia => {
                    const desbloqueada = numIncidencias >= insignia.requisitoIncidencias
                    return (
                      <div key={insignia.idInsignia} style={{
                        background: desbloqueada ? 'var(--color-accent-green-light, #e8f5e9)' : '#f0f0f0',
                        border: desbloqueada ? '1px solid #A5D6A7' : '1px solid #d0d0d0',
                        borderRadius: '10px', padding: '12px 16px', minWidth: '180px', flex: '1',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: desbloqueada ? '#2E7D32' : '#bdbdbd',
                            color: '#fff', fontSize: '0.7rem',
                          }}>
                            <i className={desbloqueada ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}></i>
                          </span>
                          <strong style={{ fontSize: '0.85rem', color: desbloqueada ? 'var(--color-text)' : '#9e9e9e' }}>{insignia.nombre}</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: desbloqueada ? 'var(--color-text-secondary)' : '#bdbdbd' }}>
                          {insignia.descripcion}
                        </p>
                        {!desbloqueada && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#bdbdbd' }}>
                            Requiere {insignia.requisitoIncidencias} incidencias ({numIncidencias}/{insignia.requisitoIncidencias})
                          </p>
                        )}
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
