# DuoEye

一个基于 Astro + React 的多邻国数据仪表盘，提供首页展示、仪表盘分析、AI 点评和截图导出。

## 功能

- 查询多邻国用户公开学习数据
- 展示连续学习、XP、课程、语言分布、热力图、年度与周月趋势
- 支持 AI 点评，可切换多个兼容 OpenAI Chat Completions 的提供方
- 支持浅色 / 深色主题
- 支持仪表盘截图导出
- 适配桌面端和小屏设备

## 技术栈

- Astro 5
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- html2canvas
- snapdom

## 本地运行

```bash
npm install
```

复制环境变量模板并填写：

```bash
cp .env.example .env
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 环境变量

### 必填

```env
DUOLINGO_TOKEN=
```

用于补充多邻国用户的 XP 汇总和排行榜等数据。

### AI 点评

默认使用智谱：

```env
AI_PROVIDER=bigmodel
AI_MODEL=glm-4.5-flash
BIGMODEL_API_KEY=
```

也支持以下提供方：

- `gemini`
- `openrouter`
- `deepseek`
- `siliconflow`
- `moonshot`
- `zenmux`
- `custom`

对应可用环境变量见 [.env.example](/E:/duoeye/.env.example)。

当 `AI_PROVIDER=custom` 时，需要额外配置：

```env
CUSTOM_API_KEY=
AI_BASE_URL=
```

### 可选

```env
API_SECRET_TOKEN=
```

用于保护部分 API 路由访问。

## 页面与接口

页面：

- `/` 首页
- `/dashboard` 仪表盘

接口：

- `POST /api/data`
  - 请求体：`{ "username": "duolingo_username" }`
  - 用于获取并转换多邻国用户数据
- `POST /api/ai`
  - 请求体：`{ "userData": {...} }`
  - 用于生成 AI 点评

## 项目结构

```text
src/
  components/         UI 组件
  layouts/            页面布局
  pages/              页面与 API 路由
  services/           数据转换与服务逻辑
  styles/             颜色与样式常量
  utils/              工具函数
```

## 注意事项

- 仅支持查询存在且可访问的多邻国用户
- 部分高级数据依赖 `DUOLINGO_TOKEN`
- AI 点评依赖正确的模型、Base URL 和 API Key 配置
- 构建产物、依赖和本地密钥已通过 `.gitignore` 忽略
