import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useUnloopStore } from '@/store/useUnloopStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ThoughtInput } from '@/components/analysis/ThoughtInput'
import { TriggerSelector } from '@/components/analysis/TriggerSelector'
import { RealityCheck } from '@/components/analysis/RealityCheck'
import { CostDisplay } from '@/components/analysis/CostDisplay'
import { ActionSelector } from '@/components/analysis/ActionSelector'
import { ClosureScreen } from '@/components/analysis/ClosureScreen'

const TOTAL_STEPS = 6
// This page guides users through a structured reflection process after breaking a loop, helping them analyze their thoughts, triggers, and actions to build self-awareness and prevent future loops.
export default function LoopAnalysis() {
  const { analysis, setStep, startSession, resetAnalysis } = useUnloopStore()

  useEffect(() => {
    resetAnalysis()
    startSession()
  }, [])

  const goNext = () => setStep(Math.min(analysis.currentStep + 1, TOTAL_STEPS - 1))
  const goBack = () => setStep(Math.max(analysis.currentStep - 1, 0))

  const renderStep = () => {
    switch (analysis.currentStep) {
      case 0: return <ThoughtInput onNext={goNext} />
      case 1: return <TriggerSelector onNext={goNext} onBack={goBack} />
      case 2: return <RealityCheck onNext={goNext} onBack={goBack} />
      case 3: return <CostDisplay onNext={goNext} onBack={goBack} />
      case 4: return <ActionSelector onNext={goNext} onBack={goBack} />
      case 5: return <ClosureScreen />
      default: return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-20 md:pb-6 md:pt-16">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Progress */}
        {analysis.currentStep < 5 && (
          <div className="mb-8">
            <ProgressBar currentStep={analysis.currentStep} totalSteps={TOTAL_STEPS} />
          </div>
        )}

        {/* Step content */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <div key={analysis.currentStep}>
              {renderStep()}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
