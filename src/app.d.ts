import { sessionStorage } from '$lib/sessionStorage/index.js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace KindeSDK {
		let SessionStorage: typeof sessionStorage;
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
