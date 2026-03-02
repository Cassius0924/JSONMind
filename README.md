<div align="center">

# 🧠 JSONMind

**将 JSON 数据实时可视化为思维导图**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ 简介

**JSONMind** 是一款基于浏览器的 JSON 可视化工具，能够将 JSON 数据实时渲染为交互式思维导图。左侧内置了 Monaco 代码编辑器，右侧是可交互的节点图，二者双向联动——编辑 JSON 文本时思维导图实时更新，悬停或选中思维导图节点时编辑器同步高亮对应代码片段。

> 无需安装，打开浏览器即可使用。

---

## 🖼️ 界面预览

```
┌─────────────────────┬────────────────────────────────────────┐
│                     │                                        │
│   JSON 编辑器        │           思维导图画布                  │
│  (Monaco Editor)    │         (ReactFlow + Dagre)            │
│                     │                                        │
│  实时语法校验        │  ┌──────┐   ┌────────┐  ┌──────────┐  │
│  格式化支持          │  │ Root │──▶│features│─▶│  item 0  │  │
│  代码高亮            │  └──────┘   └────────┘  └──────────┘  │
│                     │                                        │
└─────────────────────┴────────────────────────────────────────┘
```

---

## 🚀 功能特性

### 📊 实时可视化
- 输入/粘贴 JSON 后**即时渲染**为层级思维导图
- 支持任意深度嵌套的对象与数组
- 使用 **Dagre** 算法自动计算布局，整洁美观

### 🔗 双向绑定
- 编辑器与思维导图**实时联动**
- 鼠标悬停节点 → 编辑器自动**高亮**对应 JSON 片段并滚动到视图
- 点击节点 → 编辑器持续高亮该路径

### ✏️ 可视化编辑
- **右键菜单**：添加子节点、删除节点、设为 null、复制 JSON 路径
- **双击节点**：行内编辑节点值或重命名键名
- **`+` 按钮**：点击容器节点旁的快捷按钮添加子节点
- 支持添加 `string`、`number`、`boolean`、`object`、`array` 五种类型

### ↩️ 撤销 / 重做
- 完整的操作历史，支持最多 **50 步**撤销
- 基于 [zundo](https://github.com/charkour/zundo) 实现精细化状态管理

### 🖼️ 导出图片
- 一键将当前思维导图导出为 **PNG 图片**
- 自动截取画布全部内容，无需手动滚动

### 🔍 JSON 路径
- 底部状态栏实时显示当前选中节点的 **JSON Path**（如 `$.author.name`）
- 支持一键**复制**路径到剪贴板

### ⌨️ 丰富快捷键
- 全键盘操作支持，详见[快捷键](#️-快捷键)章节

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [React 18](https://react.dev/) | UI 框架 |
| [TypeScript 5](https://www.typescriptlang.org/) | 类型安全 |
| [Vite 5](https://vitejs.dev/) | 构建工具 |
| [Tailwind CSS 3](https://tailwindcss.com/) | 样式系统 |
| [ReactFlow](https://reactflow.dev/) | 思维导图渲染引擎 |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | 代码编辑器（VS Code 同款） |
| [Dagre](https://github.com/dagrejs/dagre) | 有向图自动布局算法 |
| [Zustand](https://zustand-demo.pmnd.rs/) + [zundo](https://github.com/charkour/zundo) | 状态管理 + 撤销历史 |
| [html-to-image](https://github.com/bubkoo/html-to-image) | 导出 PNG |
| [lucide-react](https://lucide.dev/) | 图标库 |

---

## 📦 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9（或使用 pnpm / yarn）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Cassius0924/JSONMind.git
cd JSONMind

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
npm run build
# 产物位于 dist/ 目录
npm run preview  # 预览构建结果
```

---

## 📖 使用说明

### 1. 输入 JSON

在左侧编辑器中直接输入或粘贴 JSON 数据，右侧思维导图即时更新。编辑器顶部会显示 ✅ **Valid** 或 ❌ **Invalid JSON** 状态，底部展示具体错误信息。

### 2. 浏览思维导图

- **滚轮**：平移画布
- **拖拽背景**：平移画布
- **Ctrl + 滚轮** 或画布控件：缩放

### 3. 编辑节点

| 操作 | 方式 |
|------|------|
| 修改节点值 | 双击叶子节点（split 节点），输入新值后回车确认 |
| 重命名键名 | 双击 Object 中的键名标签 |
| 添加子节点 | 右键容器节点 → 选择类型，或点击 `+` 按钮 |
| 删除节点 | 右键节点 → 删除，或选中后按 `Delete` / `Backspace` |
| 设为 null | 右键节点 → 设为 null |

### 4. 节点类型图例

| 图标样式 | 节点类型 |
|---------|---------|
| 灰色边框 | 🗂️ 对象 (Object) |
| 灰色边框 | 📋 数组 (Array) |
| 绿色边框 | 🔤 字符串 (String) |
| 蓝色边框 | 🔢 数字 (Number) |
| 黄色边框 | 🔘 布尔值 (Boolean) |

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 为当前选中的容器节点添加子节点 |
| `Delete` / `Backspace` | 删除当前选中的节点 |
| `Ctrl/Cmd` + `Z` | 撤销 |
| `Ctrl/Cmd` + `Shift` + `Z` | 重做 |
| `F11` / `F` | 切换全屏模式 |
| `Ctrl/Cmd` + `Shift` + `F` | 格式化 JSON（需聚焦编辑器） |

> **注意**：除编辑器内的格式化快捷键外，其余快捷键在文本输入框聚焦时不生效。

---

## 📁 项目结构

```
JSONMind/
├── src/
│   ├── components/
│   │   ├── nodes/
│   │   │   ├── ContainerNode.tsx   # Object/Array 节点
│   │   │   └── SplitNode.tsx       # 叶子节点（string/number/boolean/null）
│   │   ├── AddNodeModal.tsx        # 添加节点弹窗
│   │   ├── ContextMenu.tsx         # 右键菜单
│   │   ├── HelpModal.tsx           # 帮助说明弹窗
│   │   ├── JsonEditor.tsx          # Monaco 代码编辑器
│   │   └── MindMap.tsx             # 思维导图主画布
│   ├── config/
│   │   └── constants.ts            # 全局常量
│   ├── store/
│   │   └── useJsonStore.ts         # Zustand 状态管理
│   ├── utils/
│   │   ├── graphUtils.ts           # JSON → 图节点转换 & Dagre 布局
│   │   └── jsonParser.ts           # JSON 路径解析（用于编辑器高亮）
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 发起 Pull Request

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

<div align="center">

Made with ❤️ by [Cassius0924](https://github.com/Cassius0924)

</div>
