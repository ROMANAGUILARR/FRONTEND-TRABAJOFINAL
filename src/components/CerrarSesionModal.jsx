import Modal from './ui/Modal'
import Button from './ui/Button'

export default function CerrarSesionModal({ onConfirm, onCancel }) {
  return (
    <Modal isOpen={true} onClose={onCancel} title="Confirmacion de cierre de sesion" size="sm">
      <div className="text-center">
        <div className="text-5xl mb-4">🚪</div>
        <p className="text-sm text-eco-text-secondary mb-6">
          ¿Estas seguro de que deseas cerrar sesion?
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="danger" size="md" onClick={onConfirm}>
            Si, cerrar sesion
          </Button>
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
