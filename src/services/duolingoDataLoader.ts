import type { UserData } from '../types';
import { transformDuolingoData } from './duolingoService';
import { DEFAULT_TIMEZONE, getDateKeyInTimeZone, sanitizeTimeZone } from '../utils/timezone';

const CACHE = new Map<string, { data: UserData; timestamp: number; dayKey: string }>();
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;
const DUOLINGO_BASE_URL = 'https://www.duolingo.com';
const DUOLINGO_JWT =
  (typeof process !== 'undefined'
    ? process.env.DUOLINGO_TOKEN || process.env.DUOLINGO_JWT
    : '') ||
  import.meta.env.DUOLINGO_TOKEN ||
  import.meta.env.DUOLINGO_JWT;

export class DuolingoDataError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'DuolingoDataError';
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  headers: HeadersInit,
  timeoutMs = 8000,
): Promise<{ data: any; status: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { data: null, status: response.status };
    }

    return { data: await response.json(), status: response.status };
  } catch {
    clearTimeout(timeoutId);
    return { data: null, status: 0 };
  }
}

function pruneCache(now: number): void {
  for (const [key, entry] of CACHE.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      CACHE.delete(key);
    }
  }

  while (CACHE.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = CACHE.keys().next().value as string | undefined;
    if (!oldestKey) return;
    CACHE.delete(oldestKey);
  }
}

function createHeaders(jwt?: string): HeadersInit {
  return {
    'User-Agent': 'Duolingo/7.41.4 (Android; 10; SM-G960F)',
    Accept: 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
}

export function normalizeUsername(rawUsername: unknown): string {
  if (typeof rawUsername === 'string' && rawUsername.trim()) {
    return rawUsername.trim();
  }
  const envUsername =
    (typeof process !== 'undefined'
      ? process.env.DUOLINGO_USERNAME
      : '') ||
    import.meta.env.DUOLINGO_USERNAME;
  if (typeof envUsername === 'string' && envUsername.trim()) {
    return envUsername.trim();
  }
  return '';
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_.-]{1,64}$/.test(username);
}

export async function getDuolingoUserData(
  rawUsername: unknown,
  options: { timeZone?: string } = {},
): Promise<UserData> {
  const username = normalizeUsername(rawUsername);
  const timeZone = sanitizeTimeZone(options.timeZone || DEFAULT_TIMEZONE);
  if (!username) {
    throw new DuolingoDataError('Username is required', 400);
  }

  if (!isValidUsername(username)) {
    throw new DuolingoDataError('用户名格式无效', 400);
  }

  const cacheKey = `${username.toLowerCase()}::${timeZone}`;
  const now = Date.now();
  const currentDayKey = getDateKeyInTimeZone(now, timeZone);
  pruneCache(now);

  const cached = CACHE.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL && cached.dayKey === currentDayKey) {
    CACHE.delete(cacheKey);
    CACHE.set(cacheKey, cached);
    return cached.data;
  }

  const jwt = DUOLINGO_JWT;
  const headers = createHeaders(jwt);

  // 1) 用旧接口查 userId（与 duodash 一致）
  const lookupResult = await fetchWithTimeout(
    `${DUOLINGO_BASE_URL}/2017-06-30/users?username=${encodeURIComponent(username)}`,
    headers,
    10000,
  );

  if (lookupResult.status === 401 || lookupResult.status === 403) {
    throw new DuolingoDataError('JWT Token 已过期或无效，请重新获取 Duolingo JWT Token', 401);
  }

  if (lookupResult.status === 429) {
    throw new DuolingoDataError('请求过于频繁，多邻国暂时限制了访问，请稍后再试', 429);
  }

  if (lookupResult.status >= 500) {
    throw new DuolingoDataError('多邻国服务器暂时不可用，请稍后再试', 502);
  }

  const lookupRaw = lookupResult.data as { users?: any[] } | any;
  const lookupUser = lookupRaw?.users?.[0] || lookupRaw;
  const userId = lookupUser?.id || lookupUser?.user_id;

  if (!userId) {
    throw new DuolingoDataError('找不到该用户，请检查用户名是否正确', 404);
  }

  // 2) 用新接口获取完整用户数据（含数学/音乐/象棋等非语言课程，与 duodash 一致）
  const mainResult = await fetchWithTimeout(
    `${DUOLINGO_BASE_URL}/2023-05-23/users/${userId}`,
    headers,
    10000,
  );

  if (mainResult.status === 401 || mainResult.status === 403) {
    if (!jwt && lookupUser) {
      // 未配置 JWT 时回退使用公开的 lookupUser
    } else {
      throw new DuolingoDataError('JWT Token 已过期或无效，请重新获取 Duolingo JWT Token', 401);
    }
  }

  const rawMain = (mainResult.data as any)?.users?.[0] || (mainResult.data as any)?.user || mainResult.data;
  let userData: any = rawMain || lookupUser;

  if (!userData) {
    throw new DuolingoDataError('获取用户数据失败', 500);
  }

  if (lookupUser && typeof lookupUser === 'object') {
    userData = {
      ...lookupUser,
      ...userData,
      trackingProperties: {
        ...(lookupUser.trackingProperties || lookupUser.tracking_properties || {}),
        ...(userData.trackingProperties || userData.tracking_properties || {}),
      },
    };
  }

  // 3) 获取 xp_summaries（获取完整历史数据，与 duodash 一致）
  const xpResult = await fetchWithTimeout(
    `${DUOLINGO_BASE_URL}/2017-06-30/users/${userId}/xp_summaries?startDate=1970-01-01`,
    headers,
    12000,
  );
  const xpData = xpResult.data as { summaries?: unknown[] } | null;
  if (xpData?.summaries) {
    userData._xpSummaries = xpData.summaries;
  }

  if (!userData || typeof userData !== 'object') {
    throw new DuolingoDataError('数据格式异常', 502);
  }

  const transformed = transformDuolingoData(userData, timeZone);
  pruneCache(now);
  CACHE.delete(cacheKey);
  CACHE.set(cacheKey, { data: transformed, timestamp: now, dayKey: currentDayKey });
  return transformed;
}
