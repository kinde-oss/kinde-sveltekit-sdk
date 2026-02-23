import { describe, expect, it, vi, beforeEach } from "vitest";

const { sessionHooksMock } = vi.hoisted(() => ({
  sessionHooksMock: vi.fn(),
}));

vi.mock("$lib/index.js", () => ({
  sessionHooks: sessionHooksMock,
}));

import { handle } from "../hooks.server";

type RedirectLikeError = {
  status: number;
  location: string;
};

describe("hooks.server handle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to invite register auth flow when invitation_code is present", async () => {
    const resolve = vi.fn();

    try {
      await handle({
        event: {
          url: new URL("http://localhost:4173/?invitation_code=inv_123"),
        },
        resolve,
      } as never);
    } catch (error: unknown) {
      const redirectError = error as RedirectLikeError;
      expect(redirectError.status).toBe(302);
      expect(redirectError.location).toBe(
        "/api/auth/register?invitation_code=inv_123&is_invitation=true",
      );
    }

    expect(resolve).not.toHaveBeenCalled();
    expect(sessionHooksMock).not.toHaveBeenCalled();
  });

  it("does not redirect for auth api routes", async () => {
    const resolve = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));

    const response = await handle({
      event: {
        url: new URL(
          "http://localhost:4173/api/auth/register?invitation_code=inv_123",
        ),
      },
      resolve,
    } as never);

    expect(response.status).toBe(200);
    expect(sessionHooksMock).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("ignores empty invitation_code", async () => {
    const resolve = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));

    const response = await handle({
      event: {
        url: new URL("http://localhost:4173/?invitation_code=   "),
      },
      resolve,
    } as never);

    expect(response.status).toBe(200);
    expect(sessionHooksMock).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
