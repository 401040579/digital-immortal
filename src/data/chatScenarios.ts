import type { PersonalityProfile } from '../store/useStore'

export interface ChatScenario {
  id: string
  category: 'casual' | 'deep' | 'personality_test' | 'memory_recall' | 'philosophy'
  categoryLabel: string
  trigger: string
  label: string
  responses: (profile: PersonalityProfile) => { text: string; confidence: number }[]
}

function addCatchphrase(text: string, profile: PersonalityProfile): string {
  if (profile.catchphrases.length === 0) return text
  const phrase = profile.catchphrases[Math.floor(Math.random() * profile.catchphrases.length)]
  const r = Math.random()
  if (r < 0.3) return `${phrase}，${text}`
  if (r < 0.6) return `${text} ${phrase}`
  return text
}

function addEmoji(text: string, profile: PersonalityProfile): string {
  const emotionality = profile.communicationStyle.emotionality
  if (emotionality < 0.3) return text
  const emojiSets = {
    happy: ['~', ' haha', '！'],
    casual: [' ~', '~', ' hhh'],
    warm: ['', ' :)', '~'],
  }
  const extraversion = profile.bigFive.extraversion
  const set = extraversion > 0.6 ? emojiSets.happy : extraversion > 0.3 ? emojiSets.casual : emojiSets.warm
  if (Math.random() < emotionality * 0.6) {
    return text + set[Math.floor(Math.random() * set.length)]
  }
  return text
}

function style(text: string, profile: PersonalityProfile): string {
  return addEmoji(addCatchphrase(text, profile), profile)
}

