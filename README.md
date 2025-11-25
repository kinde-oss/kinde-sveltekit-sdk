# Kinde SvelteKit

The Kinde SDK for SvelteKit.

[![PRs - Welcome](https://img.shields.io/badge/PRs-Welcome-green?style=for-the-badge)](https://kinde.com/docs/developer-tools) [![Kinde - Docs](https://img.shields.io/badge/Kinde-Docs-white?style=for-the-badge)](<[https://kinde.com/docs/developer-tools](https://kinde.com/docs/developer-tools/sveltekit-sdk/)>) [![Kinde Community](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://join.slack.com/t/thekindecommunity/shared_invite/zt-26hdaavyc-CfOa06vP23guSwK~~OpFMQ) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/wHX6j7wG5d)

## Development

### Initial set up

1. Clone the repository to your machine:

   ```bash
   git clone https://github.com/kinde-oss/kinde-sveltekit-sdk
   ```

2. Go into the project:

   ```bash
   cd kinde-sveltekit-sdk
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### How to build

Implement your modifications and then execute the below command to compile the SDK:

```bash
npm run build
```

### How to add the SDK into an already existing project

1. Go to the project's root directory, then execute the below command:

   ```bash
   npm pack <path-to-sdk-folder>
   // e.g.
   npm pack ~/Documents/Projects/kinde-sveltekit-sdk
   ```

2. Update the package.json file

   ```json
   {
        ...
        "dependencies": {
            "@kinde-oss/kinde-sveltekit-sdk": "file:kinde-oss-kinde-sveltekit-sdk-<version>.tgz",
            ...
        }
        ...
   }
   ```

## Client-Side Token Synchronization

When building an API client for a different backend that uses Kinde authentication tokens, you need a way to access the token in the browser. Since `getToken()` is server-side only, the SDK provides client-side token synchronization utilities.

### Using the Default Token Store

The simplest approach is to use the default `tokenStore`:

```typescript
import { tokenStore } from "@kinde-oss/kinde-auth-sveltekit";
import { onMount } from "svelte";

// In your component
onMount(async () => {
  // Sync the token when the component mounts
  await tokenStore.sync();
});

// Use the token in your API client
$tokenStore; // Current token or null
```

### Creating a Custom Token Store

You can create your own token store instance:

```typescript
import { createTokenStore } from "@kinde-oss/kinde-auth-sveltekit";

const myTokenStore = createTokenStore();

// Sync the token
await myTokenStore.sync();

// Check if syncing is in progress
$myTokenStore.isSyncing; // boolean

// Access the token
$myTokenStore; // Current token or null
```

### Syncing with Your Own Store

If you already have a Svelte store for your API client tokens, you can sync it with the Kinde token:

```typescript
import { syncTokenWithStore } from "@kinde-oss/kinde-auth-sveltekit";
import { writable } from "svelte/store";

// Your existing API token store
const apiTokenStore = writable<string | null>(null);

// Sync it with the Kinde token
await syncTokenWithStore(apiTokenStore);

// Now your store is in sync
$apiTokenStore; // Current Kinde token or null
```

### Example: Using Token in API Client

Here's a complete example of using the token store with an API client:

```typescript
// lib/apiClient.ts
import { writable } from "svelte/store";
import { syncTokenWithStore } from "@kinde-oss/kinde-auth-sveltekit";

const apiToken = writable<string | null>(null);

// Sync token on initialization
export async function initApiClient() {
  await syncTokenWithStore(apiToken);
}

// Make API calls using the token
export async function fetchFromBackend(endpoint: string) {
  const token = $apiToken;
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`https://your-backend.com${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
```

```svelte
<!-- MyComponent.svelte -->
<script>
  import { onMount } from "svelte";
  import { initApiClient, fetchFromBackend } from "$lib/apiClient";

  onMount(async () => {
    await initApiClient();
    const data = await fetchFromBackend("/api/data");
  });
</script>
```

### How to test

Firstly, you need to install a web browser for testing purposes

```bash
// https://playwright.dev/docs/library#key-differences

npx playwright install
// for a single one
npx playwright install chromium
```

Next step, create `.env` file:

```bash
KINDE_AUDIENCE=your_kinde_api
KINDE_CLIENT_ID=your_kinde_client_id // Please use an application with password method
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_COOKIE_DOMAIN=// domain to assign cookie to
KINDE_ISSUER_URL=https://your_kinde_domain.kinde.com
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:4173
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:4173
KINDE_REDIRECT_URL=http://localhost:4173/api/auth/kinde_callback
KINDE_SCOPE=profile email offline openid
KINDE_USER_EMAIL_TEST= // An user has existed in your organization
KINDE_USER_PASSWORD_TEST=
KINDE_AUTH_WITH_PKCE= // Set `true` if you want to use Authentication Code Flow with PKCE
KINDE_DEBUG= // Set `true` if you want to enable the `api/auth/health` endpoint
```

Finally, you can simply run the command

```bash
npm run test
```

<!-- ## Documentation

For details on integrating this SDK into your project, head over to the [Kinde docs](https://kinde.com/docs/) and see the [SvelteKit SDK](<[link-to-kinde-doc](https://kinde.com/docs/developer-tools/)>) doc 👍🏼. -->

## Publishing

The core team handles publishing.

## Contributing

Please refer to Kinde’s [contributing guidelines](https://github.com/kinde-oss/.github/blob/489e2ca9c3307c2b2e098a885e22f2239116394a/CONTRIBUTING.md).

## License

By contributing to Kinde, you agree that your contributions will be licensed under its MIT License.
