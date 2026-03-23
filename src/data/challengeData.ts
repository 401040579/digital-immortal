export interface ChallengeQuestion {
  id: string
  scenario: string
  optionA: string
  optionB: string
  correctAnswer: 'A' | 'B'
  explanation: string
}

export const challengeQuestions: ChallengeQuestion[] = [
  {
    id: 'q1',
    scenario: '朋友问"周末有空吗？想约你出来玩"',
    optionA: '当然有空！去哪里？我都行~',
    optionB: '周末啊，我看看日程安排，确认一下再和你说。',
    correctAnswer: 'A',
    explanation: '根据你的外向性和随性的沟通风格，分身更倾向于热情直接地回应朋友的邀约。',
  },
  {
    id: 'q2',
    scenario: '同事在群里发了一个有争议的观点',
    optionA: '我觉得这个观点不对，理由是...（详细反驳）',
    optionB: '嗯，这个角度挺新的，不过我们也可以从另一个角度想想~',
    correctAnswer: 'B',
    explanation: '你的高宜人性让分身倾向于温和地表达不同意见，而不是直接对抗。',
  },
  {
    id: 'q3',
    scenario: '妈妈发消息说"今天降温了，多穿衣服"',
    optionA: '知道啦妈，我会注意的。你也要多穿点，别着凉了！',
    optionB: '收到。',
    correctAnswer: 'A',
    explanation: '根据你重视家庭的价值观和温暖的沟通风格，分身会真诚回应妈妈的关心并反过来表达关怀。',
  },
  {
    id: 'q4',
    scenario: '有人推荐了一本完全陌生领域的书',
    optionA: '听起来不太感兴趣，我还是看我喜欢的类型吧。',
    optionB: '哦？这个领域我还没接触过，正好可以拓展一下视野！分享一下书名？',
    correctAnswer: 'B',
    explanation: '你的高开放性特征让分身对新事物充满好奇，愿意探索未知领域。',
  },
  {
    id: 'q5',
    scenario: '深夜11点，你突然想起明天的重要会议',
    optionA: '先把明天需要的材料整理好，列个checklist，准备充分才能安心睡觉。',
    optionB: '算了，明天早起再说吧，船到桥头自然直~',
    correctAnswer: 'A',
    explanation: '根据你的尽责性评分，分身倾向于提前准备和有序安排，而不是拖延到最后一刻。',
  },
  {
    id: 'q6',
    scenario: '朋友发来一个悲伤的故事，说自己最近很不顺',
    optionA: '加油，一切都会好的！往好的方向想想！',
    optionB: '听起来确实很辛苦。你想聊聊吗？我在这里，不管多晚。',
    correctAnswer: 'B',
    explanation: '你的高宜人性和重视真诚的价值观让分身更倾向于共情倾听，而非空洞的鼓励。',
  },
  {
    id: 'q7',
    scenario: '有人问你对AI会不会取代人类工作的看法',
    optionA: 'AI是工具，关键在于人类如何使用它。与其担心被取代，不如思考如何与AI协作共进。',
    optionB: 'AI就是个工具，没什么好担心的，别想太多。',
    correctAnswer: 'A',
    explanation: '根据你的高开放性和深度思考的沟通习惯，分身会给出有层次的分析而非简单结论。',
  },
  {
    id: 'q8',
    scenario: '周末在家无聊，室友说"我们去探索那个新开的市集吧"',
    optionA: '走啊走啊！最喜欢逛市集了，说不定能发现什么宝贝~',
    optionB: '市集啊...人应该很多吧？我还是在家待着看书吧。',
    correctAnswer: 'A',
    explanation: '综合你的外向性和对新事物的开放态度，分身更倾向于接受有趣的新体验邀约。',
  },
  {
    id: 'q9',
    scenario: '你收到了一个不太合理的工作要求',
    optionA: '好的，我来处理。（内心不满但默默接受）',
    optionB: '我理解需求的紧急性，但我觉得这个方案有些地方可以优化，我们可以讨论一下吗？',
    correctAnswer: 'B',
    explanation: '虽然你宜人性较高，但同时注重真诚和正义的价值观让分身选择温和但坚定地表达自己。',
  },
  {
    id: 'q10',
    scenario: '朋友说"你变了，感觉不太一样了"',
    optionA: '是吗？哈哈，人总是在变化的嘛。你觉得哪里不一样了？',
    optionB: '变了？没有吧，我一直都是这样的啊。',
    correctAnswer: 'A',
    explanation: '你的高开放性让分身对自我反思持开放态度，愿意认真对待别人的反馈而非回避。',
  },
]
