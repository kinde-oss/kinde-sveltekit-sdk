// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { env } from "$env/dynamic/private";
import { version } from "$app/environment";

function getBaseURL() {
  try {
    return new URL(env.KINDE_REDIRECT_URL).origin;
  } catch (error) {
    console.error("Invalid KINDE_REDIRECT_URL:", error.message);
    return "";
  }
}

export const kindeConfiguration = {
  authDomain: env.KINDE_ISSUER_URL,
  clientId: env.KINDE_CLIENT_ID,
  logoutRedirectURL: env.KINDE_POST_LOGOUT_REDIRECT_URL,
  redirectURL: env.KINDE_REDIRECT_URL,
  appBase: getBaseURL(),
  audience: env.KINDE_AUDIENCE,
  scope: env.KINDE_SCOPE,
  clientSecret: env.KINDE_CLIENT_SECRET,
  loginRedirectURL: env.KINDE_POST_LOGIN_REDIRECT_URL || "",
  authUsePKCE: [true, "true"].includes(env.KINDE_AUTH_WITH_PKCE),
  debug: env.KINDE_DEBUG || process.env.NODE_ENV !== "production",
};

export const kindeAPIConfiguration = {
  authDomain: env.KINDE_ISSUER_URL,
  audience: `${env.KINDE_ISSUER_URL}/api`,
  clientId: env.KINDE_CLIENT_ID,
  clientSecret: env.KINDE_CLIENT_SECRET,
  framework: "Sveltekit",
  frameworkVersion: version,
};
