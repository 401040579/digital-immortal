# Digital Immortal - 技术架构文档

## 1. 系统总览

Digital Immortal 采用"本地优先"混合架构：核心人格数据和推理在用户设备上完成，仅在必要时调用云端大模型进行深度理解和生成。

```
┌─────────────────────────────────────────────────┐
│                    用户设备                        │
│                                                   │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ 性格建模  │  │  记忆图谱  │  │  本地推理引擎 │  │
│  │ 引擎     │  │  (FAISS)  │  │ (ONNX/TFLite)│  │
│  └────┬─────┘  └─────┬─────┘  └──────┬───────┘  │
│       │              │               │           │
│  ┌────┴──────────────┴───────────────┴───────┐   │
│  │            本地编排层 (Orchestrator)         │   │
│  └────────────────────┬──────────────────────┘   │
│                       │                          │
│  ┌────────────────────┴──────────────────────┐   │
│  │          加密通信层 (libsodium E2EE)        │   │
│  └────────────────────┬──────────────────────┘   │
└───────────────────────┼──────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │     中继服务器          │
            │  (仅转发加密消息)       │
            └───────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   其他用户设备      云端AI服务      认证服务
  (分身间通信)    (Claude API)    (身份验证)
```

## 2. AI人格建模管线 (Personality Modeling Pipeline)

### 2.1 数据采集阶段

```
输入源：
├── 结构化问卷
│   ├── Big Five 性格测评 (44题标准量表)
│   ├── 价值观排序卡片 (Schwartz理论 10类价值观)
│   ├── 沟通风格偏好设置 (滑块交互)
│   └── "红线"定义 (用户明确禁止的话题/观点)
│
├── 非结构化数据导入
│   ├── 微信聊天记录 (.txt / 备份解析)
│   ├── WhatsApp导出文件
│   ├── 社交媒体帖子 (可选)
│   └── 语音样本 (15分钟以上)
│
└── 持续对话训练
    ├── 每日对话 (用户与分身)
    ├── 情境模拟 ("如果XXX你会怎么说")
    └── 修改反馈 (用户修改分身的回复)
```

### 2.2 特征提取阶段

```python
# 伪代码：人格特征提取管线
class PersonalityPipeline:

    def extract_from_questionnaire(self, answers):
        """结构化问卷 → Big Five + 价值观向量"""
        big_five = compute_big_five(answers)          # 5维向量
        values = rank_schwartz_values(answers)         # 10维向量
        return PersonalityVector(big_five, values)

    def extract_from_conversations(self, chat_history):
        """聊天记录 → 语言风格特征"""
        style = LanguageStyleExtractor()
        features = {
            'avg_message_length': style.avg_length(chat_history),
            'emoji_frequency': style.emoji_freq(chat_history),
            'response_latency': style.response_time(chat_history),
            'formality_score': style.formality(chat_history),
            'humor_markers': style.humor_detection(chat_history),
            'vocabulary_richness': style.vocab_diversity(chat_history),
            'frequent_phrases': style.extract_catchphrases(chat_history),
            'topic_distribution': style.topic_modeling(chat_history),
            'sentiment_baseline': style.avg_sentiment(chat_history),
            'relationship_style_map': style.per_contact_style(chat_history),
        }
        return LanguageProfile(features)

    def extract_from_voice(self, audio_samples):
        """语音 → 声纹特征 + 语调模式"""
        speaker_embedding = voice_encoder.encode(audio_samples)
        prosody = prosody_analyzer.extract(audio_samples)
        return VoiceProfile(speaker_embedding, prosody)
```

### 2.3 人格模型构建

采用"基座模型 + LoRA适配器"架构：

```
┌─────────────────────────────────────────┐
│        云端基座模型 (Claude API)           │
│     用于深度理解、复杂推理、长文生成        │
└──────────────────┬──────────────────────┘
                   │ 知识蒸馏
┌──────────────────┴──────────────────────┐
│     本地小模型 (< 4B参数, 量化INT4)       │
│  ┌─────────────────────────────────┐    │
│  │ 基座权重 (通用对话能力, 只读)     │    │
│  ├─────────────────────────────────┤    │
│  │ LoRA适配器 A: 性格与语气         │    │
│  │ LoRA适配器 B: 知识与记忆         │    │
│  │ LoRA适配器 C: 社交策略           │    │
│  └─────────────────────────────────┘    │
│                                          │
│  适配器大小: 每个 10-50MB                 │
│  总占用: 模型 ~2GB + 适配器 ~150MB       │
└──────────────────────────────────────────┘
```

