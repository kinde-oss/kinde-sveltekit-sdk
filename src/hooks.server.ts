import { sessionHooks, type Handler } from "$lib/index.js";
import { redirect } from "@sveltejs/kit";

const AUTH_API_PREFIX = "/api/auth/";

export const handle: Handler = async ({ event, resolve }) => {
  const invitationCode = event.url.searchParams.get("invitation_code")?.trim();
  const isAuthRoute = event.url.pathname.startsWith(AUTH_API_PREFIX);

  if (invitationCode && !isAuthRoute) {
    const params = new URLSearchParams({
      invitation_code: invitationCode,
      is_invitation: "true",
    });

    throw redirect(302, `${AUTH_API_PREFIX}register?${params.toString()}`);
  }

  sessionHooks({ event });

  return await resolve(event);
};
