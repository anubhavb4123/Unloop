import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { haptics } from '@/utils/haptics'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  glow?: boolean
  selected?: boolean
  hoverable?: boolean
}

export function Card({
  children,
  glow = false,
  selected = false,
  hoverable = true,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : undefined}
      onPointerDown={() => { if (props.onClick) haptics.medium() }}
      className={`
        relative rounded-xl p-5
        bg-bg-card/80 backdrop-blur-sm
        border transition-all duration-300
        ${selected
          ? 'border-gold/50 shadow-[0_0_25px_rgba(201,168,76,0.15)]'
          : 'border-border hover:border-border-hover'
        }
        ${glow ? 'animate-pulse-gold' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}