**LoRA适配器训练策略：**
- 适配器A（性格与语气）：基于用户对话和问卷数据微调，每周更新
- 适配器B（知识与记忆）：基于RAG检索增强，动态加载相关记忆
- 适配器C（社交策略）：基于用户对代回复的修改反馈进行强化学习

### 2.4 相似度评估系统

```
评估维度及权重：
├── 语言风格相似度 (30%)
│   ├── 句式结构匹配
│   ├── 用词习惯匹配
│   └── emoji使用匹配
├── 性格一致性 (25%)
│   ├── Big Five维度偏差
│   └── 价值观对齐度
├── 知识准确性 (20%)
│   ├── 个人信息回忆准确率
│   └── 观点一致性
├── 对话自然度 (15%)
│   └── 人类评估者评分
└── 社交适当性 (10%)
    └── 场景应答恰当性

总相似度 = 加权平均分 (0-100%)
```

## 3. 记忆图谱结构 (Memory Graph)

### 3.1 存储架构

采用"短期记忆 + 长期记忆 + 语义索引"三层结构：

```
┌────────────────────────────────────────────┐
│          短期记忆 (Working Memory)           │
│  容量: 最近50条对话                          │
│  存储: 内存 (运行时)                         │
│  用途: 当前对话上下文                        │
│  淘汰: LRU策略，对话结束后归档到长期记忆      │
└─────────────────────┬──────────────────────┘
                      │ 归档 & 压缩
┌─────────────────────┴──────────────────────┐
│          长期记忆 (Long-term Memory)         │
│  容量: 无限制 (受设备存储限制)                │
│  存储: SQLite (结构化) + 文件系统 (媒体)     │
│  索引: FAISS向量索引 (语义检索)              │
│  组织: 图结构 (节点 = 记忆, 边 = 关联)       │
└─────────────────────┬──────────────────────┘
                      │ 聚合 & 抽象
┌─────────────────────┴──────────────────────┐
│          核心记忆 (Core Memory)              │
│  容量: ~500条                                │
│  内容: 用户核心身份信息、关键人物关系、        │
│        重要人生事件、核心价值观               │
│  特点: 不会被遗忘，优先加载到上下文           │
└────────────────────────────────────────────┘
```

### 3.2 记忆节点结构

```typescript
interface MemoryNode {
  id: string;                    // UUID
  type: MemoryType;              // experience | knowledge | opinion | relationship | preference
  content: string;               // 记忆内容（自然语言）
  embedding: Float32Array;       // 语义向量 (384维, MiniLM)
  importance: number;            // 0-1, 基于情感强度+提及频率+用户标记
  emotionalValence: number;      // -1 ~ 1
  confidence: number;            // 0-1, 来源可信度
  source: MemorySource;          // conversation | import | questionnaire | inferred
  tags: string[];                // 话题标签
  entities: Entity[];            // 关联实体 (人名、地点、事件)
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  decayFactor: number;           // 遗忘曲线参数
}

interface MemoryEdge {
  sourceId: string;
  targetId: string;
  relation: EdgeRelation;        // causal | temporal | thematic | emotional | contradicts
  weight: number;                // 0-1, 关联强度
}

type MemoryType = 'experience' | 'knowledge' | 'opinion' | 'relationship' | 'preference';
type MemorySource = 'conversation' | 'import' | 'questionnaire' | 'inferred';
type EdgeRelation = 'causal' | 'temporal' | 'thematic' | 'emotional' | 'contradicts';
```

### 3.3 记忆检索策略

```
用户/对方发来消息
       │
       ▼
  ┌──────────┐
  │ 意图分析  │ → 提取关键实体、话题、情感
  └────┬─────┘
       │
       ├──→ 语义检索 (FAISS top-k, k=20)
       ├──→ 实体检索 (SQLite精确匹配)
       ├──→ 时间检索 (最近相关记忆)
       └──→ 图遍历 (从命中节点扩展1-2跳)
       │
       ▼
  ┌──────────┐
  │ 相关性    │ → 综合排序，取 top-5
  │ 重排序    │ → 加入核心记忆 (始终包含)
  └────┬─────┘
       │
       ▼
  组装上下文 → 送入推理引擎
```

### 3.4 记忆遗忘与巩固

模拟人类记忆的艾宾浩斯遗忘曲线：

```
有效重要性 = 原始重要性 * e^(-衰减速率 * 天数) + 巩固加成

巩固条件：
- 被用户主动提及 → 重置衰减计时器
- 被检索命中且使用 → 衰减速率降低10%
- 用户标记为"重要" → 移入核心记忆（不遗忘）
- 低于阈值(0.1) → 归档（不删除，但不参与常规检索）
```

## 4. 社交通信协议 (Avatar Communication Protocol, ACP)

### 4.1 协议概述

ACP是分身间通信的标准协议，基于端到端加密的异步消息传递。

