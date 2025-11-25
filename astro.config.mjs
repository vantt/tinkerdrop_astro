// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import { remarkYoutube } from './src/plugins/remark-youtube.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://tinkerdrop.com',
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  markdown: {
    remarkPlugins: [remarkYoutube],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});