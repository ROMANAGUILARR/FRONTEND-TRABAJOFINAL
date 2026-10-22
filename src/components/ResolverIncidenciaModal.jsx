import { useEffect, useMemo, useRef, useState } from 'react'
import { resolverIncidencia } from '../services/cuadrillasApi'
import './Cuadrillas.css'

const MAX_FOTOS = 5

/** Marca la incidencia como resuelta subiendo fotos del trabajo terminado (obligatorio). */
export default function ResolverIncidenciaModal({ incidencia, onClose, onResuelta }) {
  const [archivos, setArchivos] = useState([])
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  // Vistas previas de las fotos elegidas (se liberan al cambiar la selección)
  const previas = useMemo(() => archivos.map((f) => URL.createObjectURL(f)), [archivos])
  useEffect(() => () => previas.forEach((u) => URL.revokeObjectURL(u)), [previas])

  useEffect(() => {
    const alPresionar = (e) => { if (e.key === 'Escape' && !enviando) onClose() }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [onClose, enviando])

  function agregar(e) {
    const nuevos = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
    setArchivos((prev) => [...prev, ...nuevos].slice(0, MAX_FOTOS))
    e.target.value = ''
  }

  function quitar(indice) {
    setArchivos((prev) => prev.filter((_, i) => i !== indice))
  }

  async function enviar() {
    if (archivos.length === 0) {
      setError('Adjunta al menos una foto del trabajo terminado.')
      return
    }
    setEnviando(true)
    setError(null)
    try {
      const actualizada = await resolverIncidencia(incidencia.idIncidencia, archivos, comentario)
      onResuelta(actualizada)
    } catch (e) {
      setError(e.message)
      setEnviando(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={() => !enviando && onClose()}>
      <div className="admin-modal cuad-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="resolver-titulo">
        <h3 className="admin-modal__title" id="resolver-titulo">
          <i className="fa-solid fa-circle-check" style={{ marginRight: 8 }}></i>Marcar como resuelta
        </h3>
        <p className="cuad-modal__contexto">
          <strong>{incidencia.titulo || incidencia.categoria}</strong>
          <span><strong>Ubicación:</strong> {incidencia.direccionTexto || 'Sin dirección registrada'}</span>
          <span><strong>Atendida por:</strong> {incidencia.cuadrillaNombre}</span>
        </p>

        {error && <p className="cuad-alerta cuad-alerta--error">{error}</p>}

        <div className="cuad-antes-despues">
          {incidencia.urlsImagenes?.[0] && (
            <figure>
              <img src={incidencia.urlsImagenes[0]} alt="Foto del reporte" />
              <figcaption>Antes</figcaption>
            </figure>
          )}
          <div className="cuad-evidencias">
            <span className="admin-modal__label">
              Fotos del trabajo terminado <span className="required-asterisk">*</span>
            </span>
            <div className="cuad-evidencias__grid">
              {previas.map((url, i) => (
                <div key={url} className="cuad-evidencias__item">
                  <img src={url} alt={`Evidencia ${i + 1}`} />
                  <button type="button" onClick={() => quitar(i)} aria-label={`Quitar foto ${i + 1}`} disabled={enviando}>×</button>
                </div>
              ))}
              {archivos.length < MAX_FOTOS && (
                <button
                  type="button"
                  className="cuad-evidencias__agregar"
                  onClick={() => inputRef.current?.click()}
                  disabled={enviando}
                >
                  <i className="fa-solid fa-camera" aria-hidden="true"></i>
                  <span>Agregar foto</span>
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              hidden
              onChange={agregar}
            />
            <span className="cuad-ayuda">Hasta {MAX_FOTOS} fotos. El ciudadano las verá en su seguimiento.</span>
          </div>
        </div>

        <label className="admin-modal__label" htmlFor="resolver-comentario">Comentario (opcional)</label>
        <textarea
          id="resolver-comentario"
          className="admin-input"
          maxLength={500}
          rows={3}
          placeholder="Ej.: Se retiraron 3 m³ de residuos y se limpió la zona."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          disabled={enviando}
        />

        <div className="admin-modal__actions">
          <button type="button" className="admin-btn admin-btn--cancel" onClick={onClose} disabled={enviando}>Cancelar</button>
          <button type="button" className="admin-btn admin-btn--save" onClick={enviar} disabled={enviando || archivos.length === 0}>
            {enviando ? 'Subiendo fotos…' : 'Marcar como resuelta'}
          </button>
        </div>
      </div>
    </div>
  )
}
