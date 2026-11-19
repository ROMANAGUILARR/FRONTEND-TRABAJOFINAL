import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { normalizarTexto } from '../../utils/zonas'
import './Comun.css'

/**
 * Campo de selección con buscador (autocompletar): el usuario escribe y la
 * lista se filtra, sin tener que bajar con scroll por todas las opciones.
 * No distingue mayúsculas ni tildes ("rimac" encuentra "Rímac").
 */
export default function SelectorBuscable({
  id, opciones, valor, onCambio, placeholder = 'Escribe para buscar…', maxLength, sinResultados = 'Sin coincidencias',
}) {
  const [abierto, setAbierto] = useState(false)
  const [resaltado, setResaltado] = useState(0)
  const contenedor = useRef(null)
  const lista = useRef(null)
  const idLista = `${useId()}-lista`

  const filtradas = useMemo(() => {
    const q = normalizarTexto(valor)
    if (!q) return opciones
    const empiezan = opciones.filter((o) => normalizarTexto(o).startsWith(q))
    const contienen = opciones.filter((o) => !normalizarTexto(o).startsWith(q) && normalizarTexto(o).includes(q))
    return [...empiezan, ...contienen]
  }, [opciones, valor])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function fuera(e) {
      if (contenedor.current && !contenedor.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  // Mantener visible la opción resaltada al moverse con el teclado
  useEffect(() => {
    lista.current?.children[resaltado]?.scrollIntoView?.({ block: 'nearest' })
  }, [resaltado])

  function elegir(opcion) {
    onCambio(opcion)
    setAbierto(false)
  }

  function teclado(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAbierto(true)
      setResaltado((i) => Math.min(i + 1, filtradas.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setResaltado((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && abierto && filtradas[resaltado]) {
      e.preventDefault()
      elegir(filtradas[resaltado])
    } else if (e.key === 'Escape') {
      setAbierto(false)
    }
  }

  return (
    <div className="selector-buscable" ref={contenedor}>
      <div className="selector-buscable__campo">
        <i className="fa-solid fa-magnifying-glass selector-buscable__lupa" aria-hidden="true"></i>
        <input
          id={id}
          type="text"
          className="admin-input selector-buscable__input"
          role="combobox"
          aria-expanded={abierto}
          aria-controls={idLista}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          maxLength={maxLength}
          value={valor}
          onFocus={() => setAbierto(true)}
          onChange={(e) => { onCambio(e.target.value); setAbierto(true); setResaltado(0) }}
          onKeyDown={teclado}
        />
        {valor && (
          <button type="button" className="selector-buscable__limpiar" aria-label="Borrar" onClick={() => { onCambio(''); setAbierto(true) }}>
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        )}
      </div>
      {abierto && (
        <ul className="selector-buscable__lista" id={idLista} role="listbox" ref={lista}>
          {filtradas.length === 0 ? (
            <li className="selector-buscable__vacio">{sinResultados}</li>
          ) : filtradas.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={o === valor}
              className={`selector-buscable__opcion ${i === resaltado ? 'selector-buscable__opcion--resaltada' : ''} ${o === valor ? 'selector-buscable__opcion--elegida' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); elegir(o) }}
              onMouseEnter={() => setResaltado(i)}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
