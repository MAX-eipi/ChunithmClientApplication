import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";
import { GoogleFormReport } from "./GoogleFormReport";
import { Report, ReportStatus } from "./Report";

export class ReportSheet {
    private _musicDataTable: MusicDataTable = null;
    private _sheet: GoogleAppsScript.Spreadsheet.Sheet = null;
    private _reports: Report[] = [];
    private _reportIndexMap: { [key: string]: number } = {};

    public constructor(table: MusicDataTable, spreadsheetId: string, worksheetName: string) {
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        let sheet = spreadsheet.getSheetByName(worksheetName);
        if (!sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        this._musicDataTable = table;
        this._sheet = sheet;
        this.readReports();
    }

    private readReports(): void {
        this._reports.length = 0;
        this._reportIndexMap = {};
        let rawReports = this._sheet.getDataRange().getValues();
        for (var i = 1; i < rawReports.length; i++) {
            let report = Report.createByRow(rawReports[i]);
            let index = this._reports.push(report) - 1;
            this._reportIndexMap[report.reportId.toString()] = index;
        }
    }

    public get reports(): Report[] {
        return this._reports;
    }

    public getReport(reportId: number): Report {
        if (!(reportId.toString() in this._reportIndexMap)) {
            return null;
        }
        return this.reports[this._reportIndexMap[reportId.toString()]];
    }

    public insertReport(googleFormReport: GoogleFormReport, reportStatus: ReportStatus = ReportStatus.InProgress): Report {
        let target = this._musicDataTable.getMusicDataByName(googleFormReport.musicName);
        if (!target) {
            throw new Error(`music not found. (${googleFormReport.musicName})`);
        }

        let reportId = this.reports[this.reports.length - 1].reportId + 1;
        let report = Report.createByGoogleFormReport(
            reportId,
            target.Id,
            googleFormReport,
            reportStatus
        );
        let index = this._reports.push(report) - 1;
        this._reportIndexMap[reportId.toString()] = index;

        let row = this.reports.length + 1;
        let rawReport = report.toRawData();
        this._sheet.getRange(row, 1, 1, rawReport.length).setValues([rawReport]);
        return report;
    }

    public updateStatus(updateList: { reportId: number, status: ReportStatus }[]): void {
        let table = this._sheet.getDataRange().getValues();
        for (let target of updateList) {
            for (var i = 1; i < table.length; i++) {
                let reportId = parseInt(table[i][0]);
                if (reportId == target.reportId) {
                    this._sheet.getRange(i + 1, 10).setValue(target.status);
                }
            }
        }
    }
}