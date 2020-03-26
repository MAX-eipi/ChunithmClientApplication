import { ReportFormModule } from "./@ReportFormModule";

export interface WebhookParameter {
    parameters: { key: string, value: string }[];
}

export class WebhookModule extends ReportFormModule {

    private _settings: WebhookSettings;
    public get settings(): WebhookSettings {
        return this._settings;
    }
    public set settings(value: WebhookSettings) {
        this._settings = value;
    }

    public invoke(eventName: string, parameter?: WebhookParameter): void {
        if (!this.settings) {
            return;
        }
        let targets: string[] = [];
        for (var callback of this.settings.getCallbacks(eventName)) {
            targets.push(this.replaceParameter(callback, parameter));
        }
        UrlFetchApp.fetchAll(targets);
    }

    private replaceParameter(callback: string, parameter: WebhookParameter): string {
        if (parameter) {
            for (let param of parameter.parameters) {
                callback = callback.replace(param.key, param.value);
            }
        }
        return callback;
    }
}

export class WebhookSettings {
    public static readBySheet(spreadsheetId: string, worksheetName: string): WebhookSettings {
        let sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName);
        if (!sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        let datas = sheet.getDataRange().getValues();
        let settings: { eventName: string, callback: string }[] = [];
        for (var i = 1; i < datas.length; i++) {
            settings.push({
                eventName: datas[i][0],
                callback: datas[i][1],
            });
        }
        return new WebhookSettings(settings);
    }

    public constructor(settingsList: { eventName: string, callback: string }[]) {
        for (let settings of settingsList) {
            if (!(settings.eventName in this._callbackMap)) {
                this._callbackMap[settings.eventName] = [];
            }
            this._callbackMap[settings.eventName].push(settings.callback);
        }
    }

    private _callbackMap: { [eventName: string]: string[] } = {};

    public getCallbacks(eventName: string): string[] {
        if (!(eventName in this._callbackMap)) {
            return [];
        }
        return this._callbackMap[eventName];
    }
}