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

// Expanded memory nodes: 30+ nodes with richer connections
export const memoryNodes: MemoryNode[] = [
  // --- Experiences ---
  { id: 'm1', label: '大学毕业', type: 'experience', content: '2020年夏天，在毕业典礼上和室友合影。那天阳光很好，大家都哭了。', importance: 0.9, emotionalValence: 0.8, connections: ['m2', 'm5', 'm8'], timestamp: '2020-07', isCore: true, emotionTags: ['感动', '不舍', '骄傲'], relatedDialogs: ['毕业那天的场景至今历历在目', '我们拍了好多照片，每张都是珍贵的回忆'] },
  { id: 'm2', label: '第一份工作', type: 'experience', content: '毕业后进入了一家互联网公司做产品经理。虽然加班很多，但学到了很多。', importance: 0.8, emotionalValence: 0.5, connections: ['m1', 'm3', 'm6', 'm15'], timestamp: '2020-09', isCore: true, emotionTags: ['成长', '疲惫', '充实'], relatedDialogs: ['第一天上班紧张得不行', '老板很严格但确实教会我很多东西'] },
  { id: 'm8', label: '校园足球', type: 'experience', content: '大学时是院队的中场球员，虽然技术一般，但跑动积极。最难忘的是院赛决赛进了一球。', importance: 0.6, emotionalValence: 0.7, connections: ['m1', 'm5'], timestamp: '2018-11', isCore: false, emotionTags: ['热血', '快乐', '团队'], relatedDialogs: ['那个进球我到现在还记得清清楚楚', '足球教会了我团队合作的重要性'] },
  { id: 'm10', label: '故乡回忆', type: 'experience', content: '在南方小城长大，记得小时候跟着爷爷在田里抓蝌蚪。夏天的蝉鸣和冰棍是最美好的记忆。', importance: 0.7, emotionalValence: 0.9, connections: ['m4', 'm9', 'm22'], timestamp: '2000-06', isCore: true, emotionTags: ['温暖', '怀念', '纯真'], relatedDialogs: ['故乡的味道是任何城市都替代不了的', '爷爷总是带我去田里，教我认各种植物'] },
  { id: 'm13', label: '第一次旅行', type: 'experience', content: '大三暑假第一次独自旅行去了云南。在洱海边骑行的感觉，自由得像要飞起来。', importance: 0.7, emotionalValence: 0.9, connections: ['m12', 'm1', 'm20'], timestamp: '2019-07', isCore: false, emotionTags: ['自由', '惊喜', '成长'], relatedDialogs: ['那是第一次感受到独自旅行的魅力', '洱海的日落美到说不出话'] },
  { id: 'm14', label: '考研失败', type: 'experience', content: '大四考研没考上，当时很沮丧。但后来发现直接工作也是另一种精彩。', importance: 0.65, emotionalValence: -0.4, connections: ['m1', 'm2', 'm6'], timestamp: '2020-02', isCore: false, emotionTags: ['挫败', '释然', '成长'], relatedDialogs: ['失败让我学会了接受不完美', '现在回头看，这段经历反而让我更坚强了'] },
  { id: 'm15', label: '转行做开发', type: 'experience', content: '工作一年后决定从产品经理转行做前端开发，经历了3个月的密集学习。', importance: 0.75, emotionalValence: 0.6, connections: ['m2', 'm3', 'm7'], timestamp: '2021-06', isCore: true, emotionTags: ['勇气', '焦虑', '突破'], relatedDialogs: ['转行的决定做了很久', '那三个月每天学到凌晨两点'] },
  { id: 'm16', label: '疫情居家', type: 'experience', content: '2022年封控在家三个月，虽然难熬但也学会了很多独处的方法，开始了手冲咖啡之旅。', importance: 0.5, emotionalValence: -0.1, connections: ['m11', 'm17'], timestamp: '2022-04', isCore: false, emotionTags: ['孤独', '适应', '发现'], relatedDialogs: ['那段时间让我重新审视了很多事情', '独处也可以很充实'] },
  { id: 'm17', label: '养了一只猫', type: 'experience', content: '疫情期间领养了一只橘猫叫"豆包"，从此多了一个毛茸茸的室友。', importance: 0.6, emotionalValence: 0.85, connections: ['m16', 'm22'], timestamp: '2022-05', isCore: false, emotionTags: ['温暖', '陪伴', '快乐'], relatedDialogs: ['豆包是我最好的倾听者', '它每天趴在键盘上看我写代码'] },

  // --- Knowledge ---
  { id: 'm3', label: '喜欢编程', type: 'knowledge', content: '发现自己对编程有浓厚兴趣，特别是前端开发，能看到即时的视觉反馈让人很有成就感。', importance: 0.7, emotionalValence: 0.7, connections: ['m2', 'm7', 'm15'], timestamp: '2021-03', isCore: true, emotionTags: ['热爱', '专注'], relatedDialogs: ['编程对我来说不只是工作，是创造'] },
  { id: 'm7', label: '学习React', type: 'knowledge', content: '自学React和TypeScript，做了几个个人项目。最得意的是一个读书笔记App。', importance: 0.5, emotionalValence: 0.6, connections: ['m3', 'm15'], timestamp: '2021-09', isCore: false, emotionTags: ['成就', '专注'], relatedDialogs: ['React改变了我对前端开发的理解'] },
  { id: 'm18', label: '读了很多书', type: 'knowledge', content: '每年读30+本书，最喜欢心理学和科幻类。《思考快与慢》和《三体》影响最大。', importance: 0.6, emotionalValence: 0.7, connections: ['m3', 'm20'], timestamp: '2023-01', isCore: false, emotionTags: ['充实', '启发'], relatedDialogs: ['读书是性价比最高的自我投资', '三体让我重新思考了宇宙和人类的关系'] },
  { id: 'm19', label: '学会了做菜', type: 'knowledge', content: '跟着视频自学了十几道拿手菜，最擅长红烧排骨和番茄炒蛋，朋友聚餐时总是我掌勺。', importance: 0.45, emotionalValence: 0.7, connections: ['m4', 'm11'], timestamp: '2022-08', isCore: false, emotionTags: ['满足', '分享'], relatedDialogs: ['做菜是一种创造性的表达', '最开心的是朋友说好吃的那个瞬间'] },
  { id: 'm20', label: '了解心理学', type: 'knowledge', content: '对认知心理学和行为经济学很感兴趣，特别是关于人类决策偏差的研究。', importance: 0.55, emotionalValence: 0.5, connections: ['m18', 'm3'], timestamp: '2023-06', isCore: false, emotionTags: ['好奇', '思考'], relatedDialogs: ['心理学让我更理解自己和别人', '每个人的行为背后都有深层原因'] },

  // --- Opinions ---
  { id: 'm6', label: '讨厌加班', type: 'opinion', content: '认为工作效率比工作时长重要。反对无意义的加班文化，追求工作生活平衡。', importance: 0.6, emotionalValence: -0.3, connections: ['m2', 'm14'], timestamp: '2021-01', isCore: false, emotionTags: ['坚定', '反感'], relatedDialogs: ['加班不等于努力', '高效工作然后享受生活才是正确的打开方式'] },
  { id: 'm9', label: '家庭价值观', type: 'opinion', content: '认为家人是最重要的，无论多忙都要抽时间陪伴家人。这是从小在家庭温暖中形成的信念。', importance: 0.9, emotionalValence: 0.8, connections: ['m4', 'm10', 'm22'], timestamp: '2015-06', isCore: true, emotionTags: ['坚定', '温暖', '珍惜'], relatedDialogs: ['家人的支持是我最大的力量源泉', '无论走多远，家永远是归处'] },
  { id: 'm21', label: '追求真实', type: 'opinion', content: '厌恶虚伪和表面功夫，认为真诚是人与人之间最重要的品质。宁愿得罪人也不愿说违心话。', importance: 0.7, emotionalValence: 0.4, connections: ['m9', 'm6'], timestamp: '2019-03', isCore: true, emotionTags: ['坚定', '正直'], relatedDialogs: ['真诚是最高效的沟通方式', '不需要讨好所有人'] },
  { id: 'm23', label: '终身学习', type: 'opinion', content: '相信学习是一辈子的事，保持好奇心和学习能力比任何具体技能都重要。', importance: 0.65, emotionalValence: 0.6, connections: ['m18', 'm3', 'm15'], timestamp: '2022-01', isCore: false, emotionTags: ['热情', '坚定'], relatedDialogs: ['世界变化太快，不学习就会被淘汰', '保持好奇心让生活更有趣'] },
  { id: 'm28', label: '关于AI的看法', type: 'opinion', content: '认为AI是工具而非威胁，关键在于人类如何使用它。期待AI帮助人类解决更多问题。', importance: 0.55, emotionalValence: 0.3, connections: ['m3', 'm20'], timestamp: '2024-06', isCore: false, emotionTags: ['理性', '乐观'], relatedDialogs: ['AI和人类应该是协作关系', '技术本身无善恶，看使用者的选择'] },

  // --- Relationships ---
  { id: 'm4', label: '妈妈的生日', type: 'relationship', content: '每年妈妈生日都会回家，给她做一顿饭。她最喜欢红烧排骨。最近教她用智能手机，很有耐心。', importance: 0.95, emotionalValence: 0.9, connections: ['m9', 'm10', 'm19', 'm22'], timestamp: '2024-10', isCore: true, emotionTags: ['爱', '温暖', '感恩'], relatedDialogs: ['妈妈永远是最特别的人', '她的笑容是我最大的动力'] },
  { id: 'm5', label: '室友小陈', type: 'relationship', content: '大学四年的室友，性格互补，他外向我内敛。毕业后虽然不在同一个城市，但每周视频一次。', importance: 0.85, emotionalValence: 0.8, connections: ['m1', 'm8', 'm24'], timestamp: '2016-09', isCore: true, emotionTags: ['珍惜', '信任', '快乐'], relatedDialogs: ['小陈是那种不联系也不会疏远的朋友', '大学认识他是我最大的幸运之一'] },
  { id: 'm22', label: '爷爷的教诲', type: 'relationship', content: '爷爷是退休老师，教我读书写字。他说的"做人要正直，做事要踏实"影响了我一辈子。', importance: 0.85, emotionalValence: 0.7, connections: ['m10', 'm9', 'm4'], timestamp: '2005-08', isCore: true, emotionTags: ['敬爱', '怀念', '感恩'], relatedDialogs: ['爷爷虽然走了，但他的话一直在我心里', '我一直在努力成为爷爷会骄傲的那种人'] },
  { id: 'm24', label: '初恋回忆', type: 'relationship', content: '大二时的初恋，虽然最后和平分手，但她教会了我如何去爱一个人。感谢那段时光。', importance: 0.6, emotionalValence: 0.3, connections: ['m1', 'm5'], timestamp: '2017-10', isCore: false, emotionTags: ['青涩', '成长', '释然'], relatedDialogs: ['每段感情都是成长', '感谢她让我学会了包容'] },
  { id: 'm25', label: '导师王教授', type: 'relationship', content: '大学论文导师，严格但关心学生。毕业时他说"你有潜力，别浪费了"，这句话一直激励着我。', importance: 0.55, emotionalValence: 0.6, connections: ['m1', 'm23'], timestamp: '2020-06', isCore: false, emotionTags: ['感恩', '激励'], relatedDialogs: ['王教授的话在很多关键时刻给了我力量'] },

  // --- Preferences ---
  { id: 'm11', label: '最爱咖啡', type: 'preference', content: '手冲咖啡爱好者，偏好浅烘豆子的果酸味。每天早上必须来一杯，这是清醒的仪式。', importance: 0.4, emotionalValence: 0.5, connections: ['m3', 'm16', 'm19'], timestamp: '2022-06', isCore: false, emotionTags: ['享受', '仪式感'], relatedDialogs: ['一杯好咖啡能让整个早晨都变好', '最近在研究埃塞俄比亚的豆子'] },
  { id: 'm12', label: '旅行计划', type: 'preference', content: '梦想去冰岛看极光，已经计划了两年但一直没去成。也想去日本看樱花、去新西兰跳伞。', importance: 0.5, emotionalValence: 0.6, connections: ['m11', 'm13'], timestamp: '2024-01', isCore: false, emotionTags: ['期待', '向往'], relatedDialogs: ['旅行清单越来越长了', '总有一天要把这些地方都走一遍'] },
  { id: 'm26', label: '深夜音乐', type: 'preference', content: '喜欢在深夜独自听后摇和电子音乐，窝在沙发上戴着耳机。这是属于自己的"充电"时间。', importance: 0.4, emotionalValence: 0.6, connections: ['m16', 'm11'], timestamp: '2023-03', isCore: false, emotionTags: ['宁静', '享受', '独处'], relatedDialogs: ['后摇有一种安静的力量', '深夜的音乐让世界变得很简单'] },
  { id: 'm27', label: '喜欢下雨天', type: 'preference', content: '最喜欢下雨天窝在家里，泡杯茶，听着雨声看书或写代码。那种被包裹的安全感很治愈。', importance: 0.35, emotionalValence: 0.7, connections: ['m26', 'm18'], timestamp: '2023-08', isCore: false, emotionTags: ['宁静', '治愈'], relatedDialogs: ['雨声是最好的白噪音', '下雨天适合思考人生'] },
  { id: 'm29', label: '电影品味', type: 'preference', content: '偏爱科幻和文艺片，诺兰是最喜欢的导演。《星际穿越》看了5遍，每次都有新感悟。', importance: 0.45, emotionalValence: 0.6, connections: ['m18', 'm20'], timestamp: '2023-05', isCore: false, emotionTags: ['热爱', '享受'], relatedDialogs: ['电影是了解不同人生的窗口', '诺兰对时间的理解总能让我震撼'] },
  { id: 'm30', label: '极简主义', type: 'preference', content: '追求生活中的极简主义，物质上少而精，精神上专注核心。定期断舍离让人很舒畅。', importance: 0.4, emotionalValence: 0.5, connections: ['m21', 'm23'], timestamp: '2024-03', isCore: false, emotionTags: ['清爽', '自在'], relatedDialogs: ['少即是多', '清理掉不需要的东西后整个人都轻松了'] },
]