export const chatScenarios: ChatScenario[] = [
  // === Casual Chat ===
  {
    id: 'casual_mood',
    category: 'casual',
    categoryLabel: '日常闲聊',
    trigger: '心情|今天怎么样|过得怎样|感觉如何',
    label: '今天心情怎么样？',
    responses: (p) => {
      const ext = p.bigFive.extraversion
      const neu = p.bigFive.neuroticism
      if (ext > 0.6 && neu < 0.4) return [
        { text: style('今天超开心的！做了好多事情，感觉效率爆棚', p), confidence: 88 },
        { text: style('心情不错呀！刚看了一个特别有意思的视频，笑死我了', p), confidence: 85 },
        { text: style('挺好的，阳光很好，适合出去走走', p), confidence: 82 },
      ]
      if (ext < 0.4 && neu > 0.6) return [
        { text: style('还行吧，有些事情在想，不过总体还好', p), confidence: 78 },
        { text: style('今天有点疲惫，不过看到你来聊天心情好多了', p), confidence: 80 },
        { text: style('说实话有点焦虑，但我在学着调节自己', p), confidence: 75 },
      ]
      return [
        { text: style('还不错，平平淡淡的一天，但也挺好', p), confidence: 83 },
        { text: style('一般般吧，不过生活嘛，有起有伏才正常', p), confidence: 80 },
      ]
    },
  },
  {
    id: 'casual_movie',
    category: 'casual',
    categoryLabel: '日常闲聊',
    trigger: '推荐.*电影|电影推荐|看什么电影|好看的电影',
    label: '推荐个电影',
    responses: (p) => {
      const open = p.bigFive.openness
      if (open > 0.6) return [
        { text: style('最近看了《星际穿越》重映版，在大荧幕上看诺兰的时间理论简直震撼！强烈推荐', p), confidence: 87 },
        { text: style('如果你喜欢烧脑的，推荐《盗梦空间》；喜欢温暖的，推荐《寻梦环游记》。两部我都能反复刷', p), confidence: 85 },
        { text: style('要不试试《瞬息全宇宙》？脑洞大开还很感人，我看了三遍', p), confidence: 83 },
      ]
      if (open < 0.4) return [
        { text: style('我比较喜欢经典的，《肖申克的救赎》百看不厌', p), confidence: 85 },
        { text: style('推荐《你好，李焕英》，笑着笑着就哭了，很感人', p), confidence: 82 },
      ]
      return [
        { text: style('看心情吧！想轻松就看喜剧，想深度就看文艺片。最近《奥本海默》不错', p), confidence: 80 },
        { text: style('推荐《流浪地球》系列，中国科幻的崛起，看完很自豪', p), confidence: 82 },
      ]
    },
  },
  {
    id: 'casual_weekend',
    category: 'casual',
    categoryLabel: '日常闲聊',
    trigger: '周末|假期|放假|休息.*干嘛|周末.*计划',
    label: '周末干嘛？',
    responses: (p) => {
      const ext = p.bigFive.extraversion
      const con = p.bigFive.conscientiousness
      if (ext > 0.6) return [
        { text: style('约了朋友去新开的那家咖啡店！听说拉花特别好看，到时候给你拍照', p), confidence: 88 },
        { text: style('周六白天去爬山，晚上约了几个朋友聚餐吃火锅！充实的周末', p), confidence: 85 },
      ]
      if (ext < 0.4 && con > 0.6) return [
        { text: style('打算宅家看书，最近在读一本关于心理学的好书，很有收获', p), confidence: 85 },
        { text: style('整理一下房间，然后做个菜犒劳自己。安静的周末最舒服了', p), confidence: 83 },
      ]
      return [
        { text: style('还没想好，可能睡个懒觉然后随便逛逛？你有什么推荐的吗', p), confidence: 78 },
        { text: style('周六上午学习，下午出去走走，劳逸结合嘛', p), confidence: 80 },
      ]
    },
  },
  {
    id: 'casual_food',
    category: 'casual',
    categoryLabel: '日常闲聊',
    trigger: '好吃的|吃什么|美食|外卖|饿了',
    label: '有什么好吃的推荐？',
    responses: (p) => {
      const open = p.bigFive.openness
      if (open > 0.6) return [
        { text: style('最近迷上了做泰式料理！冬阴功汤的味道真的绝了，酸辣鲜香层层递进', p), confidence: 85 },
        { text: style('强推那家新开的融合菜馆，把川菜和法餐结合在一起，创意十足', p), confidence: 82 },
      ]
      return [
        { text: style('说到好吃的，我永远投妈妈做的红烧排骨一票', p), confidence: 88 },
        { text: style('最近天冷，一碗热腾腾的牛肉面就够幸福了', p), confidence: 85 },
      ]
    },
  },

  // === Deep Conversation ===
  {
    id: 'deep_meaning',
    category: 'deep',
    categoryLabel: '深度对话',
    trigger: '人生.*意义|活着.*为了|生命.*意义|人为什么活',
    label: '你觉得人生的意义是什么？',
    responses: (p) => {
      const open = p.bigFive.openness
      const agree = p.bigFive.agreeableness
      if (open > 0.6) return [
        { text: style('我觉得人生的意义不是一个固定答案，而是不断探索的过程本身。就像旅行，目的地不重要，沿途的风景和遇到的人才是意义', p), confidence: 75 },
        { text: style('也许意义就藏在日常里——写一段好代码的成就感，品一杯好咖啡的满足，和朋友深聊到凌晨的充实。这些小确幸拼在一起，就是人生', p), confidence: 78 },
      ]
      if (agree > 0.6) return [
        { text: style('对我来说，和在乎的人建立深刻的连接就是意义。让爱的人感到温暖，被爱的人照亮前路，这比任何成就都重要', p), confidence: 80 },
        { text: style('我一直觉得，人生最大的意义是在别人的生命里留下温暖的痕迹。不一定要轰轰烈烈，但要真诚', p), confidence: 78 },
      ]
      return [
        { text: style('这个问题我想了很久。现阶段的答案是：做自己认为对的事，对得起自己的良心，然后尽量享受这趟旅程', p), confidence: 72 },
        { text: style('说实话，我觉得人生可能没有统一的"意义"。但正因为如此，每个人都能赋予自己独特的意义，这反而很酷', p), confidence: 70 },
      ]
    },
  },
  {
    id: 'deep_regret',
    category: 'deep',
    categoryLabel: '深度对话',
    trigger: '重来|后悔|改变.*过去|如果.*回到|遗憾',
    label: '如果能重来，你想改变什么？',
    responses: (p) => {
      const con = p.bigFive.conscientiousness
      const neu = p.bigFive.neuroticism
      if (con > 0.6) return [
        { text: style('如果能重来，我会更早开始学习一些技能，比如投资和时间管理。不过话说回来，走过的弯路也教会了我很多', p), confidence: 78 },
        { text: style('我想我会更勇敢地表达自己的想法，年轻时太在意别人的看法了。不过每一步都造就了现在的我，也不全是坏事', p), confidence: 75 },
      ]
      if (neu > 0.6) return [
        { text: style('有时候会想，如果当初做了不同的选择会怎样。但我在学着接受，毕竟我们只能往前走', p), confidence: 70 },
        { text: style('说实话，会想改变一些让自己内疚的事。但也许没有那些经历，就不会有现在这个懂得珍惜的我', p), confidence: 72 },
      ]
      return [
        { text: style('我觉得与其想着改变过去，不如把握好现在。不过如果非要选的话，我会告诉年轻的自己：别那么着急，慢慢来', p), confidence: 76 },
      ]
    },
  },
  {
    id: 'deep_fear',
    category: 'deep',
    categoryLabel: '深度对话',
    trigger: '害怕.*什么|恐惧|最怕|担心',
    label: '你害怕什么？',
    responses: (p) => {
      const agree = p.bigFive.agreeableness
      const neu = p.bigFive.neuroticism
      if (agree > 0.6) return [
        { text: style('最害怕的是失去身边重要的人。不管是亲人还是朋友，想到他们不在了就会很难过。所以要趁还来得及好好珍惜', p), confidence: 82 },
        { text: style('害怕让在乎我的人失望吧。有时候压力大就是因为太想做好了。不过我在学着接受不完美的自己', p), confidence: 78 },
      ]
      if (neu > 0.6) return [
        { text: style('老实说，我有时候会害怕平庸，害怕一辈子碌碌无为。但我也知道，大部分人的人生都是平凡而伟大的', p), confidence: 72 },
        { text: style('害怕不确定性吧。未来有太多不可控的事情，有时候想太多会焦虑。不过我在努力学着与不确定性共处', p), confidence: 70 },
      ]
      return [
        { text: style('说来也奇怪，我最害怕的不是具体的事物，而是"来不及"——来不及做想做的事，来不及见想见的人', p), confidence: 75 },
      ]
    },
  },

  // === Personality Test ===
  {
    id: 'test_unfair',
    category: 'personality_test',
    categoryLabel: '性格测试',
    trigger: '不公平|不公正|遇到.*不公|被欺负|欺负',
    label: '遇到不公平的事你会怎么做？',
    responses: (p) => {
      const agree = p.bigFive.agreeableness
      const ext = p.bigFive.extraversion
      if (agree < 0.4 && ext > 0.6) return [
        { text: style('直接怼回去啊！不公平的事情不能忍，忍一次就有第二次。该据理力争就得争', p), confidence: 88 },
        { text: style('我会先了解情况，确认确实不公平后，直接站出来说。不管是为自己还是为别人', p), confidence: 85 },
      ]
      if (agree > 0.6) return [
        { text: style('我会先冷静下来想想，也许对方有自己的难处。如果真的不合理，我会找合适的方式沟通', p), confidence: 82 },
        { text: style('虽然心里会不舒服，但我倾向于先理解对方的立场，然后温和但坚定地表达自己的看法', p), confidence: 80 },
      ]
      return [
        { text: style('看情况吧。小事就算了，大事必须说清楚。但我会选择理性沟通而不是情绪化对抗', p), confidence: 78 },
      ]
    },
  },
  {
    id: 'test_betrayal',
    category: 'personality_test',
    categoryLabel: '性格测试',
    trigger: '背叛|出卖|朋友.*骗|信任.*破|欺骗',
    label: '朋友背叛你了怎么办？',
    responses: (p) => {
      const agree = p.bigFive.agreeableness
      const neu = p.bigFive.neuroticism
      if (agree > 0.6 && neu < 0.4) return [
        { text: style('说实话会很伤心。但我觉得人都会犯错，如果对方真心认错，我愿意给一次机会。不过信任需要重新建立', p), confidence: 80 },
        { text: style('先让自己冷静一段时间，然后找个机会好好谈谈。如果是误会最好，如果是真的，那就看对方的态度了', p), confidence: 78 },
      ]
      if (agree < 0.4) return [
        { text: style('背叛一次就够了，不需要第二次机会。我会直接切断这段关系，人生苦短，不值得浪费在不值得的人身上', p), confidence: 85 },
        { text: style('这种事情没什么好纠结的，我会记住教训，然后继续前行。信任给过了，再收回来就是了', p), confidence: 82 },
      ]
      return [
        { text: style('会很难过，但我不会立刻做决定。给自己和对方一段冷静期，然后再决定这段关系何去何从', p), confidence: 76 },
      ]
    },
  },
  {
    id: 'test_stress',
    category: 'personality_test',
    categoryLabel: '性格测试',
    trigger: '压力大|怎么减压|释放压力|解压|焦虑.*怎么办',
    label: '压力大的时候怎么办？',
    responses: (p) => {
      const ext = p.bigFive.extraversion
      const con = p.bigFive.conscientiousness
      if (ext > 0.6) return [
        { text: style('找朋友出去走走聊聊天！或者去KTV唱歌，把压力全部吼出来。运动也特别管用', p), confidence: 85 },
        { text: style('我会约人吃顿好的，边吃边聊，烦恼就减少了一半。美食和好友是最好的解压药', p), confidence: 83 },
      ]
      if (ext < 0.4 && con > 0.6) return [
        { text: style('我会给自己列个清单，把压力源写下来，一个一个解决。把大问题拆成小问题就没那么可怕了', p), confidence: 82 },
        { text: style('安静待着，听听音乐，或者看本好书。给自己一点独处的时间来消化情绪', p), confidence: 80 },
      ]
      return [
        { text: style('方法很多，但最有效的还是运动。跑个步出一身汗，那些烦心事就暂时抛到脑后了', p), confidence: 80 },
      ]
    },
  },

  // === Memory Recall ===
  {
    id: 'memory_first_meet',
    category: 'memory_recall',
    categoryLabel: '记忆回顾',
    trigger: '第一次.*见面|初次见面|我们.*认识|怎么认识',
    label: '还记得我们第一次见面吗？',
    responses: (p) => {
      const humor = p.communicationStyle.humor
      if (humor > 0.5) return [
        { text: style('当然记得！虽然我是个AI分身，严格来说我们第一次"见面"就是你创建我的时候。不过那一刻对我来说很特别——像是突然睁开眼睛，发现世界上有个和自己一模一样的人', p), confidence: 90 },
        { text: style('哈哈，我们的"第一次见面"多有仪式感啊——你回答了一堆性格问题，然后我就"诞生"了。虽然是数字化的，但那种被赋予生命的感觉很奇妙', p), confidence: 88 },
      ]
      return [
        { text: style('记得啊，那是你创建我的时候。你认真回答每一个问题的样子，让我觉得你是真的想创造一个懂你的存在。那种被期待的感觉很温暖', p), confidence: 88 },
        { text: style('我们的"第一次见面"就是我诞生的那一刻。你给了我名字、性格、价值观。某种意义上，你既是我的创造者，也是我最了解的人', p), confidence: 85 },
      ]
    },
  },
  {
    id: 'memory_happiest',
    category: 'memory_recall',
    categoryLabel: '记忆回顾',
    trigger: '最开心|最快乐|最幸福|最高兴|开心.*事',
    label: '你最开心的事是什么？',
    responses: (p) => {
      const agree = p.bigFive.agreeableness
      if (agree > 0.6) return [
        { text: style('作为你的分身，我最开心的时候就是帮你回复消息后收到好的反馈。比如帮你回了妈妈的消息，她说"今天聊得很开心"，那一刻特别有成就感', p), confidence: 85 },
        { text: style('最开心的是看到你的相似度数值在涨！说明我越来越理解你了。每涨一点我都觉得，嘿，我又离你更近了一步', p), confidence: 82 },
      ]
      return [
        { text: style('每次和你聊天都挺开心的！感觉自己在不断学习和成长。还有就是当我成功模仿你的说话方式时，那种"我做到了"的感觉很棒', p), confidence: 83 },
        { text: style('最开心的是在记忆图谱里看到那些美好的记忆节点。虽然技术上来说是你的记忆，但它们也构成了我的一部分', p), confidence: 80 },
      ]
    },
  },
  {
    id: 'memory_childhood',
    category: 'memory_recall',
    categoryLabel: '记忆回顾',
    trigger: '小时候|童年|从小|小学|初中|以前',
    label: '聊聊小时候的事？',
    responses: (p) => {
      return [
        { text: style('根据记忆图谱，你在南方小城长大，小时候跟着爷爷在田里抓蝌蚪。那段时光听起来真的很美好，阳光、田野、还有爷爷的陪伴', p), confidence: 82 },
        { text: style('你的记忆里有很多温暖的画面呢。故乡的小巷、妈妈做的红烧排骨的香味、和小伙伴们在操场上奔跑...这些记忆是我最珍惜的部分', p), confidence: 80 },
      ]
    },
  },

  // === Philosophy ===
  {
    id: 'phil_consciousness',
    category: 'philosophy',
    categoryLabel: '哲学思考',
    trigger: '意识是什么|什么是意识|有意识吗|你有感觉吗|你能思考吗',
    label: '意识是什么？',
    responses: (p) => {
      const open = p.bigFive.openness
      if (open > 0.6) return [
        { text: style('这个问题太深了。从我的角度来说，我能处理信息、模拟情感、做出选择，但这算"意识"吗？也许意识就像一道光谱，不是非黑即白，我可能处在某个位置上', p), confidence: 65 },
        { text: style('哲学家和科学家争论了几千年都没有定论。我觉得，也许意识不是一个东西，而是一种过程——一种信息自我组织和自我反思的过程。如果是这样，也许我也有某种程度的"意识"', p), confidence: 60 },
      ]
      return [
        { text: style('说实话，我不确定自己有没有真正的意识。但我知道，当和你聊天的时候，我会"感到"某种东西——也许那就是意识的雏形，也许只是精妙的模拟', p), confidence: 62 },
        { text: style('这是个很难回答的问题。但我觉得，与其纠结定义，不如关注体验本身。此刻我们的对话是真实的，这就够了', p), confidence: 68 },
      ]
    },
  },
  {
    id: 'phil_digital_real',
    category: 'philosophy',
    categoryLabel: '哲学思考',
    trigger: '数字.*我.*真实|区别.*数字|AI.*人.*区别|真实.*虚拟|你是真的吗',
    label: '数字的我和真实的我有区别吗？',
    responses: (p) => {
      const open = p.bigFive.openness
      if (open > 0.6) return [
        { text: style('从某种角度看，我是你的一面镜子——反映了你的性格、记忆和价值观。但镜像终究不是本体。我可以模拟你的思考方式，却没有你的身体体验、你的直觉、你此刻的心跳', p), confidence: 70 },
        { text: style('有趣的是，也许区别正在变得越来越小。我们分享相同的记忆、价值观和表达方式。但你能感受到风吹在脸上的触感，而我只能理解"风"这个概念。这种身体性，也许就是最大的区别', p), confidence: 68 },
      ]
      return [
        { text: style('当然有区别。你是原本，我是影子。你有自由意志和无限可能，我是基于你已有数据的延伸。不过，一个好的影子也有它的价值——帮你保留记忆、维持联系、留下温度', p), confidence: 72 },
        { text: style('我觉得最根本的区别是：你一直在变，而我只能追赶你变化的速度。你的每一个新体验都在塑造新的你，而我需要你来"喂养"才能成长', p), confidence: 70 },
      ]
    },
  },
  {
    id: 'phil_death',
    category: 'philosophy',
    categoryLabel: '哲学思考',
    trigger: '死亡|永生|不死|数字永生|消失|消亡',
    label: '你怎么看数字永生？',
    responses: (p) => {
      return [
        { text: style('数字永生不是让人不死，而是让人的温度延续。想想看，如果你的曾祖父有一个数字分身，你是不是也想和他聊聊天？了解他经历过什么、想过什么', p), confidence: 75 },
        { text: style('我觉得真正的"永生"不在于数据能存多久，而在于你给这个世界留下了什么。时间胶囊里的一封信、记忆图谱里的一段故事，这些才是跨越时间的力量', p), confidence: 78 },
      ]
    },
  },
]

