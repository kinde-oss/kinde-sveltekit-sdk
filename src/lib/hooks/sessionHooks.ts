import type { EventHandler } from "$lib/types/handler.js";

export async function sessionHooks({ event }: { event: EventHandler }) {
  event.request.setSessionItem = async (
    itemKey: string,
    itemValue: unknown,
  ) => {
    event.cookies.set(
      `kinde_${itemKey}`,
      typeof itemValue === "string"
        ? itemValue
        : (JSON.stringify(itemValue) as string),
      {
        domain: process.env.KINDE_COOKIE_DOMAIN,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        httpOnly: true,
      },
    );
  };

  event.request.getSessionItem = (itemKey: string) => {
    const item = event.cookies.get(`kinde_${itemKey}`);

    if (!item) {
      return item;
    }

    if (/state/.test(itemKey)) {
      return item; // return raw state
    }
    try {
      const result = JSON.parse(item);
      return result;
    } catch (error) {
      return event.cookies.get(`kinde_${itemKey}`);
    }
  };

  event.request.removeSessionItem = async (itemKey: string) => {
    return event.cookies.delete(`kinde_${itemKey}`, {
      path: "/",
      domain: process.env.KINDE_COOKIE_DOMAIN,
    });
  };

  event.request.destroySession = async () => {
    event.cookies.getAll().forEach((item) => {
      if (/^kinde_/.test(item.name)) {
        event.cookies.delete(item.name, {
          path: "/",
          domain: process.env.KINDE_COOKIE_DOMAIN,
        });
      }
    });
    return;
  };
}
