import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { IconSalir, IconUsuario, IconSol, IconLuna, IconMenu } from './icons'
import './Header.css'
import CerrarSesionModal from './CerrarSesionModal'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/LOGO ECOSOLIDO.png'
import { obtenerPuntosUsuario } from '../services/incidenciasApi'
const obtenerTemaInicial = () => {
    const temaGuardado = localStorage.getItem('theme');
    if (temaGuardado) {
      return temaGuardado === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
export default function Header({ onMenuClick,onLogout }) {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    obtenerTemaInicial()
  })
  const navigate = useNavigate()
  const [showCerrarSModal, setShowCerrarSModal] = useState(false)
  const { logout, user } = useAuth();
  const nombreUsuario = user?.nombreUsuario || localStorage.getItem("nombreUsuario")
  const [puntos, setPuntos] = useState(user?.puntos ?? 0)
  const location = useLocation()
  useEffect(() => {
    if (user?.puntos !== undefined && user?.puntos !== null) {
      setPuntos(user.puntos)
    }
  }, [user?.puntos])
  useEffect(() => {
    const root = document.documentElement
    if (temaOscuro) {
        root.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    } else {
        root.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
    }
  }, [temaOscuro])
  useEffect(() => {
    async function cargarPuntos() {
        try {
            const resultado = await obtenerPuntosUsuario()
            setPuntos(resultado)
            localStorage.setItem('puntos', resultado)
        } catch (error) {
            console.error('Error al obtener puntos:', error)
        }
    }
    cargarPuntos()
  }, [location.pathname])
  function toggleTema() {
    setTemaOscuro(prev => !prev)
  }

  function handleCerrarSesion() {
    setShowCerrarSModal(true)
  }

  function handleConfirmarCierre() {
    logout();
    navigate('/login', { replace: true })
  }

  return (
    <header className="header flex items-center justify-between px-7 py-4 shadow-md sticky top-0 z-[100] gap-4 max-md:px-5 max-md:py-3.5 max-sm:px-4 max-sm:py-3" style={{ background: 'var(--sidebar-bg)' }}>

      {/* Menu hamburguesa (solo movil) */}
      <button
        type="button"
        className="hidden items-center justify-center p-2 border-none bg-transparent text-white cursor-pointer opacity-90 transition-all duration-200 rounded-sm flex-shrink-0 hover:opacity-100 hover:scale-105 active:scale-95 max-sm:flex max-md:flex"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        title="Menu"
      >
        <IconMenu />
      </button>

      {/* Logo */}
      <div className="header__logo-container flex items-center gap-2.5">
        <img src={logo} alt="Logo" className="header__logo-img w-20 h-20 object-contain rounded-sm max-md:w-16 max-md:h-16 max-sm:w-14 max-sm:h-14" />
        <h1 className="header__logo m-0 text-xl font-bold text-white tracking-tight whitespace-nowrap max-md:text-base max-sm:text-sm">
          EcoSolido
        </h1>
      </div>

      {/* Acciones */}
      <div className="header__actions flex items-center gap-4 flex-shrink-0 max-md:gap-3 max-sm:gap-2">
        <button
          type="button"
          className="flex items-center justify-center p-2 border-none bg-transparent text-white cursor-pointer opacity-90 transition-all duration-200 rounded-sm hover:opacity-100 hover:scale-105 active:scale-95 max-sm:p-1.5"
          onClick={toggleTema}
          aria-label={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={temaOscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {temaOscuro ? <IconSol /> : <IconLuna />}
        </button>

        <button type="button" className="flex items-center justify-center p-2 border-none bg-transparent text-white cursor-pointer opacity-90 transition-all duration-200 rounded-sm hover:opacity-100 hover:scale-105 active:scale-95 max-sm:p-1.5" aria-label="Perfil de usuario" onClick={() => navigate('/login')}>
          <IconUsuario />
          <span className="header__username ml-2.5 max-sm:hidden">Cuenta</span>
          <span className="header__points ml-2 text-xs font-semibold text-yellow-400 bg-black/20 px-2 py-0.5 rounded-xl max-sm:text-[10px]">
            {puntos} pts
          </span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center p-2 border-none bg-transparent text-white cursor-pointer opacity-90 transition-all duration-200 rounded-sm hover:opacity-100 hover:scale-105 active:scale-95 max-sm:p-1.5"
          aria-label="Cerrar sesion"
          onClick={handleCerrarSesion}
        >
          <IconSalir />
        </button>

        {showCerrarSModal && (
          <CerrarSesionModal
            onConfirm={handleConfirmarCierre}
            onCancel={() => setShowCerrarSModal(false)}
          />
        )}
      </div>
    </header>
  )
}
