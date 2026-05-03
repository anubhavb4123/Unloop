import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home', icon: '◉' },
  { path: '/analyze', label: 'Analyze', icon: '◈' },
  { path: '/relief', label: 'Relief', icon: '⚡' },
  { path: '/actions', label: 'Actions', icon: '◎' },
]

export function Navigation() {
  const location = useLocation()

  // Hide nav in relief mode for immersion
  if (location.pathname === '/relief') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:top-0 md:bottom-auto">
      <div className="bg-bg-surface/90 backdrop-blur-md border-t md:border-t-0 md:border-b border-border">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-around md:justify-center md:gap-8 h-14 md:h-12">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-3 py-1 no-underline"
                >
                  <span
                    className={`text-base md:text-sm transition-colors duration-200 ${
                      isActive ? 'text-gold' : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-[10px] md:text-xs font-mono transition-colors duration-200 ${
                      isActive ? 'text-gold' : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-0.5 md:bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