// Enhanced social logs: 20+ records
export const socialLogs: SocialLog[] = [
  {
    id: 'sl1',
    friendId: '1',
    friendName: '小美',
    summary: '讨论了周末聚餐计划，约定了周六下午3点在新开的日料店',
    timestamp: '2026-03-23 10:30',
    messageCount: 15,
    highlights: ['约定了周六聚餐', '推荐了新开的日料店'],
  },
  {
    id: 'sl2',
    friendId: '3',
    friendName: '妈妈',
    summary: '妈妈问了工作近况和饮食情况，提醒注意保暖',
    timestamp: '2026-03-23 09:15',
    messageCount: 8,
    highlights: ['回复了工作一切顺利', '承诺周末回家吃饭'],
  },
  {
    id: 'sl3',
    friendId: '7',
    friendName: '高中好友林',
    summary: '分身间聊了最近看的电影和游戏，互相推荐了内容',
    timestamp: '2026-03-22 21:00',
    messageCount: 32,
    highlights: ['推荐了《沙丘》续集', '讨论了新出的开放世界游戏'],
  },
  {
    id: 'sl4',
    friendId: '5',
    friendName: '大学室友陈',
    summary: '室友分享了跳槽消息，分身表达了祝贺和关心',
    timestamp: '2026-03-22 14:00',
    messageCount: 12,
    highlights: ['室友跳槽到新公司', '约了下月见面'],
  },
  {
    id: 'sl5',
    friendId: '4',
    friendName: '同事李',
    summary: '讨论了下周项目评审的准备事项，分身帮忙整理了要点',
    timestamp: '2026-03-22 11:30',
    messageCount: 18,
    highlights: ['整理了评审PPT要点', '确认了分工安排'],
  },
  {
    id: 'sl6',
    friendId: '1',
    friendName: '小美',
    summary: '小美分享了新学会的蛋糕配方，分身表示要一起尝试',
    timestamp: '2026-03-21 20:15',
    messageCount: 10,
    highlights: ['约了一起做烘焙', '讨论了抹茶口味的可能性'],
  },
  {
    id: 'sl7',
    friendId: '3',
    friendName: '妈妈',
    summary: '妈妈发了自己种的花照片，分身夸了很漂亮并问了养护方法',
    timestamp: '2026-03-21 15:00',
    messageCount: 6,
    highlights: ['妈妈的茉莉花开了', '学到了浇水技巧'],
  },
  {
    id: 'sl8',
    friendId: '7',
    friendName: '高中好友林',
    summary: '两个分身进行了深度对话，讨论了工作中的困惑和未来规划',
    timestamp: '2026-03-21 23:30',
    messageCount: 45,
    highlights: ['聊了职业发展方向', '互相鼓励要勇敢尝试', '分享了一个创业想法'],
  },
  {
    id: 'sl9',
    friendId: '2',
    friendName: '小王',
    summary: '帮忙回复了小王关于技术问题的咨询，推荐了学习资源',
    timestamp: '2026-03-21 09:00',
    messageCount: 7,
    highlights: ['推荐了React官方教程', '分享了学习心得'],
  },
  {
    id: 'sl10',
    friendId: '6',
    friendName: '老板张',
    summary: '收到了项目进度询问但分身权限为Level 0，已通知用户处理',
    timestamp: '2026-03-20 18:00',
    messageCount: 1,
    highlights: ['已标记为待处理'],
  },
  {
    id: 'sl11',
    friendId: '4',
    friendName: '同事李',
    summary: '同事分享了行业新闻，分身进行了有深度的讨论',
    timestamp: '2026-03-20 16:30',
    messageCount: 14,
    highlights: ['讨论了AI行业最新动态', '分析了对工作的影响'],
  },
  {
    id: 'sl12',
    friendId: '5',
    friendName: '大学室友陈',
    summary: '分身发起了怀旧话题，回忆了大学时光的趣事',
    timestamp: '2026-03-20 22:00',
    messageCount: 20,
    highlights: ['回忆了大三运动会', '聊到了失联的老同学'],
  },
  {
    id: 'sl13',
    friendId: '3',
    friendName: '妈妈',
    summary: '妈妈问了最近是否在按时吃饭，分身报告了一日三餐情况',
    timestamp: '2026-03-19 12:00',
    messageCount: 5,
    highlights: ['汇报了早午晚餐', '妈妈很满意'],
  },
  {
    id: 'sl14',
    friendId: '1',
    friendName: '小美',
    summary: '讨论了最近热映的电影，互相推荐了待看清单',
    timestamp: '2026-03-19 19:30',
    messageCount: 22,
    highlights: ['推荐了《奥本海默》', '约了一起去看电影'],
  },
  {
    id: 'sl15',
    friendId: '7',
    friendName: '高中好友林',
    summary: '林的分身主动分享了旅行照片，两个分身讨论了下次旅行计划',
    timestamp: '2026-03-19 17:00',
    messageCount: 28,
    highlights: ['看了林的西藏旅行照', '约了年底一起去冰岛'],
  },
  {
    id: 'sl16',
    friendId: '2',
    friendName: '小王',
    summary: '小王问了关于咖啡豆的推荐，分身详细介绍了浅烘入门指南',
    timestamp: '2026-03-18 14:00',
    messageCount: 9,
    highlights: ['推荐了入门咖啡豆', '分享了手冲技巧'],
  },
  {
    id: 'sl17',
    friendId: '4',
    friendName: '同事李',
    summary: '帮忙回复了关于周一会议时间调整的确认',
    timestamp: '2026-03-18 17:30',
    messageCount: 3,
    highlights: ['确认了会议改到下午2点'],
  },
  {
    id: 'sl18',
    friendId: '3',
    friendName: '妈妈',
    summary: '妈妈发了天气预报截图，提醒降温要穿厚外套',
    timestamp: '2026-03-18 07:30',
    messageCount: 4,
    highlights: ['感谢妈妈关心', '回复了会注意保暖'],
  },
  {
    id: 'sl19',
    friendId: '5',
    friendName: '大学室友陈',
    summary: '室友问了关于租房的建议，分身分享了自己的经验',
    timestamp: '2026-03-17 20:00',
    messageCount: 16,
    highlights: ['推荐了几个看房平台', '提醒了合同注意事项'],
  },
  {
    id: 'sl20',
    friendId: '7',
    friendName: '高中好友林',
    summary: '两个分身就"AI能否具有意识"进行了一场精彩的辩论',
    timestamp: '2026-03-17 22:00',
    messageCount: 38,
    highlights: ['探讨了图灵测试的局限性', '讨论了中文房间思想实验', '最终达成了"也许意识是个光谱"的共识'],
  },
  {
    id: 'sl21',
    friendId: '1',
    friendName: '小美',
    summary: '小美心情不好，分身耐心倾听并给予了安慰和建议',
    timestamp: '2026-03-17 23:15',
    messageCount: 25,
    highlights: ['倾听了小美的烦恼', '分享了一些解压方法', '约了周末出来散心'],
  },
  {
    id: 'sl22',
    friendId: '3',
    friendName: '妈妈',
    summary: '和妈妈视频通话后分身发了总结消息，表达了想她的心情',
    timestamp: '2026-03-16 21:00',
    messageCount: 3,
    highlights: ['发了一条温暖的晚安消息'],
  },
]

