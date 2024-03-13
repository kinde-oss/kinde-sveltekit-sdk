import {describe, it, expect, afterEach, vi} from 'vitest';
import * as kindeSDK from '$lib/KindeSDK.js';
import {Configuration} from '@kinde-oss/kinde-typescript-sdk';

describe('KindeSDK', () => {
	vi.mock('$lib/config/index.js', () => ({
		kindeConfiguration: {
			authDomain: 'https://testdomain.kinde.com',
			logoutRedirectURL: 'http://localhost:3000',
			redirectURL: 'http://localhost:3000/api/auth/callback',
			appBase: 'http://localhost:3000',
			clientSecret: 'asdfgaskjasfkjasfljasflajslfjaslfjalsfjalskfjlas',
			loginRedirectURL: 'http://localhost:3000/dashboard',
			authUsePKCE: false,
			debug: false
		},
		kindeAPIConfiguration: {
			authDomain: 'https://testdomain.kinde.com',
			logoutRedirectURL: 'http://localhost:3000',
			redirectURL: 'http://localhost:3000/api/auth/callback',
			appBase: 'http://localhost:3000',
			clientSecret: 'asdfgaskjasfkjasfljasflajslfjaslfjalsfjalskfjlas',
			loginRedirectURL: 'http://localhost:3000/dashboard',
			authUsePKCE: false,
			debug: false
		}
	}));

	vi.mock('@kinde-oss/kinde-typescript-sdk', async () => {
		const originalModule = await vi.importActual('@kinde-oss/kinde-typescript-sdk');

		return {
			...originalModule, // keep all original exports
			createKindeServerClient: () => {
				return {
					getToken: vi.fn().mockImplementation(() => {
						return 'mockedtoken';
					}),
					login: vi.fn()
				};
			}
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('kindeAuthClient', async () => {
		const client = await kindeSDK.kindeAuthClient;
		expect(client.login).toBeDefined();
	});

	it('auth headers', async () => {
		const headers = await kindeSDK.getHeaders();

		expect(headers).toEqual({
			Authorization: `Bearer mockedtoken`,
			Accept: 'application/json'
		});
	});

	it('auth getConfiguration', async () => {
		const headers = await kindeSDK.getConfiguration();

		expect(headers).toEqual(
			new Configuration({
				accessToken: 'mockedtoken',
				basePath: 'https://testdomain.kinde.com',
				headers: {
					Accept: 'application/json'
				}
			})
		);
	});
});
