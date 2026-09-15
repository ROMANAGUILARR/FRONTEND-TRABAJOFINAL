import { useState } from 'react'
import './EducacionMedioAmbiental.css'
import { generarRecomendaciones } from '../services/RecomendacionApi'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import HelpModal from './HelpModal'

const ARTICULOS = [
  {
    id: 1,
    titulo: '¿Cómo reducir tu huella de carbono?',
    resumen: 'Descubre prácticas simples pero efectivas para disminuir tu impacto ambiental en el día a día.',
    categoria: 'Huella de Carbono',
    imagen: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
    fecha: '2026-06-01',
    contenido: [
      'La huella de carbono es la cantidad total de gases de efecto invernadero que emitimos con nuestras acciones diarias. En Perú, cada persona genera en promedio 1.8 toneladas de CO₂ al año. Reducirla es clave para combatir el cambio climático.',
      'Empieza por lo simple: apaga las luces cuando no las uses, usa transporte público o bicicleta, reduce el consumo de carne roja (su producción genera altas emisiones), y prefiere productos locales para evitar la contaminación del transporte.',
      'En tu hogar, cambia las bombillas por LED, desconecta aparatos que no uses y lava la ropa con agua fría. Cada pequeño gesto suma. Si cada persona en Lima redujera su huella un 10%, se evitarían miles de toneladas de CO₂ al año.'
    ]
  },
  {
    id: 2,
    titulo: 'Reciclaje: Guía completa para principiantes',
    resumen: 'Aprende a separar correctamente tus residuos y contribuye al cuidado del medio ambiente.',
    categoria: 'Reciclaje',
    imagen: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop',
    fecha: '2026-05-28',
    contenido: [
      'El reciclaje es uno de los gestos más poderosos que podemos hacer por el planeta. En Perú solo se recicla el 5% de los residuos generados. Aprender a separar correctamente es el primer paso para cambiar esta realidad.',
      'Separa tus residuos en tres grupos: orgánicos (restos de comida, cáscaras), inorgánicos aprovechables (plástico, papel, cartón, vidrio, metal) e inorgánicos no aprovechables (pañales, colillas, papeles sucios). Lava los envases antes de depositarlos.',
      'En muchas ciudades peruanas ya existen puntos de acopio y programas municipales de reciclaje. Consulta en tu municipalidad dónde puedes llevar tus materiales reciclables. El vidrio se puede reciclar infinitamente, y reciclar una tonelada de papel salva 17 árboles.'
    ]
  },
  {
    id: 3,
    titulo: 'El impacto de los plásticos en los océanos',
    resumen: 'Conoce cómo los plásticos de un solo uso afectan la vida marina y qué puedes hacer al respecto.',
    categoria: 'Contaminación',
    imagen: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=250&fit=crop',
    fecha: '2026-05-25',
    contenido: [
      'Cada año, más de 8 millones de toneladas de plástico llegan a los océanos del mundo. El Perú, con su larga costa del Pacífico, es especialmente afectado. Los plásticos tardan más de 400 años en degradarse y fragmentan en microplásticos que entran en la cadena alimentaria.',
      'Los plásticos de un solo uso son los más peligrosos: bolsas, botellas, popotes y envoltorios. Miles de tortugas marinas, aves y peces mueren cada año al ingerirlos o enredarse en ellos. En las costas peruanas se han encontrado ballenas y leones marinos con plástico en sus estómagos.',
      '¿Qué puedes hacer? Usa bolsas reutilizadas, lleva tu propia botella de agua, rechaza los popotes y envoltorios innecesarios. Participa en limpiezas de playas. Cada botella que reutilizas evita que llegue al mar. El cambio empieza con tus decisiones diarias.'
    ]
  },
  {
    id: 4,
    titulo: 'Energías renovables: El futuro es hoy',
    resumen: 'Explora las diferentes fuentes de energía limpia y cómo están transformando nuestro mundo.',
    categoria: 'Energía',
    imagen: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=250&fit=crop',
    fecha: '2026-05-20',
    contenido: [
      'Las energías renovables provienen de fuentes naturales inagotables: el sol, el viento, el agua y la biomasa. Perú tiene un enorme potolar: la costa recibe radiación solar intensa, los Andes tienen corrientes de viento constantes y la selva cuenta con ríos caudalosos.',
      'La energía solar ha crecido significativamente en el país. Parques solares en Moquegua y Tacna ya generan electricidad para miles de hogares. La energía eólica en Marcona y Talara complementa la matriz energética. Estas fuentes no generan emisiones de CO₂ ni contaminan el agua.',
      'Tú también puedes contribuir: instala paneles solares si es posible, elige proveedores de energía limpia, y apoya políticas de transición energética. Un futuro con energía limpia significa aire más puro, menos cambio climático y empleos verdes para las nuevas generaciones.'
    ]
  },
  {
    id: 5,
    titulo: 'Compostaje doméstico: Transforma tus residuos',
    resumen: 'Aprende a crear tu propio compost y reduce significativamente la basura que generas.',
    categoria: 'Compostaje',
    imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
    fecha: '2026-05-15',
    contenido: [
      'El compostaje convierte los residuos orgánicos (cáscaras de frutas, verduras, café, cáscaras de huevo) en abono natural para las plantas. Aproximadamente el 50% de la basura que generamos en casa es orgánica, así que compostar reduce enormemente lo que llega al vertedero.',
      'Para empezar necesitas un balde o caja con tapa, tierra de jardín, y tus residuos orgánicos. Alterna capas de residuos húmedos con material seco (hojas secas, cartón). Revuelve cada semana y mantén la humedad. En 2 a 3 meses tendrás compost listo para tus plantas.',
      'El compostaje no solo reduce la basura, también evita la generación de metano en los vertederos (un gas 25 veces más potente que el CO₂), mejora la tierra del jardín y reduce la necesidad de fertilizantes químicos. Es un ciclo natural que puedes iniciar en tu hogar hoy mismo.'
    ]
  },
  {
    id: 6,
    titulo: 'Movilidad sostenible: Alternativas ecológicas',
    resumen: 'Descubre opciones de transporte que reducen la contaminación y mejoran tu salud.',
    categoria: 'Movilidad',
    imagen: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
    fecha: '2026-05-10',
    contenido: [
      'El transporte es responsable del 25% de las emisiones de CO₂ en el mundo. En ciudades como Lima, los vehículos particulares son la principal fuente de contaminación del aire. Cambiar nuestros hábitos de movilidad tiene un impacto directo en la calidad del aire que respiramos.',
      'Las alternativas son variadas: usa el Metropolitano o el Metro de Lima, comparte vehículo con compañeros de trabajo, camina o usa bicicleta para distancias cortas. Lima está ampliando sus ciclovías y ya cuenta con sistemas de bicicletas compartidas en algunas zonas.',
      'Si necesitas un vehículo, considera los eléctricos o híbridos. Reducir tu uso del auto particular un día a la semana puede disminuir tu huella de carbono en un 15%. Además, caminar y andar en bicicleta mejora tu salud cardiovascular y reduce el estrés. Muévete de forma sostenible.'
    ]
  }
]

