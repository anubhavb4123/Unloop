import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-text-muted font-mono">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-xs text-gold/60 font-mono">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-[2px] bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold to-bronze rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
