import { useEffect } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-5"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full ${sizes[size]} bg-eco-bg-white rounded-lg shadow-lg max-h-[85vh] flex flex-col ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-eco-border">
            <h2 id="modal-title" className="m-0 text-lg font-bold text-eco-text">
              {title}
            </h2>
            <button
              type="button"
              className="bg-transparent border-none text-2xl text-eco-text-secondary cursor-pointer p-0 leading-none hover:text-eco-text"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
