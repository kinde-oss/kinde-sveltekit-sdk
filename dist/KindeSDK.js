import { kindeConfiguration } from './config/index.js';
import { sessionStorage } from './sessionStorage/index.js';
import pkg, {} from '@kinde-oss/kinde-typescript-sdk';
import { omit } from './utils/index.js';
const { createKindeServerClient, GrantType, } = pkg;
export const kindeAuthClient = createKindeServerClient(GrantType.PKCE, kindeConfiguration);
export const getHeaders = async () => {
    const kindeManagementApi = createKindeServerClient(GrantType.CLIENT_CREDENTIALS, omit(kindeConfiguration, ['logoutRedirectURL', 'loginRedirectURL', 'scope', 'redirectURL']));
    const token = await kindeManagementApi.getToken(sessionStorage);
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };
};
