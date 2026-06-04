import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const nextSteps = [
  { icon: '💧', text: 'Drink a glass of water' },
  { icon: '💻', text: 'Continue your work' },
  { icon: '📴', text: 'Stay offline for a few minutes' },
  { icon: '🚶', text: 'Take a short walk' },
]
// After completing an instant relief exercise, this page provides a calming transition with next steps to help users reintegrate into their day while maintaining the calm mindset they've achieved.
export default function PostRelief() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-20 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm mx-auto space-y-8"
      >
        {/* Calm indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="w-16 h-16 mx-auto rounded-full border border-gold/30 flex items-center justify-center"
          style={{ boxShadow: '0 0 40px rgba(201,168,76,0.1)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-gold/30 to-bronze/20"
          />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-2">
            Your mind is calmer now.
          </h2>
          <p className="text-text-muted text-xs font-mono">
            The loop has been broken. Here's what to do next.
          </p>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-2"
        >
          {nextSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-3 bg-bg-card border border-border rounded-lg px-4 py-3"
            >
              <span className="text-lg">{step.icon}</span>
              <span className="text-sm text-text-secondary font-mono">{step.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Return */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button onClick={() => navigate('/')} variant="ghost" size="sm">
            ← Return home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
