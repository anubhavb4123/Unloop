import { motion } from 'framer-motion'
import { useUnloopStore } from '@/store/useUnloopStore'
import { Button } from '@/components/ui/Button'

interface RealityCheckProps {
  onNext: () => void
  onBack: () => void
}

const panels = [
  {
    key: 'thinking' as const,
    title: 'What you THINK is happening',
    placeholder: 'I think...',
    accent: 'border-l-bronze/50',
    icon: '💭',
  },
  {
    key: 'known' as const,
    title: 'What is ACTUALLY known',
    placeholder: 'The facts are...',
    accent: 'border-l-gold/50',
    icon: '📌',
  },
  {
    key: 'assuming' as const,
    title: 'What you\'re ASSUMING',
    placeholder: 'I\'m assuming that...',
    accent: 'border-l-danger/40',
    icon: '⚠',
  },
]

export function RealityCheck({ onNext, onBack }: RealityCheckProps) {
  const { analysis, setRealityCheck } = useUnloopStore()

  const filledCount = Object.values(analysis.realityCheck).filter(v => v.trim().length > 0).length
  const canProceed = filledCount >= 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary">
          Reality check
        </h2>
        <p className="text-text-muted text-sm">
          Separate facts from assumptions. Your brain lies. Paper doesn't.
        </p>
      </div>

      <div className="space-y-4">
        {panels.map((panel, i) => (
          <motion.div
            key={panel.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`border-l-2 ${panel.accent} pl-4`}
          >
            <label className="flex items-center gap-2 mb-2">
              <span>{panel.icon}</span>
              <span className="text-xs text-text-secondary font-mono uppercase tracking-wider">
                {panel.title}
              </span>
            </label>
            <textarea
              value={analysis.realityCheck[panel.key]}
              onChange={(e) => setRealityCheck(panel.key, e.target.value)}
              placeholder={panel.placeholder}
              rows={2}
              maxLength={300}
              className="
                w-full bg-bg-input border border-border rounded-lg
                px-3 py-2.5 text-text-primary text-sm
                placeholder:text-text-muted/40
                focus:border-gold/30 focus:outline-none
                resize-none transition-colors duration-300
              "
            />
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="ghost" className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-[2]">Continue</Button>
      </div>
    </motion.div>
  )
}
