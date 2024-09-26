import { sessionHooks, type Handler } from "$lib/index.js";

export const handle: Handler = async ({ event, resolve }) => {
  sessionHooks({ event });

  return await resolve(event);
};
