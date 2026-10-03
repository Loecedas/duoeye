# DuoEye

[English](./README.en.md) | 简体中文

一个基于 Astro + React 的多邻国数据分析仪表盘，提供数据分析图表、徽章成就和 AI 学习点评。

## 功能特性

- **今日概览**：展示今日学完课数、今日 XP、今日学习时长和当前连胜天数。
- **趋势分析**：最近 7 天的 XP 和学习时长波动面积图，支持切换本周趋势视图。
- **年度热力图**：全年学习热力图，支持年份自由切换，网络视图宽窄自适应。
- **总经验同步**：完美同步多邻国官方最真实的历史累计经验（支持显示已删除/重置课程的历史沉淀经验）。
- **总学习时间**：优先采用详细课程时长进行累加，并支持基于每日流水日志（`_xpSummaries`）的高精度双层防错兜底。
- **成就徽章**：内置多维度成就挑战，实时计算点亮连胜、总经验、单日突破等徽章。
- **语言分布**：以占比环形图和课程列表形式，直观分析你在各个语种及兴趣科目上的精力投入。
- **AI 学习点评**：基于你最近的学习表现，调用 AI 导师生成精辟的学习诊断与鼓励。
- **多端自适应**：适配桌面端与移动端，支持一键切换深色模式/浅色模式。

## 项目结构

```text
duoeye/
├── src/
│   ├── components/
│   │   ├── DuoDashApp.tsx              # 仪表盘根组件
│   │   ├── LandingHero.tsx             # 首页引导组件
│   │   ├── achievements/               # 成就徽章模块
│   │   ├── charts/                     # 折线、面积、热力图表模块
│   │   ├── dashboard/                  # 仪表盘核心视图（Navbar、TodayOverview 等）
│   │   ├── home/                       # 首页辅助视图
│   │   ├── icons/                      # 通用 SVG 与表情图标
│   │   └── shared/                     # 通用组件
│   ├── layouts/
│   │   └── Layout.astro                # 页面模板（处理时区与深色主题）
│   ├── pages/
│   │   ├── api/
│   │   │   ├── ai.ts                   # AI 点评接口
│   │   │   └── data.ts                 # 数据聚合接口
│   │   ├── dashboard.astro             # 仪表盘页面
│   │   └── index.astro                 # 首页
│   ├── services/
│   │   ├── duolingoDataLoader.ts       # 负责 API 远程请求与服务端缓存
│   │   └── duolingoService.ts          # 负责数据清洗、对账与结构转换
│   ├── styles/
│   │   └── duolingoColors.ts           # 多邻国官方配色配置
│   ├── types.ts                        # 全局 TypeScript 类型定义
│   └── utils/
│       ├── courseMetrics.ts
│       ├── languageCourses.ts
│       ├── theme.ts
│       └── timezone.ts                 # 时区感知日期与时间处理器
├── astro.config.mjs
└── package.json
```

## 环境要求

- Node.js 18+
- npm 或 yarn

## 快速开始

### 1. 安装依赖

```bash
git clone <your-repository-url> duoeye
cd duoeye
npm install
```

### 2. 配置环境变量

复制 `.env.example` 并重命名为 `.env`：

```bash
cp .env.example .env
```

打开 `.env` 填写配置：

```env
# 必填：用于获取历史明细和非语言课程的 JWT Token
DUOLINGO_TOKEN=your_token_here

# AI 点评配置（可选）
AI_PROVIDER=bigmodel
AI_MODEL=glm-4.5-flash
BIGMODEL_API_KEY=your_api_key
```

### 3. 本地运行

```bash
npm run dev      # 启动开发环境 (默认 http://localhost:4321)
npm run build    # 构建生产版本
npm run preview  # 本地预览构建产物
```

## 环境变量说明

