import Modal from './ui/Modal'
import Button from './ui/Button'

export default function AIConfirmModal({ onConfirm, onCancel }) {
  return (
    <Modal isOpen={true} onClose={onCancel} title="Generacion de texto por IA" size="sm">
      <div className="text-center">
        <div className="text-5xl mb-4">🤖</div>
        <p className="text-sm text-eco-text-secondary mb-6">
          ¿Estas seguro de hacer esto? Recuerda que solo va a describir las fotos que has enviado.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={onConfirm}>
            Si, generar descripcion
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
