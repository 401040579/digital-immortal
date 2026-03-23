import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, X, Calendar, User, FileText, Trash2, Mail, MailOpen, Mic, Image, Video, Send } from 'lucide-react'
import { useStore } from '../store/useStore'
import { capsuleTemplates, receivedCapsules, type ReceivedCapsule } from '../data/mockData'

type CapsuleType = 'letter' | 'voice' | 'photo' | 'video'

const capsuleTypeConfig: Record<CapsuleType, { icon: typeof FileText; label: string; color: string }> = {
  letter: { icon: FileText, label: '文字信', color: 'text-primary-400' },
  voice: { icon: Mic, label: '语音', color: 'text-green-400' },
  photo: { icon: Image, label: '照片', color: 'text-blue-400' },
  video: { icon: Video, label: '视频', color: 'text-pink-400' },
}

type Tab = 'sent' | 'received'

export function CapsulePage() {
  const { profile, capsules, addCapsule, removeCapsule, setCurrentPage } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [content, setContent] = useState('')
  const [capsuleType, setCapsuleType] = useState<CapsuleType>('letter')
  const [tab, setTab] = useState<Tab>('sent')
  const [openedCapsule, setOpenedCapsule] = useState<ReceivedCapsule | null>(null)
  const [isOpening, setIsOpening] = useState(false)
  const [localReceived, setLocalReceived] = useState(receivedCapsules)

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Clock size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">还没有创建分身</h2>
        <p className="text-gray-400 mb-6">先创建你的数字分身</p>
        <button onClick={() => setCurrentPage('create')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer">
          创建分身
        </button>
      </div>
    )
  }

  function getDaysUntil(dateStr: string) {
    const target = new Date(dateStr)
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  function handleSubmit() {
    if (!recipient.trim() || !deliveryDate || !content.trim()) return
    addCapsule({
      id: Date.now().toString(),
      recipient: recipient.trim(),
      deliveryDate,
      content: content.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      type: capsuleType,
    })
    setRecipient('')
    setDeliveryDate('')
    setContent('')
    setCapsuleType('letter')
    setShowForm(false)
  }

  async function handleOpenCapsule(capsule: ReceivedCapsule) {
    if (capsule.isOpened) {
      setOpenedCapsule(capsule)
      return
    }
    setIsOpening(true)
    setOpenedCapsule(capsule)

    // Simulate opening ceremony
    await new Promise((r) => setTimeout(r, 2000))

    setLocalReceived((prev) =>
      prev.map((c) => (c.id === capsule.id ? { ...c, isOpened: true } : c))
    )
    setIsOpening(false)
  }

  // Combine user-created capsules with preset templates
  const allSentCapsules = [
    ...capsuleTemplates.map((t) => ({
      ...t,
      type: t.type as CapsuleType,
    })),
    ...capsules.map((c) => ({
      ...c,
      type: (c.type || 'letter') as CapsuleType,
      typeLabel: capsuleTypeConfig[(c.type || 'letter') as CapsuleType].label,
    })),
  ]

  return (
    <div className="min-h-screen pt-16 md:pt-14 pb-20 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-xl font-bold text-primary-100 flex items-center gap-2">
              <Clock size={22} className="text-primary-400" />
              时间胶囊
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              写给未来的信，在指定日期送达 · {allSentCapsules.length} 个待送 · {localReceived.length} 个已收
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? '取消' : '创建'}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-100/50 rounded-xl p-1 mb-6">
          {[
            { id: 'sent' as Tab, label: '已发送', icon: Send, count: allSentCapsules.length },
            { id: 'received' as Tab, label: '已收到', icon: MailOpen, count: localReceived.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                tab === t.id ? 'bg-primary-600/30 text-primary-200' : 'text-gray-400 hover:text-primary-300'
              }`}
            >
              <t.icon size={16} />
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Create form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-surface-100/50 border border-primary-900/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-primary-100 mb-4">创建新时间胶囊</h3>

                <div className="space-y-4">
                  {/* Capsule type selector */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">胶囊类型</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.entries(capsuleTypeConfig) as [CapsuleType, typeof capsuleTypeConfig.letter][]).map(([type, config]) => (
                        <button
                          key={type}
                          onClick={() => setCapsuleType(type)}
                          className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                            capsuleType === type
                              ? 'border-primary-500 bg-primary-600/20'
                              : 'border-primary-900/30 bg-surface-200/30 hover:border-primary-700/40'
                          }`}
                        >
                          <config.icon size={20} className={config.color} />
                          <span className="text-[10px] text-gray-400">{config.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <User size={14} />
                      收件人
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={'比如"女儿小雨"、"未来的自己"...'}
                      className="w-full bg-surface-50 border border-primary-900/40 rounded-xl px-4 py-3 text-sm text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Calendar size={14} />
                      送达日期
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-surface-50 border border-primary-900/40 rounded-xl px-4 py-3 text-sm text-primary-100 focus:outline-none focus:border-primary-500/50 [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <FileText size={14} />
                      内容
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        capsuleType === 'letter' ? '写给未来的话...' :
                        capsuleType === 'voice' ? '描述语音内容（模拟）...' :
                        capsuleType === 'photo' ? '描述照片内容和附言...' :
                        '描述视频内容和附言...'
                      }
                      rows={5}
                      className="w-full bg-surface-50 border border-primary-900/40 rounded-xl px-4 py-3 text-sm text-primary-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!recipient.trim() || !deliveryDate || !content.trim()}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-40 text-white py-3 rounded-xl font-medium cursor-pointer disabled:cursor-not-allowed"
                  >
                    封存胶囊
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sent capsules */}
        {tab === 'sent' && (
          <div className="space-y-4">
            {allSentCapsules.length === 0 && (
              <div className="text-center py-16">
                <Clock size={48} className="text-primary-900/50 mx-auto mb-4" />
                <p className="text-gray-500">还没有时间胶囊</p>
                <p className="text-xs text-gray-600 mt-1">点击"创建"写一封给未来的信</p>
              </div>
            )}

            {allSentCapsules.map((capsule) => {
              const daysLeft = getDaysUntil(capsule.deliveryDate)
              const isDelivered = capsule.status === 'delivered' || daysLeft <= 0
              const typeConf = capsuleTypeConfig[capsule.type || 'letter']
              const TypeIcon = typeConf.icon

              return (
                <motion.div
                  key={capsule.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-surface-100/50 border rounded-2xl p-6 ${
                    isDelivered ? 'border-warm-400/30' : 'border-primary-900/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDelivered ? 'bg-warm-500/20' : 'bg-primary-600/20'
                      }`}>
                        <TypeIcon size={20} className={typeConf.color} />
                      </div>
                      <div>
                        <div className="text-primary-100 font-medium text-sm">
                          致 {capsule.recipient}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {capsule.deliveryDate}
                          </span>
                          <span className={`${typeConf.color} text-[10px]`}>{capsule.typeLabel}</span>
                        </div>
                      </div>
                    </div>
                    {capsules.some((c) => c.id === capsule.id) && (
                      <button
                        onClick={() => removeCapsule(capsule.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3">
                    "{capsule.content}"
                  </p>

                  {/* Countdown */}
                  {!isDelivered ? (
                    <div className="bg-surface-200/50 rounded-xl p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-200 mb-1">
                          {daysLeft}
                        </div>
                        <div className="text-xs text-gray-400">天后送达</div>
                      </div>
                      <div className="mt-3 h-1.5 bg-surface-300/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-600 to-warm-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(5, 100 - (daysLeft / 365) * 100)}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-warm-500/10 border border-warm-500/20 rounded-xl px-4 py-3 text-center">
                      <span className="text-warm-400 text-sm font-medium">已送达</span>
                    </div>
                  )}

                  <div className="text-[10px] text-gray-600 mt-3">
                    创建于 {capsule.createdAt}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Received capsules */}
        {tab === 'received' && (
          <div className="space-y-4">
            {localReceived.length === 0 && (
              <div className="text-center py-16">
                <Mail size={48} className="text-primary-900/50 mx-auto mb-4" />
                <p className="text-gray-500">还没有收到时间胶囊</p>
              </div>
            )}

            {localReceived.map((capsule) => {
              const typeConf = capsuleTypeConfig[capsule.type]
              const TypeIcon = typeConf.icon

              return (
                <motion.div
                  key={capsule.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleOpenCapsule(capsule)}
                  className={`border rounded-2xl p-5 cursor-pointer transition-all hover:border-primary-600/40 ${
                    capsule.isOpened
                      ? 'bg-surface-100/50 border-primary-900/30'
                      : 'bg-gradient-to-br from-warm-500/10 to-primary-600/10 border-warm-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      capsule.isOpened ? 'bg-surface-200/50' : 'bg-warm-500/20'
                    }`}>
                      {capsule.isOpened ? (
                        <MailOpen size={24} className="text-primary-400" />
                      ) : (
                        <Mail size={24} className="text-warm-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-primary-100 font-medium text-sm">来自 {capsule.from}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>到达于 {capsule.receivedDate}</span>
                        <span className={typeConf.color}>{capsule.typeLabel}</span>
                      </div>
                    </div>
                    {!capsule.isOpened && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-warm-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold"
                      >
                        新!
                      </motion.div>
                    )}
                    {capsule.isOpened && (
                      <TypeIcon size={16} className={typeConf.color} />
                    )}
                  </div>

                  {capsule.isOpened && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{capsule.content.slice(0, 60)}...</p>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Opening ceremony modal */}
        <AnimatePresence>
          {openedCapsule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              onClick={() => { if (!isOpening) setOpenedCapsule(null) }}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-surface-50 border border-primary-900/30 rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto"
              >
                {isOpening ? (
                  // Opening animation
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: 'linear' }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-warm-400 to-primary-500 mx-auto mb-6 flex items-center justify-center"
                    >
                      <Mail size={32} className="text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0, 1] }}
                      transition={{ duration: 2 }}
                    >
                      <p className="text-primary-200 text-lg font-medium mb-2">正在开启时间胶囊...</p>
                      <p className="text-gray-400 text-sm">来自 {openedCapsule.from} 的时光寄语</p>
                    </motion.div>

                    {/* Sparkle particles */}
                    <div className="relative h-12 mt-4">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-warm-400"
                          style={{ left: `${10 + i * 12}%` }}
                          animate={{
                            y: [0, -20, -10, -30],
                            opacity: [0, 1, 0.5, 0],
                            scale: [0, 1, 0.5, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.15,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // Opened content
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                          <MailOpen size={20} className="text-primary-400" />
                        </div>
                        <div>
                          <div className="text-primary-100 font-medium">来自 {openedCapsule.from}</div>
                          <div className="text-xs text-gray-500">
                            {openedCapsule.receivedDate} · {capsuleTypeConfig[openedCapsule.type].label}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenedCapsule(null)}
                        className="text-gray-500 hover:text-gray-300 cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Type-specific UI */}
                    {openedCapsule.type === 'voice' && (
                      <div className="bg-surface-100/50 border border-green-500/20 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Mic size={18} className="text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-surface-200/50 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-green-500 rounded-full"
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">0:32（模拟播放）</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {openedCapsule.type === 'photo' && (
                      <div className="bg-surface-100/50 border border-blue-500/20 rounded-xl p-4 mb-4 text-center">
                        <div className="w-full h-40 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg flex items-center justify-center mb-2">
                          <Image size={32} className="text-blue-400/50" />
                        </div>
                        <div className="text-[10px] text-gray-500">照片附件（模拟展示）</div>
                      </div>
                    )}

                    {openedCapsule.type === 'video' && (
                      <div className="bg-surface-100/50 border border-pink-500/20 rounded-xl p-4 mb-4 text-center">
                        <div className="w-full h-40 bg-gradient-to-br from-pink-900/30 to-red-900/30 rounded-lg flex items-center justify-center mb-2 relative">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Video size={20} className="text-white/80" />
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-500">视频附件（模拟展示）</div>
                      </div>
                    )}

                    <div className="bg-surface-100/30 rounded-xl p-5 mb-4">
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                        {openedCapsule.content}
                      </p>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                      这是一封跨越时间的信，承载着真挚的情感
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
