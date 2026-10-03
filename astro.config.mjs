// Trigger dev server restart - total learning time updated
import { defineConfig, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import netlify from '@astrojs/netlify';
import cloudflare from '@astrojs/cloudflare';

function resolveAdapter() {
  if (process.env.NETLIFY) {
    return netlify();
  }
  if (process.env.VERCEL) {
    return vercel();
  }
  return cloudflare({
    platformProxy: {
      enabled: true,
    },
  });
}

export default defineConfig({
  output: 'server',
  adapter: resolveAdapter(),
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    react(),
    tailwind()
  ],
});
