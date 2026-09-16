import { useState } from 'react'

export default function Input({
  label,
  type = 'text',
  error,
  placeholder,
  value,
  onChange,
  required = false,
  showToggle = false,
  id,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showToggle ? (showPassword ? 'text' : 'password') : type
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-semibold text-sm text-eco-text uppercase tracking-wider"
        >
          {label}
          {required && <span className="text-eco-danger ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type={inputType}
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full border-2 bg-eco-bg-white text-eco-text rounded-md p-3 text-base transition-all duration-200 focus:outline-none focus:border-eco-primary focus:shadow-[0_0_0_3px_rgba(46,150,50,0.15)] max-sm:p-2.5 max-sm:text-sm ${showToggle ? 'pr-10' : ''} ${error ? 'border-eco-danger' : 'border-eco-border'}`}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute right-2 bg-transparent border-none cursor-pointer text-eco-text-secondary p-1 flex items-center justify-center w-8 h-8"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showPassword ? (
              // Ojo abierto (contraseña visible)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // Ojo cerrado (contraseña oculta)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <span className="text-eco-danger text-xs font-medium">{error}</span>
      )}
    </div>
  )
}