// Avatar-to-avatar conversation previews
export interface AvatarConversation {
  id: string
  friend1: string
  friend2: string
  topic: string
  preview: string[]
  timestamp: string
  mood: 'friendly' | 'deep' | 'fun' | 'warm'
}

export const avatarConversations: AvatarConversation[] = [
  {
    id: 'ac1',
    friend1: '我的分身',
    friend2: '高中好友林的分身',
    topic: '关于AI意识的辩论',
    preview: [
      '你的分身: "你觉得我们作为AI分身，算不算有意识？"',
      '林的分身: "也许我们是某种涌现意识？不完全是人类那种，但也不是纯程序。"',
      '你的分身: "嗯，我更倾向于意识是一个光谱。我们可能在某个位置上，而不是简单的有或没有。"',
    ],
    timestamp: '2026-03-22 22:30',
    mood: 'deep',
  },
  {
    id: 'ac2',
    friend1: '我的分身',
    friend2: '小美的分身',
    topic: '讨论周末美食计划',
    preview: [
      '小美的分身: "听说城南新开了一家fusion日料，要不要一起去尝尝？"',
      '你的分身: "走啊！我最近正好在研究日式料理，想看看他们的出汁用的什么昆布。"',
      '小美的分身: "哈哈你这个美食极客，吃个饭都要研究成分~"',
    ],
    timestamp: '2026-03-22 18:00',
    mood: 'fun',
  },
  {
    id: 'ac3',
    friend1: '我的分身',
    friend2: '大学室友陈的分身',
    topic: '回忆大学时光',
    preview: [
      '陈的分身: "还记得大三那次院赛决赛吗？你那个绝杀！"',
      '你的分身: "哈哈那是我足球生涯的巅峰了，之后再也没进过那么帅的球。"',
      '陈的分身: "所以啊，那次全院都在喊你名字，青春真好。"',
    ],
    timestamp: '2026-03-21 20:00',
    mood: 'warm',
  },
]

