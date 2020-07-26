import { ConfigurationObject } from "./ConfigurationObject";

export class SpreadsheetConfiguration extends ConfigurationObject {
    public constructor(configSheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(SpreadsheetConfiguration.readProperties(configSheet));
    }

    private static readProperties(configSheet: GoogleAppsScript.Spreadsheet.Sheet): any {
        const properties = {};
        const datas = configSheet.getDataRange().getValues();
        for (let i = 1; i < datas.length; i++) {
            const data = datas[i];
            const key = data[0];
            const value = data[1];
            properties[key] = value;
        }
        return properties;
    }

    public get properties(): Record<string, any> {
        return this._configurationObject;
    }
}
