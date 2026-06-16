import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUnloopStore } from '@/store/useUnloopStore'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const navigate = useNavigate()
  const { totalLoopsBroken } = useUnloopStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-20 md:pb-0 md:pt-12 relative overflow-hidden">
      {/* */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          />
        ))}
      </div>
      // 
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md mx-auto relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <svg width="64" height="64" viewBox="0 0 80 80" className="mx-auto mb-4">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#a67c52" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="30" fill="none" stroke="url(#logoGrad)" strokeWidth="3" strokeDasharray="155 33" strokeLinecap="round" />
            <line x1="55" y1="15" x2="65" y2="5" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-5xl md:text-6xl font-semibold bg-gradient-to-r from-gold-light to-bronze bg-clip-text text-transparent mb-3"
        >
          Unloop
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-text-muted text-sm font-mono tracking-wide mb-10"
        >
          Break the loop. Take control.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button onClick={() => navigate('/analyze')} size="lg" fullWidth>
            Start Analysis
          </Button>
          <Button onClick={() => navigate('/relief')} variant="secondary" size="lg" fullWidth icon={<span>⚡</span>}>
            Unloop Now
          </Button>
        </motion.div>

        {/* Stats */}
        {totalLoopsBroken > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
              Loops broken
            </span>
            <span className="block text-2xl font-serif text-gold mt-1">{totalLoopsBroken}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
