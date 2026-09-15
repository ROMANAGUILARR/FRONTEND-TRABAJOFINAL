const variants = {
  default: 'bg-eco-bg-white border-eco-border',
  unlocked: 'bg-eco-bg-white border-eco-primary border-l-4 border-t border-r border-b shadow-lg',
  locked: 'bg-eco-bg-white border-eco-border border-l-4 border-l-gray-400',
  success: 'bg-green-50 dark:bg-green-900/30 border-eco-success border-2',
  danger: 'bg-red-50 dark:bg-red-900/30 border-eco-danger border-2',
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
      className={`rounded-lg shadow-md p-5 transition-all duration-200 border flex flex-col ${variants[variant]} ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </article>
  )
}
