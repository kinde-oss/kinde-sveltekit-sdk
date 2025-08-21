import { kindeAuthClient } from "$lib/KindeSDK.js";
import { kindeConfiguration } from "$lib/index.js";
import { sessionStorage } from "$lib/sessionStorage/sessionStorage.js";
import { parseSearchParamsToObject } from "$lib/utils/index.js";
import {
  type SessionManager,
  validateClientSecret,
} from "@kinde-oss/kinde-typescript-sdk";
import { error, redirect, type RequestEvent } from "@sveltejs/kit";
import { version } from "$app/environment";
import {
  generatePortalUrl,
  MemoryStorage,
  setActiveStorage,
  StorageKeys,
} from "@kinde/js-utils";

const KEY_POST_LOGIN_REDIRECT_URL = "post-login-redirect-url";

export async function handleAuth({
  request,
  params,
  url: originURL,
}: RequestEvent): Promise<Response> {
  const options = parseSearchParamsToObject(originURL.search);
  let url: URL | null = null;
  switch (params.kindeAuth) {
    case "login":
      storePostLoginRedirectUrl(options);
      url = await kindeAuthClient.login(
        request as unknown as SessionManager,
        options,
      );
      break;
    case "health":
      if (!kindeConfiguration.debug) {
        url = new URL(kindeConfiguration.loginRedirectURL);
        break;
      }
      return new Response(
        JSON.stringify({
          authDomain: kindeConfiguration.authDomain || "",
          clientId: kindeConfiguration.clientId || "",
          logoutRedirectURL: kindeConfiguration.logoutRedirectURL || "",
          redirectURL: kindeConfiguration.redirectURL || "",
          audience: kindeConfiguration.audience || "",
          scope: kindeConfiguration.scope || "",
          // deepcode ignore HardcodedNonCryptoSecret: <this is read from env var vand validated here>
          clientSecret: validateClientSecret(
            kindeConfiguration.clientSecret || "",
          )
            ? "Set correctly"
            : "Not set correctly",
          loginRedirectURL: kindeConfiguration.loginRedirectURL || "",
          authUsePKCE: kindeConfiguration.authUsePKCE,
          version: version,
          framework: "sveltekit",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    case "register":
      storePostLoginRedirectUrl(options);
      url = await kindeAuthClient.register(
        request as unknown as SessionManager,
        options,
      );
      break;
    case "create_org":
      url = await kindeAuthClient.createOrg(
        request as unknown as SessionManager,
        options,
      );
      break;
    case "portal":
      await openPortal(request, options);
      break;
    case "kinde_callback":
      await kindeAuthClient.handleRedirectToApp(
        request as unknown as SessionManager,
        new URL(request.url),
      );
      await redirectToPostLoginUrl();
      throw redirect(302, kindeConfiguration.loginRedirectURL ?? "/");
    case "logout":
      url = await kindeAuthClient.logout(request as unknown as SessionManager);
      break;
    default:
      return error(404, "Not Found");
  }
  throw redirect(302, url.toString());
}

const openPortal = async (
  request: SessionManager,
  options: Record<string, string | number>,
) => {
  const accessToken = await request.getSessionItem("access_token");
  if (!accessToken) {
    throw error(401, "User not authenticated");
  }

  const storage = new MemoryStorage();
  setActiveStorage(storage);
  await storage.setSessionItem(StorageKeys.accessToken, accessToken);
  let portalUrl;
  try {
    portalUrl = await generatePortalUrl({
      ...options,
      domain: kindeConfiguration.authDomain,
    });
  } catch (err) {
    console.log("err:", err);
    throw error(500, "Failed to generate portal URL");
  }
  throw redirect(302, portalUrl.url.toString());
};

const storePostLoginRedirectUrl = (
  options: Record<string, string | number>,
) => {
  if (
    options.post_login_redirect_url &&
    typeof options.post_login_redirect_url == "string"
  ) {
    sessionStorage.setSessionItem(
      KEY_POST_LOGIN_REDIRECT_URL,
      options.post_login_redirect_url,
    );
  }
};

const isAbsoluteUrl = (url: string) =>
  url.indexOf("http://") === 0 || url.indexOf("https://") === 0;

const redirectToPostLoginUrl = async () => {
  const value = await sessionStorage.getSessionItem(
    KEY_POST_LOGIN_REDIRECT_URL,
  );
  if (!value || typeof value !== "string") {
    return;
  }
  const post_login_redirect_url = value as string;
  sessionStorage.removeSessionItem(KEY_POST_LOGIN_REDIRECT_URL);

  if (isAbsoluteUrl(post_login_redirect_url)) {
    redirect(302, new URL(post_login_redirect_url));
  } else {
    redirect(302, new URL(post_login_redirect_url, kindeConfiguration.appBase));
  }
};
