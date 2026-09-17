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
        maxWidth: '420px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
        position: 'relative',
      }} onClick={e => e.stopPropagation()}>
        {/* Icono */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '1.5rem', color: '#2E7D32' }}></i>
        </div>

        {/* Título */}
        <h3 style={{
          margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700,
          color: 'var(--color-text, #111)',
        }}>
          ¿Generar descripción con IA?
        </h3>

        {/* Descripción */}
        <p style={{
          margin: '0 0 24px', fontSize: '0.9rem',
          color: 'var(--color-text-secondary, #555)',
          lineHeight: 1.5,
        }}>
          Se analizarán las fotos subidas y se generará automáticamente una descripción de la incidencia ambiental.
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              background: '#2E7D32', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '12px 28px', fontSize: '0.9rem',
              fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1b5e20'}
            onMouseOut={e => e.currentTarget.style.background = '#2E7D32'}
          >
            <i className="fa-solid fa-check"></i>
            Sí, generar
          </button>
          <button
            onClick={onCancel}
            style={{
              background: 'var(--color-bg, #f5f5f5)', color: 'var(--color-text, #333)',
              border: '1px solid var(--color-border, #ddd)', borderRadius: '10px',
              padding: '12px 28px', fontSize: '0.9rem',
              fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--color-border, #e0e0e0)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--color-bg, #f5f5f5)'}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}