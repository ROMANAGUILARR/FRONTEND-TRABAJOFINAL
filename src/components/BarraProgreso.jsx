const puntosCategoria = [
    { puntosNecesarios: 10, insignia: 'Primer reporte' },
    { puntosNecesarios: 50, insignia: 'Reportero activo' },
    { puntosNecesarios: 100, insignia: 'Guardian del barrio' },
    { puntosNecesarios: 150, insignia: 'EcoHeroe' },
    { puntosNecesarios: 200, insignia: 'Embajador EcoSolido' },
]
export default function BarraProgreso({ puntos }) {
    const puntosNum = Number(puntos)
    const maxPuntos = 200
    const nivelActual = [...puntosCategoria].reverse().find(nivel => puntos >= nivel.puntosNecesarios)
    const nivelSiguiente = puntosCategoria.find(nivel => puntos < nivel.puntosNecesarios)
    const puntosBase = nivelActual?.puntosNecesarios ?? 0
    const puntajeMaximo = nivelSiguiente?.puntosNecesarios ?? maxPuntos
    const progreso = Math.min(((puntos - puntosBase) / (puntajeMaximo - puntosBase)) * 100, 100)
    return (
        <div className="flex flex-col gap-1.5 w-full py-2">
            <div className="flex justify-between text-sm font-semibold">
                <span>Te encuentras en la insignia: {nivelActual ? nivelActual.insignia : 'Sin insignia'}</span>
            </div>

            {/* Barra */}
            <div className="w-full h-[30px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-800 rounded-full transition-[width] duration-[400ms] ease-in-out"
                    style={{ width: `${progreso}%` }}
                />
            </div>

            {/* Meta */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
                {puntosNum === 0 ? (
                    <p className="text-base bg-eco-danger text-white p-2.5 rounded-md">
                        Aun no has realizado contribuciones. Registra tu primera incidencia!
                    </p>
                ) : nivelSiguiente ? (
                    <>
                        <span className="text-eco-text-secondary text-xs">
                            Actualmente tienes {puntos} puntos. Necesitas {puntajeMaximo - puntos} para llegar a ser:{' '}
                        </span>
                        <span className="text-eco-text-secondary text-sm font-bold">
                            <strong>{nivelSiguiente.insignia}</strong>
                        </span>
                    </>
                ) : (
                    <span>Has alcanzado el nivel maximo!</span>
                )}
            </div>
        </div>
    )
}
