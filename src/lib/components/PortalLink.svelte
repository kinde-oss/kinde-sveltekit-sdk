<script lang="ts">
  import { type GeneratePortalUrlParams } from "@kinde/js-utils";

  export let options: Omit<GeneratePortalUrlParams, "domain" | "returnUrl"> =
    {};

  function login() {
    const params = new URLSearchParams(
      options as Record<string, string>,
    ).toString();
    const url = params ? `/auth/portal?${params}` : "/auth/portal";
    window.location.href = url;
  }
</script>

<button on:click={login}><slot>Account</slot></button>
