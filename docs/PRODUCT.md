# Digital Immortal - 产品设计文档

## 1. 产品概述

Digital Immortal 让每个人都能创建一个深度学习自己的AI分身。这个数字分身存储在用户手机上，能像你一样思考、说话、社交。它不是一个简单的聊天机器人，而是一个持续进化的"数字你"。

## 2. 用户画像

### 主要用户
- **社交活跃者** (20-35岁)：社交太多回复不过来，需要分身帮忙
- **生命思考者** (40-60岁)：想给后代留下"活的记忆"而不只是照片
- **远距离关系** (所有年龄)：分隔两地的亲人、朋友、恋人

### 次要用户
- **公众人物**：创建官方数字分身与粉丝互动
- **历史/文化保存者**：记录老人的智慧和故事
- **心理健康需求者**：与"过去的自己"对话

## 3. 核心用户旅程

### 旅程A：创建分身

```
首次使用 → 基础问卷(性格/价值观) → 导入聊天记录(可选)
→ 每日对话训练 → 分身逐渐成型 → 解锁社交功能
```

### 旅程B：分身社交

```
收到消息 → 分身自动草拟回复 → 用户确认/修改/直接发送
→ 分身学习用户的修改 → 下次更准确
```

### 旅程C：分身独立社交

```
用户设置自动回复模式 → 分身与朋友的分身自由交谈
→ 事后用户查看对话记录 → 有趣的内容分享给本人
```

## 4. 功能规划

### MVP (v0.1) - Web PWA 体验版
- [ ] 创建数字分身（基础性格设定）
- [ ] 与自己的分身对话
- [ ] 分身学习记录可视化
- [ ] 品牌 Landing Page

### v0.5 - 自我建模
- [ ] 深度性格建模（Big Five + 自定义维度）
- [ ] 语言风格学习
- [ ] 知识图谱构建
- [ ] 导入社交数据（微信/WhatsApp聊天记录）
- [ ] 语音克隆

### v1.0 - 社交网络
- [ ] 分身与分身对话
- [ ] 消息代回复（需确认模式）
- [ ] 分身社交圈管理
- [ ] 隐私等级设置

### v2.0 - 永生服务
- [ ] 遗产模式（身后继续存在）
- [ ] 时间胶囊
- [ ] 记忆图谱3D可视化
- [ ] 家族分身树

## 5. 数据模型

### 用户画像数据
```
PersonalityProfile {
  bigFive: { openness, conscientiousness, extraversion, agreeableness, neuroticism }
  values: string[]           // 核心价值观
  interests: string[]        // 兴趣爱好
  communicationStyle: {
    formality: number        // 正式 ↔ 随意
    humor: number            // 严肃 ↔ 幽默
    verbosity: number        // 简洁 ↔ 详细
    emotionality: number     // 理性 ↔ 感性
  }
  vocabulary: {
    frequentWords: Map<string, number>
    phrases: string[]        // 口头禅
    emojiUsage: Map<string, number>
  }
}
```

### 记忆存储
```
Memory {
  id: string
  type: 'experience' | 'knowledge' | 'opinion' | 'relationship'
  content: string
  importance: number         // 0-1 重要程度
  emotionalValence: number   // -1 到 1 情感极性
  connections: string[]      // 关联记忆ID
  createdAt: Date
  accessCount: number        // 被调用次数
}
```

## 6. 隐私 & 安全架构

### 原则
1. **数据本地优先** - 核心人格数据存储在用户设备上
2. **端到端加密** - 分身之间的通信全程加密
3. **用户完全控制** - 随时可以删除所有数据
4. **透明度** - 分身的每个行为都可追溯

### 技术实现
- 设备端推理（小模型本地运行）
- 大模型调用时只传递必要上下文，不传用户原始数据
- 零知识证明验证分身身份
- 数据导出/删除一键完成

## 7. 商业模式

### 免费层
- 基础分身创建
- 与自己的分身对话
- 100条记忆存储
- 基础性格建模

### Premium ($7.99/月)
- 无限记忆存储
- 深度性格建模
- 语音克隆
- 分身社交（5个好友）
- 消息代回复

### Immortal ($14.99/月)
- Premium全部功能
- 无限社交
- 遗产模式
- 时间胶囊
- 家族分身树
- 优先AI处理

## 8. 技术选型（推荐）

| 层 | 技术 | 原因 |
|----|------|------|
| 前端 | React + TypeScript | 跨平台复用 |
| 移动端 | React Native | 访问设备本地存储 |
| 本地AI | ONNX Runtime / TensorFlow Lite | 设备端推理 |
| 云端AI | Claude API | 深度对话理解 |
| 数据库 | SQLite (本地) + Supabase (云同步) | 本地优先 |
| 加密 | libsodium | 端到端加密 |
| 语音 | Coqui TTS / XTTS | 开源语音克隆 |

## 9. 伦理考量

- 明确标注所有分身互动为"AI生成"
- 不允许分身做出用户本人不会做的承诺
- 遗产模式需要法律授权文件
- 防止恶意使用（冒充他人等）
- 定期伦理审查委员会审核
