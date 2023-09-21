import { sessionStorage } from '../sessionStorage/index.js'

declare global {
    const SessionStorage: typeof sessionStorage;
}

export {};
