import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [sveltekit()],

  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    root: "./lib",
    coverage: {
      include: ["src/lib/**/*.{js,ts}"],
    },
  },
  build: {
    rollupOptions: {
      external: [""],
    },
  },
});
