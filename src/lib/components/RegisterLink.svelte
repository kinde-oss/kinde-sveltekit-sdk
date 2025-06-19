<script lang="ts">
  import { type LoginMethodParams } from "@kinde/js-utils";

  export let options: LoginMethodParams = {};

  function login() {
    const params = new URLSearchParams(
      options as Record<string, string>,
    ).toString();
    const url = params ? `/auth/register?${params}` : "/auth/register";
    window.location.href = url;
  }
</script>

<button on:click={login}><slot>Register</slot></button>