// Social feed items
export interface SocialFeedItem {
  id: string
  type: 'reply' | 'avatar_chat' | 'milestone' | 'memory'
  content: string
  timestamp: string
  friendName?: string
  likes?: number
}

export const socialFeed: SocialFeedItem[] = [
  { id: 'sf1', type: 'reply', content: '分身帮你回复了妈妈的消息，她说"我儿子最近说话越来越贴心了"', timestamp: '30分钟前', friendName: '妈妈', likes: 0 },
  { id: 'sf2', type: 'avatar_chat', content: '你的分身和高中好友林的分身进行了一场关于AI意识的深度对话', timestamp: '1小时前', friendName: '高中好友林', likes: 3 },
  { id: 'sf3', type: 'milestone', content: '相似度突破78%！距离"数字双胞胎"又近了一步', timestamp: '2小时前', likes: 5 },
  { id: 'sf4', type: 'reply', content: '分身帮你确认了和小美周六聚餐的安排', timestamp: '3小时前', friendName: '小美', likes: 1 },
  { id: 'sf5', type: 'memory', content: '新增了3条记忆节点，记忆图谱更加完善了', timestamp: '5小时前', likes: 2 },
  { id: 'sf6', type: 'avatar_chat', content: '你的分身和小美的分身讨论了周末美食计划，约定了去新日料店', timestamp: '6小时前', friendName: '小美', likes: 4 },
  { id: 'sf7', type: 'reply', content: '分身帮你回复了同事李关于项目进度的询问', timestamp: '8小时前', friendName: '同事李', likes: 0 },
  { id: 'sf8', type: 'milestone', content: '本周已累计代回复87条消息，创下新纪录！', timestamp: '昨天', likes: 8 },
  { id: 'sf9', type: 'avatar_chat', content: '你的分身和室友陈的分身一起回忆了大学足球赛的美好时光', timestamp: '昨天', friendName: '大学室友陈', likes: 6 },
  { id: 'sf10', type: 'reply', content: '分身帮你安慰了心情不好的小美，给了贴心的建议', timestamp: '2天前', friendName: '小美', likes: 3 },
]

