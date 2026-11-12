import Modal from './ui/Modal'

const PASOS = [
    { titulo: "1. Sube tus fotos", descripcion: "Arrastra o selecciona hasta 5 fotos del problema. Formatos aceptados: JPG, PNG, WEBP." },
    { titulo: "2. Selecciona una categoría", descripcion: "Elige la categoría que mejor describa la incidencia (basura, contenedor dañado, escombros, etc.)." },
    { titulo: "3. Escribe o genera una descripción", descripcion: "Describe el problema con detalle o usa el botón de IA para generar una descripción automática." },
    { titulo: "4. Registra la incidencia", descripcion: "Haz clic en «Registrar incidencia». Tu reporte quedará guardado en el sistema." },
]

const FAQS = [
    { pregunta: "¿Cuánto tarda en revisarse mi reporte?", respuesta: "El equipo municipal revisa los reportes en un plazo de 24 a 48 horas hábiles." },
    { pregunta: "¿Qué pasa después de enviar?", respuesta: "Tu incidencia queda registrada y puedes hacerle seguimiento desde la sección «Seguimiento de Incidencias»." },
    { pregunta: "¿Puedo registrar sin fotos?", respuesta: "No, al menos una foto es obligatoria para validar la incidencia." },
    { pregunta: "¿Qué hace la IA?", respuesta: "Analiza tus fotos y genera automáticamente una descripción del problema." },
    { pregunta: "¿Para qué sirven los botones de tamaño de letra?", respuesta: "Permiten modificar el tamaño de la letra de los títulos y demás textos." },
    { pregunta: "¿Para qué sirve el botón de la luna?", respuesta: "Cambia la página a modo oscuro. Presiónalo otra vez para volver al modo claro." },
    { pregunta: "¿Cómo funciona el dictado por voz?", respuesta: "Mantén presionado el botón mientras dictas la descripción y tu voz se convertirá en texto." },
    { pregunta: "¿Cómo funciona la búsqueda por voz?", respuesta: "Haz clic en el micrófono, menciona el título de la incidencia y presiona «Detener»." },
]

export default function HelpModal({ onClose }) {
    return (
        <Modal isOpen={true} onClose={onClose} title="¿Cómo funciona?" size="lg">
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
