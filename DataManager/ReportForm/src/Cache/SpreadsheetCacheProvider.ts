import { CacheProvider } from "./CacheProvider";
import { SpreadsheetWorksheetHandler } from "../Spreadsheet/SpreadsheetRegistry";

export class SpreadsheetCacheProvider implements CacheProvider {
    public constructor(private readonly _worksheetHandler: SpreadsheetWorksheetHandler) { }

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

    private _intermediateCache: Record<string, string> = null;
    private _keyToIndexMap: Record<string, number> = {};
    private _keys: string[] = [];
    private _putKeyRequests: Set<string> = new Set<string>();
    private _poolPut = false;
    private readIntermediateCache(): void {
        if (this._intermediateCache) {
            return;
        }
        const rawDatas = this._worksheetHandler.sheet.getDataRange().getValues();
        for (const row of rawDatas) {
            const key = row[0] as string;
            let value = '';
            for (let i = 1; i < row.length; i++) {
                value += row[i] as string;
            }
            this._intermediateCache[key] = value;
            this._keyToIndexMap[key] = this._keys.push(key) - 1;
        }
    }

    private getIntermediateCache(key: string): string {
        this.readIntermediateCache();
        return this._intermediateCache[key];
    }
    private putIntermediateCache(key: string, value: string): void {
        this.readIntermediateCache();
        this._intermediateCache[key] = value;
        if (this._poolPut) {
            this._putKeyRequests.add(key);
        }
        else {
            let tmpValue = value || "";
            const values: string[] = [key];
            while (tmpValue.length > 0) {
                values.push(tmpValue.substr(0, 49500));
                tmpValue = tmpValue.slice(49500);
            }
            if (!(key in this._keyToIndexMap)) {
                this._keyToIndexMap[key] = this._keys.push(key) - 1;
            }
            const index = this._keyToIndexMap[key];
            this._worksheetHandler.sheet.getRange(index, 1, 1, values.length).setValues([values]);
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
        // 書き換える行の範囲を決める
        let minIndex = -1;
        let maxIndex = -1;
        this._putKeyRequests.forEach(key => {
            if (!(key in this._keyToIndexMap)) {
                this._keyToIndexMap[key] = this._keys.push(key) - 1;
            }
            const index = this._keyToIndexMap[key];
            if (minIndex === -1 || index < minIndex) {
                minIndex = index;
            }
            if (maxIndex === -1 || index > maxIndex) {
                maxIndex = index;
            }
        });
        // 最大カラム数を算出する
        let maxLength = 0;
        for (let i = minIndex; i <= maxIndex; i++) {
            maxLength = Math.max(this._intermediateCache[this._keys[i]].length, maxLength);
        }
        const columnLength = Math.floor(maxLength / 49500) + 1;
        // 書き込む用のデータに変換する
        const values: string[][] = [];
        for (let i = minIndex; i <= maxIndex; i++) {
            const key = this._keys[i];
            const row: string[] = [key];
            let tmpValue = this._intermediateCache[key];
            while (tmpValue.length > 0) {
                row.push(tmpValue.substr(0, 49500));
                tmpValue = tmpValue.slice(49500);
            }
            while (row.length < columnLength) {
                row.push('');
            }
            values.push(row);
        }
        // 書き込む
        this._worksheetHandler.sheet.getRange(minIndex, maxIndex, values.length, columnLength).setValues(values);
        this._putKeyRequests.clear();
    }
}
