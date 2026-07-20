// file deepcode ignore HardcodedNonCryptoSecret/test: <test file>
import { describe, beforeEach, it, expect, vi } from "vitest";
import { kindeAuthClient, kindeConfiguration, handleAuth } from "$lib/index.js";

vi.mock("$lib/sessionStorage/sessionStorage.js");
vi.mock("@kinde/js-utils", async () => {
  const originalModule = await vi.importActual("@kinde/js-utils");
  return {
    ...originalModule,
    switchOrg: vi.fn(),
  };
});
vi.mock("$lib/index.js", async () => {
  const originalModule = await vi.importActual("$lib/index.js");

  const kindeConfiguration = {
    authDomain: "https://testdomain.kinde.com",
    clientId: "test_client_id",
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

  it("should handle switch_org requests", async () => {
    const { switchOrg } = await import("@kinde/js-utils");
    const switchOrgMock = vi.mocked(switchOrg);
    switchOrgMock.mockResolvedValue({
      url: new URL("https://testdomain.kinde.com/oauth2/auth?org_code=org_123"),
      state: "state",
      nonce: "nonce",
      codeChallenge: "",
      codeVerifier: "",
    });

    const requestEvent = {
      request: {},
      params: { kindeAuth: "switch_org" },
      url: new URL("http://localhost?org_code=org_123abc"),
    };

    try {
      await handleAuth(requestEvent);
    } catch (e) {
      expect(e.status).toBe(302);
      expect(e.location).toBe(
        "https://testdomain.kinde.com/oauth2/auth?org_code=org_123",
      );
    }

    expect(switchOrgMock).toHaveBeenCalledWith(
      expect.objectContaining({ orgCode: "org_123abc" }),
    );
  });

  it("should return 400 when switch_org is called without org_code", async () => {
    const requestEvent = {
      request: {},
      params: { kindeAuth: "switch_org" },
      url: new URL("http://localhost"),
    };

    try {
      await handleAuth(requestEvent);
      expect.fail("Expected error to be thrown");
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });
});
