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
            className="absolute right-2 bg-transparent border-none cursor-pointer text-eco-text-secondary p-1 text-sm"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? 'Ocultar' : 'Ver'}
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        )}
      </div>

      {error && (
        <span className="text-eco-danger text-xs font-medium">{error}</span>
      )}
    </div>
  )
}
