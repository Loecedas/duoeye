import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, request }) => {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const siteUrl = import.meta.env.SITE_URL || `${protocol}://${host}`;
  
  // Define core pages for DuoEye
  // Since dashboard requires a username parameter (e.g. /dashboard?username=xxx),
  // we index the homepage and the main dashboard template.
  const pages = [
    { path: '', changefreq: 'daily', priority: '1.0' }
  ];

  const xmlUrls = pages.map(page => {
    const loc = `${siteUrl}/${page.path}`.replace(/\/$/, '');
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    },
  });
};
