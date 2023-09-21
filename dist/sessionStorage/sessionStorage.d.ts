declare class SessionStorage {
    private session;
    constructor();
    getSessionItem(itemKey: string): any;
    setSessionItem(itemKey: string, itemValue: unknown): void;
    removeSessionItem(itemKey: string): void;
    destroySession(): void;
}
export declare const sessionStorage: SessionStorage;
export {};
