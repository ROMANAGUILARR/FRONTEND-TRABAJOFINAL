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

  async function imprimir() {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 20
    let y = margin

    // Logo
    try {
      pdf.addImage(logoEcoSolido, 'PNG', margin, y, 20, 20)
    } catch {}
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(46, 125, 50)
    pdf.text('Hoja de Recuento de Registro de Incidencias', margin + 25, y + 10)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Sistema de Gestion Ambiental - EcoSolido', margin + 25, y + 16)
    y += 28

    // Línea verde
    pdf.setDrawColor(46, 125, 50)
    pdf.setLineWidth(0.8)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 10

    // Fecha
    pdf.setFontSize(10)
    pdf.setTextColor(50, 50, 50)
    pdf.text('Fecha de solicitud: ' + fechaHoy, pageWidth - margin - 50, y)
    y += 10

    // Nombre
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Nombre: ' + usuario.nombreCompleto + ' ' + usuario.apellidoCompleto, margin, y)
    y += 12

    // Tabla
    const colWidths = [12, 70, 30, 45, 25]
    const headers = ['#', 'Descripcion', 'Estado', 'Ubicacion', 'Fecha']

    // Header
    pdf.setFillColor(46, 125, 50)
    pdf.rect(margin, y, colWidths.reduce((a, b) => a + b, 0), 8, 'F')
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    let x = margin
    headers.forEach((h, i) => {
      pdf.text(h, x + 2, y + 5.5)
      x += colWidths[i]
    })
    y += 8

    // Filas
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(50, 50, 50)
    incidencias.forEach((inc, idx) => {
      if (y > 260) { pdf.addPage(); y = margin }
      const bg = idx % 2 === 0 ? [249, 249, 249] : [255, 255, 255]
      pdf.setFillColor(...bg)
      pdf.rect(margin, y, colWidths.reduce((a, b) => a + b, 0), 7, 'F')
      pdf.setDrawColor(220, 220, 220)
      pdf.line(margin, y + 7, pageWidth - margin, y + 7)
      pdf.setFontSize(8)
      x = margin
      const vals = [
        String(idx + 1),
        (inc.descripcion || '').substring(0, 40),
        ESTADO_LABEL[inc.estado] || inc.estado,
        (inc.direccionTexto || 'No especificada').substring(0, 25),
        formatearFecha(inc.fecha)
      ]
      vals.forEach((v, i) => {
        pdf.text(v, x + 2, y + 5)
        x += colWidths[i]
      })
      y += 7
    })

    // Línea final
    pdf.setDrawColor(46, 125, 50)
    pdf.setLineWidth(0.8)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 10

    // Total
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(50, 50, 50)
    pdf.text('Total de registros: ' + incidencias.length, margin, y)
    y += 30

    // Firmas
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(80, 80, 80)
    pdf.line(margin + 10, y, margin + 70, y)
    pdf.text('Firma del Solicitante', margin + 15, y + 5)
    pdf.line(pageWidth - margin - 70, y, pageWidth - margin - 10, y)
    pdf.text('Fecha: ' + fechaHoy, pageWidth - margin - 60, y + 5)

    // Imprimir - abrir PDF en nueva ventana
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) {
      win.onload = () => { win.print() }
    }
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
