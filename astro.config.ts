// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.SITE ?? "https://informatics-web.iflabdev.workers.dev";
const base = process.env.BASE || "/";

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: "server",
  adapter: cloudflare({
    imageService: 'cloudflare-binding',
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@base-ui/react", "@base-ui/react/select"],
    },
  },
  prefetch: true,
});

