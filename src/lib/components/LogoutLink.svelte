<script lang="ts">
  import { type LoginMethodParams } from "@kinde/js-utils";
  import { browser } from "$app/environment";

  export let options: {
    redirectUrl?: string;
    allSession?: boolean;
  } = {};

  function logout() {
    if (!browser) return;
    const path = "/api/auth/logout";
    const parsedOptions: LoginMethodParams = {
      redirectUrl: options.redirectUrl,
      allSession: options.allSession ? "true" : "false",
    };
    const params = new URLSearchParams(
      parsedOptions as Record<string, string>,
    ).toString();
    const url = params ? `${path}?${params}` : path;
    window.location.href = url;
  }
</script>

<button on:click={logout}><slot>Logout</slot></button>
