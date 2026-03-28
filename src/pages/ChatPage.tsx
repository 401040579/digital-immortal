import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Info, TrendingUp, Lightbulb, Cloud, CloudOff } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useStore } from '../store/useStore'
import { generateEnhancedResponse, chatScenarios } from '../data/chatScenarios'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { isBackendAvailable, avatarChat } from '../api/client'
import { useI18n } from '../i18n'

export function ChatPage() {
  const { profile, messages, addMessage, setCurrentPage } = useStore()
  const { t } = useI18n()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [showTopics, setShowTopics] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [backendOnline, setBackendOnline] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check backend availability on mount
  useEffect(() => {
    isBackendAvailable().then(setBackendOnline).catch(() => setBackendOnline(false))
  }, [])

  const similarityData = [
    { day: t('chat.similarityDays.d1'), value: 35 },
    { day: t('chat.similarityDays.d3'), value: 42 },
    { day: t('chat.similarityDays.d5'), value: 48 },
    { day: t('chat.similarityDays.d7'), value: 55 },
    { day: t('chat.similarityDays.d10'), value: 62 },
    { day: t('chat.similarityDays.d14'), value: 68 },
    { day: t('chat.similarityDays.today'), value: 78 },
  ]

  const categoryLabels: Record<string, string> = {
    casual: t('chat.categoryLabels.casual'),
    deep: t('chat.categoryLabels.deep'),
    personality_test: t('chat.categoryLabels.personality_test'),
    memory_recall: t('chat.categoryLabels.memory_recall'),
    philosophy: t('chat.categoryLabels.philosophy'),
  }

  // Build quick topics from i18n
  const quickTopics: { label: string; message: string }[] = []
  for (let i = 0; i < 6; i++) {
    const label = t(`chat.quickTopics.${i}.label`)
    const message = t(`chat.quickTopics.${i}.message`)
    if (label !== `chat.quickTopics.${i}.label`) {
      quickTopics.push({ label, message })
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <NebulaAvatar size={100} className="mb-6" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">{t('common.noAvatar')}</h2>
        <p className="text-gray-400 mb-6">{t('common.noAvatarDesc')}</p>
        <button
          onClick={() => setCurrentPage('create')}
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer"
        >
          {t('common.createAvatar')}
        </button>
      </div>
    )
  }

  async function handleSend(text?: string) {
    const msgText = text || input.trim()
    if (!msgText) return
    const userMsg = {
      id: Date.now().toString(),
      text: msgText,
      sender: 'user' as const,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setIsTyping(true)
    setShowTopics(false)
    setSelectedCategory(null)

    try {
      if (backendOnline) {
        // Use real Claude API via backend
        const recentHistory = messages.slice(-10).map((m) => ({
          text: m.text,
          sender: m.sender,
        }))
        const result = await avatarChat({
          message: msgText,
          conversationHistory: recentHistory,
        })
        const avatarMsg = {
          id: (Date.now() + 1).toString(),
          text: result.reply,
          sender: 'avatar' as const,
          timestamp: Date.now(),
          confidence: result.confidence,
        }
        addMessage(avatarMsg)
      } else {
        // Fallback: local mock response
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200))
        const response = generateEnhancedResponse(userMsg.text, profile!)
        const avatarMsg = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'avatar' as const,
          timestamp: Date.now(),
          confidence: response.confidence,
        }
        addMessage(avatarMsg)
      }
    } catch (err) {
      console.error('Chat error:', err)
      // Fallback to local on error
      const response = generateEnhancedResponse(userMsg.text, profile!)
      const avatarMsg = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'avatar' as const,
        timestamp: Date.now(),
        confidence: response.confidence,
      }
      addMessage(avatarMsg)
    } finally {
      setIsTyping(false)
    }
  }

  function getConfidenceColor(c: number) {
    if (c >= 85) return 'text-green-400'
    if (c >= 70) return 'text-yellow-400'
    return 'text-orange-400'
  }

  function getConfidenceLabel(c: number) {
    if (c >= 85) return t('chat.confidenceHigh')
    if (c >= 70) return t('chat.confidenceMedium')
    return t('chat.confidenceLow')
  }

  const categories = Object.keys(categoryLabels)
  const filteredScenarios = selectedCategory
    ? chatScenarios.filter((s) => s.category === selectedCategory)
    : []

  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-14 pb-16 md:pb-0">
      {/* Chat header */}
      <div className="bg-surface-50/80 backdrop-blur-lg border-b border-primary-900/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NebulaAvatar size={36} animate={false} />
          <div>
            <div className="text-primary-100 font-medium text-sm">{profile.name}{t('chat.avatarOf')}</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {t('common.online')} · {t('common.similarity')} {profile.similarity ?? 78}%
              {backendOnline ? (
                <span className="ml-1.5 flex items-center gap-0.5 text-[10px] text-sky-400" title="Claude AI">
                  <Cloud size={10} /> AI
                </span>
              ) : (
                <span className="ml-1.5 flex items-center gap-0.5 text-[10px] text-gray-500" title={t('common.local')}>
                  <CloudOff size={10} /> {t('common.local')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setShowTopics(!showTopics); setShowChart(false) }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showTopics ? 'bg-primary-600/30 text-primary-300' : 'text-gray-400 hover:text-primary-300'
            }`}
          >
            <Lightbulb size={20} />
          </button>
          <button
            onClick={() => { setShowChart(!showChart); setShowTopics(false) }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showChart ? 'bg-primary-600/30 text-primary-300' : 'text-gray-400 hover:text-primary-300'
            }`}
          >
            <TrendingUp size={20} />
          </button>
        </div>
      </div>

      {/* Similarity chart */}
      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface-100/50 border-b border-primary-900/30 overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="text-sm text-primary-200 mb-2 flex items-center gap-2">
                <TrendingUp size={14} />
                {t('chat.similarityTrend')}
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={similarityData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#2a2640', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#c4b5fd' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic suggestions panel */}
      <AnimatePresence>
        {showTopics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface-100/50 border-b border-primary-900/30 overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="text-sm text-primary-200 mb-3 flex items-center gap-2">
                <Lightbulb size={14} />
                {t('chat.topicInspiration')}
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-primary-600/40 text-primary-200 border border-primary-500/50'
                        : 'bg-surface-200/50 text-gray-400 border border-transparent hover:text-primary-300'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>

              {/* Scenario list for selected category */}
              {selectedCategory && filteredScenarios.length > 0 && (
                <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
                  {filteredScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSend(s.label)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-surface-200/30 text-gray-300 text-xs hover:bg-primary-900/20 hover:text-primary-200 transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick topics */}
              {!selectedCategory && (
                <div className="flex flex-wrap gap-2">
                  {quickTopics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(topic.message)}
                      className="px-3 py-1.5 rounded-full text-xs bg-surface-200/50 text-gray-300 hover:bg-primary-900/30 hover:text-primary-200 transition-colors cursor-pointer border border-primary-900/20"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <NebulaAvatar size={80} className="mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-6">
              {t('chat.noMessages').replace('{name}', profile.name)}
              <br />
              {t('chat.noMessages2')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
              {quickTopics.slice(0, 4).map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(topic.message)}
                  className="px-4 py-2 rounded-full text-xs bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 transition-colors cursor-pointer border border-primary-500/30"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-1' : ''}`}>
              {msg.sender === 'avatar' && (
                <div className="flex items-center gap-2 mb-1">
                  <NebulaAvatar size={20} animate={false} />
                  <span className="text-xs text-gray-500">{profile.name}{t('chat.avatarOf')}</span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-surface-100 text-gray-200 rounded-bl-sm border border-primary-900/20'
                }`}
              >
                {msg.text}
              </div>
              {msg.confidence !== undefined && (
                <div className={`flex items-center gap-1 mt-1 text-[10px] ${getConfidenceColor(msg.confidence)}`}>
                  <Info size={10} />
                  {getConfidenceLabel(msg.confidence)} {msg.confidence}%
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <NebulaAvatar size={20} animate={false} />
            <div className="bg-surface-100 border border-primary-900/20 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-primary-400" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary-400" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary-400" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-surface-50/80 backdrop-blur-lg border-t border-primary-900/30 px-4 py-3">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1 bg-surface-100 border border-primary-900/40 rounded-xl px-4 py-3 text-sm text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-30 text-white p-3 rounded-xl cursor-pointer disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
