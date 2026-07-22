<script lang="ts">
  import { browser } from "$app/environment";
  import type { OrgCode } from "@kinde/js-utils";

  export let orgCode: OrgCode;

  function switchOrg() {
    if (!browser) return;
    const path = "/api/auth/switch_org";
    const params = new URLSearchParams({ org_code: orgCode }).toString();
    window.location.href = `${path}?${params}`;
  }
</script>

<button on:click={switchOrg}><slot>Switch Organization</slot></button>
