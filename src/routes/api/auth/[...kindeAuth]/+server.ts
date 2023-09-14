import { handleAuth } from "$lib/index.js";

export function GET(requestEvents) {
    return handleAuth(requestEvents)
} 