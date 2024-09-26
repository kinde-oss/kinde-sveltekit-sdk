import { sessionStorage } from "$lib/sessionStorage/index.js";

declare global {
  const SessionStorage: typeof sessionStorage;
}

export {};
