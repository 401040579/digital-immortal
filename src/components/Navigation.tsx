import { motion } from 'framer-motion'
import {
  Home, MessageCircle, Users, Brain,
  Clock, Sparkles, Menu, X, Calendar, Gamepad2
} from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'

export function Navigation() {
  const { currentPage, setCurrentPage } = useStore()
  const { t, locale, setLocale } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'landing', label: t('nav.home'), icon: Home },
    { id: 'create', label: t('nav.createAvatar'), icon: Sparkles },
    { id: 'chat', label: t('nav.chat'), icon: MessageCircle },
    { id: 'social', label: t('nav.social'), icon: Users },
    { id: 'memory', label: t('nav.memory'), icon: Brain },
    { id: 'capsule', label: t('nav.capsule'), icon: Clock },
    { id: 'growth', label: t('nav.growth'), icon: Calendar },
    { id: 'challenge', label: t('nav.challenge'), icon: Gamepad2 },
  ]

  const bottomNavItems = [
    { id: 'landing', label: t('nav.home'), icon: Home },
    { id: 'chat', label: t('nav.chat'), icon: MessageCircle },
    { id: 'social', label: t('nav.social'), icon: Users },
    { id: 'memory', label: t('nav.memory'), icon: Brain },
    { id: 'growth', label: t('nav.growth'), icon: Calendar },
  ]

  function toggleLocale() {
    setLocale(locale === 'en' ? 'zh' : 'en')
  }

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-surface-50/80 backdrop-blur-xl border-b border-primary-900/30">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-3">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 text-primary-300 font-semibold text-lg cursor-pointer"
          >
            <Sparkles size={20} />
            Digital Immortal
          </button>
          <div className="flex items-center gap-1">
            {navItems.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-primary-600/30 text-primary-200'
                    : 'text-gray-400 hover:text-primary-300 hover:bg-primary-900/20'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <button
              onClick={toggleLocale}
              className="ml-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-primary-900/30 text-primary-300 hover:bg-primary-900/20 transition-all cursor-pointer"
              title={locale === 'en' ? 'Switch to Chinese' : '切换到英文'}
            >
              {locale === 'en' ? '中' : 'EN'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface-50/90 backdrop-blur-xl border-b border-primary-900/30">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 text-primary-300 font-semibold cursor-pointer"
          >
            <Sparkles size={18} />
            Digital Immortal
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-2 py-1 rounded-lg text-xs font-semibold border border-primary-900/30 text-primary-300 hover:bg-primary-900/20 transition-all cursor-pointer"
            >
              {locale === 'en' ? '中' : 'EN'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-400 p-1 cursor-pointer"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-50/95 backdrop-blur-xl border-b border-primary-900/30 px-4 pb-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setMobileOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-all cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-primary-600/30 text-primary-200'
                    : 'text-gray-400 hover:text-primary-300'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-50/90 backdrop-blur-xl border-t border-primary-900/30">
        <div className="flex items-center justify-around py-2 px-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer ${
                currentPage === item.id
                  ? 'text-primary-300'
                  : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