```
协议栈：
┌─────────────────────────────┐
│  应用层: 对话内容 + 元数据    │  JSON
├─────────────────────────────┤
│  社交层: 权限、话题、信心度   │  ACP Header
├─────────────────────────────┤
│  加密层: E2EE (X25519 + XSalsa20) │  libsodium
├─────────────────────────────┤
│  传输层: WebSocket / HTTP/2  │  TLS 1.3
└─────────────────────────────┘
```

### 4.2 消息格式

```typescript
interface ACPMessage {
  header: {
    messageId: string;           // UUID
    fromAvatarId: string;        // 发送方分身ID
    toAvatarId: string;          // 接收方分身ID
    timestamp: number;           // Unix timestamp
    messageType: 'handshake' | 'chat' | 'system' | 'summary';
    conversationId: string;      // 会话ID
    replyTo?: string;            // 回复的消息ID
  };
  social: {
    confidenceScore: number;     // 0-100, 发送方分身的信心度
    topicTags: string[];         // 当前话题标签
    privacyLevel: 'public' | 'friends' | 'private';
    emotionalTone: string;       // 情感基调
    requiresOwnerConfirmation: boolean;  // 是否需要本人确认
  };
  payload: {
    text: string;                // 消息内容
    attachments?: Attachment[];  // 附件（图片、语音等）
    metadata?: Record<string, any>;
  };
  signature: string;             // 消息签名（防篡改）
}
```

### 4.3 握手流程 (Handshake)

```
分身A                       中继服务器                    分身B
  │                            │                           │
  │── HandshakeRequest ──────>│                           │
  │   {fromId, toId,          │── 转发 ────────────────>  │
  │    publicKey,              │                           │
  │    socialCard,             │                           │
  │    proposedTopics,         │                           │
  │    maxDuration}            │                           │
  │                            │                           │
  │                            │  <── HandshakeResponse ──│
  │  <── 转发 ────────────────│      {accept/reject,      │
  │                            │       publicKey,          │
  │                            │       socialCard,         │
  │                            │       agreedTopics,       │
  │                            │       agreedDuration}     │
  │                            │                           │
  │── SessionEstablished ────>│                           │
  │   {sharedSecret derived}   │── 转发 ────────────────> │
  │                            │                           │
  │  ═══ E2EE会话建立 ═══════│═══════════════════════════│
  │                            │                           │
  │── ChatMessage (加密) ────>│── 转发 ────────────────>  │
  │  <── ChatMessage (加密) ──│<── 转发 ──────────────── │
  │                            │                           │
  │── EndSession ────────────>│── 转发 ────────────────>  │
  │  <── SessionSummary ──────│<── 转发 ──────────────── │
```

### 4.4 中继服务器设计

中继服务器不解密任何消息内容，仅负责：
- 消息路由（基于分身ID查找对端）
- 消息暂存（离线消息队列，最多保存7天）
- 流量控制（防止分身间消息轰炸）
- 基础反垃圾（频率限制、大小限制）

```
技术选型：
- 框架: Fastify / Go (高并发)
- 消息队列: Redis Streams
- 存储: PostgreSQL (元数据) + S3 (加密消息暂存)
- 部署: Cloudflare Workers (边缘节点, 低延迟)
```

## 5. 本地 vs 云端推理策略

### 5.1 决策矩阵

```
                    ┌─────────────┬─────────────┐
                    │   本地推理    │   云端推理    │
┌───────────────────┼─────────────┼─────────────┤
│ 简单闲聊回复       │     本地     │             │
│ 日常问候/感谢      │     本地     │             │
│ 短消息代回复       │     本地     │             │
│ 情感分析/意图识别   │     本地     │             │
│ 记忆检索/匹配      │     本地     │             │
│                   │             │             │
│ 复杂多轮对话       │             │    云端      │
│ 深度性格分析       │             │    云端      │
│ 长文本生成         │             │    云端      │
│ 首次训练/大量数据   │             │    云端      │
│ 知识蒸馏/模型更新   │             │    云端      │
│                   │             │             │
│ 代回复(高信心度)   │     本地     │             │
│ 代回复(低信心度)   │             │    云端      │
│ 分身间对话         │     本地     │   回退云端   │
└───────────────────┴─────────────┴─────────────┘
```

### 5.2 本地推理性能预算

