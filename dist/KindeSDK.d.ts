import pkg from '@kinde-oss/kinde-typescript-sdk';
export declare const kindeAuthClient: {
    handleRedirectToApp: (sessionManager: pkg.SessionManager, callbackURL: URL) => Promise<void>;
    isAuthenticated: (sessionManager: pkg.SessionManager) => Promise<boolean>;
    getUserProfile: (sessionManager: pkg.SessionManager) => Promise<pkg.UserType>;
    createOrg: (sessionManager: pkg.SessionManager, options?: pkg.RegisterURLOptions | undefined) => Promise<URL>;
    getToken: (sessionManager: pkg.SessionManager) => Promise<string>;
    register: (sessionManager: pkg.SessionManager, options?: pkg.RegisterURLOptions | undefined) => Promise<URL>;
    getUser: (sessionManager: pkg.SessionManager) => Promise<pkg.UserType>;
    logout: (sessionManager: pkg.SessionManager) => URL;
    login: (sessionManager: pkg.SessionManager, options?: pkg.RegisterURLOptions | undefined) => Promise<URL>;
    getClaimValue: (sessionManager: pkg.SessionManager, claim: string, type?: pkg.ClaimTokenType | undefined) => unknown;
    getClaim: (sessionManager: pkg.SessionManager, claim: string, type?: pkg.ClaimTokenType | undefined) => {
        name: string;
        value: unknown;
    };
    getPermission: (sessionManager: pkg.SessionManager, name: string) => {
        orgCode: string | null;
        isGranted: boolean;
    };
    getOrganization: (sessionManager: pkg.SessionManager) => {
        orgCode: string | null;
    };
    getPermissions: (sessionManager: pkg.SessionManager) => {
        permissions: string[];
        orgCode: string | null;
    };
    getUserOrganizations: (sessionManager: pkg.SessionManager) => {
        orgCodes: string[];
    };
    getFlag: (sessionManager: pkg.SessionManager, code: string, defaultValue?: string | number | boolean | undefined, type?: keyof pkg.FlagType | undefined) => pkg.GetFlagType;
    getIntegerFlag: (sessionManager: pkg.SessionManager, code: string, defaultValue?: number | undefined) => number;
    getStringFlag: (sessionManager: pkg.SessionManager, code: string, defaultValue?: string | undefined) => string;
    getBooleanFlag: (sessionManager: pkg.SessionManager, code: string, defaultValue?: boolean | undefined) => boolean;
};
export declare const getHeaders: () => Promise<{
    Authorization: string;
    Accept: string;
}>;
