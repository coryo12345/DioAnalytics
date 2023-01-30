import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), vue({ appEntrypoint: '/src/_vue.ts' })],
  output: "server",
  adapter: node({ mode: "standalone" }),
  vite: {
    build: {
      target: 'esnext'
    },
    optimizeDeps: {
      esbuildOptions: { target: 'es2020' }
    }
  }
});