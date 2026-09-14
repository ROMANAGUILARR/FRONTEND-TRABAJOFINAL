import Modal from './ui/Modal'
import Button from './ui/Button'

export default function SuccessModal({ onClose, puntosGanados = 0, nuevasInsignias = [] }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Felicidades" size="sm">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>

        <p className="text-sm text-eco-text-secondary leading-relaxed mb-4">
          Su incidencia ha sido registrada exitosamente y ha sido establecida como
          Pendiente en el panel de 'Seguimiento de Incidencias'.
        </p>

        {puntosGanados > 0 && (
          <div className="bg-green-50 border border-eco-success text-eco-success rounded-md p-3 mb-4">
            🎉 ¡Has ganado <strong>{puntosGanados}</strong> puntos!
          </div>
        )}

        {nuevasInsignias.length > 0 && (
          <div className="bg-yellow-50 border border-eco-warning rounded-md p-4 mb-4 text-left">
            <p className="font-bold text-eco-text mb-2">🏅 ¡Nueva(s) insignia(s) desbloqueada(s)!</p>
            <ul className="list-none p-0 space-y-1.5">
              {nuevasInsignias.map((insignia, index) => (
                <li key={index} className="text-sm text-eco-text">
                  <strong>{typeof insignia === 'string' ? insignia : insignia.nombre}</strong>
                  {(typeof insignia !== 'string' && insignia.recompensa) && (
                    <span className="text-eco-text-secondary"> — 🎁 {insignia.recompensa}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs text-eco-text-secondary mt-2">
              Ya puedes visualizarla(s) y canjear los beneficios en "Recompensas al Ciudadano".
            </p>
          </div>
        )}

        <Button variant="success" fullWidth onClick={onClose}>
          Aceptar
        </Button>
      </div>
    </Modal>
  )
}
