import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import logoEcoSolido from '../assets/LOGO ECOSOLIDO.png'
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

  function imprimir() {
    window.print()
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
    <div>
      {/* Botones de acción (no se imprimen) */}
      <div className="reporte-acciones">
        <button onClick={onVolver} className="reporte-btn reporte-btn--volver">
          Volver
        </button>
        <button onClick={descargarPDF} className="reporte-btn reporte-btn--pdf">
          Descargar PDF
        </button>
        <button onClick={imprimir} className="reporte-btn reporte-btn--print">
          Imprimir
        </button>
        <button onClick={descargarExcel} className="reporte-btn reporte-btn--excel">
          Descargar Excel
        </button>
      </div>

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

        <div className="reporte-total">
          Total de registros: {incidencias.length}
        </div>

        {/* Firma y fecha */}
        <div className="reporte-firma">
          <div className="reporte-firma-bloque">
            <div className="reporte-firma-linea"></div>
            <span className="reporte-firma-label">Firma del Solicitante</span>
          </div>
          <div className="reporte-firma-bloque">
            <div className="reporte-firma-linea"></div>
            <span className="reporte-firma-label">Fecha: {fechaHoy}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
