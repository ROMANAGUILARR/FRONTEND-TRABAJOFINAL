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
    const elemento = reporteRef.current
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const html = `<!DOCTYPE html>
<html>
<head>
<title>Reporte</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;padding:30px;color:#111;background:#fff}
.reporte-container{max-width:800px;margin:0 auto}
.reporte-header{display:flex;align-items:center;gap:16px;margin-bottom:8px;border-bottom:3px solid #2E7D32;padding-bottom:16px}
.reporte-logo{width:70px;height:70px;object-fit:contain}
.reporte-titulo h1{font-size:18px;font-weight:700;color:#2E7D32;text-transform:uppercase}
.reporte-titulo p{font-size:12px;color:#666;margin-top:4px}
.reporte-fecha-solicitud{text-align:right;font-size:13px;color:#333;margin-bottom:24px}
.reporte-usuario-nombre{font-size:15px;font-weight:600;color:#333;margin-bottom:16px}
.reporte-tabla{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px}
.reporte-tabla thead th{background:#2E7D32;color:#fff;padding:10px 12px;text-align:left;font-weight:600;font-size:12px;text-transform:uppercase}
.reporte-tabla tbody td{padding:8px 12px;border-bottom:1px solid #ddd;color:#333}
.reporte-tabla tbody tr:nth-child(even){background:#f9f9f9}
.reporte-tabla tbody tr:last-child td{border-bottom:2px solid #2E7D32}
.reporte-total{font-size:14px;font-weight:600;color:#333;margin-bottom:40px}
.reporte-firma{display:flex;justify-content:space-between;margin-top:60px;padding-top:8px}
.reporte-firma-bloque{text-align:center;min-width:200px}
.reporte-firma-linea{border-top:1px solid #333;margin-bottom:4px}
.reporte-firma-label{font-size:12px;color:#555}
.reporte-estado-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}
.reporte-estado-badge--resuelto{background:#E8F5E9;color:#2E7D32}
.reporte-estado-badge--proceso{background:#E3F2FD;color:#1565C0}
.reporte-estado-badge--pendiente{background:#FFF3E0;color:#E65100}
.reporte-acciones{display:none}
@media print{body{padding:0}}
</style>
</head>
<body>
${elemento.outerHTML}
</body>
</html>`

    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => document.body.removeChild(iframe), 1000)
    }, 600)
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
