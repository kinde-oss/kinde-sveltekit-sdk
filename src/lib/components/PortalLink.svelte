<script lang="ts">
  import { type GeneratePortalUrlParams } from "@kinde/js-utils";
  import { browser } from "$app/environment";

  export let options: Omit<GeneratePortalUrlParams, "domain" | "returnUrl"> =
    {};

  function portal() {
    if (!browser) return;
    const path = "/api/auth/portal";

    const params = new URLSearchParams(
      options as Record<string, string>,
    ).toString();
    const url = params ? `${path}?${params}` : path;
    window.location.href = url;
  }
</script>

<button on:click={portal}><slot>Account</slot></button>
