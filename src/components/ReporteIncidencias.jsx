import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import logoEcoSolido from '../assets/LOGO ECOSOLIDO.png'
import { MOCK_INSIGNIAS } from '../services/mockData'
import './ReporteIncidencias.css'

const ESTADO_BADGE = {
  RESUELTO: 'reporte-estado-badge--resuelto',
  EN_PROCESO: 'reporte-estado-badge--proceso',
  PENDIENTE: 'reporte-estado-badge--pendiente',
}

const ESTADO_LABEL = {
  RESUELTO: 'Resuelto',
  EN_PROCESO: 'En Proceso',
  PENDIENTE: 'Pendiente',
}

export default function ReporteIncidencias({ usuario, incidencias, onVolver }) {
  const reporteRef = useRef(null)

  const formatearFecha = (fechaString) => {
    if (!fechaString) return ''
    const fecha = new Date(fechaString)
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha).replace(/\//g, '-')
  }

  const fechaHoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')

  async function descargarPDF() {
    const elemento = reporteRef.current
    const canvas = await html2canvas(elemento, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`Reporte_${usuario.nombreCompleto}_${usuario.apellidoCompleto}.pdf`)
  }

  function descargarExcel() {
    const datos = incidencias.map((inc, i) => ({
      '#': i + 1,
      'Descripción': inc.descripcion,
      'Estado': ESTADO_LABEL[inc.estado] || inc.estado,
      'Ubicación': inc.direccionTexto || 'No especificada',
      'Fecha': formatearFecha(inc.fecha),
    }))
    const ws = XLSX.utils.json_to_sheet(datos)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Incidencias')
    XLSX.writeFile(wb, `Reporte_${usuario.nombreCompleto}_${usuario.apellidoCompleto}.xlsx`)
  }

  return (
    <div className="reporte-print-area">
      {/* Plantilla del reporte */}
      <div ref={reporteRef} className="reporte-container">
        {/* Encabezado */}
        <div className="reporte-header">
          <img src={logoEcoSolido} alt="EcoSolido" className="reporte-logo" />
          <div className="reporte-titulo">
            <h1>Hoja de Recuento de Registro de Incidencias</h1>
            <p>Sistema de Gestión Ambiental — EcoSolido</p>
          </div>
        </div>

        <div className="reporte-fecha-solicitud">
          Fecha de solicitud: {fechaHoy}
        </div>

        <div className="reporte-usuario-nombre">
          Nombre: {usuario.nombreCompleto} {usuario.apellidoCompleto}
        </div>

        {/* Tabla de registros */}
        <table className="reporte-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Descripción</th>
              <th>Estado de Registro</th>
              <th>Ubicación</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No hay registros de incidencias para este usuario.
                </td>
              </tr>
            ) : (
              incidencias.map((inc, i) => (
                <tr key={inc.id || i}>
                  <td>{i + 1}</td>
                  <td>{inc.descripcion}</td>
                  <td>
                    <span className={`reporte-estado-badge ${ESTADO_BADGE[inc.estado] || ''}`}>
                      {ESTADO_LABEL[inc.estado] || inc.estado}
                    </span>
                  </td>
                  <td>{inc.direccionTexto || 'No especificada'}</td>
                  <td>{formatearFecha(inc.fecha)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Resumen de insignias */}
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111', margin: '0 0 16px' }}>
            Resumen de {usuario.nombreCompleto} {usuario.apellidoCompleto}: {' '}
            <span style={{ color: '#2E7D32', fontWeight: 800 }}>{incidencias.length * 10}</span> puntos acumulados
          </h3>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Insignias
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', alignItems: 'stretch' }}>
            {(() => {
              const colores = [
                { bg: '#e8f5e9', border: '#A5D6A7', icon: '#2E7D32' },
                { bg: '#E3F2FD', border: '#90CAF9', icon: '#1565C0' },
                { bg: '#FFF3E0', border: '#FFCC80', icon: '#E65100' },
                { bg: '#F3E5F5', border: '#CE93D8', icon: '#7B1FA2' },
                { bg: '#E0F2F1', border: '#80CBC4', icon: '#00695C' },
              ]
              return MOCK_INSIGNIAS.map((insignia, idx) => {
                const desbloqueada = incidencias.length >= insignia.requisitoIncidencias
                const progreso = Math.min(incidencias.length / insignia.requisitoIncidencias, 1)
                const c = colores[idx % colores.length]
                return (
                  <div key={insignia.idInsignia} style={{
                    background: desbloqueada ? c.bg : '#f5f5f5',
                    border: desbloqueada ? `1px solid ${c.border}` : '1px solid #e0e0e0',
                    borderRadius: '10px', padding: '10px',
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    height: '100%',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                          background: desbloqueada ? c.icon : '#bdbdbd',
                          color: '#fff', fontSize: '0.75rem',
                        }}>
                          <i className={desbloqueada ? 'fa-solid fa-check' : 'fa-solid fa-lock'}></i>
                        </span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <strong style={{ fontSize: '0.78rem', fontWeight: 700, color: desbloqueada ? '#111' : '#999', display: 'block', lineHeight: 1.2 }}>
                            {insignia.nombre}
                          </strong>
                          <span style={{ fontSize: '0.65rem', color: desbloqueada ? c.icon : '#bbb', fontWeight: 600 }}>
                            {desbloqueada ? 'Desbloqueada' : `${incidencias.length}/${insignia.requisitoIncidencias}`}
                          </span>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.65rem', color: desbloqueada ? '#555' : '#bbb', lineHeight: 1.4, flex: 1 }}>
                        {insignia.descripcion}
                      </p>
                      <div style={{
                        width: '100%', height: '4px', borderRadius: '2px',
                        background: desbloqueada ? `${c.icon}30` : '#e0e0e0',
                        overflow: 'hidden', flexShrink: 0,
                      }}>
                        <div style={{
                          width: `${progreso * 100}%`, height: '100%', borderRadius: '2px',
                          background: desbloqueada ? c.icon : '#999',
                        }} />
                      </div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Firmas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', paddingTop: '8px' }}>
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <div style={{ borderTop: '1px solid #333', marginBottom: '4px' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Firma del Solicitante</span>
          </div>
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <div style={{ borderTop: '1px solid #333', marginBottom: '4px' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Firma del Jefe de Municipalidad</span>
          </div>
        </div>
      </div>

      {/* Botones de acción (debajo de la plantilla) */}
      <div className="reporte-acciones" style={{ marginTop: '24px', justifyContent: 'center', gap: '20px' }}>
        <button onClick={onVolver} className="reporte-btn reporte-btn--volver">
          Volver
        </button>
        <button onClick={descargarPDF} className="reporte-btn reporte-btn--pdf">
          Descargar PDF
        </button>
        <button onClick={descargarExcel} className="reporte-btn reporte-btn--excel">
          Descargar Excel
        </button>
      </div>
    </div>
  )
}
