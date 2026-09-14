import Modal from './ui/Modal'

const PASOS = [
    { titulo: "1. Sube tus fotos", descripcion: "Arrastra o selecciona hasta 5 fotos del problema. Formatos aceptados: JPG, PNG, WEBP." },
    { titulo: "2. Selecciona una categoria", descripcion: "Elige la categoria que mejor describa la incidencia (basura, contenedor danado, escombros, etc.)." },
    { titulo: "3. Escribe o genera una descripcion", descripcion: "Describe el problema con detalle o usa el boton de IA para generar una descripcion automatica." },
    { titulo: "4. Registra la incidencia", descripcion: "Haz click en 'Registrar incidencia'. Tu reporte quedara guardado en el sistema." },
]

const FAQS = [
    { pregunta: "Cuanto tarda en revisarse mi reporte?", respuesta: "El equipo municipal revisa los reportes en un plazo de 24 a 48 horas habiles." },
    { pregunta: "Que pasa despues de enviar?", respuesta: "Tu incidencia queda registrada y puedes hacer seguimiento desde la seccion 'Seguimiento'." },
    { pregunta: "Puedo registrar sin fotos?", respuesta: "No, al menos una foto es obligatoria para validar la incidencia." },
    { pregunta: "Que hace la IA?", respuesta: "Analiza tus fotos y genera automaticamente una descripcion del problema." },
    { pregunta: "Para que sirven los botones de tamano de letra?", respuesta: "Permiten modificar el tamano de la fuente de los titulos y demas campos textuales." },
    { pregunta: "Para que sirve el boton de la luna?", respuesta: "Cambia la pestana a modo nocturno. Presione otra vez para volver al modo claro." },
    { pregunta: "Como funciona el dictado por voz?", respuesta: "Manten presionado el boton mientras dictas la descripcion y tu voz se convertira en texto." },
    { pregunta: "Como funciona la busqueda por voz?", respuesta: "Haz click en el microfono, menciona el titulo de la incidencia y presiona detener." },
]

export default function HelpModal({ onClose }) {
    return (
        <Modal isOpen={true} onClose={onClose} title="Como funciona?" size="lg">
            <div style={{ '--font-scale': 1 }}>
                <h3 className="text-base font-bold text-eco-text mb-3">Pasos para registrar una incidencia</h3>
                <ol className="list-decimal pl-5 mb-6 space-y-2">
                    {PASOS.map((paso, i) => (
                        <li key={i} className="text-sm text-eco-text">
                            <strong>{paso.titulo}</strong>
                            <p className="text-eco-text-secondary m-0 mt-1">{paso.descripcion}</p>
                        </li>
                    ))}
                </ol>

                <h3 className="text-base font-bold text-eco-text mb-3">Preguntas frecuentes</h3>
                <ul className="list-none p-0 space-y-3">
                    {FAQS.map((faq, i) => (
                        <li key={i} className="text-sm">
                            <strong className="text-eco-text">{faq.pregunta}</strong>
                            <p className="text-eco-text-secondary m-0 mt-1">{faq.respuesta}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </Modal>
    )
}
