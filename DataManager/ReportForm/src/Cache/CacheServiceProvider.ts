import { CacheProvider } from "./CacheProvider";

export class CacheServiceProvider implements CacheProvider {
    private _cache: GoogleAppsScript.Cache.Cache = null;
    private getCache(): GoogleAppsScript.Cache.Cache {
        if (!this._cache) {
            this._cache = CacheService.getScriptCache();
        }
        return this._cache;
    }

    public get<T>(key: string): T {
        const value = this.getIntermediateCache(key);
        if (!value) {
            return null;
        }
        return JSON.parse(value) as T;
    }

    public put<T>(key: string, value: T): void {
        this.putIntermediateCache(key, JSON.stringify(value));
    }

    private _intermediateCache: Record<string, string> = {};
    private _putKeyRequests: Set<string> = new Set<string>();
    private _poolPut = false;
    private getIntermediateCache(key: string): string {
        if (key in this._intermediateCache) {
            return this._intermediateCache[key];
        }
        this._intermediateCache[key] = this.getCache().get(key);
        return this._intermediateCache[key];
    }
    private putIntermediateCache(key: string, value: string): void {
        this._intermediateCache[key] = value;
        if (this._poolPut) {
            this._putKeyRequests.add(key);
        }
        else {
            this.getCache().put(key, value);
        }
    }

    public get async(): boolean {
        return this._poolPut;
    }
    public set async(next: boolean) {
        if (this._poolPut === next) {
            return;
        }
        // async -> syncにするときに既に溜まっているリクエストを処理する
        const current = this._poolPut;
        this._poolPut = next;
        if (current && !next) {
            this.syncServer();
        }
    }

    public syncServer(): void {
        if (this._putKeyRequests.size === 0) {
            return;
        }
        const values: Record<string, string> = {};
        this._putKeyRequests.forEach(key => {
            values[key] = this._intermediateCache[key];
        });
        this.getCache().putAll(values);
        this._putKeyRequests.clear();
    }
}