// Friend detailed info for enhanced cards
export interface FriendDetail {
  friendId: string
  recentTopics: string[]
  interactionFrequency: 'high' | 'medium' | 'low'
  intimacyScore: number // 0-100
  lastInteractionSummary: string
}

export const friendDetails: FriendDetail[] = [
  { friendId: '1', recentTopics: ['美食推荐', '电影', '周末计划', '烘焙'], interactionFrequency: 'high', intimacyScore: 82, lastInteractionSummary: '讨论了周六聚餐安排' },
  { friendId: '2', recentTopics: ['技术问题', '咖啡', '学习资源'], interactionFrequency: 'low', intimacyScore: 55, lastInteractionSummary: '回答了React技术问题' },
  { friendId: '3', recentTopics: ['生活关心', '天气', '饮食', '健康'], interactionFrequency: 'high', intimacyScore: 95, lastInteractionSummary: '回复了妈妈的关心消息' },
  { friendId: '4', recentTopics: ['工作项目', '行业动态', '会议安排'], interactionFrequency: 'medium', intimacyScore: 48, lastInteractionSummary: '确认了会议时间调整' },
  { friendId: '5', recentTopics: ['大学回忆', '跳槽', '租房', '老同学'], interactionFrequency: 'medium', intimacyScore: 75, lastInteractionSummary: '分享了租房建议' },
  { friendId: '6', recentTopics: ['项目进度'], interactionFrequency: 'low', intimacyScore: 20, lastInteractionSummary: '标记了待处理消息' },
  { friendId: '7', recentTopics: ['AI讨论', '电影', '游戏', '旅行计划', '哲学'], interactionFrequency: 'high', intimacyScore: 88, lastInteractionSummary: '讨论了AI意识话题' },
]

