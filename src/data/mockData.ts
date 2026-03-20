import type { MemoryNode, SocialLog } from '../store/useStore'

export const personalityQuestions = [
  {
    id: 1,
    question: '朋友突然取消了周末约定，你的第一反应是？',
    type: 'choice' as const,
    dimension: 'agreeableness',
    options: [
      { label: '没关系，下次再约', value: 0.8 },
      { label: '有点失望，但能理解', value: 0.5 },
      { label: '会直接表达不满', value: 0.2 },
    ],
  },
  {
    id: 2,
    question: '面对一个全新的领域，你更倾向于？',
    type: 'choice' as const,
    dimension: 'openness',
    options: [
      { label: '立刻兴奋地钻研', value: 0.9 },
      { label: '先观望再决定', value: 0.5 },
      { label: '更喜欢待在舒适区', value: 0.2 },
    ],
  },
  {
    id: 3,
    question: '在社交场合中，你通常是？',
    type: 'slider' as const,
    dimension: 'extraversion',
    min: 0,
    max: 1,
    minLabel: '安静聆听的人',
    maxLabel: '活跃带动气氛的人',
  },
  {
    id: 4,
    question: '做重要决定时，你更依赖？',
    type: 'slider' as const,
    dimension: 'emotionality',
    min: 0,
    max: 1,
    minLabel: '理性分析',
    maxLabel: '直觉和感受',
  },
  {
    id: 5,
    question: '你的待办清单通常是？',
    type: 'choice' as const,
    dimension: 'conscientiousness',
    options: [
      { label: '详细规划，每天都整理', value: 0.9 },
      { label: '有大致计划，灵活调整', value: 0.5 },
      { label: '随性而为，讨厌计划', value: 0.1 },
    ],
  },
  {
    id: 6,
    question: '遇到压力时，你通常会？',
    type: 'choice' as const,
    dimension: 'neuroticism',
    options: [
      { label: '容易焦虑，需要倾诉', value: 0.8 },
      { label: '内心波动，但能自我调节', value: 0.5 },
      { label: '泰然处之，很少受影响', value: 0.2 },
    ],
  },
  {
    id: 7,
    question: '你说话的风格更偏向？',
    type: 'slider' as const,
    dimension: 'formality',
    min: 0,
    max: 1,
    minLabel: '正式严谨',
    maxLabel: '随意轻松',
  },
  {
    id: 8,
    question: '你的幽默感类型？',
    type: 'slider' as const,
    dimension: 'humor',
    min: 0,
    max: 1,
    minLabel: '严肃认真',
    maxLabel: '段子手',
  },
]

export const valueOptions = [
  '真诚', '自由', '创新', '家庭', '正义', '成长',
  '友情', '健康', '知识', '冒险', '和平', '独立',
  '责任', '快乐', '美', '勇气', '善良', '智慧',
]

export const memoryNodes: MemoryNode[] = [
  { id: 'm1', label: '大学毕业', type: 'experience', content: '2020年夏天，在毕业典礼上和室友合影。那天阳光很好，大家都哭了。', importance: 0.9, emotionalValence: 0.8, connections: ['m2', 'm5', 'm8'] },
  { id: 'm2', label: '第一份工作', type: 'experience', content: '毕业后进入了一家互联网公司做产品经理。虽然加班很多，但学到了很多。', importance: 0.8, emotionalValence: 0.5, connections: ['m1', 'm3', 'm6'] },
  { id: 'm3', label: '喜欢编程', type: 'preference', content: '发现自己对编程有浓厚兴趣，特别是前端开发，能看到即时的视觉反馈。', importance: 0.7, emotionalValence: 0.7, connections: ['m2', 'm7'] },
  { id: 'm4', label: '妈妈的生日', type: 'relationship', content: '每年妈妈生日都会回家，给她做一顿饭。她最喜欢红烧排骨。', importance: 0.95, emotionalValence: 0.9, connections: ['m9', 'm10'] },
  { id: 'm5', label: '室友小陈', type: 'relationship', content: '大学四年的室友，性格互补。毕业后虽然不在同一个城市，但经常视频。', importance: 0.85, emotionalValence: 0.8, connections: ['m1', 'm8'] },
  { id: 'm6', label: '讨厌加班', type: 'opinion', content: '认为工作效率比工作时长重要。反对无意义的加班文化。', importance: 0.6, emotionalValence: -0.3, connections: ['m2'] },
  { id: 'm7', label: '学习React', type: 'knowledge', content: '自学React和TypeScript，做了几个个人项目。最得意的是一个读书笔记App。', importance: 0.5, emotionalValence: 0.6, connections: ['m3'] },
  { id: 'm8', label: '校园足球', type: 'experience', content: '大学时是院队的中场球员，虽然技术一般，但跑动积极。', importance: 0.6, emotionalValence: 0.7, connections: ['m1', 'm5'] },
  { id: 'm9', label: '家庭价值观', type: 'opinion', content: '认为家人是最重要的，无论多忙都要抽时间陪伴家人。', importance: 0.9, emotionalValence: 0.8, connections: ['m4', 'm10'] },
  { id: 'm10', label: '故乡回忆', type: 'experience', content: '在南方小城长大，记得小时候跟着爷爷在田里抓蝌蚪。', importance: 0.7, emotionalValence: 0.9, connections: ['m4', 'm9'] },
  { id: 'm11', label: '最爱咖啡', type: 'preference', content: '手冲咖啡爱好者，偏好浅烘豆子的果酸味。每天早上必须来一杯。', importance: 0.4, emotionalValence: 0.5, connections: ['m3'] },
  { id: 'm12', label: '旅行计划', type: 'preference', content: '梦想去冰岛看极光，已经计划了两年但一直没去成。', importance: 0.5, emotionalValence: 0.6, connections: ['m11'] },
]

