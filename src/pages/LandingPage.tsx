import { motion } from 'framer-motion'
import { Sparkles, MessageCircle, Users, Clock, Shield, Star, ArrowRight, Check } from 'lucide-react'
import { NebulaAvatar } from '../components/NebulaAvatar'
import { useStore } from '../store/useStore'

const features = [
  {
    icon: Sparkles,
    title: '数字分身',
    desc: '基于你的性格、语言风格和价值观，创建一个独一无二的数字"你"',
  },
  {
    icon: MessageCircle,
    title: '智能代回复',
    desc: '分身理解你的说话方式，帮你回复消息，维持社交温度',
  },
  {
    icon: Users,
    title: '分身社交',
    desc: '你的分身可以和朋友的分身聊天，帮你扩展社交圈',
  },
  {
    icon: Clock,
    title: '数字永生',
    desc: '时间胶囊、记忆图谱、遗产模式，让你的智慧跨越时间',
  },
]

const stories = [
  {
    name: '小林',
    age: 28,
    role: '产品经理',
    quote: '\u201c每天200+条消息回不完，分身帮我维持了20个微信群的社交温度。现在朋友们都说我越来越\u2018会聊天\u2019了。\u201d',
    metric: '社交回复效率提升 300%',
  },
  {
    name: '张叔',
    age: 55,
    role: '大学教授',
    quote: '\u201c父母去世后，很多故事和智慧没有被记录。现在我把自己的经历和想法都教给了分身，女儿随时可以和\u2018爸爸\u2019聊天。\u201d',
    metric: '已记录 2000+ 条人生记忆',
  },
  {
    name: '小美',
    age: 32,
    role: '海外留学生',
    quote: '\u201c12小时时差让我很难和爸妈保持联系。现在爸妈可以随时和我的分身聊天，他们觉得我一直在身边。\u201d',
    metric: '家人满意度提升 85%',
  },
]

const plans = [
  {
    name: '免费版',
    price: '0',
    period: '',
    features: ['基础分身创建', '每日20次对话', '100条记忆存储', '基础性格建模'],
    cta: '免费开始',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '7.99',
    period: '/月',
    features: ['无限对话 & 记忆', '深度性格建模', '语音克隆', '分身社交（5好友）', '消息代回复', '社交周报'],
    cta: '开始体验',
    highlight: true,
  },
  {
    name: 'Immortal',
    price: '14.99',
    period: '/月',
    features: ['Premium全部功能', '无限社交', '遗产模式', '时间胶囊', '家族分身树', '优先AI处理'],
    cta: '解锁永生',
    highlight: false,
  },
]

export function LandingPage() {
  const setCurrentPage = useStore((s) => s.setCurrentPage)

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
            数字永生
          </p>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            创建一个深度理解你的AI分身。
            <br className="hidden md:block" />
            它像你一样思考、说话、社交 -- 一面温暖的镜子。
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentPage('create')}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-lg shadow-primary-600/30 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles size={20} />
            创建你的数字分身
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
          不只是聊天机器人
        </motion.h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          一个持续进化的"数字你"
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
              <h3 className="text-lg font-semibold text-primary-100 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-100">
          如何运作？
        </h2>
        <div className="space-y-12">
          {[
            { step: '01', title: '性格建模', desc: '通过有趣的问卷和对话，让AI深度理解你的性格、语言风格和价值观。' },
            { step: '02', title: '持续训练', desc: '每天和分身聊几分钟，它会越来越像你。看着相似度从35%涨到85%的成就感！' },
            { step: '03', title: '社交代理', desc: '设定好友的代回复权限，让分身帮你维持社交温度，再也不怕忘记回消息。' },
            { step: '04', title: '数字永生', desc: '记忆图谱、时间胶囊、遗产模式，让你的智慧和记忆跨越时间限制。' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="text-4xl font-bold text-primary-600/40 shrink-0 w-16">{item.step}</div>
              <div>
                <h3 className="text-xl font-semibold text-primary-200 mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Stories */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-100">
          用户故事
        </h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          每个人都有不同的理由拥有数字分身
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
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
                  {s.name[0]}
                </div>
                <div>
                  <div className="text-primary-100 font-medium">{s.name}，{s.age}岁</div>
                  <div className="text-xs text-gray-500">{s.role}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1 italic">{s.quote}</p>
              <div className="flex items-center gap-2 text-xs text-primary-400 bg-primary-900/20 rounded-lg px-3 py-2">
                <Star size={14} />
                {s.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="bg-surface-100/30 backdrop-blur border border-primary-900/30 rounded-2xl p-8 text-center">
          <Shield size={40} className="text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-100 mb-3">隐私优先，你完全掌控</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            核心数据存储在你的设备上，端到端加密通信。你随时可以查看、编辑、删除分身的任何记忆。
            我们不卖数据，不偷看隐私。你的数字分身，只属于你。
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-100">
          定价方案
        </h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          选择适合你的方案
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
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
                  最受欢迎
                </div>
              )}
              <h3 className="text-xl font-bold text-primary-100 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-200">${plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
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
                {plan.cta}
              </button>
            </motion.div>
          ))}
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
            准备好遇见另一个自己了吗？
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            只需5分钟，开始你的数字永生之旅
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentPage('create')}
            className="bg-gradient-to-r from-primary-600 to-warm-500 hover:from-primary-500 hover:to-warm-400 text-white px-10 py-4 rounded-2xl text-lg font-medium shadow-lg shadow-primary-600/30 cursor-pointer"
          >
            创建你的数字分身
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-900/30 px-6 py-8 text-center text-sm text-gray-500">
        <p>Digital Immortal &copy; 2026 &middot; 温暖的镜子，而非冰冷的复制</p>
        <p className="mt-1 text-xs text-gray-600">所有分身生成内容均标注为AI生成 | 隐私优先</p>
      </footer>
    </div>
  )
}
