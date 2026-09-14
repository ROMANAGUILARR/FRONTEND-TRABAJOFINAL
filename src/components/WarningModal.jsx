import Modal from './ui/Modal'
import Button from './ui/Button'

export default function WarningModal({ onClose, message, title, hidePrefix }) {
  return (
    <Modal isOpen={true} onClose={onClose} title={title || 'Advertencia'} size="sm">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>

        <p className="text-sm text-eco-text-secondary leading-relaxed mb-4">
          {!hidePrefix && (
            <>Su incidencia no se ha podido registrar.<br /></>
          )}
          {message || 'No ha colocado foto alguna.'}
        </p>

        <Button variant="primary" fullWidth onClick={onClose}>
          Aceptar
        </Button>
      </div>
    </Modal>
  )
}
