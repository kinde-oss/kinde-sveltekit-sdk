<script lang="ts">
  import {
    mapLoginMethodParamsForUrl,
    type LoginMethodParams,
  } from "@kinde/js-utils";
  import { browser } from "$app/environment";

  export let options: LoginMethodParams = {};

  function login() {
    if (!browser) return;
    const path = "/api/auth/login";
    const parsedOptions = mapLoginMethodParamsForUrl(options);
    const params = new URLSearchParams(
      parsedOptions as Record<string, string>,
    ).toString();
    const url = params ? `${path}?${params}` : path;
    window.location.href = url;
  }
</script>

<button on:click={login}><slot>Login</slot></button>
