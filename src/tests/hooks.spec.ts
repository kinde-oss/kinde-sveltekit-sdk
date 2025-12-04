import { sessionHooks } from "$lib/index.js";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("sessionHooks", () => {
  it("should add setSessionItem and getSessionItem methods to event.request", async () => {
    const event = {
      request: {},
      cookies: {
        set: vi.fn(),
        get: vi.fn().mockReturnValue("test value"),
      },
    };

    await sessionHooks({ event });

    expect(typeof event.request.setSessionItem).toBe("function");
    expect(typeof event.request.getSessionItem).toBe("function");
  });

  it("should set and get session items correctly", async () => {
    const event = {
      request: {},
      cookies: {
        set: vi.fn(),
        get: vi.fn().mockReturnValue("test value"),
      },
    };
    await sessionHooks({ event });

    await event.request.setSessionItem("testKey", "testValue");
    const item = event.request.getSessionItem("testKey");

    expect(event.cookies.set).toHaveBeenCalledWith(
      "kinde_testKey",
      "testValue",
      expect.any(Object),
    );
    expect(item).toBe("test value");
  });

  it("return undefined when item is not found", async () => {
    const event = {
      request: {},
      cookies: {
        set: vi.fn(),
        get: vi.fn().mockReturnValue(undefined),
      },
    };
    await sessionHooks({ event });
    const item = event.request.getSessionItem("testKey");
    expect(item).toBe(undefined);
  });

  it("return raw state", async () => {
    const event = {
      request: {},
      cookies: {
        set: vi.fn(),
        get: vi.fn().mockReturnValue("statekey"),
      },
    };
    await sessionHooks({ event });
    const item = event.request.getSessionItem("state");
    expect(item).toBe("statekey");
  });

  it("returns object when object stored", async () => {
    const dataStore = {};
    const event = {
      request: {},
      cookies: {
        set: vi.fn().mockImplementation((key, value) => {
          dataStore[key] = value;
        }),
        get: vi.fn().mockImplementation((key) => {
          return dataStore[key];
        }),
      },
    };
    await sessionHooks({ event });
    event.request.setSessionItem("testObject", { testValue: true });

    const item = event.request.getSessionItem("testObject");
    expect(item.testValue).toBe(true);
  });

  it("should remove item from session storage using sessionHooks", async () => {
    // Arrange
    const key = "testKey";
    const value = "testValue";
    const objectValue = { ["kinde_" + key]: value };
    const event = {
      request: {},
      cookies: {
        set: vi.fn(),
        get: vi
          .fn()
          .mockImplementation(() =>
            JSON.stringify(objectValue["kinde_" + key]),
          ),
        delete: vi.fn().mockImplementation((key) => {
          delete objectValue[key];
        }),
      },
    };
    await sessionHooks({ event });
    event.request.setSessionItem(key, value);

    // Act
    event.request.removeSessionItem(key);

    // Assert
    const retrievedValue = event.request.getSessionItem("kinde_" + key);
    expect(retrievedValue).toBeUndefined();
  });

  it("should destroy the session using sessionHooks", async () => {
    // Arrange
    const key1 = "testKey1";
    const value1 = "testValue1";
    const key2 = "testKey2";
    const value2 = "testValue2";
    const objectValue = {
      ["kinde_testKey1"]: value1,
      ["kinde_testKey2"]: value2,
    };
    const event = {
      request: {},
      cookies: {
        set: vi.fn(),
        get: vi
          .fn()
          .mockImplementation((key) => JSON.stringify(objectValue[key])),
        delete: vi.fn().mockImplementation((key) => {
          delete objectValue[key];
        }),
        getAll: vi
          .fn()
          .mockImplementation(() =>
            Object.keys(objectValue).map((key) => ({ name: key })),
          ),
      },
    };
    await sessionHooks({ event });
    event.request.setSessionItem(key1, value1);
    event.request.setSessionItem(key2, value2);

    // Act
    event.request.destroySession();

    // Assert
    const retrievedValue1 = event.request.getSessionItem(key1);
    const retrievedValue2 = event.request.getSessionItem(key2);
    expect(retrievedValue1).toBeUndefined();
    expect(retrievedValue2).toBeUndefined();
  });

  describe("cookie maxAge configuration", () => {
    const originalEnv = process.env.KINDE_SESSION_MAX_AGE;

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.KINDE_SESSION_MAX_AGE = originalEnv;
      } else {
        delete process.env.KINDE_SESSION_MAX_AGE;
      }
    });

    it("should use default 29 days when KINDE_SESSION_MAX_AGE is not set", async () => {
      delete process.env.KINDE_SESSION_MAX_AGE;

      const event = {
        request: {},
        cookies: {
          set: vi.fn(),
          get: vi.fn(),
        },
      };

      await sessionHooks({ event });
      await event.request.setSessionItem("testKey", "testValue");

      expect(event.cookies.set).toHaveBeenCalledWith(
        "kinde_testKey",
        "testValue",
        expect.objectContaining({
          maxAge: 29 * 24 * 60 * 60,
        }),
      );
    });

    it("should use custom maxAge when KINDE_SESSION_MAX_AGE is set", async () => {
      process.env.KINDE_SESSION_MAX_AGE = "3600"; // 1 hour

      const event = {
        request: {},
        cookies: {
          set: vi.fn(),
          get: vi.fn(),
        },
      };

      await sessionHooks({ event });
      await event.request.setSessionItem("testKey", "testValue");

      expect(event.cookies.set).toHaveBeenCalledWith(
        "kinde_testKey",
        "testValue",
        expect.objectContaining({
          maxAge: 3600,
        }),
      );
    });

    it("should fallback to default when KINDE_SESSION_MAX_AGE is zero", async () => {
      process.env.KINDE_SESSION_MAX_AGE = "0";

      const event = {
        request: {},
        cookies: {
          set: vi.fn(),
          get: vi.fn(),
        },
      };

      await sessionHooks({ event });
      await event.request.setSessionItem("testKey", "testValue");

      expect(event.cookies.set).toHaveBeenCalledWith(
        "kinde_testKey",
        "testValue",
        expect.objectContaining({
          maxAge: 29 * 24 * 60 * 60,
        }),
      );
    });

    it("should fallback to default when KINDE_SESSION_MAX_AGE is invalid", async () => {
      process.env.KINDE_SESSION_MAX_AGE = "invalid";

      const event = {
        request: {},
        cookies: {
          set: vi.fn(),
          get: vi.fn(),
        },
      };

      await sessionHooks({ event });
      await event.request.setSessionItem("testKey", "testValue");

      expect(event.cookies.set).toHaveBeenCalledWith(
        "kinde_testKey",
        "testValue",
        expect.objectContaining({
          maxAge: 29 * 24 * 60 * 60,
        }),
      );
    });
  });
});
