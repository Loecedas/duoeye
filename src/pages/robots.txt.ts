import type { APIRoute } from 'astro';
import { getEnv } from '../utils/env';

export const GET: APIRoute = async ({ url, request, locals }) => {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const siteUrl = getEnv('SITE_URL', locals) || `${protocol}://${host}`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    },
  });
};
