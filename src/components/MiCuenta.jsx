import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { IconUsuario } from './icons'
import './MiCuenta.css'

export default function MiCuenta() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const esAdmin = user?.rol === 'ADMIN'
    const nombreMostrar = (user?.nombreUsuario || localStorage.getItem('nombreUsuario') || '—').replace(' Demo', '')

    return (
        <div className="micuenta min-h-screen bg-eco-bg flex items-center justify-center p-5">
            <div className="w-full max-w-[460px] bg-eco-bg-white rounded-lg shadow-lg relative" style={{ padding: '40px 32px 32px' }}>
                {/* Botón X para cerrar */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-text-secondary)', fontSize: '1.2rem',
                        width: '32px', height: '32px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--color-border)'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                    aria-label="Cerrar"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* Encabezado */}
                <div className="text-center mb-8">
                    <div className="micuenta__avatar">
                        <IconUsuario />
                    </div>
                    <h1 className="m-0 mb-1 text-2xl font-bold text-eco-text">Mi Cuenta</h1>
                    <p className="m-0 text-sm text-eco-text-secondary">
                        Datos de tu cuenta en EcoSolido
                    </p>
                </div>

                {/* Datos del usuario */}
                <div className="micuenta__datos flex flex-col gap-3 mb-8">
                    <div className="micuenta__fila">
                        <span className="micuenta__etiqueta">Usuario</span>
                        <span className="micuenta__valor">{nombreMostrar}</span>
                    </div>
                    <div className="micuenta__fila">
                        <span className="micuenta__etiqueta">Rol</span>
                        <span className="micuenta__valor">
                            <span className={`admin-badge ${esAdmin ? 'admin-badge--progress' : 'admin-badge--resolved'}`}>
                                {esAdmin ? 'Administrador' : 'Ciudadano'}
                            </span>
                        </span>
                    </div>
                    <div className="micuenta__fila">
                        <span className="micuenta__etiqueta">Puntos</span>
                        <span className="micuenta__valor" style={{ color: '#2E7D32', fontWeight: 700 }}>
                            {user?.puntos ?? localStorage.getItem('puntos') ?? 0} pts
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}