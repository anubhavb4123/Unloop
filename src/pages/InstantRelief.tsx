import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { haptics } from '@/utils/haptics'

type Exercise = 'breathing' | 'stretch' | 'hand-raise'

const exercises: { id: Exercise; label: string; icon: string }[] = [
  { id: 'breathing', label: 'Breathe', icon: '🫁' },
  { id: 'stretch', label: 'Stretch', icon: '🧘' },
  { id: 'hand-raise', label: 'Raise', icon: '🙌' },
]

const feedbackMessages = [
  'Good, keep going.',
  'Nice. Stay with the motion.',
  'You\'re doing well.',
  'Don\'t think. Just follow.',
  'Let the tension leave.',
  'Almost there. Stay present.',
]

export default function InstantRelief() {
  const navigate = useNavigate()
  const [exercise, setExercise] = useState<Exercise>('breathing')
  const [elapsed, setElapsed] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [stretchStep, setStretchStep] = useState(0)

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Feedback rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedback(feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)])
      haptics.double()
    }, 8000)
    setFeedback(feedbackMessages[0])
    return () => clearInterval(interval)
  }, [])

  // Breathing cycle with haptic cues
  useEffect(() => {
    if (exercise !== 'breathing') return
    const cycle = () => {
      setPhase('inhale')
      haptics.breatheIn()
      setTimeout(() => { setPhase('hold'); haptics.breatheHold() }, 4000)
      setTimeout(() => { setPhase('exhale'); haptics.breatheOut() }, 7000)
    }
    cycle()
    const interval = setInterval(cycle, 11000)
    return () => clearInterval(interval)
  }, [exercise])

  // Stretch cycle with haptic nudge
  useEffect(() => {
    if (exercise !== 'stretch' && exercise !== 'hand-raise') return
    const interval = setInterval(() => {
      setStretchStep(s => (s + 1) % 4)
      haptics.stretchStep()
    }, 5000)
    return () => clearInterval(interval)
  }, [exercise])

  const stretchInstructions = [
    'Roll your neck slowly to the left...',
    'Now roll to the right...',
    'Drop your shoulders. Release the tension.',
    'Tilt your head back. Breathe.',
  ]

  const raiseInstructions = [
    'Raise both hands above your head slowly...',
    'Stretch upward. Feel the pull.',
    'Hold... breathe...',
    'Slowly bring them down.',
  ]

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleExit = () => { haptics.complete(); navigate('/post-relief') }

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Exit button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleExit}
        className="absolute top-4 right-4 text-text-muted hover:text-text-secondary text-xs font-mono cursor-pointer z-10 bg-transparent border-none"
      >
        exit ×
      </motion.button>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4 text-text-muted/40 text-xs font-mono"
      >
        {formatTime(elapsed)}
      </motion.div>

      {/* Header */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-text-muted text-xs font-mono tracking-wider mb-8 uppercase"
      >
        Follow this. Don't think.
      </motion.p>

      {/* Exercise selector */}
      <div className="flex gap-2 mb-10">
        {exercises.map(e => (
          <button
            key={e.id}
            onClick={() => { setExercise(e.id); haptics.switchExercise() }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer border transition-all duration-300 bg-transparent ${
              exercise === e.id ? 'border-gold/50 text-gold' : 'border-border text-text-muted hover:border-border-hover'
            }`}
          >
            {e.icon} {e.label}
          </button>
        ))}
      </div>

      {/* Main animation area */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {exercise === 'breathing' && (
            <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              {/* Breathing circle */}
              <motion.div
                animate={{
                  scale: phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : 1,
                  opacity: phase === 'hold' ? 0.8 : 0.6,
                }}
                transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 3 : 4, ease: 'easeInOut' }}
                className="w-32 h-32 rounded-full border-2 border-gold/40 flex items-center justify-center"
                style={{ boxShadow: '0 0 60px rgba(201,168,76,0.1)' }}
              >
                <motion.div
                  animate={{
                    scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 0.8,
                  }}
                  transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 3 : 4, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-bronze/10"
                />
              </motion.div>

              <motion.span
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-sm font-mono text-text-secondary"
              >
                {phase === 'inhale' ? 'Breathe in...' : phase === 'hold' ? 'Hold...' : 'Breathe out...'}
              </motion.span>
            </motion.div>
          )}

          {exercise === 'stretch' && (
            <motion.div key="stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              {/* Stretch visual */}
              <motion.div
                animate={{ rotate: stretchStep % 2 === 0 ? -15 : 15 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center text-4xl"
              >
                🧘
              </motion.div>
              <motion.p key={stretchStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-sm font-mono text-text-secondary text-center max-w-[200px]">
                {stretchInstructions[stretchStep]}
              </motion.p>
            </motion.div>
          )}

          {exercise === 'hand-raise' && (
            <motion.div key="hand-raise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <motion.div
                animate={{ y: stretchStep % 2 === 0 ? -30 : 0 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                className="text-5xl"
              >
                🙌
              </motion.div>
              <motion.p key={stretchStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-sm font-mono text-text-secondary text-center max-w-[200px]">
                {raiseInstructions[stretchStep]}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        <motion.p
          key={feedback}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="mt-10 text-xs font-mono text-text-muted italic"
        >
          {feedback}
        </motion.p>
      </AnimatePresence>

      {/* Done button */}
      {elapsed > 30 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-8">
          <Button onClick={handleExit} variant="secondary" size="sm">
            I feel calmer
          </Button>
        </motion.div>
      )}
    </div>
  )
}
