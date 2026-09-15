import { useState, useEffect } from 'react'
import { obtenerUsuarios } from '../services/incidenciasApi'

export default function GestionarCiudadanos() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('TODOS')

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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>
        Gestión de Ciudadanos
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
        Visualiza los ciudadanos registrados en la plataforma EcoSolido
      </p>

      {/* Métricas */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 24px', flex: '1', minWidth: '150px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Usuarios</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)', margin: '4px 0 0' }}>{usuarios.length}</p>
        </div>
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 24px', flex: '1', minWidth: '150px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Ciudadanos</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-eco-primary, #2E7D32)', margin: '4px 0 0' }}>{totalCiudadanos}</p>
        </div>
        <div style={{ background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 24px', flex: '1', minWidth: '150px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Administradores</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)', margin: '4px 0 0' }}>{totalAdmins}</p>
        </div>
      </div>

      {/* Buscador y filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, DNI, email o usuario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            flex: 1, minWidth: '250px', padding: '10px 14px',
            border: '2px solid var(--color-border)', borderRadius: '8px',
            background: 'var(--color-bg-white)', color: 'var(--color-text)',
            fontSize: '0.9rem', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {['TODOS', 'CIUDADANO', 'ADMIN'].map(rol => (
            <button
              key={rol}
              onClick={() => setFiltroRol(rol)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: filtroRol === rol ? 'var(--color-eco-primary, #2E7D32)' : 'var(--color-bg-white)',
                color: filtroRol === rol ? '#fff' : 'var(--color-text)',
                border: filtroRol === rol ? 'none' : '1px solid var(--color-border)',
              }}
            >
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {usuariosFiltrados.map(usuario => (
            <div
              key={usuario.idUsuario}
              style={{
                background: 'var(--color-bg-white)', border: '1px solid var(--color-border)',
                borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {usuario.nombreCompleto} {usuario.apellidoCompleto}
                </h3>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                  background: usuario.rol === 'ADMIN' ? 'var(--color-btn-ia, #37474F)' : 'var(--color-eco-primary, #2E7D32)',
                  color: '#fff',
                }}>
                  {usuario.rol}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>DNI: </span>
                  <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{usuario.dni}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Teléfono: </span>
                  <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{usuario.telefono}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Email: </span>
                  <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{usuario.correoElectronico}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Usuario: </span>
                  <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{usuario.nombreUsuario}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Puntos: </span>
                  <span style={{ color: 'var(--color-eco-primary, #2E7D32)', fontWeight: 700 }}>{usuario.puntos}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
