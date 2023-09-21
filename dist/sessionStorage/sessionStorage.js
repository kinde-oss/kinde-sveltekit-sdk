class SessionStorage {
    session;
    constructor() {
        this.session = {};
    }
    getSessionItem(itemKey) {
        try {
            const item = JSON.parse(this.session[itemKey]);
            return item;
        }
        catch (error) {
            return this.session[itemKey];
        }
    }
    setSessionItem(itemKey, itemValue) {
        this.session[itemKey] = typeof itemValue === 'string' ? itemValue : JSON.stringify(itemValue);
    }
    removeSessionItem(itemKey) {
        delete this.session[itemKey];
    }
    destroySession() {
        this.session = {};
    }
}
globalThis.KindeSDK = {
    ...(globalThis.KindeSDK ?? {}),
    SessionStorage: (globalThis.KindeSDK ?? {}).SessionStorage ?? new SessionStorage()
};
export const sessionStorage = globalThis.KindeSDK.SessionStorage;
