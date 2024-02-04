import {kindeAuthClient} from '$lib/KindeSDK.js';
import {kindeConfiguration} from '$lib/index.js';
import {sessionStorage} from '$lib/sessionStorage/sessionStorage.js';
import {parseSearchParamsToObject} from '$lib/utils/index.js';
import type {SessionManager} from '@kinde-oss/kinde-typescript-sdk';
import {error, redirect, type RequestEvent} from '@sveltejs/kit';

const KEY_POST_REDIRECT_URL = 'post-redirect-url';

export async function handleAuth({
	request,
	params,
	url: originURL
}: RequestEvent): Promise<Response> {
	const options = parseSearchParamsToObject(originURL.search);
	let url: URL | null = null;
	switch (params.kindeAuth) {
		case 'login':
			storePostRedirectUrl(options);
			url = await kindeAuthClient.login(request as unknown as SessionManager, options);
			break;
		case 'register':
			storePostRedirectUrl(options);
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
			redirectToPostUrl();
			throw redirect(302, kindeConfiguration.loginRedirectURL ?? '/');
		case 'logout':
			url = await kindeAuthClient.logout(request as unknown as SessionManager);
			break;
		default:
			throw error(404, 'Not Found');
	}
	throw redirect(302, url.toString());
}

const storePostRedirectUrl = (options: Record<string, string | number>) => {
	if (options.post_redirect_url && typeof options.post_redirect_url == 'string') {
		sessionStorage.setSessionItem(KEY_POST_REDIRECT_URL, options.post_redirect_url);
	}
};

const redirectToPostUrl = () => {
	if (sessionStorage.getSessionItem(KEY_POST_REDIRECT_URL)) {
		const post_redirect_url = sessionStorage.getSessionItem(KEY_POST_REDIRECT_URL);
		sessionStorage.removeSessionItem(KEY_POST_REDIRECT_URL);
		throw redirect(302, kindeConfiguration.appBase + post_redirect_url);
	}
};
