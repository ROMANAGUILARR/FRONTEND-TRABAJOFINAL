export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="ai-modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="ai-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="ai-modal__title">
          ¿Estás seguro de eliminar esta incidencia?
        </h2>
        <p className="ai-modal__message">
          Esta acción no se puede deshacer. La incidencia será eliminada permanentemente.
        </p>
        <div className="ai-modal__actions">
          <button type="button" className="ai-modal__btn" style={{ background: '#C62828', color: '#fff' }} onClick={onConfirm}>
            Confirmar
          </button>
          <button type="button" className="ai-modal__btn ai-modal__btn--no" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
