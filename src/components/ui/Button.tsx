import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { haptics } from '@/utils/haptics'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-gold to-bronze text-bg font-medium
    hover:from-gold-light hover:to-bronze-light
    shadow-[0_0_20px_rgba(201,168,76,0.15)]
    hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]
  `,
  secondary: `
    bg-transparent border border-gold/30 text-gold
    hover:bg-gold/10 hover:border-gold/50
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:text-text-primary hover:bg-white/5
  `,
  danger: `
    bg-transparent border border-danger/30 text-danger
    hover:bg-danger/10 hover:border-danger/50
  `,
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onPointerDown={() => { if (!disabled) haptics.light() }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-mono tracking-wide
        transition-all duration-300 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  )
}
