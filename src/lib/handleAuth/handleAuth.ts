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
    case "kinde_callback":
      await kindeAuthClient.handleRedirectToApp(
        request as unknown as SessionManager,
        new URL(request.url),
      );
      redirectToPostLoginUrl();
      return redirect(302, kindeConfiguration.loginRedirectURL ?? "/");
    case "logout":
      url = await kindeAuthClient.logout(request as unknown as SessionManager);
      break;
    default:
      return error(404, "Not Found");
  }
  redirect(302, url.toString());
}

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

const redirectToPostLoginUrl = () => {
  if (sessionStorage.getSessionItem(KEY_POST_LOGIN_REDIRECT_URL)) {
    const post_login_redirect_url = sessionStorage.getSessionItem(
      KEY_POST_LOGIN_REDIRECT_URL,
    );
    sessionStorage.removeSessionItem(KEY_POST_LOGIN_REDIRECT_URL);

    if (isAbsoluteUrl(post_login_redirect_url)) {
      redirect(302, new URL(post_login_redirect_url));
    } else {
      redirect(
                302,
                new URL(post_login_redirect_url, kindeConfiguration.appBase),
              );
    }
  }
};
