import { browser } from "$app/environment";
import type { Writable } from "svelte/store";

/**
 * Syncs the current Kinde access token with a custom Svelte store.
 * This is useful when you have your own store for API client tokens.
 *
 * @param store - A writable Svelte store to sync the token with
 * @returns The token value (or null if not authenticated)
 *
 * @example
 * ```ts
 * import { syncTokenWithStore } from '@kinde-oss/kinde-auth-sveltekit';
 * import { writable } from 'svelte/store';
 *
 * const myApiTokenStore = writable<string | null>(null);
 *
 * // Sync your store with the Kinde token
 * await syncTokenWithStore(myApiTokenStore);
 *
 * // Now your store is in sync and can be used in API calls
 * $myApiTokenStore // Current token or null
 * ```
 */
export async function syncTokenWithStore(
  store: Writable<string | null>,
): Promise<string | null> {
  if (!browser) {
    console.warn("Token sync can only be called in the browser");
    return null;
  }

  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) {
      if (response.status === 401) {
        store.set(null);
        return null;
      }
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();
    store.set(data.token);
    return data.token;
  } catch (error) {
    console.error("Error syncing token:", error);
    store.set(null);
    return null;
  }
}
