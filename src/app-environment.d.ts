// SvelteKit 3 still resolves the deprecated `$app/environment` alias at runtime,
// but no longer ships types for it. The SDK keeps importing it so that it works
// with SvelteKit 2, which has no `$app/env`.
declare module "$app/environment" {
  export * from "$app/env";
}
