import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/ui/Navigation'

// Lazy-loaded pages for performance
const Home = lazy(() => import('@/pages/Home'))
const LoopAnalysis = lazy(() => import('@/pages/LoopAnalysis'))
const InstantRelief = lazy(() => import('@/pages/InstantRelief'))
const ActionManager = lazy(() => import('@/pages/ActionManager'))
const PostRelief = lazy(() => import('@/pages/PostRelief'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<LoopAnalysis />} />
          <Route path="/relief" element={<InstantRelief />} />
          <Route path="/actions" element={<ActionManager />} />
          <Route path="/post-relief" element={<PostRelief />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
