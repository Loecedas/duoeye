import type { APIRoute } from 'astro';
import { transformDuolingoData } from '../../services/duolingoService';

const CACHE = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;
const DUOLINGO_BASE_URL = 'https://www.duolingo.com';
const DUOLINGO_JWT = import.meta.env.DUOLINGO_TOKEN;

async function fetchWithTimeout(url: string, headers: HeadersInit, timeoutMs = 8000): Promise<{ data: any; status: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { data: null, status: res.status };
    return { data: await res.json(), status: res.status };
  } catch {
    clearTimeout(timeoutId);
    return { data: null, status: 0 };
  }
}

function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_\-.]{1,64}$/.test(username);
}

function jsonResponse(data: any, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
}

function pruneCache(now: number): void {
  for (const [key, entry] of CACHE.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      CACHE.delete(key);
    }
  }

  while (CACHE.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = CACHE.keys().next().value as string | undefined;
    if (!oldestKey) break;
    CACHE.delete(oldestKey);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return jsonResponse({ error: 'Username is required' }, 400);
    }

    if (!isValidUsername(username)) {
      return jsonResponse({ error: '用户名格式无效' }, 400);
    }

    const cacheKey = username.toLowerCase();
    const now = Date.now();
    pruneCache(now);
    const cached = CACHE.get(cacheKey);
    
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return jsonResponse({ data: cached.data }, 200);
    }

    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.duolingo.com/',
      'Origin': 'https://www.duolingo.com',
      'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    };

    const [v2Result, v1Result, api1Result] = await Promise.all([
      fetchWithTimeout(
        `${DUOLINGO_BASE_URL}/2017-06-30/users?username=${encodeURIComponent(username)}`,
        headers, 10000
      ),
      fetchWithTimeout(
        `${DUOLINGO_BASE_URL}/users/${encodeURIComponent(username)}`,
        headers, 8000
      ),
      fetchWithTimeout(
        `${DUOLINGO_BASE_URL}/api/1/users/show?username=${encodeURIComponent(username)}`,
        headers, 8000
      ),
    ]);

    if (v2Result.status === 401 || v2Result.status === 403) {
      return jsonResponse({ error: '该账号设置为私密，无法访问' }, 403);
    }

    const v2Raw = v2Result.data as { users?: any[] } | any;
    const v2Data = v2Raw?.users?.[0] || v2Raw;
    const v1Data = v1Result.data as any;
    const api1Data = api1Result.data as any;

    if (!v2Data && !v1Data && !api1Data) {
      return jsonResponse({ error: '找不到该用户，请检查用户名是否正确' }, 404);
    }

    const userData: any = {
      ...(v1Data || {}),
      ...(api1Data || {}),
      ...(v2Data || {}),
      tracking_properties: {
        ...(v1Data?.tracking_properties || v1Data?.trackingProperties || {}),
        ...(api1Data?.tracking_properties || api1Data?.trackingProperties || {}),
        ...(v2Data?.tracking_properties || v2Data?.trackingProperties || {})
      }
    };

    const userId = userData.id || userData.user_id || userData.tracking_properties?.user_id;

    if (userId && DUOLINGO_JWT) {
      const authHeaders: HeadersInit = { ...headers, 'Authorization': `Bearer ${DUOLINGO_JWT}` };
      const [xpResult, lbResult] = await Promise.all([
        fetchWithTimeout(
          `${DUOLINGO_BASE_URL}/2017-06-30/users/${userId}/xp_summaries?startDate=1970-01-01`,
          authHeaders, 12000
        ),
        fetchWithTimeout(
          `${DUOLINGO_BASE_URL}/2017-06-30/users/${userId}/leaderboards?active=true`,
          authHeaders, 10000
        ),
      ]);
      if (xpResult.data?.summaries) userData._xpSummaries = xpResult.data.summaries;
      if (lbResult.data) userData._leaderboardHistory = lbResult.data;
    }

    if (!userData || typeof userData !== 'object') {
      return jsonResponse({ error: '数据格式异常' }, 502);
    }

    const transformed = transformDuolingoData(userData);

    pruneCache(now);
    CACHE.set(cacheKey, { data: transformed, timestamp: now });

    return jsonResponse({ data: transformed }, 200);
  } catch (err: any) {
    return jsonResponse({ error: '获取数据时出错：' + (err?.message || '未知错误') }, 500);
  }
};