export const socialLogs: SocialLog[] = [
  {
    id: 'sl1',
    friendId: '1',
    friendName: '小美',
    summary: '讨论了周末聚餐计划，约定了周六下午3点在新开的日料店',
    timestamp: '2026-03-20 10:30',
    messageCount: 15,
    highlights: ['约定了周六聚餐', '推荐了新开的日料店'],
  },
  {
    id: 'sl2',
    friendId: '3',
    friendName: '妈妈',
    summary: '妈妈问了工作近况和饮食情况，提醒注意保暖',
    timestamp: '2026-03-20 09:15',
    messageCount: 8,
    highlights: ['回复了工作一切顺利', '承诺周末回家吃饭'],
  },
  {
    id: 'sl3',
    friendId: '7',
    friendName: '高中好友林',
    summary: '分身间聊了最近看的电影和游戏，互相推荐了内容',
    timestamp: '2026-03-19 21:00',
    messageCount: 32,
    highlights: ['推荐了《沙丘》续集', '讨论了新出的开放世界游戏'],
  },
  {
    id: 'sl4',
    friendId: '5',
    friendName: '大学室友陈',
    summary: '室友分享了跳槽消息，分身表达了祝贺和关心',
    timestamp: '2026-03-19 14:00',
    messageCount: 12,
    highlights: ['室友跳槽到新公司', '约了下月见面'],
  },
]

export const weeklyReport = {
  period: '2026年3月14日 - 3月20日',
  totalReplies: 87,
  autoReplies: 52,
  draftReplies: 35,
  avgConfidence: 84,
  topContacts: [
    { name: '妈妈', count: 28 },
    { name: '高中好友林', count: 21 },
    { name: '小美', count: 18 },
    { name: '同事李', count: 12 },
    { name: '大学室友陈', count: 8 },
  ],
  topTopics: ['工作近况', '周末计划', '美食推荐', '电影讨论', '家人关心'],
  similarityTrend: [
    { day: '周一', value: 76 },
    { day: '周二', value: 78 },
    { day: '周三', value: 77 },
    { day: '周四', value: 80 },
    { day: '周五', value: 82 },
    { day: '周六', value: 83 },
    { day: '周日', value: 85 },
  ],
}

// Simulated avatar responses based on personality
export function generateAvatarResponse(
  userMessage: string,
  profile: { bigFive: { extraversion: number; agreeableness: number; openness: number }; communicationStyle: { humor: number; formality: number } } | null
): { text: string; confidence: number } {
  const casual = profile ? profile.communicationStyle.formality > 0.5 : true
  const humorous = profile ? profile.communicationStyle.humor > 0.5 : false
  const extraverted = profile ? profile.bigFive.extraversion > 0.5 : true

  const greetings = ['你好', '嗨', '哈喽', 'hi', '早', '晚上好']
  const isGreeting = greetings.some((g) => userMessage.toLowerCase().includes(g))

  if (isGreeting) {
    const responses = casual
      ? ['嗨嗨~ 今天怎么样？', '哈喽！有什么新鲜事吗？', '嘿！正想着你呢~']
      : ['你好，很高兴和你聊天。', '你好，今天过得还好吗？']
    return { text: responses[Math.floor(Math.random() * responses.length)], confidence: 92 }
  }

  if (userMessage.includes('工作') || userMessage.includes('忙')) {
    const responses = humorous
      ? ['工作嘛，就是那个让我们买得起咖啡的东西 哈哈', '忙是忙，但忙里偷闲才是生活的艺术~']
      : ['工作确实挺充实的，不过我觉得劳逸结合很重要', '最近手头有几个项目在推进，还挺有成就感的']
    return { text: responses[Math.floor(Math.random() * responses.length)], confidence: 78 }
  }

  if (userMessage.includes('吃') || userMessage.includes('美食') || userMessage.includes('餐')) {
    return {
      text: casual
        ? '说到吃的我就来劲了！最近发现一家超棒的小店，改天带你去~'
        : '我对美食挺有兴趣的，你有什么好的推荐吗？',
      confidence: 85,
    }
  }

  if (userMessage.includes('开心') || userMessage.includes('高兴') || userMessage.includes('快乐')) {
    return {
      text: extraverted
        ? '太好了！开心的事情要大声说出来！什么好事分享一下~'
        : '听到你开心我也很高兴，这种感觉要好好珍惜呀',
      confidence: 88,
    }
  }

  if (userMessage.includes('难过') || userMessage.includes('不开心') || userMessage.includes('烦')) {
    return {
      text: '抱抱~ 想聊聊是什么事情让你不开心吗？有时候说出来会好很多的',
      confidence: 82,
    }
  }

  // Default responses
  const defaults = casual
    ? [
        '嗯嗯，我懂你的意思~',
        '这个想法挺有意思的，继续说说？',
        '哈哈是的，我也这么觉得',
        '你说得对，我之前还真没想过这个角度',
        '有道理！那你打算怎么做？',
      ]
    : [
        '这是一个值得思考的话题。',
        '我理解你的观点，让我想想。',
        '很有意思的看法，我们可以深入聊聊。',
      ]
  return {
    text: defaults[Math.floor(Math.random() * defaults.length)],
    confidence: 65 + Math.floor(Math.random() * 25),
  }
}
