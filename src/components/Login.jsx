import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './ui/Button'
import Input from './ui/Input'
import './Login.css'

export default function Login({ onLogin }) {
    const [nombreUs, setNombreUs] = useState("")
    const [contra, setContra] = useState("")
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { login } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(nombreUs, contra);
        if (result.success) {
            onLogin?.();
            navigate(result.rol === 'ADMIN' ? '/ciudadanos' : '/registro');
        } else {
            setError(result.error);
        }
    }

    return (
        <div className="login flex items-center justify-center min-h-screen bg-eco-bg p-5">
            <div className="w-full max-w-[420px] bg-eco-bg-white rounded-lg shadow-lg p-10 max-md:p-6 max-sm:p-5">

                {/* Logo */}
                <div className="text-center mb-8">
                    <svg className="w-16 h-16 text-eco-primary mx-auto mb-3 max-md:w-12 max-md:h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h1 className="m-0 mb-2 text-2xl font-bold text-eco-text tracking-tight max-md:text-xl max-sm:text-lg">
                        EcoSolido
                    </h1>
                    <p className="m-0 text-sm text-eco-text-secondary leading-relaxed">
                        Inicia sesion para gestionar incidencias
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-eco-danger text-eco-danger p-3 rounded-md text-sm text-center mb-2">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Input
                        label="Nombre de usuario"
                        placeholder="Ingresa tu nombre de usuario"
                        value={nombreUs}
                        onChange={(e) => setNombreUs(e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <Input
                        label="Contrasena"
                        placeholder="Ingresa tu contrasena"
                        value={contra}
                        onChange={(e) => setContra(e.target.value)}
                        required
                        showToggle
                        autoComplete="current-password"
                    />

                    <div className="mt-2">
                        <Button type="submit" variant="primary" size="lg" fullWidth>
                            Iniciar Sesion
                        </Button>
                    </div>
                </form>

                {/* Links */}
                <div className="flex flex-col gap-3 text-center mt-6">
                    <p className="m-0 text-sm text-eco-text-secondary">Aun no tienes cuenta?</p>
                    <Button variant="link" onClick={() => navigate("/registrarse")}>
                        Registrate aqui
                    </Button>
                    <p className="m-0 text-sm text-eco-text-secondary">Olvidaste tu contrasena?</p>
                    <Button variant="link" onClick={() => navigate("/restablecer")}>
                        Restablecer Contrasena
                    </Button>
                </div>
            </div>
        </div>
    )
}
