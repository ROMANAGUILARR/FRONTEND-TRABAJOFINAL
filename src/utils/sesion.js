// Control de la sesión: cuando el token JWT vence (dura 8 horas), se cierra la sesión
// y se vuelve al inicio de sesión con un aviso, en lugar de mostrar errores en las pantallas.

const CLAVES_SESION = ['token', 'nombreUsuario', 'puntos', 'permissions', 'rol']
export const AVISO_SESION_VENCIDA = 'Tu sesión expiró. Vuelve a iniciar sesión.'

/** Fecha de vencimiento del token en milisegundos (campo exp del JWT), o null si no se puede leer. */
export function leerVencimiento(token) {
    try {
        const partes = String(token).split('.')
        if (partes.length !== 3) return null
        let base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/')
        while (base64.length % 4 !== 0) base64 += '='
        const datos = JSON.parse(atob(base64))
        return typeof datos.exp === 'number' ? datos.exp * 1000 : null
    } catch {
        return null
    }
}

/** true si el token ya venció. Los tokens del modo demo no vencen. */
export function tokenVencido(token, ahora = Date.now()) {
    if (!token || String(token).startsWith('demo-token')) return false
    const vence = leerVencimiento(token)
    return vence !== null && vence <= ahora
}

export function cerrarSesionPorVencimiento() {
    try {
        CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave))
        sessionStorage.setItem('sesionVencida', '1')
    } catch { /* almacenamiento no disponible */ }
    if (window.location.pathname !== '/login') {
        window.location.replace('/login')
    }
}

/** Lee y borra el aviso de sesión vencida (lo muestra la pantalla de inicio de sesión). */
export function consumirAvisoSesionVencida() {
    try {
        if (sessionStorage.getItem('sesionVencida')) {
            sessionStorage.removeItem('sesionVencida')
            return AVISO_SESION_VENCIDA
        }
    } catch { /* almacenamiento no disponible */ }
    return null
}

/**
 * Revisa el token al abrir la aplicación, cada minuto y antes de cada petición a la API.
 * Si la API responde 401 (token rechazado), también cierra la sesión.
 */
export function instalarControlDeSesion(apiBase) {
    const vencida = () => tokenVencido(localStorage.getItem('token'))

    if (vencida()) cerrarSesionPorVencimiento()

    const fetchOriginal = window.fetch.bind(window)
    window.fetch = async (recurso, opciones) => {
        const url = typeof recurso === 'string' ? recurso : (recurso?.url ?? String(recurso))
        const esApi = url.startsWith(apiBase)
        const esLogin = url.includes('/usuario/autenticar')
        const habiaSesion = Boolean(localStorage.getItem('token'))

        if (esApi && !esLogin && vencida()) {
            cerrarSesionPorVencimiento()
            return new Response(AVISO_SESION_VENCIDA, { status: 401 })
        }

        const respuesta = await fetchOriginal(recurso, opciones)
        if (esApi && !esLogin && habiaSesion && respuesta.status === 401) {
            cerrarSesionPorVencimiento()
        }
        return respuesta
    }

    setInterval(() => {
        if (vencida()) cerrarSesionPorVencimiento()
    }, 60 * 1000)
}
