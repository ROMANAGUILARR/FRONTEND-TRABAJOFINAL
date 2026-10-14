import { useEffect, useState } from 'react'
import { obtenerInsigniasUsuario, obtenerPuntosUsuario } from '../services/incidenciasApi'
import { MOCK_INSIGNIAS, MOCK_INCIDENCIAS_POR_USUARIO } from '../services/mockData'
import { useAuth } from '../hooks/useAuth'
import primerInsignia from '../assets/PRIMER INSIGNIA.png'
import segundaInsignia from '../assets/SEGUNDA INSIGNIA.png'
import tercerInsignia from '../assets/TERCER INSIGNIA.png'
import cuartaInsignia from '../assets/CUARTA INSIGNIA.png'
import quintaInsignia from '../assets/QUINTA INSIGNIA.png'
import './RecompensasCiudadano.css'
import BarraProgreso from './BarraProgreso'
import HelpModal from './HelpModal'
import Card from './ui/Card'

const IMAGENES_INSIGNIAS = {
  1: primerInsignia, 2: segundaInsignia, 3: tercerInsignia,
  4: cuartaInsignia, 5: quintaInsignia
}

const fs = (base) => `calc(${base}rem * var(--font-scale, 1))`

// Misma estructura para insignias desbloqueadas y bloqueadas, asi todas miden igual
function InsigniaCard({ insignia, desbloqueada }) {
  return (
    <Card
      variant={desbloqueada ? 'unlocked' : 'locked'}
      className={`insignia-card ${desbloqueada ? 'insignia-card--desbloqueada' : 'insignia-card--bloqueada'}`}
    >
      <h4 className="insignia-card__titulo" title={insignia.nombre}>{insignia.nombre}</h4>
      <div className="insignia-card__imagen-wrapper">
        <img
          src={IMAGENES_INSIGNIAS[insignia.idInsignia]}
          alt={insignia.nombre}
          className="insignia-card__imagen"
        />
      </div>
      <p className="insignia-card__descripcion">{insignia.descripcion}</p>
      {!desbloqueada && (
        <span className="insignia-card__estado">
          Registra {insignia.requisitoIncidencias} incidencias para desbloquear
        </span>
      )}
      <div className="insignia-card__recompensa">
        <span className="insignia-card__recompensa-label">Recompensa</span>
        <span className="insignia-card__recompensa-texto">{insignia.recompensa}</span>
      </div>
    </Card>
  )
}

export default function RecompensasCiudadano() {
  const [insignias, setInsignias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [tamañoLetra, setTamañoLetra] = useState(1)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [puntos, setPuntos] = useState(() => parseInt(localStorage.getItem('puntos') || '0', 10))
  const { updatePuntos } = useAuth()

  useEffect(() => {
    async function cargarPuntos() {
      try {
        const reales = await obtenerPuntosUsuario()
        setPuntos(reales)
        updatePuntos(reales)
      } catch (err) {
        console.warn('No se pudieron refrescar los puntos:', err.message)
      }
    }
    cargarPuntos()

    function handleNuevaIncidencia() {
      const pts = parseInt(localStorage.getItem('puntos') || '0', 10)
      setPuntos(pts)
      updatePuntos(pts)
      cargarInsignias()
    }
    async function cargarInsignias() {
      try {
        const data = await obtenerInsigniasUsuario()
        setInsignias(data)
      } catch {}
    }
    window.addEventListener('incidencia-registrada', handleNuevaIncidencia)
    return () => window.removeEventListener('incidencia-registrada', handleNuevaIncidencia)
  }, [updatePuntos])

  useEffect(() => {
    async function cargarInsignias() {
      try {
        const data = await obtenerInsigniasUsuario()
        setInsignias(data)
      } catch (err) {
        console.warn('Usando datos locales:', err.message)
        const incidencias = MOCK_INCIDENCIAS_POR_USUARIO[1] || []
        const total = incidencias.length
        setInsignias(MOCK_INSIGNIAS.map(ins => ({
          ...ins,
          desbloqueada: total >= ins.requisitoIncidencias
        })))
      } finally {
        setCargando(false)
      }
    }
    cargarInsignias()
  }, [])

  const desbloqueadas = insignias.filter(i => i.desbloqueada)
  const pendientes = insignias.filter(i => !i.desbloqueada)

  return (
    <main className="recompensas p-6 max-md:p-4" style={{ '--font-scale': tamañoLetra }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h2 className="font-bold text-eco-text m-0" style={{ fontSize: fs(1.5) }}>Area de Recompensas</h2>
        <button
          type="button"
          className="bg-transparent border border-current rounded-[20px] px-3.5 py-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          style={{ fontSize: fs(0.95) }}
          onClick={() => setShowHelpModal(true)}
        >
          ¿Cómo funciona?
        </button>
        <div className="registrar__font-controls">
          <button type="button" onClick={() => setTamañoLetra(t => Math.max(0.8, t - 0.1))}>🗛-</button>
          <button type="button" onClick={() => setTamañoLetra(1)}>A</button>
          <button type="button" onClick={() => setTamañoLetra(t => Math.min(1.7, t + 0.1))}>🗚+</button>
        </div>
      </div>

      <p className="text-eco-text-secondary mb-6" style={{ fontSize: fs(1) }}>
        Aqui podras ver tus insignias y los premios que mereces por obtener cada una.
      </p>

      {cargando && <p className="text-eco-text-secondary text-center py-8">Cargando insignias...</p>}

      {!cargando && (
        <>
          {/* Progreso */}
          <section className="mb-8">
            <h3 className="font-bold text-eco-text mb-1" style={{ fontSize: fs(1.15) }}>Mis puntos</h3>
            <p className="text-eco-text-secondary mb-3" style={{ fontSize: fs(0.85) }}>Tu progreso para obtener la siguiente insignia</p>
            <BarraProgreso puntos={puntos} />
          </section>

          {/* Desbloqueadas */}
          <section className="mb-8">
            <h3 className="font-bold text-eco-text mb-4" style={{ fontSize: fs(1.15) }}>
              Insignias desbloqueadas ({desbloqueadas.length})
            </h3>
            {desbloqueadas.length === 0 ? (
              <div className="bg-eco-bg-white rounded-lg border border-eco-border p-6 text-center shadow-sm">
                <p className="text-eco-text-secondary" style={{ fontSize: fs(1.1) }}>Aun no has desbloqueado insignias. Registra incidencias para comenzar a ganar.</p>
              </div>
            ) : (
              <div className="insignias-grid">
                {desbloqueadas.map(insignia => (
                  <InsigniaCard key={insignia.idInsignia} insignia={insignia} desbloqueada />
                ))}
              </div>
            )}
          </section>

          {/* Pendientes */}
          <section className="mb-8">
            <h3 className="font-bold text-eco-text mb-4" style={{ fontSize: fs(1.15) }}>
              Insignias pendientes ({pendientes.length})
            </h3>
            {pendientes.length === 0 ? (
              <div className="bg-eco-primary/10 dark:bg-green-900/30 rounded-lg border border-eco-success p-6 text-center">
                <p className="text-eco-success font-bold text-lg">Felicidades! Has desbloqueado todas las insignias.</p>
              </div>
            ) : (
              <div className="insignias-grid">
                {pendientes.map(insignia => (
                  <InsigniaCard key={insignia.idInsignia} insignia={insignia} desbloqueada={false} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </main>
  )
}
