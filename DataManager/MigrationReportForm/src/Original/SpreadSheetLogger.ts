
export class SpreadSheetLogger {
    private logSheet: GoogleAppsScript.Spreadsheet.Sheet;
    private currentLogRow: number;

    private errorLogSheet: GoogleAppsScript.Spreadsheet.Sheet;
    private currentErrorLogRow: number;

    public constructor(logSheetId: string, logSheetName: string, errorLogSheetId: string, errorLogSheetName: string) {
        this.logSheet = SpreadsheetApp.openById(logSheetId).getSheetByName(logSheetName);
        this.currentLogRow = this.logSheet.getLastRow();

        this.errorLogSheet = SpreadsheetApp.openById(errorLogSheetId).getSheetByName(errorLogSheetName);
        this.currentErrorLogRow = this.errorLogSheet.getLastRow();
    }

    public log(message: string[]): void {
        message = [new Date().toString()].concat(message);
        this.logSheet.getRange(this.currentLogRow + 1, 1, 1, message.length).setValues([message]);
        this.currentLogRow++;
    }

    public logError(message: string[]): void {
        message = [new Date().toString()].concat(message);
        this.errorLogSheet.getRange(this.currentErrorLogRow + 1, 1, 1, message.length).setValues([message]);
        this.currentErrorLogRow++;
    }
} 