import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],

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
