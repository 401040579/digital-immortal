import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Info, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useStore } from '../store/useStore'
import { generateAvatarResponse } from '../data/mockData'
import { NebulaAvatar } from '../components/NebulaAvatar'

const similarityData = [
  { day: '第1天', value: 35 },
  { day: '第3天', value: 42 },
  { day: '第5天', value: 48 },
  { day: '第7天', value: 55 },
  { day: '第10天', value: 62 },
  { day: '第14天', value: 68 },
  { day: '今天', value: 74 },
]

export function ChatPage() {
  const { profile, messages, addMessage, setCurrentPage } = useStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <NebulaAvatar size={100} className="mb-6" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">还没有创建分身</h2>
        <p className="text-gray-400 mb-6">先创建你的数字分身，才能和它对话</p>
        <button
          onClick={() => setCurrentPage('create')}
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer"
        >
          创建分身
        </button>
      </div>
    )
  }

  async function handleSend() {
    if (!input.trim()) return
    const userMsg = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user' as const,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200))

    const response = generateAvatarResponse(userMsg.text, profile)
    const avatarMsg = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'avatar' as const,
      timestamp: Date.now(),
      confidence: response.confidence,
    }
    addMessage(avatarMsg)
    setIsTyping(false)
  }

  function getConfidenceColor(c: number) {
    if (c >= 85) return 'text-green-400'
    if (c >= 70) return 'text-yellow-400'
    return 'text-orange-400'
  }

  function getConfidenceLabel(c: number) {
    if (c >= 85) return '高信心'
    if (c >= 70) return '中信心'
    return '低信心'
  }

  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-14 pb-16 md:pb-0">
      {/* Chat header */}
      <div className="bg-surface-50/80 backdrop-blur-lg border-b border-primary-900/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NebulaAvatar size={36} animate={false} />
          <div>
            <div className="text-primary-100 font-medium text-sm">{profile.name}的分身</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              在线
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowChart(!showChart)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            showChart ? 'bg-primary-600/30 text-primary-300' : 'text-gray-400 hover:text-primary-300'
          }`}
        >
          <TrendingUp size={20} />
        </button>
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
                相似度趋势
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <NebulaAvatar size={80} className="mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              嗨，{profile.name}！我是你的数字分身。
              <br />
              虽然我刚出生，但已经迫不及待想和你聊天了！
            </p>
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
                  <span className="text-xs text-gray-500">{profile.name}的分身</span>
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
            placeholder="说点什么..."
            className="flex-1 bg-surface-100 border border-primary-900/40 rounded-xl px-4 py-3 text-sm text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
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
