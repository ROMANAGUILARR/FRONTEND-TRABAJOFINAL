import { useNavigate } from 'react-router-dom'
import { IconUsuario } from './icons'
import Button from './ui/Button'
import logo from '../assets/LOGO ECOSOLIDO.png'
import hero from '../assets/hero.png'
import './Landing.css'

/**
 * Landing pública: primera pantalla que ve el usuario al entrar a la página.
 * Desde aquí puede dar click en "Cuenta" para loguearse o registrarse.
 */
export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="landing min-h-screen bg-eco-bg">
            {/* Barra superior */}
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

            {/* Hero */}
            <main className="landing__main">
                <section className="landing__hero">
                    <img src={hero} alt="Ilustración EcoSolido" className="landing__hero-img" />
                    <div className="landing__hero-content">
                        <h1 className="landing__title">
                            Reporta incidencias ambientales y gana recompensas
                        </h1>
                        <p className="landing__subtitle">
                            EcoSolido es el programa donde los ciudadanos ayudan a mantener
                            limpia su ciudad: registra incidencias, sigue su resolución,
                            aprende sobre el medio ambiente y gana puntos e insignias.
                        </p>
                        <div className="landing__actions">
                            <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                                Iniciar Sesion
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => navigate('/registrarse')}>
                                Registrarse
                            </Button>
                        </div>
                        <p className="landing__hint">
                            Para participar del programa, ingresa a tu cuenta o crea una nueva.
                        </p>
                    </div>
                </section>

                {/* Beneficios */}
                <section className="landing__features">
                    <div className="landing__feature">
                        <span className="landing__feature-icon">📸</span>
                        <h3>Reporta</h3>
                        <p>Registra incidencias ambientales con fotos y ubicación en segundos.</p>
                    </div>
                    <div className="landing__feature">
                        <span className="landing__feature-icon">🌱</span>
                        <h3>Aprende</h3>
                        <p>Accede a educación ambiental y consejos para cuidar tu ciudad.</p>
                    </div>
                    <div className="landing__feature">
                        <span className="landing__feature-icon">🏅</span>
                        <h3>Recompénsate</h3>
                        <p>Gana puntos e insignias por cada aporte a tu comunidad.</p>
                    </div>
                </section>
            </main>

            <footer className="landing__footer">
                <p>© {new Date().getFullYear()} EcoSolido — Juntos por una ciudad más limpia.</p>
            </footer>
        </div>
    )
}