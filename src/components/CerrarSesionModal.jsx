import Modal from './ui/Modal'
import Button from './ui/Button'

export default function CerrarSesionModal({ onConfirm, onCancel }) {
  return (
    <Modal isOpen={true} onClose={onCancel} title="¿Estás seguro de que deseas cerrar sesión?" size="sm">
      <div className="text-center">
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
