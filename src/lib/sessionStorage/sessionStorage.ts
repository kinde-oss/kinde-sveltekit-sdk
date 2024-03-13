import type {SessionManager} from '@kinde-oss/kinde-typescript-sdk';

class SessionStorage {
	private session: Record<string, string>;

	constructor() {
		this.session = {};
	}

	getSessionItem(itemKey: string) {
		try {
			const item = JSON.parse(this.session[itemKey]);
			return item;
		} catch (error) {
			return this.session[itemKey];
		}
	}

	setSessionItem(itemKey: string, itemValue: unknown) {
		this.session[itemKey] =
			typeof itemValue === 'string' ? itemValue : (JSON.stringify(itemValue) as string);
	}

	removeSessionItem(itemKey: string) {
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
export const sessionStorage = globalThis.KindeSDK.SessionStorage as SessionManager;
