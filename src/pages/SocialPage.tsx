import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Shield, MessageSquare, BarChart3, ChevronRight, Clock } from 'lucide-react'
import { useStore, type Friend } from '../store/useStore'
import { socialLogs, weeklyReport } from '../data/mockData'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts'

const permissionLabels: Record<number, { label: string; desc: string; color: string }> = {
  0: { label: 'Level 0', desc: '禁止代回复', color: 'text-red-400' },
  1: { label: 'Level 1', desc: '仅草拟（需确认）', color: 'text-yellow-400' },
  2: { label: 'Level 2', desc: '自动回复', color: 'text-green-400' },
  3: { label: 'Level 3', desc: '完全自主', color: 'text-primary-400' },
}

type Tab = 'friends' | 'logs' | 'report'

export function SocialPage() {
  const { profile, friends, updateFriendPermission, setCurrentPage } = useStore()
  const [tab, setTab] = useState<Tab>('friends')
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Users size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">还没有创建分身</h2>
        <p className="text-gray-400 mb-6">先创建你的数字分身</p>
        <button onClick={() => setCurrentPage('create')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer">
          创建分身
        </button>
      </div>
    )
  }

  const statusColors = { online: 'bg-green-400', offline: 'bg-gray-500', busy: 'bg-yellow-400' }

  return (
    <div className="min-h-screen pt-16 md:pt-14 pb-20 md:pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <NebulaAvatar size={40} animate={false} />
          <div>
            <h1 className="text-xl font-bold text-primary-100">社交控制台</h1>
            <p className="text-xs text-gray-400">今日已代回复 {weeklyReport.totalReplies} 条</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-100/50 rounded-xl p-1 mb-6">
          {[
            { id: 'friends' as Tab, label: '好友列表', icon: Users },
            { id: 'logs' as Tab, label: '社交记录', icon: MessageSquare },
            { id: 'report' as Tab, label: '周报', icon: BarChart3 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                tab === t.id ? 'bg-primary-600/30 text-primary-200' : 'text-gray-400 hover:text-primary-300'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Friends */}
          {tab === 'friends' && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-3">
                {friends.map((f) => (
                  <motion.div
                    key={f.id}
                    layout
                    className="bg-surface-100/50 border border-primary-900/30 rounded-xl p-4 hover:border-primary-700/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                            {f.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-50 ${statusColors[f.status]}`} />
                        </div>
                        <div>
                          <div className="text-primary-100 font-medium text-sm">{f.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            {f.lastActive}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFriend(selectedFriend?.id === f.id ? null : f)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className={`text-xs ${permissionLabels[f.permissionLevel].color}`}>
                          {permissionLabels[f.permissionLevel].label}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`text-gray-500 transition-transform ${selectedFriend?.id === f.id ? 'rotate-90' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Permission details */}
                    <AnimatePresence>
                      {selectedFriend?.id === f.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-primary-900/20">
                            <div className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                              <Shield size={12} />
                              代回复权限设置
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {[0, 1, 2, 3].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateFriendPermission(f.id, level as 0 | 1 | 2 | 3)}
                                  className={`px-3 py-2 rounded-lg text-xs text-left transition-all cursor-pointer ${
                                    f.permissionLevel === level
                                      ? 'bg-primary-600/30 border border-primary-500/50'
                                      : 'bg-surface-200/50 border border-transparent hover:border-primary-900/30'
                                  }`}
                                >
                                  <div className={permissionLabels[level].color}>
                                    {permissionLabels[level].label}
                                  </div>
                                  <div className="text-gray-400 text-[10px] mt-0.5">
                                    {permissionLabels[level].desc}
                                  </div>
                                </button>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-3">
                              已代回复 {f.replyCount} 条消息
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Social Logs */}
          {tab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {socialLogs.map((log) => (
                  <div key={log.id} className="bg-surface-100/50 border border-primary-900/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">
                          {log.friendName[0]}
                        </div>
                        <span className="text-primary-100 font-medium text-sm">{log.friendName}</span>
                      </div>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{log.summary}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{log.messageCount} 条消息</span>
                    </div>
                    {log.highlights.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {log.highlights.map((h, i) => (
                          <div key={i} className="text-xs text-primary-300 bg-primary-900/20 px-3 py-1.5 rounded-lg">
                            {h}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Weekly Report */}
          {tab === 'report' && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-surface-100/50 border border-primary-900/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary-100 mb-1">社交周报</h3>
                <p className="text-xs text-gray-500 mb-6">{weeklyReport.period}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: '总代回复', value: weeklyReport.totalReplies },
                    { label: '自动回复', value: weeklyReport.autoReplies },
                    { label: '平均信心', value: `${weeklyReport.avgConfidence}%` },
                  ].map((s, i) => (
                    <div key={i} className="bg-surface-200/50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-primary-200">{s.value}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top contacts chart */}
                <div className="mb-6">
                  <h4 className="text-sm text-primary-200 mb-3">互动最多的好友</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={weeklyReport.topContacts} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#c4b5fd' }} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ background: '#2a2640', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Similarity trend */}
                <div className="mb-6">
                  <h4 className="text-sm text-primary-200 mb-3">相似度趋势</h4>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={weeklyReport.similarityTrend}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#2a2640', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top topics */}
                <div>
                  <h4 className="text-sm text-primary-200 mb-3">热门话题</h4>
                  <div className="flex flex-wrap gap-2">
                    {weeklyReport.topTopics.map((t, i) => (
                      <span key={i} className="bg-primary-900/30 text-primary-300 px-3 py-1.5 rounded-full text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
