# Digital Immortal - 开发规范

## 项目概述
AI个人分身平台，深度学习用户个性后创建数字克隆用于社交。

## 技术栈
- 前端：React + TypeScript + Vite
- 跨平台：React Native (移动) + Tauri (桌面)
- 本地AI：ONNX Runtime (设备端推理)
- 云端AI：Claude API
- 加密：libsodium
- 本地数据：IndexedDB + SQLite
- 部署：GitHub Pages (PWA) → Vercel (生产)

## 开发规范
- 使用 TypeScript strict mode
- 隐私优先：数据本地存储为默认行为
- 所有网络传输必须加密
- 组件使用函数式组件 + Hooks
- 状态管理：Zustand
- 样式：Tailwind CSS
- 测试：Vitest + React Testing Library
- 提交信息：Conventional Commits (中文描述)

## 目录结构
```
src/
  personality/   # 性格建模引擎
  memory/        # 记忆系统
  social/        # 社交层
  avatar/        # 分身管理
  crypto/        # 加密通信
  ui/            # 界面组件
  utils/         # 工具函数
docs/            # 文档
public/          # 静态资源
```
