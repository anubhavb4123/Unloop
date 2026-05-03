import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Trigger = 'fear-of-loss' | 'fear-of-judgment' | 'uncertainty' | 'regret' | 'custom'
export type ActionChoice = 'take-action' | 'wait' | 'let-go'
export type ActionCategory = 'calm' | 'distract' | 'productive'
export type ActionType = 'music' | 'video' | 'real-world'
export type LoopType = 'future-anxiety' | 'regret-loop' | 'reassurance-loop' | 'decision-paralysis' | 'unknown'

export interface RealityCheck {
  thinking: string
  known: string
  assuming: string
}

export interface PersonalAction {
  id: string
  title: string
  category: ActionCategory
  type: ActionType
  link?: string
  icon: string
}

export interface SessionRecord {
  id: string
  thought: string
  trigger: Trigger
  customTrigger?: string
  actionChoice: ActionChoice
  loopType: LoopType
  timestamp: number
  duration: number
}

interface AnalysisState {
  currentStep: number
  thought: string
  trigger: Trigger | null
  customTrigger: string
  realityCheck: RealityCheck
  actionChoice: ActionChoice | null
  actionNote: string
  sessionStartTime: number | null
  loopType: LoopType
}

interface UnloopStore {
  // Analysis flow
  analysis: AnalysisState
  setStep: (step: number) => void
  setThought: (thought: string) => void
  setTrigger: (trigger: Trigger) => void
  setCustomTrigger: (text: string) => void
  setRealityCheck: (field: keyof RealityCheck, value: string) => void
  setActionChoice: (choice: ActionChoice) => void
  setActionNote: (note: string) => void
  startSession: () => void
  resetAnalysis: () => void
  getSessionDuration: () => number

  // Loop type detection
  detectLoopType: () => LoopType

  // Personal actions
  personalActions: PersonalAction[]
  addAction: (action: PersonalAction) => void
  updateAction: (id: string, action: Partial<PersonalAction>) => void
  deleteAction: (id: string) => void

  // Session history
  sessionHistory: SessionRecord[]
  saveSession: () => void
  checkReEntry: (thought: string) => SessionRecord | null

  // Stats
  totalLoopsBroken: number
}

const defaultAnalysis: AnalysisState = {
  currentStep: 0,
  thought: '',
  trigger: null,
  customTrigger: '',
  realityCheck: { thinking: '', known: '', assuming: '' },
  actionChoice: null,
  actionNote: '',
  sessionStartTime: null,
  loopType: 'unknown',
}

const defaultActions: PersonalAction[] = [
  { id: '1', title: 'Lo-fi playlist', category: 'calm', type: 'music', link: 'https://youtube.com/results?search_query=lofi+chill+beats', icon: '🎵' },
  { id: '2', title: 'Deep breathing', category: 'calm', type: 'real-world', icon: '🫁' },
  { id: '3', title: 'Watch something light', category: 'distract', type: 'video', link: 'https://youtube.com', icon: '🎥' },
  { id: '4', title: 'Go for a walk', category: 'distract', type: 'real-world', icon: '🚶' },
  { id: '5', title: 'Write it down', category: 'productive', type: 'real-world', icon: '📝' },
  { id: '6', title: 'Drink water', category: 'productive', type: 'real-world', icon: '💧' },
]

function detectLoopTypeFromState(analysis: AnalysisState): LoopType {
  const { trigger, realityCheck } = analysis
  const assumingLower = realityCheck.assuming.toLowerCase()
  const thinkingLower = realityCheck.thinking.toLowerCase()

  if (trigger === 'regret') return 'regret-loop'

  if (trigger === 'uncertainty') {
    if (assumingLower.includes('what if') || thinkingLower.includes('what if')) {
      return 'future-anxiety'
    }
    return 'decision-paralysis'
  }

  if (trigger === 'fear-of-judgment' || trigger === 'fear-of-loss') {
    if (thinkingLower.includes('they think') || thinkingLower.includes('people') || assumingLower.includes('everyone')) {
      return 'reassurance-loop'
    }
    return 'future-anxiety'
  }

  if (assumingLower.includes('worst') || thinkingLower.includes('going to') || thinkingLower.includes('will')) {
    return 'future-anxiety'
  }

  return 'unknown'
}