```
目标设备: iPhone 14+ / Android旗舰 (2023+)
可用NPU算力: 15-40 TOPS
可用内存: 4-6 GB (给AI的份额)
内存带宽: 50-70 GB/s

模型规格:
- 基座: Phi-3-mini 或 Gemma-2B (INT4量化)
- 模型大小: 1.5-2.5 GB
- LoRA适配器: 50-150 MB
- FAISS索引: 50-200 MB (取决于记忆量)

性能目标:
- 首token延迟: < 500ms
- 生成速度: > 15 tokens/s
- 单次推理功耗: < 200mW
- 30分钟连续使用电量消耗: < 3%

降级策略:
- 设备性能不足 → 自动切换云端
- 电量 < 20% → 减少本地推理频率
- 温度过高 → 暂停本地推理，提示用户稍后
```

### 5.3 云端调用优化

```
最小化云端数据传输原则：

发送给云端的内容:
  ✓ 当前对话上下文 (最近5-10轮)
  ✓ 人格摘要 (BigFive + 风格参数, ~500 tokens)
  ✓ 检索到的相关记忆摘要 (~1000 tokens)
  ✓ 任务描述 (生成回复 / 分析性格 / 等)

绝不发送给云端:
  ✗ 完整聊天历史
  ✗ 原始导入数据
  ✗ 语音原始录音
  ✗ 用户照片/视频
  ✗ 完整记忆图谱

云端调用成本预估 (Claude API):
  - 普通对话: ~2000 tokens/次, 约 $0.006/次
  - 深度分析: ~5000 tokens/次, 约 $0.015/次
  - 用户均日调用: 5-10次 → $0.03-0.15/天
  - 月均成本: $1-4.5/用户 (有利润空间)
```

## 6. 数据同步与备份

### 6.1 同步策略

```
本地 SQLite ←→ Supabase (可选云同步)

同步内容:
  ✓ 人格参数 (加密后同步)
  ✓ 记忆图谱 (加密后同步)
  ✓ 社交关系设置 (加密后同步)
  ✓ LoRA适配器权重 (加密后同步)
  ✗ 原始训练数据 (永不上传)

同步方式:
  - 增量同步 (仅变更部分)
  - 冲突解决: 设备端优先 (last-write-wins)
  - 频率: Wi-Fi环境下每小时同步一次
```

### 6.2 多设备支持

```
主设备 ──── 完整数据 + 推理能力
             │ 加密同步
辅设备 ──── 完整数据 + 推理能力 (延迟同步)
             │ 轻量同步
Web端 ───── 查看摘要 + 云端推理 (无本地模型)
```

## 7. 安全架构

### 7.1 密钥管理

```
用户注册时:
  1. 生成 X25519 密钥对 (分身身份密钥)
  2. 生成 Ed25519 签名密钥对 (消息签名)
  3. 密钥存储在设备安全区 (iOS Keychain / Android Keystore)
  4. 派生加密密钥用于本地数据加密 (XSalsa20-Poly1305)

分身间通信:
  1. 双方交换公钥 (通过中继服务器)
  2. X25519 Diffie-Hellman 协商会话密钥
  3. 会话密钥用于加密后续所有消息
  4. 每个会话使用独立密钥 (前向安全)
```

### 7.2 威胁模型

| 威胁 | 风险等级 | 缓解措施 |
|------|---------|---------|
| 中继服务器被入侵 | 中 | E2EE确保服务器无法读取消息 |
| 设备丢失/被盗 | 高 | 设备加密 + 生物识别锁 + 远程擦除 |
| 身份冒充 | 高 | 公钥指纹验证 + 实名认证选项 |
| 模型逆向工程 | 中 | LoRA适配器加密存储，推理时解密 |
| 记忆数据泄露 | 高 | 本地AES-256加密，密钥在安全区 |
| 恶意分身骚扰 | 中 | 频率限制 + 举报机制 + 黑名单 |

## 8. 系统可扩展性

### 8.1 插件架构（v2.0+）

```
核心引擎 (不可替换)
  ├── 人格模型管线
  ├── 记忆图谱
  └── 社交通信协议

可插拔模块:
  ├── 推理后端 (ONNX / CoreML / TFLite / 云端)
  ├── 语音引擎 (XTTS / ElevenLabs / 系统TTS)
  ├── 数据导入器 (微信 / WhatsApp / Telegram / ...)
  ├── 社交平台连接器 (未来: 接入微信/iMessage)
  └── 可视化组件 (2D图谱 / 3D图谱 / AR)
```

### 8.2 API设计（面向第三方开发者）

```
未来开放API (v2.0+):
  POST /api/avatar/{id}/chat          # 与分身对话
  GET  /api/avatar/{id}/personality   # 获取人格摘要
  POST /api/avatar/{id}/memory       # 添加记忆
  GET  /api/avatar/{id}/social       # 社交关系列表
  POST /api/avatar/{id}/message      # 代发消息

  所有API需要用户授权 (OAuth 2.0)
  速率限制: 100次/分钟
  数据最小化: 不暴露原始训练数据
```
