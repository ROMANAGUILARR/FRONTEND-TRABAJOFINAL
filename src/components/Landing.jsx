import { useNavigate } from 'react-router-dom'
import { IconUsuario } from './icons'
import Button from './ui/Button'
import logo from '../assets/LOGO ECOSOLIDO.png'
import hero from '../assets/hero.png'
import './Landing.css'
import { useAuth } from '../hooks/useAuth'

export default function Landing() {
    const navigate = useNavigate()
    const { login } = useAuth()

    async function handleDemo() {
        const result = await login('demo', 'demo')
        if (result.success) {
            navigate(result.rol === 'ADMIN' ? '/dashboard' : '/registro')
        }
    }

    return (
        <div className="landing">
            {/* Header glassmorphism */}
            <header className="landing__header">
                <div className="landing__logo-container">
                    <img src={logo} alt="Logo EcoSolido" className="landing__logo-img" />
                    <span className="landing__logo-text">EcoSolido</span>
                </div>
                <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/login')}
                    className="landing__cuenta-btn"
                >
                    <IconUsuario />
                    <span>Cuenta</span>
                </Button>
            </header>

            <main className="landing__main">
                {/* Hero con gradiente verde */}
                <section className="landing__hero">
                    {/* Formas decorativas flotantes */}
                    <div className="landing__shape landing__shape--1" aria-hidden="true" />
                    <div className="landing__shape landing__shape--2" aria-hidden="true" />
                    <div className="landing__shape landing__shape--3" aria-hidden="true" />

                    <div className="landing__hero-inner">
                        <div className="landing__hero-content">
                            <span className="landing__badge">Por una ciudad más limpia</span>
                            <h1 className="landing__title">
                                Reporta incidencias ambientales y gana recompensas
                            </h1>
                            <p className="landing__subtitle">
                                Registra incidencias, sigue su resolución, aprende sobre el
                                medio ambiente y gana puntos e insignias por tu compromiso.
                            </p>
                            <div className="landing__actions">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => navigate('/login')}
                                    className="landing__btn-hero"
                                >
                                    Iniciar Sesión
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/registrarse')}
                                    className="landing__btn-outline"
                                >
                                    Registrarse
                                </Button>
                            </div>
                            <div className="landing__actions">
                                <Button variant="link" size="md" onClick={handleDemo} className="landing__btn-demo">
                                    Ver módulos (modo demo)
                                </Button>
                            </div>
                            <p className="landing__hint">
                                Para participar del programa, ingresa a tu cuenta o crea una nueva.
                            </p>
                        </div>
                        <div className="landing__hero-visual">
                            <img src={hero} alt="Ilustración EcoSolido" className="landing__hero-img" />
                        </div>
                    </div>
                </section>

                {/* Beneficios */}
                <section className="landing__features">
                    <h2 className="landing__features-title">¿Cómo funciona?</h2>
                    <div className="landing__features-grid">
                        <div className="landing__feature">
                            <div className="landing__feature-icon-wrap">
                                <span className="landing__feature-icon">📸</span>
                            </div>
                            <h3>Reporta</h3>
                            <p>Registra incidencias ambientales con fotos y ubicación en segundos.</p>
                        </div>
                        <div className="landing__feature">
                            <div className="landing__feature-icon-wrap">
                                <span className="landing__feature-icon">🌱</span>
                            </div>
                            <h3>Aprende</h3>
                            <p>Accede a educación ambiental y consejos para cuidar tu ciudad.</p>
                        </div>
                        <div className="landing__feature">
                            <div className="landing__feature-icon-wrap">
                                <span className="landing__feature-icon">🏅</span>
                            </div>
                            <h3>Recompénsate</h3>
                            <p>Gana puntos e insignias por cada aporte a tu comunidad.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="landing__footer">
                <div className="landing__footer-inner">
                    <div className="landing__footer-brand">
                        <img src={logo} alt="EcoSolido" className="landing__footer-logo" />
                        <span>EcoSolido</span>
                    </div>
                    <p>© {new Date().getFullYear()} EcoSolido — Juntos por una ciudad más limpia.</p>
                </div>
            </footer>
        </div>
    )
}