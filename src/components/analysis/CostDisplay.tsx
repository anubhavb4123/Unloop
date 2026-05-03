import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUnloopStore } from '@/store/useUnloopStore'
import { Button } from '@/components/ui/Button'

interface CostDisplayProps {
  onNext: () => void
  onBack: () => void
}

export function CostDisplay({ onNext, onBack }: CostDisplayProps) {
  const { getSessionDuration } = useUnloopStore()
  const [elapsed, setElapsed] = useState(0)
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getSessionDuration())
    }, 1000)
    return () => clearInterval(interval)
  }, [getSessionDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary">
          The cost of this loop
        </h2>
        <p className="text-text-muted text-sm">
          Overthinking has a price. Here's what it's costing you.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Time metric */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card border border-border rounded-xl p-4 text-center"
        >
          <span className="text-2xl block mb-1">⏱</span>
          <motion.span
            key={elapsed}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-2xl md:text-3xl font-serif text-gold block"
          >
            {formatTime(elapsed)}
          </motion.span>
          <span className="text-[10px] text-text-muted block mt-1">
            spent in this session
          </span>
        </motion.div>

        {/* Emotional cost */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-card border border-border rounded-xl p-4 text-center"
        >
          <span className="text-2xl block mb-1">🧠</span>
          <div className="flex justify-center gap-0.5 my-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="w-2 bg-gradient-to-t from-bronze to-gold rounded-full origin-bottom"
                style={{ height: `${12 + i * 6}px` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-text-muted block mt-1">
            mental energy drained
          </span>
        </motion.div>
      </div>

      {/* The question */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-bg-elevated border border-gold/10 rounded-xl p-5 text-center"
      >
        <p className="font-serif text-lg text-text-primary mb-4">
          Has anything changed by thinking about this repeatedly?
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => setAnswer('yes')}
            variant={answer === 'yes' ? 'primary' : 'secondary'}
            size="sm"
          >
            Yes
          </Button>
          <Button
            onClick={() => setAnswer('no')}
            variant={answer === 'no' ? 'primary' : 'secondary'}
            size="sm"
          >
            No
          </Button>
        </div>

        {answer && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-text-muted mt-3"
          >
            {answer === 'no'
              ? 'Exactly. Repeating the same thought doesn\'t produce new answers.'
              : 'Good. Then you already know what to do. Stop looping and act.'}
          </motion.p>
        )}
      </motion.div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="ghost" className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!answer} className="flex-[2]">Continue</Button>
      </div>
    </motion.div>
  )
}
