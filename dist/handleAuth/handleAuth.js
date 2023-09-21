import { kindeAuthClient } from '../KindeSDK.js';
import { kindeConfiguration } from '../index.js';
import { error, redirect } from '@sveltejs/kit';
export async function handleAuth({ request, params }) {
    let url = null;
    switch (params.kindeAuth) {
        case 'login':
            url = await kindeAuthClient.login(request);
            break;
        case 'register':
            url = await kindeAuthClient.register(request);
            break;
        case 'create_org':
            url = await kindeAuthClient.createOrg(request);
            break;
        case 'kinde_callback':
            await kindeAuthClient.handleRedirectToApp(request, new URL(request.url));
            throw redirect(302, kindeConfiguration.loginRedirectURL ?? '/');
        case 'logout':
            url = kindeAuthClient.logout(request);
            break;
        default:
            throw error(404, 'Not Found');
    }
    throw redirect(302, url.toString());
}
