export declare const pick: (target: Record<string, unknown>, path: string[]) => Record<string, unknown>;
export declare const omit: (target: Record<string, unknown>, path: string[]) => {
    [x: string]: unknown;
};
