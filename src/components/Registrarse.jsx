import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import Input from './ui/Input'
import './Registrarse.css'

export default function Registrarse() {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', email: '', telefono: '', DNI: '',
        nombreUsuario: '', contrasena: '', confirmarContrasena: '',
        pregunta: '', respuesta: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contrasenas no coinciden');
            return;
        }
        if (formData.contrasena.length < 6) {
            setError('La contrasena debe tener al menos 6 caracteres');
            return;
        }

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

            setSuccess('Registro exitoso! Redirigiendo al login...');
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="registrarse flex items-center justify-center min-h-screen bg-eco-bg p-5 max-sm:p-3">
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
                    <div className="bg-red-50 border border-eco-danger text-eco-danger p-3 rounded-md text-sm text-center mb-3">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-eco-success text-eco-success p-3 rounded-md text-sm text-center mb-3">
                        {success}
                    </div>
                )}

                {/* Formulario */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                        <Input label="Nombre" name="nombre" placeholder="Tu nombre" value={formData.nombre} onChange={handleChange} required />
                        <Input label="Apellido" name="apellido" placeholder="Tu apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>

                    <Input label="Correo electronico" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
                    <Input label="Telefono" name="telefono" type="tel" maxLength="9" placeholder="Tu numero de telefono" value={formData.telefono} onChange={handleChange} required />
                    <Input label="DNI" name="DNI" maxLength="8" placeholder="Establece el DNI" value={formData.DNI} onChange={handleChange} required />
                    <Input label="Nombre de usuario" name="nombreUsuario" placeholder="Elige un nombre de usuario" value={formData.nombreUsuario} onChange={handleChange} required />
                    <Input label="Pregunta de seguridad" name="pregunta" placeholder="Respondible con 1 o 3 palabras" value={formData.pregunta} onChange={handleChange} required />
                    <Input label="Respuesta" name="respuesta" placeholder="Solo coloque la respuesta" value={formData.respuesta} onChange={handleChange} required />

                    <Input label="Contrasena" name="contrasena" placeholder="Minimo 6 caracteres" value={formData.contrasena} onChange={handleChange} required showToggle />
                    <Input label="Confirmar contrasena" name="confirmarContrasena" placeholder="Repite tu contrasena" value={formData.confirmarContrasena} onChange={handleChange} required showToggle />

                    <span className="text-eco-warning text-xs font-medium">* Campo Obligatorio</span>

                    <Button type="submit" variant="primary" size="lg" fullWidth>
                        Crear Cuenta
                    </Button>
                </form>

                {/* Link */}
                <div className="flex flex-col gap-2 text-center mt-5">
                    <p className="m-0 text-sm text-eco-text-secondary">Ya tienes cuenta?</p>
                    <Button variant="link" onClick={() => navigate("/login")}>
                        Inicia sesion aqui
                    </Button>
                </div>
            </div>
        </div>
    )
}
