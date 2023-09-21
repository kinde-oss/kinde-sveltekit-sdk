// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
	KINDE_AUDIENCE,
	KINDE_CLIENT_ID,
	KINDE_CLIENT_SECRET,
	KINDE_ISSUER_URL,
	KINDE_POST_LOGIN_REDIRECT_URL,
	KINDE_POST_LOGOUT_REDIRECT_URL,
	KINDE_REDIRECT_URL,
	KINDE_SCOPE
} from '$env/static/private';

export const kindeConfiguration = {
	authDomain: KINDE_ISSUER_URL,
	clientId: KINDE_CLIENT_ID,
	logoutRedirectURL: KINDE_POST_LOGOUT_REDIRECT_URL,
	redirectURL: KINDE_REDIRECT_URL,
	audience: KINDE_AUDIENCE,
	scope: KINDE_SCOPE,
	clientSecret: KINDE_CLIENT_SECRET,
	loginRedirectURL: KINDE_POST_LOGIN_REDIRECT_URL
};
