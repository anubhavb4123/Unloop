import { useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUnloopStore } from '@/store/useUnloopStore'
import { getSuggestions, getLoopTypeLabel, getLoopTypeMessage } from '@/utils/suggestions'
import { Button } from '@/components/ui/Button'
import { haptics } from '@/utils/haptics'

export function ClosureScreen() {
  const navigate = useNavigate()
  const { analysis, detectLoopType, saveSession, resetAnalysis } = useUnloopStore()

  const loopType = useMemo(() => detectLoopType(), [analysis.trigger, analysis.realityCheck])
  const suggestions = useMemo(() => getSuggestions(analysis.trigger), [analysis.trigger])

  useEffect(() => { haptics.strong() }, [])

  const handleEnd = () => {
    haptics.complete()
    saveSession()
    resetAnalysis()
    navigate('/post-relief')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 text-center"
    >
      {/* Unloop animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex justify-center"
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="closureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#a67c52" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="40" cy="40" r="30"
            fill="none"
            stroke="url(#closureGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="188"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 188 }}
            transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* Loop type */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <span className="text-[10px] text-gold/70 font-mono uppercase tracking-widest">
          {getLoopTypeLabel(loopType)}
        </span>
      </motion.div>

      {/* Closure message */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="space-y-3">
        <h2 className="font-serif text-xl md:text-2xl text-text-primary leading-snug">
          You've analyzed this logically.
          <br />
          Further thinking won't change the outcome.
        </h2>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          {getLoopTypeMessage(loopType)}
        </p>
      </motion.div>

      {/* Session summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="bg-bg-card border border-border rounded-xl p-4 text-left space-y-2 max-w-sm mx-auto"
      >
        <div className="flex items-start gap-2">
          <span className="text-text-muted text-[10px] font-mono min-w-[60px]">THOUGHT</span>
          <span className="text-text-secondary text-xs">{analysis.thought.slice(0, 80)}{analysis.thought.length > 80 ? '...' : ''}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-text-muted text-[10px] font-mono min-w-[60px]">TRIGGER</span>
          <span className="text-text-secondary text-xs">{analysis.trigger === 'custom' ? analysis.customTrigger : analysis.trigger?.replace(/-/g, ' ')}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-text-muted text-[10px] font-mono min-w-[60px]">ACTION</span>
          <span className="text-gold text-xs">{analysis.actionChoice?.replace(/-/g, ' ')}</span>
        </div>
        {analysis.actionNote && (
          <div className="flex items-start gap-2">
            <span className="text-text-muted text-[10px] font-mono min-w-[60px]">NOTE</span>
            <span className="text-text-secondary text-xs italic">{analysis.actionNote}</span>
          </div>
        )}
      </motion.div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="space-y-2">
        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Suggested next</span>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.slice(0, 2).map((s, i) => (
            <span key={i} className="text-xs bg-bg-elevated border border-border rounded-full px-3 py-1.5 text-text-secondary">
              {s.icon} {s.title}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <Button onClick={handleEnd} size="lg" fullWidth>
          End this loop
        </Button>
      </motion.div>
    </motion.div>
  )
}
