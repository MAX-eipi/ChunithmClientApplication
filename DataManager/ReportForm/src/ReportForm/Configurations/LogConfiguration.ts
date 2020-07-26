import { ReportFormConfiguration } from "./@ReportFormConfiguration";

export class LogConfiguration extends ReportFormConfiguration {
    public get logSpreadSheetId(): string { return this.global.logSpreadSheetId; }
    public get logWorkSheetName(): string { return this.global.logWorkSheetName; }

    public get errorLogSpreadSheetId(): string { return this.global.errorLogSpreadSheetId; }
    public get errorLogWorkSheetName(): string { return this.global.errorLogWorkSheetName; }
}
