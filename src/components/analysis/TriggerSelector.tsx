import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUnloopStore, type Trigger } from '@/store/useUnloopStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface TriggerSelectorProps {
  onNext: () => void
  onBack: () => void
}

const triggers: { id: Trigger; label: string; icon: string; description: string }[] = [
  { id: 'fear-of-loss', label: 'Fear of Loss', icon: '💔', description: 'Afraid of losing something or someone' },
  { id: 'fear-of-judgment', label: 'Fear of Judgment', icon: '👁', description: 'Worried about what others think' },
  { id: 'uncertainty', label: 'Uncertainty', icon: '🌫', description: 'Don\'t know what will happen' },
  { id: 'regret', label: 'Regret', icon: '↩', description: 'Replaying past decisions' },
]

export function TriggerSelector({ onNext, onBack }: TriggerSelectorProps) {
  const { analysis, setTrigger, setCustomTrigger } = useUnloopStore()
  const [showCustom, setShowCustom] = useState(analysis.trigger === 'custom')

  const handleSelect = (trigger: Trigger) => {
    setTrigger(trigger)
    if (trigger !== 'custom') setShowCustom(false)
  }

  const handleCustom = () => {
    setTrigger('custom')
    setShowCustom(true)
  }

  const canProceed = analysis.trigger !== null && (analysis.trigger !== 'custom' || analysis.customTrigger.trim().length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary">
          What's driving this?
        </h2>
        <p className="text-text-muted text-sm">
          Identify the emotional trigger underneath.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {triggers.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              selected={analysis.trigger === t.id}
              onClick={() => handleSelect(t.id)}
              className="cursor-pointer text-center py-4"
            >
              <span className="text-2xl block mb-2">{t.icon}</span>
              <span className="text-sm text-text-primary block font-mono">{t.label}</span>
              <span className="text-[10px] text-text-muted block mt-1">{t.description}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom trigger option */}
      <Card
        selected={analysis.trigger === 'custom'}
        onClick={handleCustom}
        className="cursor-pointer text-center py-3"
      >
        <span className="text-sm text-text-secondary font-mono">Something else...</span>
      </Card>

      {showCustom && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <input
            value={analysis.customTrigger}
            onChange={(e) => setCustomTrigger(e.target.value)}
            placeholder="Describe what's triggering this..."
            autoFocus
            maxLength={100}
            className="
              w-full bg-bg-input border border-border rounded-lg
              px-4 py-3 text-text-primary text-sm
              placeholder:text-text-muted/50
              focus:border-gold/40 focus:outline-none
              transition-colors duration-300
            "
          />
        </motion.div>
      )}

      <div className="flex gap-3">
        <Button onClick={onBack} variant="ghost" className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-[2]">Continue</Button>
      </div>
    </motion.div>
  )
}
