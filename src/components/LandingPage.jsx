import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './ui/Button'
import logo from '../assets/LOGO ECOSOLIDO.png'

const modulosCiudadano = [
  {
    icono: '📝',
    titulo: 'Registrar Incidencia',
    descripcion: 'Reporta problemas ambientales con fotos, descripción automática por IA y ubicación en mapa interactivo.'
  },
  {
    icono: '📍',
    titulo: 'Seguimiento',
    descripcion: 'Consulta el estado de tus reportes: Pendiente → En Proceso → Resuelto.'
  },
  {
    icono: '🎓',
    titulo: 'Educación Ambiental',
    descripcion: 'Aprende sobre cuidado del medio ambiente con contenido educativo.'
  },
  {
    icono: '🏆',
    titulo: 'Insignias y Recompensas',
    descripcion: 'Gana puntos e insignias por tu participación activa en la comunidad.'
  }
]

const modulosAdmin = [
  {
    icono: '📊',
    titulo: 'Dashboard',
    descripcion: 'Visualiza estadísticas y métricas de todas las incidencias registradas.'
  },
  {
    icono: '🔧',
    titulo: 'Gestionar Incidencias',
    descripcion: 'Edita, actualiza el estado y administra todas las incidencias del sistema.'
  },
  {
    icono: '👥',
    titulo: 'Gestionar Ciudadanos',
    descripcion: 'Administra los ciudadanos registrados en la plataforma.'
  },
  {
    icono: '📄',
    titulo: 'Reportes',
    descripcion: 'Genera reportes detallados en PDF y Excel por ciudadano.'
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg, #f0f7f0)' }}>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-5 py-16 max-md:py-10">
        <img src={logo} alt="EcoSolido" className="w-28 h-28 object-contain mb-5 max-md:w-20 max-md:h-20" />
        <h1 className="text-4xl font-bold mb-3 text-eco-text max-md:text-2xl max-sm:text-xl">
          🌿 EcoSolido
        </h1>
        <p className="text-lg text-eco-text-secondary max-w-[600px] mb-8 max-md:text-base max-sm:text-sm">
          Plataforma ciudadana para el reporte, seguimiento y gestión de incidencias ambientales.
          Cuidamos nuestro entorno juntos.
        </p>

        {isAuthenticated ? (
          <Button variant="primary" size="lg" onClick={() => navigate(user?.rol === 'ADMIN' ? '/dashboard' : '/registro')}>
            Ir al panel
          </Button>
        ) : (
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/registrarse')}>
              Crear Cuenta
            </Button>
          </div>
        )}
      </section>

      {/* Módulos Ciudadano */}
      <section className="px-5 py-10 max-w-[900px] mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-eco-text max-md:text-xl">
          🟢 Módulos del Ciudadano
        </h2>
        <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
          {modulosCiudadano.map((mod, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
              style={{ background: 'var(--card-bg, #ffffff)' }}
            >
              <span className="text-3xl mb-3 block">{mod.icono}</span>
              <h3 className="text-lg font-semibold mb-2 text-eco-text">{mod.titulo}</h3>
              <p className="text-sm text-eco-text-secondary leading-relaxed m-0">{mod.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos Admin */}
      <section className="px-5 py-10 max-w-[900px] mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-eco-text max-md:text-xl">
          🔴 Módulos del Administrador
        </h2>
        <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
          {modulosAdmin.map((mod, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
              style={{ background: 'var(--card-bg, #ffffff)' }}
            >
              <span className="text-3xl mb-3 block">{mod.icono}</span>
              <h3 className="text-lg font-semibold mb-2 text-eco-text">{mod.titulo}</h3>
              <p className="text-sm text-eco-text-secondary leading-relaxed m-0">{mod.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="text-center px-5 py-12">
        <h2 className="text-xl font-bold mb-3 text-eco-text">¿Listo para hacer la diferencia?</h2>
        <p className="text-eco-text-secondary mb-6 max-sm:text-sm">
          Regístrate gratis y comienza a reportar incidencias ambientales en tu comunidad.
        </p>
        {!isAuthenticated && (
          <Button variant="primary" size="lg" onClick={() => navigate('/registrarse')}>
            Registrarse Ahora
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-eco-text-secondary border-t border-gray-200">
        © 2025 EcoSolido — Cuidamos el medio ambiente juntos 🌱
      </footer>
    </div>
  )
}
