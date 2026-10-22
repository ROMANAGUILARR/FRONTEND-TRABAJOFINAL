import { useState, useEffect } from 'react'
import { IconSol, IconLuna } from './icons'
import { obtenerTemaInicial, aplicarTema } from '../utils/tema'

// Botón flotante para cambiar entre modo claro y oscuro en las
// pantallas públicas (login, registro y restablecer contraseña).
export default function ThemeToggleButton() {
  const [temaOscuro, setTemaOscuro] = useState(obtenerTemaInicial)

  useEffect(() => {
    aplicarTema(temaOscuro)
  }, [temaOscuro])

  return (
    <button
      type="button"
      onClick={() => setTemaOscuro(prev => !prev)}
      aria-label={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={temaOscuro ? 'Modo claro' : 'Modo oscuro'}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 py-2 px-3.5 rounded-full border-2 border-eco-border bg-eco-bg-white text-eco-text text-sm font-semibold shadow-md cursor-pointer transition-all duration-200 hover:border-eco-primary hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-primary max-sm:top-3 max-sm:right-3 max-sm:px-2.5"
    >
      {temaOscuro ? <IconSol /> : <IconLuna />}
      <span className="max-sm:hidden">{temaOscuro ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  )
}
