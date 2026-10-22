import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import Input from './ui/Input'
import ThemeToggleButton from './ThemeToggleButton'
import { useAuth } from '../hooks/useAuth'
import './Registrarse.css'

const PREGUNTAS_SEGURIDAD = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿En qué ciudad naciste?',
    '¿Cuál es el nombre de tu colegio de primaria?',
    '¿Cuál es tu comida favorita?',
    '¿Cuál es el segundo nombre de tu madre?',
]

export default function Registrarse() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', email: '', telefono: '', DNI: '',
        nombreUsuario: '', contrasena: '', confirmarContrasena: '',
        pregunta: '', respuesta: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (!/^\d{8}$/.test(formData.DNI)) {
            setError('El DNI debe tener exactamente 8 dígitos');
            return;
        }
        if (!/^\d{9}$/.test(formData.telefono)) {
            setError('El teléfono debe tener exactamente 9 dígitos');
            return;
        }

        setEnviando(true);
        try {
            const respuesta = await fetch(`${API_BASE}/usuario/registrar`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreCompleto: formData.nombre,
                    apellidoCompleto: formData.apellido,
                    dni: formData.DNI,
                    telefono: formData.telefono,
                    correoElectronico: formData.email,
                    nombreUsuario: formData.nombreUsuario,
                    contrasena: formData.contrasena,
                    preguntaSeguridad: formData.pregunta,
                    respuestaPregunta: formData.respuesta
                })
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                throw new Error(errorText);
            }

            setSuccess('Registro exitoso! Ingresando al programa...');
            // Auto-login: el usuario queda registrado e ingresa directo al programa
            const resultadoLogin = await login(formData.nombreUsuario, formData.contrasena);
            if (resultadoLogin.success) {
                setTimeout(() => {
                    navigate(resultadoLogin.rol === 'ADMIN' ? '/ciudadanos' : '/registro');
                }, 1200);
            } else {
                // Si falla el auto-login, enviar al login manual
                setSuccess('Registro exitoso! Redirigiendo al login...');
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setError(error.message === 'Failed to fetch'
                ? 'No se pudo conectar con el servidor. Si nadie lo usó en un rato, puede tardar hasta 1 minuto en activarse; espera un momento e intenta de nuevo.'
                : error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="registrarse flex items-center justify-center min-h-screen bg-eco-bg p-5 max-sm:p-3">
            <ThemeToggleButton />
            <div className="w-full max-w-[520px] bg-eco-bg-white rounded-lg shadow-lg p-10 max-md:p-6 max-sm:p-5">

                {/* Logo */}
                <div className="text-center mb-6">
                    <svg className="w-14 h-14 text-eco-primary mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h1 className="m-0 mb-1 text-2xl font-bold text-eco-text">EcoSolido</h1>
                    <p className="m-0 text-sm text-eco-text-secondary">Crea tu cuenta para gestionar incidencias</p>
                </div>

                {/* Mensajes */}
                {error && (
                    <div className="bg-[var(--color-accent-red-light)] border border-[var(--color-btn-danger)] text-[var(--color-danger-text)] p-3 rounded-md text-sm text-center mb-3">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-[var(--color-accent-green-light)] border border-[var(--color-btn-success)] text-[var(--color-success-text)] p-3 rounded-md text-sm text-center mb-3">
                        {success}
                    </div>
                )}

                {/* Formulario */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                        <Input label="Nombre" name="nombre" placeholder="Tu nombre" value={formData.nombre} onChange={handleChange} required />
                        <Input label="Apellido" name="apellido" placeholder="Tu apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>

                    <Input label="Correo electrónico" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
                    <Input label="Teléfono" name="telefono" type="tel" inputMode="numeric" maxLength="9" placeholder="9 dígitos, ej. 987654321" value={formData.telefono} onChange={handleChange} required />
                    <Input label="DNI" name="DNI" inputMode="numeric" maxLength="8" placeholder="8 dígitos" value={formData.DNI} onChange={handleChange} required />
                    <Input label="Nombre de usuario" name="nombreUsuario" placeholder="Elige un nombre de usuario" value={formData.nombreUsuario} onChange={handleChange} required />
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pregunta" className="font-semibold text-sm text-eco-text uppercase tracking-wider">
                            Pregunta de seguridad<span className="text-eco-danger ml-1 font-bold">*</span>
                        </label>
                        <select
                            id="pregunta"
                            name="pregunta"
                            value={formData.pregunta}
                            onChange={handleChange}
                            required
                            className="w-full border-2 border-eco-border bg-eco-bg-white text-eco-text rounded-md p-3 text-base focus:outline-none focus:border-eco-primary max-sm:p-2.5 max-sm:text-sm"
                        >
                            <option value="">-- Elige una pregunta --</option>
                            {PREGUNTAS_SEGURIDAD.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <Input label="Respuesta" name="respuesta" placeholder="Tu respuesta (la necesitarás para recuperar tu contraseña)" value={formData.respuesta} onChange={handleChange} required />

                    <Input label="Contraseña" name="contrasena" placeholder="Mínimo 6 caracteres" value={formData.contrasena} onChange={handleChange} required showToggle />
                    <Input label="Confirmar contraseña" name="confirmarContrasena" placeholder="Repite tu contraseña" value={formData.confirmarContrasena} onChange={handleChange} required showToggle />

                    <span className="text-[var(--color-warning-text)] text-xs font-medium">* Campo Obligatorio</span>

                    <Button type="submit" variant="primary" size="lg" fullWidth disabled={enviando}>
                        {enviando ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                </form>

                {/* Link */}
                <div className="flex flex-col gap-2 text-center mt-5">
                    <p className="m-0 text-sm text-eco-text-secondary">¿Ya tienes cuenta?</p>
                    <Button variant="link" onClick={() => navigate("/login")}>
                        Inicia sesión aquí
                    </Button>
                </div>
            </div>
        </div>
    )
}
