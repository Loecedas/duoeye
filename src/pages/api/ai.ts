import type { APIRoute } from 'astro';
import type { AiProvider, UserData } from '../../types';
import { getEnv } from '../../utils/env';

export const prerender = false;

interface AiRuntimeConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const API_KEY_ENV_MAP: Record<AiProvider, string[]> = {
  bigmodel: ['BIGMODEL_API_KEY', 'ZHIPU_API_KEY', 'GLM_API_KEY', 'ZAI_API_KEY'],
  gemini: ['GEMINI_API_KEY', 'GOOGLE_API_KEY'],
  openrouter: ['OPENROUTER_API_KEY'],
  deepseek: ['DEEPSEEK_API_KEY'],
  siliconflow: ['SILICONFLOW_API_KEY'],
  moonshot: ['MOONSHOT_API_KEY', 'KIMI_API_KEY'],
  zenmux: ['ZENMUX_API_KEY'],
  custom: ['CUSTOM_API_KEY', 'AI_API_KEY'],
};

const DEFAULT_ENDPOINTS: Record<AiProvider, string> = {
  bigmodel: 'https://open.bigmodel.cn/api/paas/v4',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai',
  openrouter: 'https://openrouter.ai/api/v1',
  deepseek: 'https://api.deepseek.com',
  siliconflow: 'https://api.siliconflow.cn/v1',
  moonshot: 'https://api.moonshot.cn/v1',
  zenmux: 'https://api.zenmux.com/v1',
  custom: 'https://open.bigmodel.cn/api/paas/v4',
};

const DEFAULT_MODELS: Record<AiProvider, string> = {
  bigmodel: 'glm-4-flashx',
  gemini: 'gemini-1.5-flash',
  openrouter: 'google/gemini-2.0-flash-exp:free',
  deepseek: 'deepseek-chat',
  siliconflow: 'deepseek-ai/DeepSeek-V3',
  moonshot: 'moonshot-v1-8k',
  zenmux: 'gemini-2.5-flash',
  custom: 'glm-4-flashx',
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function isAiProvider(value: string): value is AiProvider {
  return value in API_KEY_ENV_MAP;
}

function findKeyForProvider(provider: AiProvider, locals?: any): string {
  const candidateKeys = API_KEY_ENV_MAP[provider] || [];
  for (const envName of candidateKeys) {
    const key = getEnv(envName, locals);
    if (key) return key;
  }
  return '';
}

function findAnyProviderAndKey(locals?: any): { provider: AiProvider; apiKey: string } | null {
  for (const [provider, candidateKeys] of Object.entries(API_KEY_ENV_MAP)) {
    for (const envName of candidateKeys) {
      const key = getEnv(envName, locals);
      if (key) {
        return { provider: provider as AiProvider, apiKey: key };
      }
    }
  }
  const generic = getEnv('AI_API_KEY', locals) || getEnv('ZAI_API_KEY', locals);
  if (generic) {
    return { provider: 'custom', apiKey: generic };
  }
  return null;
}

function resolveProvider(locals?: any): AiProvider {
  const configured = getEnv('AI_PROVIDER', locals).toLowerCase().trim();

  // 若用户配置了 provider
  if (configured && isAiProvider(configured)) {
    // 检查此 provider 是否配置了 Key
    const key = findKeyForProvider(configured, locals);
    if (key) return configured;

    // 若配置了 custom 或未找到当前 provider 的 Key，但设置了其他 Provider 的 Key，自动适配实际 Key
    const detected = findAnyProviderAndKey(locals);
    if (detected && detected.provider !== 'custom') {
      return detected.provider;
    }
    return configured;
  }

  // 未指定 provider 时，根据填写的 Key 智能识别
  const detected = findAnyProviderAndKey(locals);
  if (detected) return detected.provider;

  return 'bigmodel';
}

function getAiConfig(locals?: any): AiRuntimeConfig {
  const provider = resolveProvider(locals);
  let apiKey = findKeyForProvider(provider, locals);

  if (!apiKey) {
    const anyConfig = findAnyProviderAndKey(locals);
    if (anyConfig) {
      apiKey = anyConfig.apiKey;
    }
  }

  const model = getEnv('AI_MODEL', locals) || DEFAULT_MODELS[provider] || 'glm-4-flashx';
  let baseUrl = getEnv('AI_BASE_URL', locals) || DEFAULT_ENDPOINTS[provider];

  if (!baseUrl && provider === 'custom') {
    baseUrl = DEFAULT_ENDPOINTS.bigmodel;
  }

  return {
    provider,
    apiKey,
    model,
    baseUrl,
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
      return '当前 AI Key 鉴权失败，请检查 Cloudflare 中配置的 BIGMODEL_API_KEY 或 CUSTOM_API_KEY';
    }
    return `当前 ${provider} AI Key 鉴权失败，请检查 Cloudflare 中的密钥配置`;
  }

  if (status === 403) {
    return '当前模型或接口没有访问权限';
  }

  if (status === 429) {
    return 'AI 服务请求过于频繁或额度已用尽，请稍后再试';
  }

  return undefined;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const config = getAiConfig(locals);

  if (!config.apiKey) {
    return jsonResponse(
      {
        error: `未在 Cloudflare 环境变量中检测到有效的 API Key。请在 Cloudflare 后台配置 ${
          API_KEY_ENV_MAP[config.provider]?.[0] || 'BIGMODEL_API_KEY'
        } 或 AI_API_KEY。`,
      },
      500,
    );
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
      Authorization: `Bearer ${config.apiKey.trim()}`,
      'Content-Type': 'application/json',
    };

    if (config.provider === 'openrouter') {
      headers['HTTP-Referer'] = request.headers.get('origin') || '';
      headers['X-Title'] = 'DuoEye';
    }

    const cleanBaseUrl = config.baseUrl.trim().replace(/\/$/, '').replace(/\/chat\/completions$/, '');
    const endpoint = `${cleanBaseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let response: Response;
    try {
      response = await fetch(endpoint, {
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
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return jsonResponse({ error: 'AI 服务响应超时，请稍后再试' }, 504);
      }
      throw fetchErr;
    }
    clearTimeout(timeoutId);

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
