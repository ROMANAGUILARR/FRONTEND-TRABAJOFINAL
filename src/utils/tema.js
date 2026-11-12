// Manejo del tema claro/oscuro compartido por toda la app.
// El tema elegido se guarda en localStorage ('theme') y se aplica
// con el atributo data-theme="dark" en <html>.

export function obtenerTemaInicial() {
  try {
    const temaGuardado = localStorage.getItem('theme');
    if (temaGuardado) {
      return temaGuardado === 'dark';
    }
  } catch {
    // localStorage no disponible: se usa la preferencia del sistema
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function aplicarTema(oscuro) {
  const root = document.documentElement;
  if (oscuro) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem('theme', oscuro ? 'dark' : 'light');
  } catch {
    // sin almacenamiento: el tema solo dura esta sesión
  }
}
