import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { IconUsuario, IconSalir } from './icons'
import Button from './ui/Button'
import CerrarSesionModal from './CerrarSesionModal'
import { useState } from 'react'
import './MiCuenta.css'

/**
 * Página "Mi Cuenta": muestra los datos del usuario autenticado
 * (nombre, rol, puntos) y permite cerrar sesión.
 */
export default function MiCuenta() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [showCerrarSModal, setShowCerrarSModal] = useState(false)

    const esAdmin = user?.rol === 'ADMIN'

    function handleConfirmarCierre() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="micuenta min-h-screen bg-eco-bg flex items-center justify-center p-5">
            <div className="w-full max-w-[460px] bg-eco-bg-white rounded-lg shadow-lg p-10 max-md:p-6 max-sm:p-5">
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
                        <span className="micuenta__valor">{user?.nombreUsuario || '—'}</span>
                    </div>
                    <div className="micuenta__fila">
                        <span className="micuenta__etiqueta">Rol</span>
                        <span className="micuenta__valor">
                            {esAdmin ? 'Administrador' : 'Ciudadano'}
                        </span>
                    </div>
                    <div className="micuenta__fila">
                        <span className="micuenta__etiqueta">Puntos</span>
                        <span className="micuenta__valor">⭐ 0 pts</span>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-3">
                    <Button variant="secondary" size="lg" fullWidth onClick={() => navigate(-1)}>
                        Volver
                    </Button>
                    <Button
                        variant="danger"
                        size="lg"
                        fullWidth
                        onClick={() => setShowCerrarSModal(true)}
                    >
                        <IconSalir />
                        Cerrar Sesion
                    </Button>
                </div>

                {/* Modal de confirmación */}
                {showCerrarSModal && (
                    <CerrarSesionModal
                        onConfirm={handleConfirmarCierre}
                        onCancel={() => setShowCerrarSModal(false)}
                    />
                )}
            </div>
        </div>
    )
}