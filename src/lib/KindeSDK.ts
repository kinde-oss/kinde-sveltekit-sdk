import {
  kindeConfiguration,
  kindeAPIConfiguration,
} from "$lib/config/index.js";
import { sessionStorage } from "$lib/sessionStorage/index.js";

import {
  GrantType,
  createKindeServerClient,
  type CCClientOptions,
  type SessionManager,
  type PKCEClientOptions,
  type ACClientOptions,
  Configuration,
  type ConfigurationParameters,
} from "@kinde-oss/kinde-typescript-sdk";
import { omit } from "./utils/index.js";

export const getToken = async () => {
  const kindeManagementApi = createKindeServerClient(
    GrantType.CLIENT_CREDENTIALS,
    kindeAPIConfiguration as unknown as CCClientOptions,
  );
  return await kindeManagementApi.getToken(
    sessionStorage as unknown as SessionManager,
  );
};

export const kindeAuthClient = createKindeServerClient(
  kindeConfiguration.authUsePKCE
    ? GrantType.PKCE
    : GrantType.AUTHORIZATION_CODE,
  omit(
    kindeConfiguration,
    kindeConfiguration.authUsePKCE
      ? ["authUsePKCE", "clientSecret"]
      : ["authUsePKCE"],
  ) as unknown as PKCEClientOptions | ACClientOptions,
);

export const getHeaders = async () => {
  return {
    Authorization: `Bearer ${await getToken()}`,
    Accept: "application/json",
  };
};

export const getConfiguration = async (
  configurationOverrides?: ConfigurationParameters,
) => {
  return new Configuration({
    basePath: kindeConfiguration.authDomain,
    accessToken: await getToken(),
    headers: {
      Accept: "application/json",
    },
    ...(configurationOverrides || {}),
  });
};
