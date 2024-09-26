// file deepcode ignore HardcodedNonCryptoSecret/test: <test file>
import { describe, beforeEach, it, expect, vi } from "vitest";
import { kindeAuthClient, kindeConfiguration, handleAuth } from "$lib/index.js";

vi.mock("$lib/sessionStorage/sessionStorage.js");
vi.mock("$lib/index.js", async () => {
  const originalModule = await vi.importActual("$lib/index.js");

  const kindeConfiguration = {
    authDomain: "https://testdomain.kinde.com",
    logoutRedirectURL: "http://localhost:3000",
    redirectURL: "http://localhost:3000/api/auth/callback",
    appBase: "http://localhost:3000",
    clientSecret: "asdfgaskjasfkjasfljasflajslfjaslfjalsfjalskfjlas",
    loginRedirectURL: "http://localhost:3000/dashboard",
    authUsePKCE: false,
    debug: false,
  };

  return {
    ...originalModule,
    getConfiguration: vi.fn().mockReturnValue(kindeConfiguration),
    kindeConfiguration: kindeConfiguration,
    kindeAPIConfiguration: kindeConfiguration,
  };
});

describe("HandleAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle login requests", async () => {
    const requestEvent = {
      request: {},
      params: { kindeAuth: "login" },
      url: new URL("http://localhost?redirect_url=/test"),
    };
    const loginMock = vi.fn().mockImplementation(() => {
      return new URL("http://localhost/redirected");
    });
    kindeAuthClient.login = loginMock;
    try {
      await handleAuth(requestEvent);
    } catch (e) {
      expect(e.status).toBe(302);
      expect(e.location).toBe("http://localhost/redirected");
    }
    expect(loginMock).toHaveBeenCalledWith(
      {},
      {
        redirect_url: "/test",
      },
    );
  });

  it("should handle health requests in debug mode", async () => {
    const requestEvent = {
      request: {},
      params: { kindeAuth: "health" },
      url: new URL("http://localhost"),
    };
    kindeConfiguration.debug = true;

    const response = await handleAuth(requestEvent);

    expect(response).toBeDefined();
  });
});
