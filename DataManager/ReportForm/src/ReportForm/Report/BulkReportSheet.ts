import { BulkReport } from "./BulkReport";
import { GoogleFormBulkReport } from "./GoogleFormBulkReport";
import { ReportStatus } from "./Report";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";

export class BulkReportSheet {
    private _musicDataTable: MusicDataTable = null;
    private _sheet: GoogleAppsScript.Spreadsheet.Sheet = null;
    private _bulkReports: BulkReport[] = [];
    private _bulkReportIndexMap: { [key: string]: number } = {};

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
        this.readBulkReports();
    }

    private readBulkReports(): void {
        this._bulkReports.length = 0;
        this._bulkReportIndexMap = {};
        let rawBulkReports = this._sheet.getDataRange().getValues();
        for (var i = 1; i < rawBulkReports.length; i++) {
            let report = BulkReport.createByRow(rawBulkReports[i]);
            let index = this._bulkReports.push(report) - 1;
            this._bulkReportIndexMap[report.reportId.toString()] = index;
        }
    }

    public get bulkReports(): BulkReport[] {
        return this._bulkReports;
    }

    public getBulkReport(reportId: number): BulkReport {
        if (!(reportId.toString() in this._bulkReportIndexMap)) {
            return null;
        }
        return this.bulkReports[this._bulkReportIndexMap[reportId.toString()]];
    }

    public insertBulkReport(googleFormBulkReport: GoogleFormBulkReport, reportStatus: ReportStatus = ReportStatus.InProgress): BulkReport {
        let reportId = this.bulkReports.length > 0
            ? this.bulkReports[this.bulkReports.length - 1].reportId + 1
            : 1;
        let report = BulkReport.createByGoogleFormBulkReport(
            reportId,
            googleFormBulkReport,
            this._musicDataTable.getTargetLevelMusicCount(googleFormBulkReport.targetLevel),
            new Date(),
            reportStatus);
        let index = this._bulkReports.push(report) - 1;
        this._bulkReportIndexMap[reportId.toString()] = index;

        let row = this.bulkReports.length + 1;
        let rawReport = report.toRawData();
        this._sheet.getRange(row, 1, 1, rawReport.length).setValues([rawReport]);
        return report;
    }
}