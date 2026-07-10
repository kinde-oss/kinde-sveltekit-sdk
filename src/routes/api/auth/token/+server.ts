import { json, type RequestEvent } from "@sveltejs/kit";
import type { EventHandler } from "$lib/types/handler.js";

export async function GET(event: RequestEvent) {
  // Access the session item from the request (set by sessionHooks)
  // The sessionHooks add getSessionItem to the request object
  const request = event.request as EventHandler["request"];
  const accessToken = request.getSessionItem("access_token");

  if (!accessToken) {
    return json({ token: null }, { status: 401 });
  }

  return json({ token: accessToken });
}
