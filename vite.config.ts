import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";
import { defineConfig } from "vitest/config";

const pkg = JSON.parse(
  readFileSync(new URL("package.json", import.meta.url), "utf8"),
);

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://svelte.dev/docs/kit/integrations
      // for more information about preprocessors
      preprocess: vitePreprocess(),
      // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      // If your environment is not supported or you settled on a specific environment, switch out the adapter.
      // See https://svelte.dev/docs/kit/adapters for more information about adapters.
      adapter: adapter(),
      version: {
        name: pkg.version,
      },
    }),
  ],

  test: {
    setupFiles: ["./vitest-setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts}"],
    coverage: {
      include: ["src/lib/**/*.{js,ts}"],
    },
  },
  build: {
    rolldownOptions: {
      external: [],
    },
  },
});