| 变量名 | 必填 | 说明 |
| :--- | :--: | :--- |
| `DUOLINGO_TOKEN` | ✅ | 多邻国账户的 JWT Token，用于获取历史明细和非语言课程数据 |
| `AI_PROVIDER` | 可选 | AI 提供商（`bigmodel`, `gemini`, `openrouter`, `deepseek`, `siliconflow`, `moonshot`, `zenmux`, `custom`） |
| `AI_MODEL` | 可选 | 调用的 AI 模型名称 |
| `BIGMODEL_API_KEY` | 可选 | 智谱 AI 密钥 |
| `GEMINI_API_KEY` | 可选 | Gemini 密钥 |
| `DEEPSEEK_API_KEY` | 可选 | DeepSeek 密钥 |
| `OPENROUTER_API_KEY` | 可选 | OpenRouter 密钥 |
| `SILICONFLOW_API_KEY` | 可选 | 硅基流动密钥 |
| `MOONSHOT_API_KEY` | 可选 | 月之暗面密钥 |
| `ZENMUX_API_KEY` | 可选 | Zenmux 密钥 |
| `CUSTOM_API_KEY` | 可选 | 自定义中转密钥（`AI_PROVIDER=custom` 时必填） |
| `AI_BASE_URL` | 可选 | 自定义中转接口 URL（`AI_PROVIDER=custom` 时必填） |
| `API_SECRET_TOKEN` | 可选 | API 路由访问防护 Token，设置后接口需鉴权 |

## 获取多邻国 Token

1. 使用电脑浏览器登录 [多邻国官网](https://www.duolingo.com/)。
2. 按 `F12` 打开开发者工具，切换到 **控制台 (Console)**。
3. 输入并执行以下代码：
   ```js
   document.cookie.match(/jwt_token=([^;]+)/)[1]
   ```
4. 将复制出来的 Token 填入 `.env` 文件的 `DUOLINGO_TOKEN` 中。

## 数据来源与接口

DuoEye 通过多邻国官方非公开 API 获取数据：

| 数据接口 | 说明 |
| :--- | :--- |
| `GET /2017-06-30/users?username={username}` | 获取用户的基础 ID（仅取 id 字段） |
| `GET /2023-05-23/users/{userId}` | 获取完整用户数据（含数学/音乐/象棋等非语言课程） |
| `GET /2017-06-30/users/{userId}/xp_summaries?startDate=1970-01-01` | 获取每日经验值与学习时间完整流水 |

*请求示例：*
```http
GET https://www.duolingo.com/2023-05-23/users/{userId}
```

### 核心字段计算逻辑

| 数据项 | 字段映射与计算逻辑 |
| :--- | :--- |
| **总经验** | 优先读取详细接口的 `totalXp`，并与当前活跃课程的总和取最大值，保留已删除/重置语言的历史痕迹。 |
| **总学习时间** | 优先累加所有课程的 `timeSpent` 时长。无数据时，累加历史每日流水的 `totalSessionTime`；若均无真实数据则直接显示为 0，不进行任何虚假估算。 |
| **注册天数** | 当前浏览器本地日期 - 账号创建日期（`creationDate`），支持跨时区自适应。 |
| **今日数据** | 自动提取每日流水的最后一日，支持按浏览器本地时区过滤今日 XP、做课数和学习时长。 |

## 缓存策略

- **服务端缓存**：后端内存缓存，TTL（生存时间）为 5 分钟，跨天或超时后自动失效，避免频繁发起请求导致多邻国 API 触发限流限制。
- **客户端缓存**：基于 `localStorage` 和 `sessionStorage` 浏览器缓存，命中时实现页面秒开，同时在后台静默发起刷新，并在检测到跨天后自动清空缓存。

## 常见问题

**JWT Token 过期**  
API 返回类似“JWT Token 已过期或无效”的错误提示时，重新在浏览器控制台执行命令获取新 Token 并更新 `.env` 文件。

**数据与 App 存在偏差**  
已删除/重置的语言课程数据在多邻国接口中不复存在，因此根据课程总计的时间会与实际包含已删除课程的总时间存在微小差别，这是正常数据对账结果。

## 部署指南

### 部署到 Cloudflare

本项目已深度适配 Cloudflare Workers（带 Static Assets），支持一键快速部署。

#### 方式一：Wrangler CLI 本地一键部署

1. 登录 Cloudflare：
   ```bash
   npx wrangler login
   ```
2. 构建并部署：
   ```bash
   npm run deploy:cf
   ```
3. 在 Cloudflare 控制台对应 Worker 的 **Settings -> Variables and Secrets** 中配置环境变量（如 `DUOLINGO_TOKEN`、`AI_PROVIDER`、API Keys 等）。

#### 方式二：Git 仓库自动集成部署

1. 在 Cloudflare Dashboard 中创建 Worker 或 Pages 项目并关联 Git 仓库。
2. 构建配置：
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build:cf`
   - **Compatibility flags**: 确保包含 `nodejs_compat`
3. 添加环境变量（参考 `.env.example`）。

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

> 本项目为非官方开源第三方工具，与 Duolingo Inc. 无关。使用本工具需遵守 [多邻国服务条款](https://www.duolingo.com/terms)。
