export function toError(err: unknown): Error {
    return err instanceof Error ? err : new Error(String(err));
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
