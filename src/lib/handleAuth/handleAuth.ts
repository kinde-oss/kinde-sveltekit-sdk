import {kindeAuthClient} from '$lib/KindeSDK.js';
import {kindeConfiguration} from '$lib/index.js';
import {parseSearchParamsToObject} from '$lib/utils/index.js';
import type {SessionManager} from '@kinde-oss/kinde-typescript-sdk';
import {error, redirect, type RequestEvent} from '@sveltejs/kit';

export async function handleAuth({
	request,
	params,
	url: originURL
}: RequestEvent): Promise<Response> {
	const options = parseSearchParamsToObject(originURL.search);
	let url: URL | null = null;
	switch (params.kindeAuth) {
		case 'login':
			url = await kindeAuthClient.login(request as unknown as SessionManager, options);
			break;
		case 'register':
			url = await kindeAuthClient.register(request as unknown as SessionManager, options);
			break;
		case 'create_org':
			url = await kindeAuthClient.createOrg(request as unknown as SessionManager, options);
			break;
		case 'kinde_callback':
			await kindeAuthClient.handleRedirectToApp(
				request as unknown as SessionManager,
				new URL(request.url)
			);
			throw redirect(302, kindeConfiguration.loginRedirectURL ?? '/');
		case 'logout':
			url = await kindeAuthClient.logout(request as unknown as SessionManager);
			break;
		default:
			throw error(404, 'Not Found');
	}
	throw redirect(302, url.toString());
}
