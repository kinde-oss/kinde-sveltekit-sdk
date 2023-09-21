import { kindeAuthClient } from '$lib/KindeSDK.js';
import type { SessionManager } from '@kinde-oss/kinde-typescript-sdk';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ request }: RequestEvent) {
	const isAuthentication = await kindeAuthClient.isAuthenticated(
		request as unknown as SessionManager
	);

    if (isAuthentication) {
        const userProfile = await kindeAuthClient.getUser(request as unknown as SessionManager);
        
        const userOrganizations = kindeAuthClient.getUserOrganizations(
            request as unknown as SessionManager
        );
        const permission = kindeAuthClient.getPermission(
            request as unknown as SessionManager,
            'read:profile'
        );
        const permissions = kindeAuthClient.getPermissions(request as unknown as SessionManager);
        const aud = kindeAuthClient.getClaim(request as unknown as SessionManager, 'aud');
        const theme = kindeAuthClient.getStringFlag(request as unknown as SessionManager, 'theme');
        const enable_dark_theme = kindeAuthClient.getBooleanFlag(
            request as unknown as SessionManager,
            'enable_dark_theme'
        );
        const user_limit = kindeAuthClient.getIntegerFlag(
            request as unknown as SessionManager,
            'user_limit'
        );
    
        console.log({
            isAuthentication,
            userProfile,
            userOrganizations,
            permission,
            permissions,
            aud,
            theme,
            enable_dark_theme,
            user_limit
        });
    }
    
	return {
		isAuthentication
	};
}