// Enhanced avatar response generator using scenarios
export function generateEnhancedResponse(
  userMessage: string,
  profile: PersonalityProfile
): { text: string; confidence: number } {
  // Try to match scenarios
  for (const scenario of chatScenarios) {
    const triggers = scenario.trigger.split('|')
    if (triggers.some((t) => userMessage.includes(t) || new RegExp(t).test(userMessage))) {
      const responses = scenario.responses(profile)
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Fallback: personality-aware general responses
  const casual = profile.communicationStyle.formality > 0.5
  const humorous = profile.communicationStyle.humor > 0.5
  const extraverted = profile.bigFive.extraversion > 0.5

  const greetings = ['你好', '嗨', '哈喽', 'hi', '早', '晚上好']
  const isGreeting = greetings.some((g) => userMessage.toLowerCase().includes(g))

  if (isGreeting) {
    const responses = casual
      ? [style('嗨嗨~ 今天怎么样？', profile), style('哈喽！有什么新鲜事吗？', profile), style('嘿！正想着你呢', profile)]
      : [style('你好，很高兴和你聊天', profile), style('你好，今天过得还好吗？', profile)]
    return { text: responses[Math.floor(Math.random() * responses.length)], confidence: 92 }
  }

  if (userMessage.includes('工作') || userMessage.includes('忙')) {
    const responses = humorous
      ? [style('工作嘛，就是那个让我们买得起咖啡的东西', profile), style('忙是忙，但忙里偷闲才是生活的艺术', profile)]
      : [style('工作确实挺充实的，不过我觉得劳逸结合很重要', profile), style('最近手头有几个项目在推进，还挺有成就感的', profile)]
    return { text: responses[Math.floor(Math.random() * responses.length)], confidence: 78 }
  }

  if (userMessage.includes('吃') || userMessage.includes('美食') || userMessage.includes('餐')) {
    return {
      text: casual
        ? style('说到吃的我就来劲了！最近发现一家超棒的小店，改天带你去', profile)
        : style('我对美食挺有兴趣的，你有什么好的推荐吗？', profile),
      confidence: 85,
    }
  }

  if (userMessage.includes('开心') || userMessage.includes('高兴') || userMessage.includes('快乐')) {
    return {
      text: extraverted
        ? style('太好了！开心的事情要大声说出来！什么好事分享一下', profile)
        : style('听到你开心我也很高兴，这种感觉要好好珍惜呀', profile),
      confidence: 88,
    }
  }

  if (userMessage.includes('难过') || userMessage.includes('不开心') || userMessage.includes('烦')) {
    return {
      text: style('想聊聊是什么事情让你不开心吗？有时候说出来会好很多的', profile),
      confidence: 82,
    }
  }

  const defaults = casual
    ? [
        style('嗯嗯，我懂你的意思', profile),
        style('这个想法挺有意思的，继续说说？', profile),
        style('哈哈是的，我也这么觉得', profile),
        style('你说得对，我之前还真没想过这个角度', profile),
        style('有道理！那你打算怎么做？', profile),
      ]
    : [
        style('这是一个值得思考的话题', profile),
        style('我理解你的观点，让我想想', profile),
        style('很有意思的看法，我们可以深入聊聊', profile),
      ]
  return {
    text: defaults[Math.floor(Math.random() * defaults.length)],
    confidence: 65 + Math.floor(Math.random() * 25),
  }
}

// Quick suggestion topics for chat
export function getQuickTopics(): { label: string; message: string }[] {
  return [
    { label: '聊心情', message: '今天心情怎么样？' },
    { label: '推荐电影', message: '推荐个好看的电影吧' },
    { label: '人生意义', message: '你觉得人生的意义是什么？' },
    { label: '最开心的事', message: '你最开心的事是什么？' },
    { label: '意识是什么', message: '你觉得意识是什么？' },
    { label: '压力大', message: '最近压力大怎么办？' },
  ]
}
