import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const siteUrl = import.meta.env.SITE_URL || url.origin;
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
