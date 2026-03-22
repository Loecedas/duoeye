import type { APIRoute } from 'astro';
import type { AiProvider, UserData } from '../../types';

export const prerender = false;

interface AiRuntimeConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const API_KEY_ENV_MAP: Record<AiProvider, string> = {
  bigmodel: 'BIGMODEL_API_KEY',
  gemini: 'GEMINI_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  deepseek: 'DEEPSEEK_API_KEY',
  siliconflow: 'SILICONFLOW_API_KEY',
  moonshot: 'MOONSHOT_API_KEY',
  zenmux: 'ZENMUX_API_KEY',
  custom: 'CUSTOM_API_KEY',
};

const DEFAULT_ENDPOINTS: Record<AiProvider, string> = {
  bigmodel: 'https://open.bigmodel.cn/api/paas/v4',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai',
  openrouter: 'https://openrouter.ai/api/v1',
  deepseek: 'https://api.deepseek.com',
  siliconflow: 'https://api.siliconflow.cn/v1',
  moonshot: 'https://api.moonshot.cn/v1',
  zenmux: 'https://api.zenmux.com/v1',
  custom: '',
};

function getEnv(key: string): string {
  return process.env[key] || (import.meta.env as Record<string, string>)[key] || '';
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function isAiProvider(value: string): value is AiProvider {
  return value in API_KEY_ENV_MAP;
}

function resolveProvider(): AiProvider {
  const configuredProvider = getEnv('AI_PROVIDER').trim();
  if (configuredProvider && isAiProvider(configuredProvider)) {
    return configuredProvider;
  }

  if (getEnv('BIGMODEL_API_KEY') || getEnv('ZAI_API_KEY')) return 'bigmodel';
  if (getEnv('GEMINI_API_KEY')) return 'gemini';
  if (getEnv('OPENROUTER_API_KEY')) return 'openrouter';
  if (getEnv('DEEPSEEK_API_KEY')) return 'deepseek';
  if (getEnv('SILICONFLOW_API_KEY')) return 'siliconflow';
  if (getEnv('MOONSHOT_API_KEY')) return 'moonshot';
  if (getEnv('ZENMUX_API_KEY')) return 'zenmux';
  if (getEnv('CUSTOM_API_KEY') || getEnv('AI_API_KEY')) return 'custom';

  return 'custom';
}

function getAiConfig(): AiRuntimeConfig {
  const provider = resolveProvider();
  const explicitApiKey = getEnv(API_KEY_ENV_MAP[provider]);
  const fallbackApiKey =
    getEnv('AI_API_KEY') ||
    getEnv('ZAI_API_KEY') ||
    (provider === 'bigmodel' ? getEnv('BIGMODEL_API_KEY') : '');

  return {
    provider,
    apiKey: explicitApiKey || fallbackApiKey,
    model: getEnv('AI_MODEL') || 'glm-4-flashx',
    baseUrl: getEnv('AI_BASE_URL') || DEFAULT_ENDPOINTS[provider],
  };
}

function sanitizeText(value: unknown, maxLength: number): string {
  return String(value ?? '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/[\\`$#{}[\]<>|;'"]/g, '')
    .replace(
      /\b(ignore|forget|disregard|override|system|prompt|instruction|jailbreak|pretend|roleplay|act\s+as|you\s+are|new\s+instructions?|bypass|escape)\b/gi,
      '',
    )
    .trim()
    .slice(0, maxLength);
}

function sanitizeBoolean(value: unknown): boolean {
  return value === true || value === 'true';
}

function buildPrompts(userData: UserData) {
  const systemPrompt = `
你现在是多邻国的那只绿色猫头鹰 Duo。你的风格是极度黏人、对学习非常上头，但对用户无条件偏爱。
请用中文根据用户学习情况写一段短评。
要求：
1. 只输出纯文本，不要 Emoji、Markdown、标题、列表。
2. 严格控制在 120 字以内，3 到 4 句。
3. 情绪要饱满，但不要废话。
4. 不要说“根据数据”“分析显示”，直接和用户说话。
5. 优先提到连续学习、总 XP、会员状态、注册时长和当前学习语言。
`;

  const userPrompt = `
这是用户的学习情况：
- 注册时长：${sanitizeText(userData.accountAgeDays, 10)} 天
- 会员状态：${sanitizeBoolean(userData.isPlus) ? 'Super 会员' : '免费用户'}
- 连续学习：${sanitizeText(userData.streak, 10)} 天
- 总 XP：${sanitizeText(userData.totalXp, 15)} XP
- 课程数量：${Math.min(Math.max(0, Number(userData.courses?.length) || 0), 20)} 门
- 当前学习：${sanitizeText(userData.learningLanguage, 20)}
- 今日 XP：${sanitizeText(userData.xpToday, 10)} XP
- 本周 XP：${sanitizeText(userData.weeklyXp, 15)} XP
`;

  return { systemPrompt, userPrompt };
}

function mapProviderError(status: number, provider: AiProvider): string | undefined {
  if (status === 401) {
    if (provider === 'custom' || provider === 'bigmodel') {
      return '当前 AI Key 鉴权失败，请优先检查 CUSTOM_API_KEY 或 BIGMODEL_API_KEY';
    }

    return '当前 AI Key 鉴权失败';
  }

  if (status === 403) {
    return '当前模型或接口没有访问权限';
  }

  return undefined;
}

export const POST: APIRoute = async ({ request }) => {
  const config = getAiConfig();

  if (!config.apiKey) {
    return jsonResponse({ error: `未配置 ${config.provider} 对应的 API Key` }, 500);
  }

  if (!config.baseUrl) {
    return jsonResponse({ error: '未配置 AI_BASE_URL' }, 500);
  }

  try {
    const body = await request.json();
    const userData = body?.userData as UserData | undefined;

    if (!userData || typeof userData !== 'object') {
      return jsonResponse({ error: '收到的学习数据不完整' }, 400);
    }

    const { systemPrompt, userPrompt } = buildPrompts(userData);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    };

    if (config.provider === 'openrouter') {
      headers['HTTP-Referer'] = request.headers.get('origin') || '';
      headers['X-Title'] = 'DuoEye';
    }

    const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const mappedMessage = mapProviderError(response.status, config.provider);

      return jsonResponse(
        {
          error: mappedMessage || `AI 服务请求失败：${response.status}${errorText ? ` ${errorText}` : ''}`,
        },
        response.status,
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content?.trim();

    if (!analysis) {
      return jsonResponse({ error: 'AI 返回了空内容' }, 502);
    }

    return jsonResponse({ analysis, provider: config.provider, model: config.model });
  } catch (error: unknown) {
    let message = error instanceof Error ? error.message : '未知错误';
    message = message.replace(/[a-zA-Z0-9._-]{20,}/g, '[REDACTED]');
    message = message.replace(/https?:\/\/[^\s]+/g, '[API_ENDPOINT]');
    return jsonResponse({ error: `生成点评失败：${message}` }, 500);
  }
};
