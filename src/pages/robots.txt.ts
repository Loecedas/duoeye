import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, request }) => {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const siteUrl = import.meta.env.SITE_URL || `${protocol}://${host}`;
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
