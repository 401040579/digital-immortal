# Digital Immortal - 开发路线图

## Phase 0：体验原型 (PWA on GitHub Pages) — 2周

### 目标
让人体验"和自己的数字分身对话"的感觉

### 交付物
- GitHub Pages PWA
- 快速性格问卷 → 生成初始分身
- 与分身对话（分身会模仿你的风格回应）
- 分身"相似度"仪表盘
- 品牌 Landing Page

### 技术栈
- Vite + React
- Service Worker + manifest.json
- Claude API (性格建模 + 对话生成)
- LocalStorage / IndexedDB (本地数据)

---

## Phase 1：深度建模 — 6周

### 里程碑
- [ ] Big Five 性格测评引擎
- [ ] 语言风格分析器
- [ ] 记忆存储系统 (IndexedDB)
- [ ] 对话训练迭代机制
- [ ] 分身准确度评估系统

---

## Phase 2：社交层 — 6周

### 里程碑
- [ ] 分身间通信协议
- [ ] 好友系统
- [ ] 消息代回复（确认模式）
- [ ] 分身自动社交（观察模式）
- [ ] 隐私控制面板

---

## Phase 3：永生服务 — 8周

### 里程碑
- [ ] 遗产模式配置
- [ ] 时间胶囊系统
- [ ] 记忆图谱可视化 (D3.js / Three.js)
- [ ] 语音克隆集成
- [ ] 设备端小模型推理

---

## 总时间线

```
Month 1     │ Phase 0: PWA体验原型
Month 2-3   │ Phase 1: 深度建模
Month 3-5   │ Phase 2: 社交层
Month 5-7   │ Phase 3: 永生服务
Month 7+    │ 持续迭代 & 生态建设
```
