import { kindeConfiguration } from '$lib/config/index.js';
import { sessionStorage } from '$lib/sessionStorage/index.js';

import pkg, { type ACClient, type CCClient, type CCClientOptions, type PKCEClientOptions } from '@kinde-oss/kinde-typescript-sdk';
const { createKindeServerClient, GrantType, } = pkg;

export const kindeAuthClient = createKindeServerClient<ACClient, PKCEClientOptions>(
	GrantType.PKCE,
	kindeConfiguration
);

export const getHeaders = async () => {
	const kindeManagementApi = createKindeServerClient<CCClient, CCClientOptions>(
		GrantType.CLIENT_CREDENTIALS,
		kindeConfiguration
	);

	const token = await kindeManagementApi.getToken(sessionStorage);

	return {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};
};
