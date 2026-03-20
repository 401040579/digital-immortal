import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react'
import { personalityQuestions, valueOptions } from '../data/mockData'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { useStore } from '../store/useStore'

type Step = 'welcome' | 'name' | 'personality' | 'style' | 'values' | 'catchphrases' | 'complete'

const steps: Step[] = ['welcome', 'name', 'personality', 'style', 'values', 'catchphrases', 'complete']

export function CreatePage() {
  const { setProfile, setCurrentPage } = useStore()
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

  function completeCreation() {
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

  const currentQs = step === 'personality' ? personalityQs : styleQs
  const currentQ = currentQs[questionIdx]

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
          <span>开始</span>
          <span>完成</span>
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
                你好，我是 Digital Immortal
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                准备好创建另一个你了吗？<br />
                这个过程大约需要5分钟，让我们开始吧！
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto cursor-pointer"
              >
                开始 <ArrowRight size={18} />
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
                先给你的数字分身起个名字
              </h2>
              <p className="text-gray-400 mb-8">很多人用自己的昵称</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入名字..."
                className="w-full bg-surface-100 border border-primary-900/40 rounded-xl px-6 py-4 text-lg text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 mb-8"
              />
              <div className="flex justify-between">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> 返回
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  disabled={!name.trim()}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  下一步 <ArrowRight size={18} />
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
                性格问卷 {questionIdx + 1}/{personalityQs.length}
              </div>
              <h2 className="text-xl font-bold text-primary-100 mb-8">{currentQ.question}</h2>

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
                      {opt.label}
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
                    <span>{currentQ.minLabel}</span>
                    <span>{currentQ.maxLabel}</span>
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
                  <ArrowLeft size={16} /> 返回
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
                  {questionIdx < personalityQs.length - 1 ? '下一题' : '下一步'} <ArrowRight size={18} />
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
              <h2 className="text-xl font-bold text-primary-100 mb-2">语言风格设置</h2>
              <p className="text-gray-400 text-sm mb-8">调整滑块来描述你的说话风格</p>

              <div className="space-y-8 mb-8">
                {styleQs.map((q) => (
                  <div key={q.id}>
                    <label className="text-sm text-primary-200 mb-2 block">{q.question}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(answers[q.dimension] ?? 0.5) * 100}
                      onChange={(e) => handleAnswer(q.dimension, parseInt(e.target.value) / 100)}
                      className="w-full accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{q.minLabel}</span>
                      <span>{q.maxLabel}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> 返回
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  下一步 <ArrowRight size={18} />
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
              <h2 className="text-xl font-bold text-primary-100 mb-2">你的核心价值观</h2>
              <p className="text-gray-400 text-sm mb-6">选择最能代表你的3-5个价值观</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {valueOptions.map((v) => (
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
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={16} /> 返回
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  disabled={selectedValues.length < 1}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  下一步 <ArrowRight size={18} />
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
              <h2 className="text-xl font-bold text-primary-100 mb-2">你的口头禅</h2>
              <p className="text-gray-400 text-sm mb-6">
                添加你经常说的话（最多5个），让分身更像你
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={phraseInput}
                  onChange={(e) => setPhraseInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPhrase()}
                  placeholder={'比如\u201c绝绝子\u201d、\u201c有道理\u201d...'}
                  className="flex-1 bg-surface-100 border border-primary-900/40 rounded-xl px-4 py-3 text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addPhrase}
                  disabled={!phraseInput.trim() || catchphrases.length >= 5}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white px-4 py-3 rounded-xl cursor-pointer disabled:cursor-not-allowed"
                >
                  添加
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
                  <ArrowLeft size={16} /> 返回
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={completeCreation}
                  className="bg-gradient-to-r from-primary-600 to-warm-500 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={18} />
                  创建分身
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
                你的分身已创建！
              </h2>
              <p className="text-lg text-primary-300 mb-1">"{name}"</p>
              <p className="text-gray-400 text-sm mb-8">
                一颗独一无二的星云，正在学习成为你
              </p>

              {/* Profile card */}
              <div className="bg-surface-100/50 border border-primary-900/30 rounded-2xl p-6 mb-6 text-left">
                <h3 className="text-primary-200 font-semibold mb-4">分身档案</h3>

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
                      <span className="text-xs text-gray-500">相似度</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">小种子阶段 -- 每天聊一聊，它会越来越像你</p>
                </div>

                {/* Big Five */}
                <div className="space-y-3">
                  {[
                    { label: '开放性', key: 'openness' as const },
                    { label: '尽责性', key: 'conscientiousness' as const },
                    { label: '外向性', key: 'extraversion' as const },
                    { label: '宜人性', key: 'agreeableness' as const },
                    { label: '情绪性', key: 'neuroticism' as const },
                  ].map((dim) => {
                    const val = (useStore.getState().profile?.bigFive[dim.key] ?? 0.5) * 100
                    return (
                      <div key={dim.key} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-16 shrink-0">{dim.label}</span>
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
                    <span className="text-xs text-gray-500">价值观: </span>
                    {selectedValues.map((v) => (
                      <span key={v} className="text-xs bg-primary-900/30 text-primary-300 px-2 py-1 rounded mr-1">
                        {v}
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
                  和分身对话
                </motion.button>
                <button
                  onClick={() => setCurrentPage('social')}
                  className="bg-surface-100 hover:bg-surface-200 text-primary-300 px-6 py-3 rounded-xl font-medium cursor-pointer"
                >
                  探索更多
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
