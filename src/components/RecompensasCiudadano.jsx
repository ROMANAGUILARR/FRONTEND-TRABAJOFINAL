import { useEffect, useState } from 'react'
import { obtenerInsigniasUsuario, obtenerPuntosUsuario } from '../services/incidenciasApi'
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

const MOCK_INSIGNIAS = [
  { idInsignia: 1, nombre: 'Primer reporte', descripcion: 'Has registrado tu primera incidencia y comenzado a transformar tu comunidad.', requisitoIncidencias: 1, recompensa: 'Bono de S/20 en tu billetera digital.', desbloqueada: false },
  { idInsignia: 2, nombre: 'Reportero activo', descripcion: 'Has registrado 5 incidencias. Tu compromiso es notable.', requisitoIncidencias: 5, recompensa: 'Bono de S/50 + recarga de 10 GB moviles.', desbloqueada: false },
  { idInsignia: 3, nombre: 'Guardian del barrio', descripcion: 'Has registrado 10 incidencias. Eres un referente ambiental.', requisitoIncidencias: 10, recompensa: 'Vale de S/100 en canasta familiar.', desbloqueada: false },
  { idInsignia: 4, nombre: 'EcoHeroe', descripcion: 'Has registrado 15 incidencias. Tu dedicacion es inspiradora.', requisitoIncidencias: 15, recompensa: 'Vale de S/200 + kit ecologico.', desbloqueada: false },
  { idInsignia: 5, nombre: 'Embajador EcoSolido', descripcion: 'Has registrado 20 incidencias. Eres un embajador del cambio.', requisitoIncidencias: 20, recompensa: 'Vale de S/500 + kit + certificado.', desbloqueada: false },
]

const fs = (base) => `calc(${base}rem * var(--font-scale, 1))`

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
        setInsignias(MOCK_INSIGNIAS)
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {desbloqueadas.map(insignia => (
                  <Card key={insignia.idInsignia} variant="unlocked" className="text-center">
                    <h4 className="font-bold text-eco-text mb-2" style={{ fontSize: fs(1.15) }}>{insignia.nombre}</h4>
                    <img src={IMAGENES_INSIGNIAS[insignia.idInsignia]} alt={insignia.nombre} className="w-36 h-36 mx-auto mb-3" />
                    <p className="text-eco-text-secondary mb-3" style={{ fontSize: fs(0.9) }}>{insignia.descripcion}</p>
                    <div style={{ backgroundColor: '#2E7D32', borderRadius: '8px', padding: '12px', marginTop: 'auto' }}>
                      <span style={{ color: '#ffffff', fontWeight: 700, display: 'block', marginBottom: '4px', fontSize: fs(0.85) }}>Recompensa</span>
                      <span style={{ color: '#ffffff', fontWeight: 600, display: 'block', fontSize: fs(0.9) }}>{insignia.recompensa}</span>
                    </div>
                  </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendientes.map(insignia => (
                  <Card key={insignia.idInsignia} variant="locked" className="text-center">
                    <h4 className="font-bold text-eco-text mb-2" style={{ fontSize: fs(1.15) }}>{insignia.nombre}</h4>
                    <img src={IMAGENES_INSIGNIAS[insignia.idInsignia]} alt={insignia.nombre} className="w-36 h-36 mx-auto mb-3 grayscale opacity-60" />
                    <p className="text-eco-text-secondary mb-2" style={{ fontSize: fs(0.85) }}>
                      Registra <strong className="text-eco-primary">{insignia.requisitoIncidencias}</strong> incidencias para desbloquear.
                    </p>
                    <div style={{ backgroundColor: '#37474F', borderRadius: '8px', padding: '12px', marginTop: 'auto' }}>
                      <span style={{ color: '#ffffff', fontWeight: 700, display: 'block', marginBottom: '4px', fontSize: fs(0.85) }}>Recompensa</span>
                      <span style={{ color: '#ffffff', fontWeight: 600, display: 'block', fontSize: fs(0.9) }}>{insignia.recompensa}</span>
                    </div>
                  </Card>
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
