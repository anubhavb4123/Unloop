import type { Trigger, PersonalAction, LoopType } from '@/store/useUnloopStore'

export interface Suggestion {
  title: string
  description: string
  icon: string
  actionType: 'breathing' | 'journal' | 'music' | 'connect' | 'decision' | 'physical' | 'reframe'
}

const suggestionMap: Record<string, Suggestion[]> = {
  'fear-of-loss': [
    { title: 'Breathing exercise', description: 'Ground yourself with 4-7-8 breathing', icon: '🫁', actionType: 'breathing' },
    { title: 'Write what you value', description: 'List 3 things you still have', icon: '📝', actionType: 'journal' },
    { title: 'Calming music', description: 'Listen to something soothing', icon: '🎵', actionType: 'music' },
  ],
  'fear-of-judgment': [
    { title: 'Reframe the narrative', description: 'Write what YOU know is true about yourself', icon: '🔄', actionType: 'reframe' },
    { title: 'Deep breathing', description: 'Release tension from your body', icon: '🫁', actionType: 'breathing' },
    { title: 'Message someone you trust', description: 'One honest conversation resets perspective', icon: '💬', actionType: 'connect' },
  ],
  'uncertainty': [
    { title: 'Decision framework', description: 'Write 2 options. Pick the one you can reverse.', icon: '⚖️', actionType: 'decision' },
    { title: 'Walk and think', description: 'Movement creates clarity, sitting creates loops', icon: '🚶', actionType: 'physical' },
    { title: 'Write pros and cons', description: 'Put it on paper. Your brain lies, paper doesn\'t.', icon: '📝', actionType: 'journal' },
  ],
  'regret': [
    { title: 'Journal it out', description: 'Write what happened. Then write what you learned.', icon: '📝', actionType: 'journal' },
    { title: 'Self-compassion note', description: 'Write to yourself like you\'d write to a friend', icon: '✉️', actionType: 'journal' },
    { title: 'Physical reset', description: 'Cold water on your face. Stretch. Move.', icon: '💪', actionType: 'physical' },
  ],
  'custom': [
    { title: 'Breathing exercise', description: 'Start with your body, not your thoughts', icon: '🫁', actionType: 'breathing' },
    { title: 'Write it down', description: 'Externalize the thought. Get it out of your head.', icon: '📝', actionType: 'journal' },
    { title: 'Take a walk', description: 'Change your environment, change your state', icon: '🚶', actionType: 'physical' },
  ],
}

export function getSuggestions(trigger: Trigger | null): Suggestion[] {
  if (!trigger) return suggestionMap['custom']
  return suggestionMap[trigger] || suggestionMap['custom']
}

export function getLoopTypeLabel(loopType: LoopType): string {
  switch (loopType) {
    case 'future-anxiety': return 'Future Anxiety Loop'
    case 'regret-loop': return 'Regret Loop'
    case 'reassurance-loop': return 'Reassurance-Seeking Loop'
    case 'decision-paralysis': return 'Decision Paralysis Loop'
    default: return 'Thought Loop'
  }
}

export function getLoopTypeMessage(loopType: LoopType): string {
  switch (loopType) {
    case 'future-anxiety':
      return 'You\'re projecting into a future that doesn\'t exist yet. The scenario you fear hasn\'t happened.'
    case 'regret-loop':
      return 'You\'re replaying something you can\'t change. The lesson is already learned.'
    case 'reassurance-loop':
      return 'You\'re seeking validation that no amount of thinking will provide. You already know where you stand.'
    case 'decision-paralysis':
      return 'You\'re stuck between options. No decision is still a decision — and usually the worst one.'
    default:
      return 'You\'ve been circling the same thought. Recognizing it is the first step out.'
  }
}

export function getActionSuggestionsByTrigger(trigger: Trigger | null, actions: PersonalAction[]): PersonalAction[] {
  if (!trigger) return actions.slice(0, 3)

  const categoryPriority: Record<string, string[]> = {
    'fear-of-loss': ['calm', 'productive'],
    'fear-of-judgment': ['calm', 'distract'],
    'uncertainty': ['productive', 'calm'],
    'regret': ['productive', 'calm'],
    'custom': ['calm', 'distract', 'productive'],
  }

  const priorities = categoryPriority[trigger] || ['calm', 'distract', 'productive']
  const sorted = [...actions].sort((a, b) => {
    const aIdx = priorities.indexOf(a.category)
    const bIdx = priorities.indexOf(b.category)
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx)
  })

  return sorted.slice(0, 3)
}
