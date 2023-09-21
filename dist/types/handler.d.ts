import type { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import type { MaybePromise, RequestEvent } from "@sveltejs/kit";
import type { ResolveOptions } from "vite";
export type EventHandler = RequestEvent & {
    request: RequestEvent['request'] & SessionManager & {
        session: Record<string, unknown> & {
            destroy: (error?: unknown) => void;
        };
    };
};
export type Handler = (input: {
    event: EventHandler;
    resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
}) => MaybePromise<Response>;
