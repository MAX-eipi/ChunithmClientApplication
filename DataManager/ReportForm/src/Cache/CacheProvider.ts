export interface CacheProvider {
    get<T>(key: string): T;
    put<T>(key: string, value: T): void;
    syncServer(): void;
    async: boolean;
}