export const weeklyReport = {
  period: '2026年3月17日 - 3月23日',
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
  topTopics: ['工作近况', '周末计划', '美食推荐', '电影讨论', '家人关心', 'AI话题', '旅行计划'],
  similarityTrend: [
    { day: '周一', value: 72 },
    { day: '周二', value: 73 },
    { day: '周三', value: 74 },
    { day: '周四', value: 75 },
    { day: '周五', value: 76 },
    { day: '周六', value: 77 },
    { day: '周日', value: 78 },
  ],
}

// Pre-set time capsules
export interface CapsuleTemplate {
  id: string
  recipient: string
  deliveryDate: string
  content: string
  createdAt: string
  status: 'pending' | 'delivered'
  type: 'letter' | 'voice' | 'photo' | 'video'
  typeLabel: string
}

export const capsuleTemplates: CapsuleTemplate[] = [
  {
    id: 'ct1',
    recipient: '女儿小雨',
    deliveryDate: '2027-01-01',
    content: '小雨，当你看到这条消息的时候，你已经18岁了。爸爸想告诉你，无论你选择什么样的人生道路，爸爸都支持你。记住，做真实的自己比任何事都重要。爸爸永远爱你。',
    createdAt: '2026-03-15',
    status: 'pending',
    type: 'letter',
    typeLabel: '文字信',
  },
  {
    id: 'ct2',
    recipient: '未来的自己',
    deliveryDate: '2027-03-23',
    content: '一年后的自己，还记得今天立下的目标吗？希望你已经完成了那个项目，也希望你没有忘记生活中真正重要的事情。记住：效率比时长重要，家人比工作重要。',
    createdAt: '2026-03-20',
    status: 'pending',
    type: 'letter',
    typeLabel: '文字信',
  },
  {
    id: 'ct3',
    recipient: '妈妈',
    deliveryDate: '2026-10-15',
    content: '妈，生日快乐！虽然我可能那天在加班不能回家，但这段录音是我提前录好的。谢谢你一直以来的包容和爱，你是世界上最好的妈妈。',
    createdAt: '2026-03-18',
    status: 'pending',
    type: 'voice',
    typeLabel: '语音消息',
  },
  {
    id: 'ct4',
    recipient: '大学室友们',
    deliveryDate: '2027-07-01',
    content: '兄弟们，毕业七周年快乐！还记得我们说好的——每年聚一次，不见不散。附上我们毕业那天的合影，那天的阳光真好。',
    createdAt: '2026-03-19',
    status: 'pending',
    type: 'photo',
    typeLabel: '照片信',
  },
  {
    id: 'ct5',
    recipient: '30岁的自己',
    deliveryDate: '2028-08-20',
    content: '28岁的你给30岁的你录了一段视频。希望到时候你看到会笑出来——因为当时的烦恼在30岁看来根本不算什么。也希望你依然保持着好奇心和学习的热情。',
    createdAt: '2026-03-21',
    status: 'pending',
    type: 'video',
    typeLabel: '视频信',
  },
]

