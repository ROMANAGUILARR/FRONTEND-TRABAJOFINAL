export default function EditConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="ai-modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="ai-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="ai-modal__title">
          ¿Deseas editar esta incidencia?
        </h2>
        <p className="ai-modal__message">
          Se abrirá el formulario de edición donde podrás modificar la categoría, descripción, estado y ubicación.
        </p>
        <div className="ai-modal__actions">
          <button type="button" className="ai-modal__btn ai-modal__btn--no" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="ai-modal__btn" style={{ background: '#2E7D32', color: '#fff' }} onClick={onConfirm}>
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}
