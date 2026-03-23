export interface GrowthMilestone {
  id: string
  date: string
  type: 'creation' | 'chat' | 'similarity' | 'social' | 'memory' | 'capsule' | 'feature'
  title: string
  description: string
  icon: string
  similarity?: number
}

export const growthMilestones: GrowthMilestone[] = [
  {
    id: 'g1',
    date: '2026-03-16',
    type: 'creation',
    title: '分身诞生',
    description: '完成了性格问卷和语言风格设置，你的数字分身正式诞生了！初始相似度35%。',
    icon: 'sparkles',
    similarity: 35,
  },
  {
    id: 'g2',
    date: '2026-03-16',
    type: 'chat',
    title: '第一次对话',
    description: '分身和你进行了第一次对话，虽然有些生涩，但已经开始学习你的表达方式。',
    icon: 'message',
    similarity: 37,
  },
  {
    id: 'g3',
    date: '2026-03-17',
    type: 'memory',
    title: '首批记忆录入',
    description: '导入了12条核心记忆，包括大学毕业、第一份工作、家庭记忆等。记忆图谱初步成形。',
    icon: 'brain',
    similarity: 42,
  },
  {
    id: 'g4',
    date: '2026-03-17',
    type: 'chat',
    title: '深度对话解锁',
    description: '第一次进行了关于"人生意义"的深度对话。分身展现出了对你价值观的初步理解。',
    icon: 'message',
    similarity: 45,
  },
  {
    id: 'g5',
    date: '2026-03-18',
    type: 'similarity',
    title: '相似度突破50%',
    description: '通过持续对话和记忆训练，相似度突破50%！分身已经能模仿你的基本语言风格。',
    icon: 'trending',
    similarity: 50,
  },
  {
    id: 'g6',
    date: '2026-03-18',
    type: 'social',
    title: '首次社交连接',
    description: '添加了第一位好友"小美"，开始建立社交网络。设置了Level 1代回复权限。',
    icon: 'users',
    similarity: 52,
  },
  {
    id: 'g7',
    date: '2026-03-19',
    type: 'social',
    title: '首次代回复',
    description: '分身第一次成功代替你回复了妈妈的消息，她说"你最近说话越来越贴心了"。',
    icon: 'reply',
    similarity: 58,
  },
  {
    id: 'g8',
    date: '2026-03-19',
    type: 'feature',
    title: '口头禅学会',
    description: '分身成功学会了你的口头禅，在对话中自然地使用它们。朋友都没发现是AI在回复！',
    icon: 'quote',
    similarity: 62,
  },
  {
    id: 'g9',
    date: '2026-03-20',
    type: 'capsule',
    title: '第一个时间胶囊',
    description: '创建了第一个时间胶囊，写给女儿小雨的18岁生日信。温暖的文字穿越时空。',
    icon: 'clock',
    similarity: 64,
  },
  {
    id: 'g10',
    date: '2026-03-20',
    type: 'memory',
    title: '记忆图谱扩展',
    description: '记忆节点增加到30个！覆盖了经历、知识、观点、关系和偏好五大维度。',
    icon: 'brain',
    similarity: 66,
  },
  {
    id: 'g11',
    date: '2026-03-21',
    type: 'similarity',
    title: '相似度突破70%',
    description: '重大里程碑！相似度突破70%！分身已经能准确把握你的情感倾向和决策风格。',
    icon: 'trending',
    similarity: 70,
  },
  {
    id: 'g12',
    date: '2026-03-21',
    type: 'social',
    title: '分身间首次对话',
    description: '你的分身和高中好友林的分身进行了第一次自主对话，聊了电影和游戏推荐。',
    icon: 'users',
    similarity: 72,
  },
  {
    id: 'g13',
    date: '2026-03-22',
    type: 'chat',
    title: '哲学讨论达人',
    description: '进行了关于"数字意识"和"永生"的哲学讨论，分身展现出了深度思考能力。',
    icon: 'message',
    similarity: 74,
  },
  {
    id: 'g14',
    date: '2026-03-22',
    type: 'social',
    title: '社交网络成长',
    description: '好友列表增加到7人，本周总计代回复87条消息，平均信心度84%。',
    icon: 'users',
    similarity: 76,
  },
  {
    id: 'g15',
    date: '2026-03-23',
    type: 'similarity',
    title: '相似度突破80%（预计）',
    description: '按照当前成长速率，预计今天将突破80%的相似度！距离"数字双胞胎"越来越近。',
    icon: 'trending',
    similarity: 80,
  },
]

export interface GrowthStats {
  totalChats: number
  totalMessages: number
  totalMemories: number
  totalFriends: number
  totalReplies: number
  totalCapsules: number
  daysActive: number
  currentSimilarity: number
}

export const growthStats: GrowthStats = {
  totalChats: 23,
  totalMessages: 156,
  totalMemories: 30,
  totalFriends: 7,
  totalReplies: 87,
  totalCapsules: 2,
  daysActive: 7,
  currentSimilarity: 78,
}
