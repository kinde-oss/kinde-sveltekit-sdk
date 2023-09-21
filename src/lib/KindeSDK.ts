import { kindeConfiguration } from '$lib/config/index.js';
import { sessionStorage } from '$lib/sessionStorage/index.js';

import pkg, { type ACClient, type CCClient, type CCClientOptions, type PKCEClientOptions } from '@kinde-oss/kinde-typescript-sdk';
import { omit } from './utils/index.js';
const { createKindeServerClient, GrantType, } = pkg;

export const kindeAuthClient = createKindeServerClient<ACClient, PKCEClientOptions>(
	GrantType.PKCE,
	kindeConfiguration as unknown as PKCEClientOptions
);

export const getHeaders = async () => {
	const kindeManagementApi = createKindeServerClient<CCClient, CCClientOptions>(
		GrantType.CLIENT_CREDENTIALS,
		omit(kindeConfiguration, ['logoutRedirectURL', 'loginRedirectURL', 'scope', 'redirectURL']) as unknown as CCClientOptions
	);

	const token = await kindeManagementApi.getToken(sessionStorage);

	return {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};
};
