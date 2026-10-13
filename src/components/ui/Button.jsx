const variants = {
  primary: 'bg-eco-primary text-white hover:bg-eco-primary-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  danger: 'bg-eco-danger text-white hover:bg-red-500 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'bg-eco-gray text-white hover:bg-eco-gray-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  success: 'bg-eco-success text-white hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'bg-transparent text-eco-primary hover:bg-eco-primary/10',
  link: 'bg-transparent text-eco-primary font-semibold p-0 hover:text-eco-primary-dark hover:underline',
}

const sizes = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-3.5 px-7 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const isLink = variant === 'link'
  const baseClasses = isLink
    ? 'inline-flex items-center justify-center gap-2 font-semibold rounded-md border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
    : 'inline-flex items-center justify-center gap-2 font-semibold rounded-md border-none cursor-pointer transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
