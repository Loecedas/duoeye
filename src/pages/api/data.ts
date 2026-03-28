import type { APIRoute } from 'astro';
import {
  DuolingoDataError,
  getDuolingoUserData,
  normalizeUsername,
} from '../../services/duolingoDataLoader';

function jsonResponse(data: any, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

async function handleRequest(username: unknown) {
  try {
    const data = await getDuolingoUserData(username);
    return jsonResponse({ data }, 200);
  } catch (error: any) {
    if (error instanceof DuolingoDataError) {
      return jsonResponse({ error: error.message }, error.status);
    }

    return jsonResponse({ error: '获取数据时出错：' + (error?.message || '未知错误') }, 500);
  }
}

export const GET: APIRoute = async ({ url }) => {
  return handleRequest(normalizeUsername(url.searchParams.get('username')));
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  return handleRequest(normalizeUsername(body?.username));
};
