import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export default function Login({ onLogin }) {
    const [nombreUs, setNombreUs] = useState("")
    const [contra, setContra] = useState("")
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [verContra, setVerContra] = useState(false)
    const { login, user } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(nombreUs, contra);
        if (result.success) {
            onLogin?.();
            navigate(result.rol === 'ADMIN' ? '/dashboard' : '/registro');
        } else {
            setError(result.error);
        }
    }

    return (
        <div className="login flex items-center justify-center min-h-screen bg-eco-bg p-5">
            <div className="login__container w-full max-w-[420px] bg-eco-bg-white rounded-lg shadow-lg p-10 max-md:p-6 max-sm:p-5">

                {/* Logo */}
                <div className="login__logo text-center mb-8">
                    <svg className="login__logo-icon w-16 h-16 text-eco-primary mx-auto mb-3 max-md:w-12 max-md:h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h1 className="login__title m-0 mb-2 text-2xl font-bold text-eco-text tracking-tight max-md:text-xl max-sm:text-lg">
                        EcoSolido
                    </h1>
                    <p className="login__subtitle m-0 text-sm text-eco-text-secondary leading-relaxed">
                        Inicia sesion para gestionar incidencias
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="login__error bg-red-50 border border-eco-danger text-eco-danger p-3 rounded-md text-sm text-center mb-2">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form className="login__form flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="login__field flex flex-col gap-2">
                        <label htmlFor="username" className="font-semibold text-sm text-eco-text uppercase tracking-wider">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingresa tu nombre de usuario"
                            value={nombreUs}
                            onChange={(e) => setNombreUs(e.target.value)}
                            autoComplete="username"
                            required
                            className="border-2 border-eco-border bg-eco-bg-white text-eco-text rounded-md p-3 text-base transition-all duration-200 focus:outline-none focus:border-eco-primary focus:shadow-[0_0_0_3px_rgba(46,150,50,0.15)] max-sm:p-2.5 max-sm:text-sm"
                        />
                    </div>

                    <div className="login__field flex flex-col gap-2">
                        <label htmlFor="contrasena" className="font-semibold text-sm text-eco-text uppercase tracking-wider">
                            Contrasena
                        </label>
                        <div className="login__input-wrapper relative flex items-center">
                            <input
                                type={verContra ? "text" : "password"}
                                id="contrasena"
                                placeholder="Ingresa tu contrasena"
                                value={contra}
                                onChange={(e) => setContra(e.target.value)}
                                autoComplete="current-password"
                                required
                                className="border-2 border-eco-border bg-eco-bg-white text-eco-text rounded-md p-3 text-base transition-all duration-200 focus:outline-none focus:border-eco-primary focus:shadow-[0_0_0_3px_rgba(46,150,50,0.15)] w-full pr-10 max-sm:p-2.5 max-sm:text-sm"
                            />
                            <button
                                type="button"
                                className="login__toggle-pass absolute right-2 bg-transparent border-none cursor-pointer text-eco-text-secondary p-0 flex items-center"
                                onClick={() => setVerContra(prev => !prev)}
                                aria-label={verContra ? "Ocultar contrasena" : "Ver contrasena"}
                            >
                                {verContra ? "Ocultar" : "Ver"}
                            </button>
                        </div>
                    </div>

                    <div className="login__actions flex flex-col gap-4 mt-2">
                        <button
                            type="submit"
                            className="login__submit w-full py-3.5 px-7 text-base font-semibold text-white bg-eco-primary border-none rounded-md cursor-pointer transition-all duration-200 shadow-sm hover:bg-eco-primary-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 max-sm:py-3 max-sm:text-sm"
                        >
                            Iniciar Sesion
                        </button>
                    </div>
                </form>

                {/* Links */}
                <div className="login__links flex flex-col gap-3 text-center mt-6">
                    <p className="m-0 text-sm text-eco-text-secondary">Aun no tienes cuenta?</p>
                    <button
                        type="button"
                        className="bg-transparent border-none text-eco-primary text-sm font-semibold cursor-pointer p-0 transition-colors duration-200 hover:text-eco-primary-dark hover:underline"
                        onClick={() => navigate("/registrarse")}
                    >
                        Registrate aqui
                    </button>
                    <p className="m-0 text-sm text-eco-text-secondary">Olvidaste tu contrasena?</p>
                    <button
                        type="button"
                        className="bg-transparent border-none text-eco-primary text-sm font-semibold cursor-pointer p-0 transition-colors duration-200 hover:text-eco-primary-dark hover:underline"
                        onClick={() => navigate("/restablecer")}
                    >
                        Restablecer Contrasena
                    </button>
                </div>
            </div>
        </div>
    )
}
