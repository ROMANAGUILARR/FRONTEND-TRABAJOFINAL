import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './ui/Button'
import { IconUsuario } from './icons'
import logo from '../assets/LOGO ECOSOLIDO.png'
import './LandingPage.css'

const pasos = [
  {
    num: '01',
    titulo: 'Reporta',
    desc: 'Toma fotos de la incidencia, describe el problema y marca la ubicación exacta en el mapa.',
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-paso-icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    )
  },
  {
    num: '02',
    titulo: 'Seguimiento',
    desc: 'Tu reporte se asigna automáticamente a una cuadrilla. Consulta el estado en tiempo real.',
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-paso-icon">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  },
  {
    num: '03',
    titulo: 'Resolución',
    desc: 'La cuadrilla atiende la incidencia. Recibes notificación cuando se resuelve.',
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-paso-icon">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  {
    num: '04',
    titulo: 'Recompensa',
    desc: 'Ganas ecopuntos e insignias por cada aporte. Canjéalas por beneficios.',
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-paso-icon">
        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    )
  }
]

const modulosCiudadano = [
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    titulo: 'Registrar Incidencia',
    descripcion: 'Reporta problemas ambientales con fotos, descripción automática por IA y ubicación exacta en mapa interactivo.',
    color: '#2E7D32'
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    titulo: 'Seguimiento en Tiempo Real',
    descripcion: 'Consulta el estado de tus reportes: Pendiente → En Proceso → Resuelto con trazabilidad completa.',
    color: '#1565C0'
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    titulo: 'Educación Ambiental',
    descripcion: 'Accede a contenido educativo sobre cuidado del medio ambiente y mejores prácticas ecológicas.',
    color: '#00838F'
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    titulo: 'Insignias y Recompensas',
    descripcion: 'Gana ecopuntos e insignias por cada aporte. Tu participación activa tiene recompensa.',
    color: '#E65100'
  }
]

