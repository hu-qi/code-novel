# Code Novel - 代码即小说

> Transform stories into code, or code into stories

## 简介

Code Novel 是一个将故事描述转换为代码（或将代码转换为故事描述）的工具。它基于 TechQuery 代码风格设计，追求代码的可读性和故事性。

## 核心功能

- 📖 **故事转代码**：将自然语言故事描述转换为可运行的 JavaScript/TypeScript 代码
- 💻 **代码转故事**：将代码转换为生动的故事描述
- 🎭 **人物映射**：人物 → 类，技能 → 方法，场景 → 模块
- 🔄 **双向转换**：故事与代码之间的无缝转换

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 |
| 编辑器 | Monaco Editor |
| 构建工具 | Vite 5 |
| 样式 | Tailwind CSS |
| LLM | DeepSeek V3.2 |

## 目录结构

```
code-novel/
├── source/
│   ├── index.js              # 模块入口
│   ├── story/                # 故事解析
│   │   ├── parser/           # 故事解析器
│   │   ├── character/        # 人物映射
│   │   └── plot/             # 情节解析
│   ├── code/                 # 代码生成
│   │   └── generator/        # 代码生成器
│   ├── engine/               # 核心引擎
│   │   ├── bridge/           # 故事-代码桥接
│   │   └── llm-client.js     # LLM 客户端
│   └── ui/                   # UI 组件
├── test/                     # 测试
├── dist/                     # 构建产物
├── build/                    # 构建配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 代码风格

本项目遵循 [TechQuery](https://github.com/TechQuery) 代码风格：

- 类名：`PascalCase`
- 方法名：`camelCase`
- 私有成员：`__前缀__`
- 常量：`Symbol`
- 详细 JSDoc 注释
- 观察者模式

## 故事-代码映射规则

| 故事元素 | 代码元素 |
|----------|----------|
| 人物 | 类 (class) |
| 技能 | 方法 (method) |
| 特征 | 属性 (property) |
| 场景 | 函数/模块 |
| 情节 | 执行流程 |
| 对话 | API 调用 |

## License

MIT