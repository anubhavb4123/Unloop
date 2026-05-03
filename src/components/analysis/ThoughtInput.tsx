import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useUnloopStore } from '@/store/useUnloopStore'
import { Button } from '@/components/ui/Button'
import { haptics } from '@/utils/haptics'

interface ThoughtInputProps {
  onNext: () => void
}

export function ThoughtInput({ onNext }: ThoughtInputProps) {
  const { analysis, setThought, checkReEntry } = useUnloopStore()
  const [reEntryWarning, setReEntryWarning] = useState<string | null>(null)
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const checkForReEntry = useCallback((text: string) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      if (text.length > 10) {
        const existing = checkReEntry(text)
        if (existing) {
          setReEntryWarning("You've already analyzed this thought. Further thinking won't change the outcome.")
          haptics.warning()
        } else {
          setReEntryWarning(null)
        }
      }
    }, 500)
    setDebounceTimer(timer)
  }, [checkReEntry, debounceTimer])

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [debounceTimer])

  const handleChange = (value: string) => {
    setThought(value)
    checkForReEntry(value)
  }

  const canProceed = analysis.thought.trim().length > 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary">
          What are you overthinking?
        </h2>
        <p className="text-text-muted text-sm">
          Write it down. Get it out of your head.
        </p>
      </div>

      <div className="relative">
        <textarea
          value={analysis.thought}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="The thing that keeps playing in my mind is..."
          autoFocus
          rows={5}
          maxLength={500}
          className="
            w-full bg-bg-input border border-border rounded-lg
            px-4 py-3 text-text-primary text-sm
            placeholder:text-text-muted/50
            focus:border-gold/40 focus:outline-none
            resize-none transition-colors duration-300
          "
        />
        <span className="absolute bottom-3 right-3 text-[10px] text-text-muted">
          {analysis.thought.length}/500
        </span>
      </div>

      {reEntryWarning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gold/5 border border-gold/20 rounded-lg px-4 py-3"
        >
          <p className="text-gold text-xs font-mono leading-relaxed">
            ⚠ {reEntryWarning}
          </p>
          <p className="text-text-muted text-xs mt-2">
            You can still continue, but recognize the pattern.
          </p>
        </motion.div>
      )}

      <Button
        onClick={onNext}
        disabled={!canProceed}
        fullWidth
        size="lg"
      >
        Continue
      </Button>
    </motion.div>
  )
}