const modulosAdmin = [
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    titulo: 'Dashboard Estadístico',
    descripcion: 'Visualiza métricas, gráficos y tendencias de todas las incidencias registradas.',
    color: '#2E7D32'
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    titulo: 'Gestionar Incidencias',
    descripcion: 'Edita, actualiza el estado y administra todas las incidencias del sistema.',
    color: '#1565C0'
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    titulo: 'Gestionar Ciudadanos',
    descripcion: 'Administra los ciudadanos registrados, consulta su historial y gestiona permisos.',
    color: '#6A1B9A'
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-card-icon">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    titulo: 'Reportes PDF y Excel',
    descripcion: 'Genera reportes detallados exportables en PDF y Excel por ciudadano o por periodo.',
    color: '#BF360C'
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, login } = useAuth()

  async function handleDemo() {
    const result = await login('GASPER', 'Palacios10')
    if (result.success) {
      navigate(result.rol === 'ADMIN' ? '/ciudadanos' : '/registro')
    }
  }

  return (
    <div className="lp">
      {/* ===== NAVBAR ===== */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-nav-brand">
            <img src={logo} alt="EcoSolido" className="lp-nav-logo" />
            <span className="lp-nav-name">EcoSolido</span>
          </div>
          <div className="lp-nav-actions">
            {isAuthenticated ? (
              <Button variant="primary" size="md" onClick={() => navigate(user?.rol === 'ADMIN' ? '/ciudadanos' : '/registro')}>
                Ir al Panel
              </Button>
            ) : (
              <>
                <Button variant="link" size="md" onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/registrarse')}>
                  <IconUsuario /> Crear Cuenta
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-hero-badge">🌱 Plataforma ciudadana ambiental activa</span>
            <h1 className="lp-hero-title">
              Reporta incidencias ambientales y cuida tu ciudad
            </h1>
            <p className="lp-hero-desc">
              Registra acúmulos de basura, agua contaminada o quemas ilegales con fotos
              y ubicación exacta. Coordina cuadrillas de atención inmediata y gana
              ecopuntos por tu compromiso.
            </p>
            <div className="lp-hero-btns">
              {isAuthenticated ? (
                <Button variant="primary" size="lg" onClick={() => navigate(user?.rol === 'ADMIN' ? '/ciudadanos' : '/registro')}>
                  Ir al Panel
                </Button>
              ) : (
                <>
                  <Button variant="primary" size="lg" onClick={() => navigate('/registrarse')}>
                    Comenzar Ahora
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                    Ya tengo cuenta
                  </Button>
                </>
              )}
            </div>
            {!isAuthenticated && (
              <button className="lp-demo-link" onClick={handleDemo}>
                Ver módulos en modo demo →
              </button>
            )}
          </div>

          {/* Stats panel derecho */}
          <div className="lp-hero-stats">
            <div className="lp-hero-stat">
              <span className="lp-hero-stat-num">1,420</span>
              <span className="lp-hero-stat-label">RESUELTAS ESTE MES</span>
            </div>
            <div className="lp-hero-stat">
              <span className="lp-hero-stat-num">94%</span>
              <span className="lp-hero-stat-label">EFECTIVIDAD CUADRILLAS</span>
            </div>
            <div className="lp-hero-stat">
              <span className="lp-hero-stat-num">+18.5k</span>
              <span className="lp-hero-stat-label">ECOPUNTOS OTORGADOS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="lp-pasos">
        <div className="lp-pasos-inner">
          <h2 className="lp-section-title">¿Cómo funciona EcoSolido?</h2>
          <p className="lp-section-subtitle">Cuatro pasos simples para hacer la diferencia en tu comunidad</p>
          <div className="lp-pasos-grid">
            {pasos.map((p, i) => (
              <div key={i} className="lp-paso">
                <div className="lp-paso-icon-wrap">
                  {p.icono}
                </div>
                <span className="lp-paso-num">Paso {p.num}</span>
                <h3 className="lp-paso-titulo">{p.titulo}</h3>
                <p className="lp-paso-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MÓDULOS CIUDADANO ===== */}
      <section className="lp-modulos">
        <div className="lp-modulos-inner">
          <h2 className="lp-section-title">Módulos del Ciudadano</h2>
          <p className="lp-section-subtitle">Todo lo que necesitas como participante del programa</p>
          <div className="lp-cards-grid">
            {modulosCiudadano.map((mod, i) => (
              <div key={i} className="lp-card" style={{ '--card-accent': mod.color }}>
                <div className="lp-card-icon-wrap" style={{ background: mod.color + '12', color: mod.color }}>
                  {mod.icono}
                </div>
                <h3 className="lp-card-titulo">{mod.titulo}</h3>
                <p className="lp-card-desc">{mod.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MÓDULOS ADMIN ===== */}
      <section className="lp-modulos lp-modulos--alt">
        <div className="lp-modulos-inner">
          <h2 className="lp-section-title">Módulos del Administrador</h2>
          <p className="lp-section-subtitle">Herramientas de gestión y control para el equipo administrativo</p>
          <div className="lp-cards-grid">
            {modulosAdmin.map((mod, i) => (
              <div key={i} className="lp-card" style={{ '--card-accent': mod.color }}>
                <div className="lp-card-icon-wrap" style={{ background: mod.color + '12', color: mod.color }}>
                  {mod.icono}
                </div>
                <h3 className="lp-card-titulo">{mod.titulo}</h3>
                <p className="lp-card-desc">{mod.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <section className="lp-stats">
        <div className="lp-stats-inner">
          <div className="lp-stat">
            <span className="lp-stat-num">1,200+</span>
            <span className="lp-stat-label">Incidencias reportadas</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat-num">850+</span>
            <span className="lp-stat-label">Ciudadanos activos</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat-num">94%</span>
            <span className="lp-stat-label">Incidencias resueltas</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat-num">15+</span>
            <span className="lp-stat-label">Distritos atendidos</span>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-title">¿Listo para hacer la diferencia?</h2>
          <p className="lp-cta-desc">
            Únete a la comunidad EcoSolido y comienza a reportar incidencias ambientales en tu zona.
          </p>
          {!isAuthenticated && (
            <div className="lp-cta-btns">
              <Button variant="primary" size="lg" onClick={() => navigate('/registrarse')}>
                Registrarse Gratis
              </Button>
              <Button variant="secondary" size="lg" onClick={handleDemo}>
                Probar Demo
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <img src={logo} alt="EcoSolido" className="lp-footer-logo" />
            <span>EcoSolido</span>
          </div>
          <p className="lp-footer-copy">© {new Date().getFullYear()} EcoSolido — Juntos por una ciudad más limpia 🌱</p>
        </div>
      </footer>
    </div>
  )
}