const CATEGORIAS = ['Todas', 'Huella de Carbono', 'Reciclaje', 'Contaminación', 'Energía', 'Compostaje', 'Movilidad']
const CATEGORIAS2 = ['Orgánicos', 'Inorgánicos no aprovechables', 'Inorgánicos aprovechables']
export default function EducacionMedioAmbiental() {
  const MAX_CONTEXTO = 200
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [tamañoLetra, setTamañoLetra] = useState(1)
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null)
  const [tipoMaterial, setTipoMaterial] = useState("")
  const [contextoExtra, setContextoExtra] = useState("")
  const [recomendaciones, setRecomendaciones] = useState([])
  const [cargando, setCargando] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [caracteresRestantes, setCaracteresRestantes] = useState(MAX_CONTEXTO)
  const [error, setError] = useState('')
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  function handleContextoChange(event) {
    const nuevoValor = event.target.value;
    setContextoExtra(nuevoValor);
    setCaracteresRestantes(MAX_CONTEXTO - nuevoValor.length);
    setError('');
  }
  const articulosFiltrados = categoriaActiva === 'Todas'
    ? ARTICULOS
    : ARTICULOS.filter(articulo => articulo.categoria === categoriaActiva)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tipoMaterial || tipoMaterial === '--Selecione alguna opción--') {
      setError('Debe seleccionar un tipo de material.')
      return
    }
    setCargando(true)
    setError('')
    try {
      const resultado = await generarRecomendaciones(tipoMaterial, contextoExtra)
      setRecomendaciones(resultado)
    } catch (err) {
      setError(err.message ?? 'Error al generar recomendaciones.')
    } finally {
      setCargando(false)
    }
  }
  return (
    <main className="educacion" style={{ '--font-scale': tamañoLetra }}>
      <div className="recomendaciones_espacio">
        <div className="recomendaciones_header">
          <h2 className="educacion__title">Recomendaciones para el buen tratamiento de residuos sólidos</h2>
          <button
            type="button"
            className="registrar__help2-btn"
            onClick={() => setShowHelpModal(true)}
          >
            ¿Cómo funciona?
          </button>
          <div className="registrar__font2-controls">
            <button type="button" onClick={() => setTamañoLetra(t => Math.max(0.8, t - 0.1))}>🗛-</button>
            <button type="button" onClick={() => setTamañoLetra(1)}>A</button>
            <button type="button" onClick={() => setTamañoLetra(t => Math.min(1.7, t + 0.1))}>🗚+</button>
          </div>
        </div>
        <p className="educacion__subtitle">
          Recibe consejos que te enseñen a manejar correctamente residuos sólidos de un tipo específico
        </p>
        <form onSubmit={handleSubmit} className="educacion__form">
          <label className="educacion__label">Selecciona un tipo de residuo sólido <span style={{ color: '#ff7a00' }}>*</span>:</label>
          <select className="educacion__dropdown" name="tipoMaterial" value={tipoMaterial} onChange={(e) => { setTipoMaterial(e.target.value) }}>
            <option value="" disabled>--Selecione alguna opción--</option>
            {CATEGORIAS2.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
          <label className="educacion__label">Especifica las recomendaciones que deseas en base a la categoría:</label>
          <textarea className="educacion__textarea" name="contexto" value={listening ? transcript : contextoExtra} maxLength={MAX_CONTEXTO} onChange={handleContextoChange}></textarea>
          {browserSupportsSpeechRecognition && (
            <div className="registrar__voz2">
              <button
                type="button"
                className={`registrar__btn2--voz ${listening ? 'registrar__btn2--voz--activo' : ''}`}
                onClick={() => {
                  if (listening) {
                    SpeechRecognition.stopListening();
                    if (transcript) {
                      setContextoExtra(transcript);
                      setCaracteresRestantes(MAX_CONTEXTO - transcript.length);
                    }
                  } else {
                    resetTranscript();
                    SpeechRecognition.startListening({ language: 'es-PE', continuous: true });
                  }
                }}
              >
                {listening ? '⏹️ Detener grabación' : '🗣️ Dictar descripción'}
              </button>
              {listening && (
                <span className="registrar__voz-estado">Escuchando...</span>
              )}
            </div>
          )}
          <span className={`registrar__contador2 ${caracteresRestantes < 50 ? 'registrar__contador2--alerta' : ''}`}>
            {caracteresRestantes} caracteres restantes
          </span>
          <button type="submit" className="educacion_buttonOR">Obtener recomendaciones</button>
        </form>
        <span style={{ color: '#ff7a00', width: '100%', textAlign: '-webkit-left', fontSize: '0.8rem' }}>* Obligatorio a establecer</span>
        {cargando && <p>Generando recomendaciones...</p>}
        {error && <p className="educacion__error">{error}</p>}
        {recomendaciones.length > 0 && (<>
          <div className="espacio_recomendaciones">
            <h2 className="reco_titulo">Recomendaciones</h2>
            <ul className="educacion__recomendaciones">
              {recomendaciones.map((rec, index) => (
                <li key={index} className="educacion__recomendacion-item">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </>
        )}
      </div>
      <div className="educacion__header">
        <h2 className="educacion__title">Educación Medio Ambiental</h2>
        <p className="educacion__subtitle">
          Aprende y comparte conocimientos para cuidar nuestro planeta
        </p>
      </div>

      <div className="educacion__categorias">
        {CATEGORIAS.map(categoria => (
          <button
            key={categoria}
            className={`educacion__categoria-btn ${categoriaActiva === categoria ? 'educacion__categoria-btn--active' : ''}`}
            onClick={() => setCategoriaActiva(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {articuloSeleccionado ? (
        <article className="educacion__detalle">
          <button
            className="educacion__volver-btn"
            onClick={() => setArticuloSeleccionado(null)}
          >
            ← Volver a los artículos
          </button>
          <div className="educacion__detalle-contenido">
            <img
              src={articuloSeleccionado.imagen}
              alt={articuloSeleccionado.titulo}
              className="educacion__detalle-imagen"
            />
            <div className="educacion__detalle-info">
              <span className="educacion__detalle-categoria">
                {articuloSeleccionado.categoria}
              </span>
              <h3 className="educacion__detalle-titulo">
                {articuloSeleccionado.titulo}
              </h3>
              <p className="educacion__detalle-fecha">
                Publicado el {articuloSeleccionado.fecha}
              </p>
              <div className="educacion__detalle-cuerpo">
                {articuloSeleccionado.contenido ? (
                  articuloSeleccionado.contenido.map((parrafo, i) => (
                    <p key={i}>{parrafo}</p>
                  ))
                ) : (
                  <p>{articuloSeleccionado.resumen}</p>
                )}
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div className="educacion__grid">
          {articulosFiltrados.map(articulo => (
            <article
              key={articulo.id}
              className="educacion__card"
              onClick={() => setArticuloSeleccionado(articulo)}
            >
              <div className="educacion__card-imagen-wrapper">
                <img
                  src={articulo.imagen}
                  alt={articulo.titulo}
                  className="educacion__card-imagen"
                />
                <span className="educacion__card-categoria">
                  {articulo.categoria}
                </span>
              </div>
              <div className="educacion__card-contenido">
                <h3 className="educacion__card-titulo">{articulo.titulo}</h3>
                <p className="educacion__card-resumen">{articulo.resumen}</p>
                <span className="educacion__card-fecha">{articulo.fecha}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {articulosFiltrados.length === 0 && !articuloSeleccionado && (
        <div className="educacion__vacio">
          <p>No hay artículos disponibles en esta categoría.</p>
        </div>
      )}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} fontScale={tamañoLetra} />}
    </main>
  )
}
