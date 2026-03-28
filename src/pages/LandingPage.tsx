import { motion } from 'framer-motion'
import { Sparkles, MessageCircle, Users, Clock, Shield, Star, ArrowRight, Check } from 'lucide-react'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'

export function LandingPage() {
  const setCurrentPage = useStore((s) => s.setCurrentPage)
  const { t } = useI18n()

  const features = [
    { icon: Sparkles, titleKey: 'landing.features.avatar.title', descKey: 'landing.features.avatar.desc' },
    { icon: MessageCircle, titleKey: 'landing.features.reply.title', descKey: 'landing.features.reply.desc' },
    { icon: Users, titleKey: 'landing.features.social.title', descKey: 'landing.features.social.desc' },
    { icon: Clock, titleKey: 'landing.features.immortal.title', descKey: 'landing.features.immortal.desc' },
  ]

  const storyKeys = ['s1', 's2', 's3'] as const

  const planConfigs = [
    { key: 'free', price: '0', period: '', highlight: false },
    { key: 'premium', price: '7.99', period: t('landing.perMonth'), highlight: true },
    { key: 'immortal', price: '14.99', period: t('landing.perMonth'), highlight: false },
  ] as const

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <NebulaAvatar size={140} className="mx-auto mb-8" />

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary-300 via-primary-400 to-warm-400 bg-clip-text text-transparent">
            Digital Immortal
          </h1>

          <p className="text-xl md:text-2xl text-primary-200/80 mb-2 font-light">
            {t('landing.subtitle')}
          </p>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.tagline')}
            <br className="hidden md:block" />
            {t('landing.tagline2')}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentPage('create')}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-lg shadow-primary-600/30 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles size={20} />
            {t('landing.cta')}
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-400/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-primary-400/50" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-100"
        >
          {t('landing.featuresTitle')}
        </motion.h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          {t('landing.featuresSubtitle')}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-100/50 backdrop-blur border border-primary-900/30 rounded-2xl p-6 hover:border-primary-600/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center mb-4">
                <f.icon size={24} className="text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-primary-100 mb-2">{t(f.titleKey)}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-100">
          {t('landing.howTitle')}
        </h2>
        <div className="space-y-12">
          {(['s01', 's02', 's03', 's04'] as const).map((key, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="text-4xl font-bold text-primary-600/40 shrink-0 w-16">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="text-xl font-semibold text-primary-200 mb-2">{t(`landing.steps.${key}.title`)}</h3>
                <p className="text-gray-400 leading-relaxed">{t(`landing.steps.${key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Stories */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-100">
          {t('landing.storiesTitle')}
        </h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          {t('landing.storiesSubtitle')}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {storyKeys.map((key, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-surface-100/50 backdrop-blur border border-primary-900/30 rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-warm-400 flex items-center justify-center text-white font-bold text-sm">
                  {t(`landing.stories.${key}.name`)[0]}
                </div>
                <div>
                  <div className="text-primary-100 font-medium">
                    {t(`landing.stories.${key}.name`)}{t('landing.ageLabel')}{t(`landing.stories.${key}.age`)}
                  </div>
                  <div className="text-xs text-gray-500">{t(`landing.stories.${key}.role`)}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1 italic">{t(`landing.stories.${key}.quote`)}</p>
              <div className="flex items-center gap-2 text-xs text-primary-400 bg-primary-900/20 rounded-lg px-3 py-2">
                <Star size={14} />
                {t(`landing.stories.${key}.metric`)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="bg-surface-100/30 backdrop-blur border border-primary-900/30 rounded-2xl p-8 text-center">
          <Shield size={40} className="text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-100 mb-3">{t('landing.privacyTitle')}</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('landing.privacyDesc')}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-100">
          {t('landing.pricingTitle')}
        </h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          {t('landing.pricingSubtitle')}
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {planConfigs.map((plan, i) => {
            const planFeatures: string[] = []
            for (let fi = 0; fi < 10; fi++) {
              const val = t(`landing.plans.${plan.key}.features.${fi}`)
              if (val === `landing.plans.${plan.key}.features.${fi}`) break
              planFeatures.push(val)
            }
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-primary-900/60 to-surface-100/50 border-2 border-primary-500/50 shadow-lg shadow-primary-600/10'
                    : 'bg-surface-100/50 border border-primary-900/30'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold text-primary-300 bg-primary-600/20 self-start px-3 py-1 rounded-full mb-3">
                    {t('landing.plans.premium.badge')}
                  </div>
                )}
                <h3 className="text-xl font-bold text-primary-100 mb-2">{t(`landing.plans.${plan.key}.name`)}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary-200">${plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {planFeatures.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-primary-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setCurrentPage('create')}
                  className={`w-full py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    plan.highlight
                      ? 'bg-primary-600 hover:bg-primary-500 text-white'
                      : 'bg-primary-900/30 hover:bg-primary-900/50 text-primary-300'
                  }`}
                >
                  {t(`landing.plans.${plan.key}.cta`)}
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-100 mb-4">
            {t('landing.finalCta')}
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            {t('landing.finalCtaDesc')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentPage('create')}
            className="bg-gradient-to-r from-primary-600 to-warm-500 hover:from-primary-500 hover:to-warm-400 text-white px-10 py-4 rounded-2xl text-lg font-medium shadow-lg shadow-primary-600/30 cursor-pointer"
          >
            {t('landing.cta')}
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-900/30 px-6 py-8 text-center text-sm text-gray-500">
        <p>Digital Immortal &copy; 2026 &middot; {t('landing.footer')}</p>
        <p className="mt-1 text-xs text-gray-600">{t('landing.footerSub')}</p>
      </footer>
    </div>
  )
}
