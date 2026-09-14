const variants = {
  default: 'bg-eco-bg-white border-eco-border',
  unlocked: 'bg-eco-bg-white border-eco-primary border-2',
  locked: 'bg-eco-bg-white border-eco-border opacity-80',
  success: 'bg-green-50 border-eco-success border-2',
  danger: 'bg-red-50 border-eco-danger border-2',
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) {
  return (
    <article
      onClick={onClick}
      className={`rounded-lg shadow-md p-5 transition-all duration-200 border ${variants[variant]} ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </article>
  )
}
