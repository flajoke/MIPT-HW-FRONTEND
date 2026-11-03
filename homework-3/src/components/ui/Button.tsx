import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', children, className = '', ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button className={`${variant === 'primary' ? 'primary-button' : 'secondary-button'} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export default Button
