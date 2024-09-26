import { sessionHooks, type Handler } from "$lib/index.js";

export const handle: Handler = async ({ event, resolve }) => {
  sessionHooks({ event });

  const response = await resolve(event);
  return response;
};
