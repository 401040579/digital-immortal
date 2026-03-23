import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, MessageCircle, Brain, Users, Clock, Quote, Zap, Calendar, BarChart3 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { growthMilestones, growthStats, type GrowthMilestone } from '../data/growthData'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const iconMap: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  message: MessageCircle,
  brain: Brain,
  users: Users,
  clock: Clock,
  trending: TrendingUp,
  reply: MessageCircle,
  quote: Quote,
}

const typeColors: Record<string, string> = {
  creation: 'from-purple-500 to-purple-600',
  chat: 'from-blue-500 to-blue-600',
  similarity: 'from-orange-500 to-orange-600',
  social: 'from-pink-500 to-pink-600',
  memory: 'from-indigo-500 to-indigo-600',
  capsule: 'from-teal-500 to-teal-600',
  feature: 'from-green-500 to-green-600',
}

const typeBorderColors: Record<string, string> = {
  creation: 'border-purple-500/30',
  chat: 'border-blue-500/30',
  similarity: 'border-orange-500/30',
  social: 'border-pink-500/30',
  memory: 'border-indigo-500/30',
  capsule: 'border-teal-500/30',
  feature: 'border-green-500/30',
}

const similarityGrowthData = [
  { day: '3/16', value: 35 },
  { day: '3/17', value: 45 },
  { day: '3/18', value: 52 },
  { day: '3/19', value: 62 },
  { day: '3/20', value: 66 },
  { day: '3/21', value: 72 },
  { day: '3/22', value: 76 },
  { day: '3/23', value: 78 },
]

export function GrowthPage() {
  const { profile, setCurrentPage } = useStore()
  const [selectedMilestone, setSelectedMilestone] = useState<GrowthMilestone | null>(null)

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <TrendingUp size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-primary-100 mb-3">还没有创建分身</h2>
        <p className="text-gray-400 mb-6">先创建你的数字分身</p>
        <button onClick={() => setCurrentPage('create')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer">
          创建分身
        </button>
      </div>
    )
  }

  // Group milestones by date
  const groupedMilestones: Record<string, GrowthMilestone[]> = {}
  for (const m of growthMilestones) {
    if (!groupedMilestones[m.date]) groupedMilestones[m.date] = []
    groupedMilestones[m.date].push(m)
  }

  const dates = Object.keys(groupedMilestones).sort()

  return (
    <div className="min-h-screen pt-16 md:pt-14 pb-20 md:pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <NebulaAvatar size={40} animate={false} />
          <div>
            <h1 className="text-xl font-bold text-primary-100 flex items-center gap-2">
              <Calendar size={20} className="text-primary-400" />
              分身成长日记
            </h1>
            <p className="text-xs text-gray-400">记录 {profile.name} 分身的成长历程</p>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: '活跃天数', value: growthStats.daysActive, icon: Calendar },
            { label: '总对话数', value: growthStats.totalChats, icon: MessageCircle },
            { label: '记忆数', value: growthStats.totalMemories, icon: Brain },
            { label: '代回复', value: growthStats.totalReplies, icon: Users },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-100/50 border border-primary-900/30 rounded-xl p-3 text-center"
            >
              <stat.icon size={16} className="text-primary-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-primary-200">{stat.value}</div>
              <div className="text-[10px] text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Similarity growth chart */}
        <div className="bg-surface-100/50 border border-primary-900/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-primary-400" />
              <span className="text-sm text-primary-200 font-medium">相似度成长曲线</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-primary-200">{growthStats.currentSimilarity}%</span>
              <TrendingUp size={14} className="text-green-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={similarityGrowthData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[20, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#2a2640', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#c4b5fd' }}
              />
              <Line type="monotone" dataKey="value" stroke="url(#growthGrad)" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 3 }} />
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>创建日</span>
            <span>+{growthStats.currentSimilarity - 35}% 增长</span>
            <span>今天</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-primary-900/30" />

          {dates.map((date, dateIdx) => (
            <div key={date} className="mb-8">
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[45px] h-[45px] rounded-full bg-surface-50 border-2 border-primary-500/50 flex items-center justify-center z-10 relative">
                  <span className="text-[10px] text-primary-300 font-semibold text-center leading-tight">
                    {date.slice(5).replace('-', '/')}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-primary-200 font-medium">
                    {dateIdx === 0 ? '分身诞生日' : dateIdx === dates.length - 1 ? '今天' : `第${dateIdx + 1}天`}
                  </span>
                </div>
              </div>

              {/* Milestones for this date */}
              <div className="ml-[52px] space-y-3">
                {groupedMilestones[date].map((milestone) => {
                  const IconComp = iconMap[milestone.icon] || Zap
                  const isSelected = selectedMilestone?.id === milestone.id
                  const isSimilarityBreak = milestone.type === 'similarity'

                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dateIdx * 0.05 }}
                      onClick={() => setSelectedMilestone(isSelected ? null : milestone)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all hover:border-primary-600/40 ${
                        typeBorderColors[milestone.type]
                      } ${isSelected ? 'bg-primary-900/20' : 'bg-surface-100/50'} ${
                        isSimilarityBreak ? 'ring-1 ring-orange-500/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${typeColors[milestone.type]} flex items-center justify-center shrink-0`}>
                          <IconComp size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-primary-100">{milestone.title}</h4>
                            {milestone.similarity !== undefined && (
                              <span className="text-xs font-semibold text-warm-400">{milestone.similarity}%</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isSelected && milestone.similarity !== undefined && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 pt-3 border-t border-primary-900/20"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">相似度进度</span>
                            <div className="flex-1 h-2 bg-surface-200/50 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary-600 to-warm-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${milestone.similarity}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                              />
                            </div>
                            <span className="text-xs text-primary-300 font-semibold">{milestone.similarity}%</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Future milestone teaser */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[45px] h-[45px] rounded-full bg-surface-50 border-2 border-dashed border-primary-900/30 flex items-center justify-center z-10 relative">
                <span className="text-lg text-gray-600">?</span>
              </div>
              <span className="text-sm text-gray-500">未来的里程碑...</span>
            </div>
            <div className="ml-[52px] space-y-2">
              {[
                { label: '相似度突破90%', sub: '达到"数字双胞胎"级别' },
                { label: '首次通过图灵测试', sub: '朋友无法区分你和分身' },
                { label: '遗产模式启动', sub: '你的智慧将跨越时间' },
              ].map((future, i) => (
                <div key={i} className="border border-dashed border-primary-900/20 rounded-xl p-3 bg-surface-100/20">
                  <div className="text-xs text-gray-500">{future.label}</div>
                  <div className="text-[10px] text-gray-600">{future.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
