import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react'
import { personalityQuestions, valueOptions } from '../data/mockData'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { useStore } from '../store/useStore'
import { isBackendAvailable, saveAvatar } from '../api/client'
import { useI18n } from '../i18n'

type Step = 'welcome' | 'name' | 'personality' | 'style' | 'values' | 'catchphrases' | 'complete'

const steps: Step[] = ['welcome', 'name', 'personality', 'style', 'values', 'catchphrases', 'complete']

export function CreatePage() {
  const { setProfile, setCurrentPage } = useStore()
  const { t } = useI18n()
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [catchphrases, setCatchphrases] = useState<string[]>([])
  const [phraseInput, setPhraseInput] = useState('')

  const stepIndex = steps.indexOf(step)
  const progress = (stepIndex / (steps.length - 1)) * 100

  const personalityQs = personalityQuestions.filter((q) => ['agreeableness', 'openness', 'extraversion', 'conscientiousness', 'neuroticism'].includes(q.dimension))
  const styleQs = personalityQuestions.filter((q) => ['formality', 'humor', 'emotionality'].includes(q.dimension))

  // Get translated question data
  function getQuestionText(qIndex: number) {
    return t(`create.personalityQuestions.${qIndex}.question`)
  }
  function getOptionText(qIndex: number, optIndex: number) {
    return t(`create.personalityQuestions.${qIndex}.options.${optIndex}`)
  }
  function getMinLabel(qIndex: number) {
    return t(`create.personalityQuestions.${qIndex}.minLabel`)
  }
  function getMaxLabel(qIndex: number) {
    return t(`create.personalityQuestions.${qIndex}.maxLabel`)
  }

  // Get translated value options
  function getValueText(index: number) {
    return t(`create.valueOptions.${index}`)
  }

  function nextStep() {
    const i = steps.indexOf(step)
    if (i < steps.length - 1) setStep(steps[i + 1])
  }

  function prevStep() {
    const i = steps.indexOf(step)
    if (i > 0) setStep(steps[i - 1])
  }

  function handleAnswer(dimension: string, value: number) {
    setAnswers((prev) => ({ ...prev, [dimension]: value }))
  }

  async function completeCreation() {
    const profile = {
      name,
      bigFive: {
        openness: answers.openness ?? 0.5,
        conscientiousness: answers.conscientiousness ?? 0.5,
        extraversion: answers.extraversion ?? 0.5,
        agreeableness: answers.agreeableness ?? 0.5,
        neuroticism: answers.neuroticism ?? 0.5,
      },
      communicationStyle: {
        formality: answers.formality ?? 0.5,
        humor: answers.humor ?? 0.5,
        verbosity: 0.5,
        emotionality: answers.emotionality ?? 0.5,
      },
      values: selectedValues,
      catchphrases,
      similarity: 35 + Math.floor(Math.random() * 15),
    }
    setProfile(profile)
    setStep('complete')

    // Save to cloud backend if available (fire-and-forget)
    try {
      const online = await isBackendAvailable()
      if (online) {
        await saveAvatar(profile)
        console.log('[DI] Avatar saved to cloud backend')
      }
    } catch (err) {
      console.warn('[DI] Failed to save avatar to cloud, local copy is fine:', err)
    }
  }

  function toggleValue(v: string) {
    setSelectedValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 5 ? [...prev, v] : prev
    )
  }

  function addPhrase() {
    if (phraseInput.trim() && catchphrases.length < 5) {
      setCatchphrases([...catchphrases, phraseInput.trim()])
      setPhraseInput('')
    }
  }

  // Map original question index to personality/style question arrays
  const currentQs = step === 'personality' ? personalityQs : styleQs
  const currentQ = currentQs[questionIdx]

  // Find original index in personalityQuestions for i18n
  function getOriginalIndex(q: typeof currentQ) {
    return personalityQuestions.findIndex((pq) => pq.id === q.id)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="h-1 bg-surface-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{t('common.progressStart')}</span>
          <span>{t('common.progressDone')}</span>
        </div>
      </div>

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* Welcome */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <NebulaAvatar size={100} className="mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary-100 mb-3">
                {t('create.welcomeTitle')}
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {t('create.welcomeDesc')}<br />
                {t('create.welcomeDesc2')}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto cursor-pointer"
              >
                {t('common.start')} <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-primary-100 mb-3">
                {t('create.nameTitle')}
              </h2>
              <p className="text-gray-400 mb-8">{t('create.nameDesc')}</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('create.namePlaceholder')}
                className="w-full bg-surface-100 border border-primary-900/40 rounded-xl px-6 py-4 text-lg text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 mb-8"
              />
              <div className="flex justify-between">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> {t('common.back')}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  disabled={!name.trim()}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {t('common.next')} <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Personality Questions */}
          {step === 'personality' && currentQ && (
            <motion.div
              key={`personality-${questionIdx}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="text-xs text-primary-400 mb-2">
                {t('create.personalityLabel')} {questionIdx + 1}/{personalityQs.length}
              </div>
              <h2 className="text-xl font-bold text-primary-100 mb-8">{getQuestionText(getOriginalIndex(currentQ))}</h2>

              {currentQ.type === 'choice' && currentQ.options && (
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(currentQ.dimension, opt.value)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer ${
                        answers[currentQ.dimension] === opt.value
                          ? 'border-primary-500 bg-primary-600/20 text-primary-200'
                          : 'border-primary-900/30 bg-surface-100/50 text-gray-300 hover:border-primary-700/40'
                      }`}
                    >
                      {getOptionText(getOriginalIndex(currentQ), i)}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'slider' && (
                <div className="mb-8">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(answers[currentQ.dimension] ?? 0.5) * 100}
                    onChange={(e) => handleAnswer(currentQ.dimension, parseInt(e.target.value) / 100)}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{getMinLabel(getOriginalIndex(currentQ))}</span>
                    <span>{getMaxLabel(getOriginalIndex(currentQ))}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (questionIdx > 0) setQuestionIdx(questionIdx - 1)
                    else prevStep()
                  }}
                  className="text-gray-400 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={16} /> {t('common.back')}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (questionIdx < personalityQs.length - 1) setQuestionIdx(questionIdx + 1)
                    else {
                      setQuestionIdx(0)
                      nextStep()
                    }
                  }}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  {questionIdx < personalityQs.length - 1 ? t('common.nextQuestion') : t('common.next')} <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Style sliders */}
          {step === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-bold text-primary-100 mb-2">{t('create.styleTitle')}</h2>
              <p className="text-gray-400 text-sm mb-8">{t('create.styleDesc')}</p>

              <div className="space-y-8 mb-8">
                {styleQs.map((q) => {
                  const origIdx = getOriginalIndex(q)
                  return (
                    <div key={q.id}>
                      <label className="text-sm text-primary-200 mb-2 block">{getQuestionText(origIdx)}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(answers[q.dimension] ?? 0.5) * 100}
                        onChange={(e) => handleAnswer(q.dimension, parseInt(e.target.value) / 100)}
                        className="w-full accent-primary-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{getMinLabel(origIdx)}</span>
                        <span>{getMaxLabel(origIdx)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> {t('common.back')}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  {t('common.next')} <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Values */}
          {step === 'values' && (
            <motion.div
              key="values"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-bold text-primary-100 mb-2">{t('create.valuesTitle')}</h2>
              <p className="text-gray-400 text-sm mb-6">{t('create.valuesDesc')}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {valueOptions.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => toggleValue(v)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
                      selectedValues.includes(v)
                        ? 'border-primary-500 bg-primary-600/30 text-primary-200'
                        : 'border-primary-900/30 bg-surface-100/50 text-gray-400 hover:border-primary-700/40'
                    }`}
                  >
                    {selectedValues.includes(v) && <Check size={14} className="inline mr-1" />}
                    {getValueText(i)}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> {t('common.back')}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  disabled={selectedValues.length < 1}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {t('common.next')} <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Catchphrases */}
          {step === 'catchphrases' && (
            <motion.div
              key="catchphrases"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-bold text-primary-100 mb-2">{t('create.catchphrasesTitle')}</h2>
              <p className="text-gray-400 text-sm mb-6">
                {t('create.catchphrasesDesc')}
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={phraseInput}
                  onChange={(e) => setPhraseInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPhrase()}
                  placeholder={t('create.catchphrasesPlaceholder')}
                  className="flex-1 bg-surface-100 border border-primary-900/40 rounded-xl px-4 py-3 text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addPhrase}
                  disabled={!phraseInput.trim() || catchphrases.length >= 5}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white px-4 py-3 rounded-xl cursor-pointer disabled:cursor-not-allowed"
                >
                  {t('common.add')}
                </motion.button>
              </div>

              {catchphrases.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {catchphrases.map((p, i) => (
                    <span
                      key={i}
                      className="bg-primary-600/20 text-primary-300 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                    >
                      "{p}"
                      <button
                        onClick={() => setCatchphrases(catchphrases.filter((_, j) => j !== i))}
                        className="text-primary-400 hover:text-primary-200 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> {t('common.back')}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={completeCreation}
                  className="bg-gradient-to-r from-primary-600 to-warm-500 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={18} />
                  {t('create.createButton')}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Complete */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <NebulaAvatar size={140} className="mx-auto mb-6" />
              </motion.div>

              <h2 className="text-2xl font-bold text-primary-100 mb-2">
                {t('create.completeTitle')}
              </h2>
              <p className="text-lg text-primary-300 mb-1">"{name}"</p>
              <p className="text-gray-400 text-sm mb-8">
                {t('create.completeDesc')}
              </p>

              {/* Profile card */}
              <div className="bg-surface-100/50 border border-primary-900/30 rounded-2xl p-6 mb-6 text-left">
                <h3 className="text-primary-200 font-semibold mb-4">{t('create.profileCard')}</h3>

                {/* Similarity gauge */}
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(useStore.getState().profile?.similarity ?? 40) * 2.51} 251`}
                      />
                      <defs>
                        <linearGradient id="gaugeGrad">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary-200">
                        {useStore.getState().profile?.similarity ?? 40}%
                      </span>
                      <span className="text-xs text-gray-500">{t('create.similarityLabel')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{t('create.seedStage')}</p>
                </div>

                {/* Big Five */}
                <div className="space-y-3">
                  {([
                    { labelKey: 'create.bigFive.openness', key: 'openness' as const },
                    { labelKey: 'create.bigFive.conscientiousness', key: 'conscientiousness' as const },
                    { labelKey: 'create.bigFive.extraversion', key: 'extraversion' as const },
                    { labelKey: 'create.bigFive.agreeableness', key: 'agreeableness' as const },
                    { labelKey: 'create.bigFive.neuroticism', key: 'neuroticism' as const },
                  ]).map((dim) => {
                    const val = (useStore.getState().profile?.bigFive[dim.key] ?? 0.5) * 100
                    return (
                      <div key={dim.key} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-16 shrink-0">{t(dim.labelKey)}</span>
                        <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                        <span className="text-xs text-primary-300 w-8 text-right">{Math.round(val)}%</span>
                      </div>
                    )
                  })}
                </div>

                {selectedValues.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs text-gray-500">{t('create.valuesLabel')}</span>
                    {selectedValues.map((v) => (
                      <span key={v} className="text-xs bg-primary-900/30 text-primary-300 px-2 py-1 rounded mr-1">
                        {getValueText(valueOptions.indexOf(v))}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage('chat')}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium cursor-pointer"
                >
                  {t('create.chatButton')}
                </motion.button>
                <button
                  onClick={() => setCurrentPage('social')}
                  className="bg-surface-100 hover:bg-surface-200 text-primary-300 px-6 py-3 rounded-xl font-medium cursor-pointer"
                >
                  {t('common.explore')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
