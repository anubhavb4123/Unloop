import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUnloopStore, type PersonalAction, type ActionCategory, type ActionType } from '@/store/useUnloopStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { haptics } from '@/utils/haptics'

const categories: { id: ActionCategory; label: string; icon: string }[] = [
  { id: 'calm', label: 'Calm', icon: '🌊' },
  { id: 'distract', label: 'Distract', icon: '🎯' },
  { id: 'productive', label: 'Productive', icon: '⚡' },
]

const typeOptions: { id: ActionType; label: string }[] = [
  { id: 'music', label: '🎵 Music' },
  { id: 'video', label: '🎥 Video' },
  { id: 'real-world', label: '📱 Real-world' },
]
// For simplicity, we allow any link for non-real-world types. In a real app, you'd want to validate this better.
export default function ActionManager() {
  const { personalActions, addAction, updateAction, deleteAction } = useUnloopStore()
  const [activeCategory, setActiveCategory] = useState<ActionCategory>('calm')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', type: 'real-world' as ActionType, link: '', icon: '✨' })

  const filteredActions = personalActions.filter(a => a.category === activeCategory)
  const categoryCount = filteredActions.length

  const openAdd = () => {
    setEditingId(null)
    setForm({ title: '', type: 'real-world', link: '', icon: '✨' })
    setShowModal(true)
  }

  const openEdit = (action: PersonalAction) => {
    setEditingId(action.id)
    setForm({ title: action.title, type: action.type, link: action.link || '', icon: action.icon })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editingId) {
      updateAction(editingId, { title: form.title, type: form.type, link: form.link || undefined, icon: form.icon })
    } else {
      addAction({
        id: Date.now().toString(36),
        title: form.title,
        category: activeCategory,
        type: form.type,
        link: form.link || undefined,
        icon: form.icon,
      })
    }
    setShowModal(false)
    haptics.success()
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-20 md:pb-6 md:pt-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-serif text-2xl text-text-primary">Your Actions</h1>
          <p className="text-text-muted text-xs font-mono mt-1">Personal relief toolkit. Max 5 per category.</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveCategory(c.id); haptics.light() }}
              className={`flex-1 py-2 rounded-lg text-xs font-mono cursor-pointer border transition-all duration-300 bg-transparent ${
                activeCategory === c.id ? 'border-gold/50 text-gold bg-gold/5' : 'border-border text-text-muted hover:border-border-hover'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Actions list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredActions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hoverable className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl">{action.icon}</span>
                    <div className="min-w-0">
                      <span className="text-sm text-text-primary font-mono block truncate">{action.title}</span>
                      <span className="text-[10px] text-text-muted">{action.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {action.link && (
                      <a href={action.link} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-gold text-xs px-1.5 py-1 no-underline">↗</a>
                    )}
                    <button onClick={() => openEdit(action)} className="text-text-muted hover:text-text-secondary text-xs px-1.5 py-1 cursor-pointer bg-transparent border-none">✎</button>
                    <button onClick={() => { deleteAction(action.id); haptics.warning() }} className="text-text-muted hover:text-danger text-xs px-1.5 py-1 cursor-pointer bg-transparent border-none">×</button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredActions.length === 0 && (
            <p className="text-center text-text-muted text-xs font-mono py-8">No actions in this category yet.</p>
          )}
        </div>

        {/* Add button */}
        {categoryCount < 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <Button onClick={openAdd} variant="secondary" fullWidth size="sm">
              + Add Action
            </Button>
          </motion.div>
        )}

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Action' : 'New Action'}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted font-mono block mb-1">Title</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Listen to lofi beats"
                maxLength={50}
                className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-text-primary text-sm placeholder:text-text-muted/40 focus:border-gold/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted font-mono block mb-1">Type</label>
              <div className="flex gap-2">
                {typeOptions.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setForm({ ...form, type: t.id })}
                    className={`flex-1 py-1.5 rounded text-xs font-mono cursor-pointer border transition-all bg-transparent ${
                      form.type === t.id ? 'border-gold/50 text-gold' : 'border-border text-text-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-mono block mb-1">Icon (emoji)</label>
              <input
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                maxLength={2}
                className="w-16 bg-bg-input border border-border rounded-lg px-3 py-2 text-center text-lg focus:border-gold/30 focus:outline-none"
              />
            </div>

            {form.type !== 'real-world' && (
              <div>
                <label className="text-xs text-text-muted font-mono block mb-1">Link (optional)</label>
                <input
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-text-primary text-sm placeholder:text-text-muted/40 focus:border-gold/30 focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowModal(false)} variant="ghost" className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={!form.title.trim()} className="flex-[2]">Save</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
