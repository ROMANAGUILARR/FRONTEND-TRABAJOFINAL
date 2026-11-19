import { useLayoutEffect, useRef, useState } from 'react'
import './Comun.css'

/**
 * Muestra un texto largo recortado a pocas líneas con "…" y un botón
 * "Ver más" / "Ver menos". El botón solo aparece si el texto no cabe.
 */
export default function TextoExpandible({ texto, lineas = 2, className = '' }) {
  const [abierto, setAbierto] = useState(false)
  const [desborda, setDesborda] = useState(false)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || abierto) return
    const medir = () => setDesborda(el.scrollHeight - el.clientHeight > 1)
    medir()
    if (typeof ResizeObserver === 'undefined') return
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [texto, lineas, abierto])

  if (!texto) return null

  return (
    <div className={`texto-expandible ${className}`}>
      <p
        ref={ref}
        className={`texto-expandible__texto ${abierto ? '' : 'texto-expandible__texto--recortado'}`}
        style={abierto ? undefined : { WebkitLineClamp: lineas, lineClamp: lineas }}
      >
        {texto}
      </p>
      {(desborda || abierto) && (
        <button
          type="button"
          className="texto-expandible__btn"
          aria-expanded={abierto}
          onClick={(e) => { e.stopPropagation(); setAbierto((v) => !v) }}
        >
          {abierto ? 'Ver menos' : 'Ver más'}
          <i className={`fa-solid ${abierto ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
        </button>
      )}
    </div>
  )
}
