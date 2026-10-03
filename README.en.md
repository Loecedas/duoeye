# DuoEye

English | [简体中文](./README.md)

A Duolingo data analysis dashboard built with Astro + React, offering learning charts, achievement badges, AI insights, and dark mode support.

## Features

- **Today Overview**: Display completed lessons, today's XP, learning duration, and current streak.
- **Trend Analysis**: Area charts showing XP and learning duration fluctuations over the last 7 days.
- **Yearly Heatmap**: Calendar heatmap for learning consistency, supporting custom year switching with screen responsive layouts.
- **Total XP Sync**: Synchronize the actual lifetime total XP matching the official profile (including historical XP from deleted/reset courses).
- **Total Learning Time**: Sum up detailed course duration with a robust double-layer fallback using daily summaries (`_xpSummaries`) as backup.
- **Achievements**: Real-time badge tracking covering streaks, lifetime XP, daily breakthroughs, etc.
- **Language Distribution**: Analyze effort distribution across languages and subjects via charts and lists.
- **AI Coach Insights**: Personal feedback and insights on recent study sessions powered by LLMs.
- **Responsive & Dark Mode**: Adapts seamlessly to desktops and mobile screens with dark/light themes.

## Project Structure

```text
duoeye/
├── src/
│   ├── components/
│   │   ├── DuoDashApp.tsx              # Dashboard root component
│   │   ├── LandingHero.tsx             # Homepage login/guide component
│   │   ├── achievements/               # Achievement badges module
│   │   ├── charts/                     # Line, area, and heatmap charts module
│   │   ├── dashboard/                  # Dashboard layout (Navbar, TodayOverview, etc.)
│   │   ├── home/                       # Homepage helper views
│   │   ├── icons/                      # Common SVG and emoji icons
│   │   └── shared/                     # Shareable UI components
│   ├── layouts/
│   │   └── Layout.astro                # Page layout template (handles timezone & theme)
│   ├── pages/
│   │   ├── api/
│   │   │   ├── ai.ts                   # AI review API endpoint
│   │   │   └── data.ts                 # Data aggregator API endpoint
│   │   ├── dashboard.astro             # Dashboard page wrapper
│   │   └── index.astro                 # Homepage wrapper
│   ├── services/
│   │   ├── duolingoDataLoader.ts       # Handles API requests and server caching
│   │   └── duolingoService.ts          # Handles data cleaning, reconciliation & transformation
│   ├── styles/
│   │   └── duolingoColors.ts           # Duolingo brand colors configuration
│   ├── types.ts                        # Global TypeScript types definitions
│   └── utils/
│       ├── courseMetrics.ts
│       ├── languageCourses.ts
│       ├── theme.ts
│       └── timezone.ts                 # Timezone-aware date and time utilities
├── astro.config.mjs
└── package.json
```

## Requirements

- Node.js 18+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
git clone <your-repository-url> duoeye
cd duoeye
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` and rename it to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# Required: JWT Token for fetching historical logs and non-language courses
DUOLINGO_TOKEN=your_token_here

# AI Coach Configuration (Optional)
AI_PROVIDER=bigmodel
AI_MODEL=glm-4.5-flash
BIGMODEL_API_KEY=your_api_key
```

### 3. Run Locally

```bash
npm run dev      # Start dev server (default http://localhost:4321)
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Environment Variables

| Variable | Required | Description |
| :--- | :--: | :--- |
| `DUOLINGO_TOKEN` | ✅ | Duolingo account JWT Token, required for historical logs and non-language courses |
| `AI_PROVIDER` | Optional | AI provider (`bigmodel`, `gemini`, `openrouter`, `deepseek`, `siliconflow`, `moonshot`, `zenmux`, `custom`) |
| `AI_MODEL` | Optional | Target AI model name |
| `BIGMODEL_API_KEY` | Optional | Zhipu AI API Key |
| `GEMINI_API_KEY` | Optional | Gemini API Key |
| `DEEPSEEK_API_KEY` | Optional | DeepSeek API Key |
| `OPENROUTER_API_KEY` | Optional | OpenRouter API Key |
| `SILICONFLOW_API_KEY` | Optional | SiliconFlow API Key |
| `MOONSHOT_API_KEY` | Optional | Moonshot API Key |
| `ZENMUX_API_KEY` | Optional | Zenmux API Key |
| `CUSTOM_API_KEY` | Optional | Custom endpoint key (required when `AI_PROVIDER=custom`) |
| `AI_BASE_URL` | Optional | Custom proxy API base URL (required when `AI_PROVIDER=custom`) |
| `API_SECRET_TOKEN` | Optional | Access token for API routing security |

## Getting Duolingo JWT Token

1. Open your browser and log in to [Duolingo Website](https://www.duolingo.com/).
2. Press `F12` to open Developer Tools, and switch to the **Console** tab.
3. Run the following code snippet:
   ```js
   document.cookie.match(/jwt_token=([^;]+)/)[1]
   ```
4. Copy the returned token string and paste it into `DUOLINGO_TOKEN` in your `.env` file.

## Data Sources & API Endpoints

DuoEye fetches user statistics via Duolingo's official internal APIs:

| Endpoint | Description |
| :--- | :--- |
| `GET /2017-06-30/users?username={username}` | Resolve basic user ID |
| `GET /2023-05-23/users/{userId}` | Fetch full user profile data (including Math, Music, Chess, etc.) |
| `GET /2017-06-30/users/{userId}/xp_summaries?startDate=1970-01-01` | Fetch full historical daily XP logs and learning session durations |

*Request Example:*
```http
GET https://www.duolingo.com/2023-05-23/users/{userId}
```

### Core Calculation Logic

| Metric | Mapping & Calculation Logic |
| :--- | :--- |
| **Total XP** | Prioritize `totalXp` from the detailed query, take the maximum against the active courses sum. This retains XP of deleted/reset courses. |
| **Total Learning Time** | Prioritize the sum of course `timeSpent`. If empty, sum up daily log `totalSessionTime`. Ultimately falls back to `totalXp / 3` estimation. |
| **Account Age** | Local browser date - `creationDate` (timezone-aware). |
| **Today's Stats** | Select the last day record from the daily logs, filtering by the client timezone. |

## Caching Strategy

- **Server-Side Cache**: In-memory cache with a TTL of 5 minutes. Automatically expires on day rollover to prevent hitting Duolingo API rate limits.
- **Client-Side Cache**: Local state stored in `localStorage` and `sessionStorage`. Enables instant page loads, revalidating silently in the background.

## FAQ

**Expired JWT Token**  
If the API returns a "JWT Token is expired or invalid" error, retrieve a new token via the console command and update your `.env` file.

**Data Discrepancy with Official App**  
Deleted or reset language courses are permanently deleted from course structures, causing slight variations between course sums and the actual account-level total XP. This is normal data behavior.

## License

This project is licensed under the [MIT License](LICENSE).

---

> This is an unofficial third-party open-source tool and is not affiliated with Duolingo Inc. Usage must comply with [Duolingo Terms of Service](https://www.duolingo.com/terms).
