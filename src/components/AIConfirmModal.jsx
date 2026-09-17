export default function AIConfirmModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }} onClick={onCancel}>
      <div style={{
        background: 'var(--color-bg-white, #fff)',
        borderRadius: '16px', padding: '32px',
        maxWidth: '440px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
        position: 'relative',
      }} onClick={e => e.stopPropagation()}>
        {/* Título principal */}
        <h3 style={{
          margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 700,
          color: 'var(--color-text, #111)',
        }}>
          Confirmación de generación de texto por IA
        </h3>

        {/* Subtítulo */}
        <p style={{
          margin: '0 0 4px', fontSize: '1rem',
          color: 'var(--color-text, #111)', fontWeight: 600,
        }}>
          ¿Estás seguro de hacer esto?
        </p>

        {/* Descripción */}
        <p style={{
          margin: '0 0 24px', fontSize: '0.9rem',
          color: 'var(--color-text-secondary, #555)',
          lineHeight: 1.5,
        }}>
          Recuerda que solo va a describir las fotos que has enviado.
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              background: '#2E7D32', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '12px 32px', fontSize: '0.9rem',
              fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1b5e20'}
            onMouseOut={e => e.currentTarget.style.background = '#2E7D32'}
          >
            Sí
          </button>
          <button
            onClick={onCancel}
            style={{
              background: 'var(--color-bg, #f5f5f5)', color: 'var(--color-text, #333)',
              border: '1px solid var(--color-border, #ddd)', borderRadius: '10px',
              padding: '12px 32px', fontSize: '0.9rem',
              fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--color-border, #e0e0e0)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--color-bg, #f5f5f5)'}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}