import { Configuration } from "./Configuration";

export class SpreadsheetConfiguration implements Configuration {
    private _properties: { [key: string]: any } = {};
    public constructor(configSheet: GoogleAppsScript.Spreadsheet.Sheet) {
        this.readProperties(configSheet);
    }

    private readProperties(configSheet: GoogleAppsScript.Spreadsheet.Sheet): void {
        this._properties = {};
        let datas = configSheet.getDataRange().getValues();
        for (var i = 1; i < datas.length; i++) {
            let data = datas[i];
            let key = data[0];
            let value = data[1];
            this._properties[key] = value;
        }
    }

    public get properties(): { [key: string]: any } {
        return this._properties;
    }

    public hasProperty(key: string): boolean {
        return key in this._properties;
    }

    public getProperty<T>(key: string, defaultValue: T = null): T {
        if (!this.hasProperty(key)) {
            return defaultValue;
        }
        return this._properties[key] as T;
    }
}