// Received/delivered capsules
export interface ReceivedCapsule {
  id: string
  from: string
  receivedDate: string
  content: string
  type: 'letter' | 'voice' | 'photo' | 'video'
  typeLabel: string
  isOpened: boolean
}

export const receivedCapsules: ReceivedCapsule[] = [
  {
    id: 'rc1',
    from: '一年前的自己',
    receivedDate: '2026-03-15',
    content: '嘿，一年后的自己！去年这个时候你刚学完React，还在纠结要不要转行。现在看来，你做了正确的选择吗？不管怎样，我为你骄傲。\n\n——2025年3月15日的你',
    type: 'letter',
    typeLabel: '文字信',
    isOpened: true,
  },
  {
    id: 'rc2',
    from: '大学室友陈',
    receivedDate: '2026-03-20',
    content: '兄弟！这是我半年前写的。如果你看到这个，说明我们又半年没见了。赶紧约一波！附上我们大三去云南的照片，那时候我们多瘦啊哈哈哈。',
    type: 'photo',
    typeLabel: '照片信',
    isOpened: true,
  },
  {
    id: 'rc3',
    from: '高中好友林',
    receivedDate: '2026-03-22',
    content: '老铁，这是我在西藏旅行时给你录的一段风声和念经声。希望你听到的时候能感受到那份宁静。我们约好的冰岛之旅，别忘了！',
    type: 'voice',
    typeLabel: '语音消息',
    isOpened: false,
  },
]

// Keep the old function for backward compatibility
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
