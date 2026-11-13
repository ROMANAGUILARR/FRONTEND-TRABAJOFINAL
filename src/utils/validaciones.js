// Reglas de validación del registro: las mismas que aplica el backend (CrearUsuarioRequestDTO).
// Están separadas del componente para poder probarlas con pruebas automatizadas (npm test).

export const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/
export const PATRON_USUARIO = /^[A-Za-z0-9._-]+$/
export const PATRON_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
export const PATRON_TELEFONO = /^\d{9}$/

/** Devuelve el primer error encontrado, o null si los datos son válidos. */
export function validarRegistro(datos) {
    const nombre = datos.nombre.trim()
    const apellido = datos.apellido.trim()
    const usuario = datos.nombreUsuario.trim()
    if (nombre.length < 2 || nombre.length > 100) return 'El nombre debe tener entre 2 y 100 caracteres.'
    if (!PATRON_NOMBRE.test(nombre)) return 'El nombre solo puede contener letras y espacios.'
    if (apellido.length < 2 || apellido.length > 100) return 'El apellido debe tener entre 2 y 100 caracteres.'
    if (!PATRON_NOMBRE.test(apellido)) return 'El apellido solo puede contener letras y espacios.'
    if (!PATRON_CORREO.test(datos.email.trim())) return 'El correo electrónico no tiene un formato válido.'
    if (usuario.length < 3 || usuario.length > 50) return 'El nombre de usuario debe tener entre 3 y 50 caracteres.'
    if (!PATRON_USUARIO.test(usuario)) return 'El nombre de usuario solo puede tener letras, números, punto, guion o guion bajo (sin espacios).'
    if (!datos.pregunta) return 'Elige una pregunta de seguridad.'
    if (!datos.respuesta.trim()) return 'Escribe la respuesta a tu pregunta de seguridad.'
    if (datos.respuesta.trim().length > 50) return 'La respuesta de seguridad debe tener como máximo 50 caracteres.'
    if (datos.contrasena.length < 6 || datos.contrasena.length > 72) return 'La contraseña debe tener entre 6 y 72 caracteres.'
    if (datos.contrasena !== datos.confirmarContrasena) return 'Las contraseñas no coinciden.'
    return null
}
