<script lang="ts">
  import { type LoginMethodParams } from "@kinde/js-utils";

  export let options: {
    redirectUrl?: string;
    allSession?: boolean;
  } = {};

  function login() {
    const params = new URLSearchParams(
      options as Record<string, string>,
    ).toString();
    const url = params ? `/auth/logout?${params}` : "/auth/logout";
    window.location.href = url;
  }
</script>

<button on:click={login}><slot>Logout</slot></button>