function isSimilarThought(a: string, b: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return true

  const wordsA = new Set(na.split(/\s+/))
  const wordsB = new Set(nb.split(/\s+/))
  const intersection = [...wordsA].filter(w => wordsB.has(w))
  const union = new Set([...wordsA, ...wordsB])
  return intersection.length / union.size > 0.5
}

export const useUnloopStore = create<UnloopStore>()(
  persist(
    (set, get) => ({
      analysis: { ...defaultAnalysis },

      setStep: (step) => set((s) => ({ analysis: { ...s.analysis, currentStep: step } })),
      setThought: (thought) => set((s) => ({ analysis: { ...s.analysis, thought } })),
      setTrigger: (trigger) => set((s) => ({ analysis: { ...s.analysis, trigger } })),
      setCustomTrigger: (text) => set((s) => ({ analysis: { ...s.analysis, customTrigger: text } })),
      setRealityCheck: (field, value) =>
        set((s) => ({
          analysis: {
            ...s.analysis,
            realityCheck: { ...s.analysis.realityCheck, [field]: value },
          },
        })),
      setActionChoice: (choice) => set((s) => ({ analysis: { ...s.analysis, actionChoice: choice } })),
      setActionNote: (note) => set((s) => ({ analysis: { ...s.analysis, actionNote: note } })),

      startSession: () =>
        set((s) => ({
          analysis: { ...s.analysis, sessionStartTime: Date.now() },
        })),

      resetAnalysis: () => set({ analysis: { ...defaultAnalysis } }),

      getSessionDuration: () => {
        const start = get().analysis.sessionStartTime
        if (!start) return 0
        return Math.floor((Date.now() - start) / 1000)
      },

      detectLoopType: () => {
        const loopType = detectLoopTypeFromState(get().analysis)
        set((s) => ({ analysis: { ...s.analysis, loopType } }))
        return loopType
      },

      // Personal actions
      personalActions: [...defaultActions],

      addAction: (action) =>
        set((s) => {
          const categoryCount = s.personalActions.filter(a => a.category === action.category).length
          if (categoryCount >= 5) return s
          return { personalActions: [...s.personalActions, action] }
        }),

      updateAction: (id, updates) =>
        set((s) => ({
          personalActions: s.personalActions.map(a => (a.id === id ? { ...a, ...updates } : a)),
        })),

      deleteAction: (id) =>
        set((s) => ({
          personalActions: s.personalActions.filter(a => a.id !== id),
        })),

      // Session history
      sessionHistory: [],

      saveSession: () =>
        set((s) => {
          const { analysis, totalLoopsBroken } = s
          if (!analysis.thought || !analysis.trigger || !analysis.actionChoice) return s
          const record: SessionRecord = {
            id: Date.now().toString(36),
            thought: analysis.thought,
            trigger: analysis.trigger,
            customTrigger: analysis.customTrigger || undefined,
            actionChoice: analysis.actionChoice,
            loopType: analysis.loopType,
            timestamp: Date.now(),
            duration: analysis.sessionStartTime ? Math.floor((Date.now() - analysis.sessionStartTime) / 1000) : 0,
          }
          return {
            sessionHistory: [...s.sessionHistory, record],
            totalLoopsBroken: totalLoopsBroken + 1,
          }
        }),

      checkReEntry: (thought) => {
        const history = get().sessionHistory
        return history.find(s => isSimilarThought(s.thought, thought)) || null
      },

      totalLoopsBroken: 0,
    }),
    {
      name: 'unloop-store',
      partialize: (state) => ({
        personalActions: state.personalActions,
        sessionHistory: state.sessionHistory,
        totalLoopsBroken: state.totalLoopsBroken,
      }),
    }
  )
)
