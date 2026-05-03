import { motion } from 'framer-motion'
import { useUnloopStore, type ActionChoice } from '@/store/useUnloopStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ActionSelectorProps {
  onNext: () => void
  onBack: () => void
}

const actions: { id: ActionChoice; label: string; icon: string; description: string }[] = [
  { id: 'take-action', label: 'Take Action', icon: '⚡', description: 'Define one concrete step and do it.' },
  { id: 'wait', label: 'Wait', icon: '⏳', description: 'This needs time. Set a date to revisit.' },
  { id: 'let-go', label: 'Let Go', icon: '🍃', description: 'This is outside your control. Release it.' },
]

export function ActionSelector({ onNext, onBack }: ActionSelectorProps) {
  const { analysis, setActionChoice, setActionNote } = useUnloopStore()

  const promptText: Record<ActionChoice, string> = {
    'take-action': 'What is one specific thing you will do right now?',
    'wait': 'When will you revisit this? Set a clear boundary.',
    'let-go': 'Acknowledge: this thought has been heard. You can release it.',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl text-text-primary">Decide. Now.</h2>
        <p className="text-text-muted text-sm">Analysis is done. Pick your move.</p>
      </div>

      <div className="space-y-3">
        {actions.map((action, i) => (
          <motion.div key={action.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Card selected={analysis.actionChoice === action.id} onClick={() => setActionChoice(action.id)} className="cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{action.icon}</span>
                <div>
                  <span className="text-sm text-text-primary font-mono block">{action.label}</span>
                  <span className="text-xs text-text-muted block mt-0.5">{action.description}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {analysis.actionChoice && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
          <p className="text-xs text-text-secondary font-mono">{promptText[analysis.actionChoice]}</p>
          <input
            value={analysis.actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            placeholder="Write it here..."
            maxLength={200}
            className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-text-muted/40 focus:border-gold/30 focus:outline-none transition-colors duration-300"
          />
        </motion.div>
      )}

      <div className="flex gap-3">
        <Button onClick={onBack} variant="ghost" className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!analysis.actionChoice} className="flex-[2]">Finish</Button>
      </div>
    </motion.div>
  )
}
