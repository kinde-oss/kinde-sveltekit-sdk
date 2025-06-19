import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    root: "./lib",
    coverage: {
      include: ["src/lib/**/*.{js,ts}"],
    },
  },
  resolve: {
    alias: {
      "/components": resolve(__dirname, "src/lib/components/index.ts"),
    },
  },
  build: {
    rollupOptions: {
      external: ["svelte"],
    },
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        components: resolve(__dirname, "src/components/index.ts"),
      },
      formats: ["es", "cjs"],
      name: "@kinde-oss/kinde-auth-react",
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.mjs` : `${entryName}.cjs`,
    },
    target: "esnext",
    outDir: "dist2",
    emptyOutDir: true,
  },
});
