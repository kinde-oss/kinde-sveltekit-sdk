<script lang="ts">
  import {
    mapLoginMethodParamsForUrl,
    type LoginMethodParams,
  } from "@kinde/js-utils";
  import { browser } from "$app/environment";

  export let options: LoginMethodParams = {};

  function register() {
    if (!browser) return;
    const path = "/api/auth/register";
    const parsedOptions = mapLoginMethodParamsForUrl(options);
    const params = new URLSearchParams(
      parsedOptions as Record<string, string>,
    ).toString();
    const url = params ? `${path}?${params}` : path;
    window.location.href = url;
  }
</script>

<button on:click={register}><slot>Register</slot></button>
