import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, X, Calendar, User, FileText, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export function CapsulePage() {
  const { profile, capsules, addCapsule, removeCapsule, setCurrentPage } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [content, setContent] = useState('')

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
    })
    setRecipient('')
    setDeliveryDate('')
    setContent('')
    setShowForm(false)
  }

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
              写给未来的信，在指定日期送达
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? '取消' : '创建胶囊'}
          </motion.button>
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
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <User size={14} />
                      收件人
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={'比如\u201c女儿小雨\u201d、\u201c未来的自己\u201d...'}
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
                      placeholder="写给未来的话..."
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

        {/* Capsule list */}
        <div className="space-y-4">
          {capsules.length === 0 && (
            <div className="text-center py-16">
              <Clock size={48} className="text-primary-900/50 mx-auto mb-4" />
              <p className="text-gray-500">还没有时间胶囊</p>
              <p className="text-xs text-gray-600 mt-1">点击"创建胶囊"写一封给未来的信</p>
            </div>
          )}

          {capsules.map((capsule) => {
            const daysLeft = getDaysUntil(capsule.deliveryDate)
            const isDelivered = capsule.status === 'delivered' || daysLeft <= 0

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
                      <Clock size={20} className={isDelivered ? 'text-warm-400' : 'text-primary-400'} />
                    </div>
                    <div>
                      <div className="text-primary-100 font-medium text-sm">
                        致 {capsule.recipient}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {capsule.deliveryDate}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCapsule(capsule.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
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
      </div>
    </div>
  )
}
