import type { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import type { RequestEvent } from "@sveltejs/kit";
import type { ResolveOptions } from "vite";

type MaybePromise<T> = T | Promise<T>;

export type EventHandler = RequestEvent & {
  request: RequestEvent["request"] &
    SessionManager & {
      session: Record<string, unknown> & {
        destroy: (error?: unknown) => void;
      };
    };
};

export type Handler = (input: {
  event: EventHandler;
  resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
}) => MaybePromise<Response>;
