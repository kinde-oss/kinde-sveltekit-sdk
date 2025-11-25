import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export interface TokenStore extends Writable<string | null> {
  sync: () => Promise<string | null>;
  isSyncing: Writable<boolean>;
}

/**
 * Creates a token store that can be synced with the Kinde session token.
 * This allows you to keep your own store in sync with the current authentication token.
 *
 * @example
 * ```ts
 * import { createTokenStore } from '@kinde-oss/kinde-auth-sveltekit';
 *
 * const tokenStore = createTokenStore();
 *
 * // Sync the token
 * await tokenStore.sync();
 *
 * // Use the token in your API client
 * $tokenStore // This will be the current token or null
 * ```
 */
export function createTokenStore(): TokenStore {
  const store = writable<string | null>(null);
  const isSyncing = writable<boolean>(false);

  const sync = async (): Promise<string | null> => {
    if (!browser) {
      console.warn("Token sync can only be called in the browser");
      return null;
    }

    isSyncing.set(true);
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
    } finally {
      isSyncing.set(false);
    }
  };

  return {
    ...store,
    sync,
    isSyncing,
  };
}

/**
 * Default token store instance. You can use this directly or create your own with createTokenStore().
 */
export const tokenStore = createTokenStore();
