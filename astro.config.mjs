import { defineConfig, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import netlify from '@astrojs/netlify';

const adapter = process.env.NETLIFY ? netlify() : vercel();

export default defineConfig({
  output: 'server',
  adapter: adapter,
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    react(),
    tailwind()
  ],
});
