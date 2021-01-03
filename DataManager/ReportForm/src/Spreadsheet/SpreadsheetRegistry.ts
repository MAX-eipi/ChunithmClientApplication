export class SpreadsheetWorksheetHandler {
    public constructor(public readonly sheet: GoogleAppsScript.Spreadsheet.Sheet) { }
}

export class SpreadsheetWorksheetRegistry {
    public constructor(public readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) { }

    private readonly _handlerTable: Record<string, SpreadsheetWorksheetHandler> = {};
    public getSheetByName(sheetName: string): SpreadsheetWorksheetHandler {
        if (sheetName in this._handlerTable) {
            return this._handlerTable[sheetName];
        }
        const sheet = this.spreadsheet.getSheetByName(sheetName);
        const handler = new SpreadsheetWorksheetHandler(sheet);
        this._handlerTable[sheetName] = handler;
        return handler;
    }
}

export class SpreadsheetHandler {
    public readonly workSheetRegistry: SpreadsheetWorksheetRegistry;
    public constructor(public readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
        this.workSheetRegistry = new SpreadsheetWorksheetRegistry(spreadsheet);
    }
}

export class SpreadsheetRegistry {
    private static _instance: SpreadsheetRegistry = null;
    public static instance(): SpreadsheetRegistry {
        if (!this._instance) {
            this._instance = new SpreadsheetRegistry();
        }
        return this._instance;
    }

    private readonly _handlerTable: Record<string, SpreadsheetHandler> = {};
    private readonly _urlToIdMap: Record<string, string> = {};
    public getById(id: string): SpreadsheetHandler {
        if (id in this._handlerTable) {
            return this._handlerTable[id];
        }
        const spreadsheet = SpreadsheetApp.openById(id);
        const handler = new SpreadsheetHandler(spreadsheet);
        this._handlerTable[id] = handler;
        return this._handlerTable[id];
    }

    public getByUrl(url: string): SpreadsheetHandler {
        if (url in this._urlToIdMap) {
            return this.getById(this._urlToIdMap[url]);
        }
        const spreadsheet = SpreadsheetApp.openByUrl(url);
        const handler = new SpreadsheetHandler(spreadsheet);
        const id = spreadsheet.getId();
        this._urlToIdMap[url] = id;
        this._handlerTable[id] = handler;
        return handler;
    }
}
