// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

import { remarkYoutube } from "./src/plugins/remark-youtube.js";

import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import node from '@astrojs/node';

const adapter = process.env.VERCEL ? vercel() : node({mode: 'standalone'});

// https://astro.build/config
export default defineConfig({
  site: "https://tinkerdrop.com",
  output: 'server',
  adapter,
  integrations: [react(), keystatic()],
  image: {
    // Enable image optimization
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  markdown: {
    remarkPlugins: [remarkYoutube],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
