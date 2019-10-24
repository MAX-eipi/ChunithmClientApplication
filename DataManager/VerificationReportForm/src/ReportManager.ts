import * as DataManager from "../DataManager";
import { Report, ReportError, ReportStatus } from "./Report";

export class ReportManager {
    private sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private currentRow: number;

    private reports: Report[] = null;
    private reportMap: { [reportId: string]: Report } = null;

    public constructor(musicDataTable: DataManager.MusicDataTable, reportSpreadSheetId: string) {
        this.sheet = ReportManager.getReportSheet(reportSpreadSheetId, "Response");
        this.currentRow = -1;
    }

    private static getReportSheet(reportSpreadSheetId: string, reportSheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
        let spreadsheet = SpreadsheetApp.openById(reportSpreadSheetId);
        if (!spreadsheet) {
            return null;
        }
        let sheet = spreadsheet.getSheetByName(reportSheetName);
        if (!sheet) {
            return null;
        }
        return sheet;
    }

    public insertReport(formResponse: GoogleAppsScript.Forms.FormResponse, musicDataTable: DataManager.MusicDataTable): Report {
        let itemResponses = formResponse.getItemResponses();
        let musicName = ReportManager.convertMusicName(itemResponses[1].getResponse().toString());
        let difficulty = itemResponses[2].getResponse().toString();
        let beforeOp = parseFloat(itemResponses[3].getResponse().toString());
        let afterOp = parseFloat(itemResponses[4].getResponse().toString());
        let score = parseInt(itemResponses[5].getResponse().toString());
        let comboStatus = itemResponses[6].getResponse().toString();
        let targetMusicData = musicDataTable.getMusicDataByName(musicName);
        if (targetMusicData == null) {
            throw new ReportError(`楽曲情報取得の失敗. 楽曲名:${musicName}`);
        }
        if (this.currentRow < 0) {
            this.currentRow = this.sheet.getLastRow() + 1;
        }
        let reportId = this.currentRow - 1;
        let imagePaths = [];
        if (itemResponses[7]) {
            let responseImagePaths = itemResponses[7].getResponse().toString();
            if (responseImagePaths) {
                imagePaths = responseImagePaths.split(",");
            }
        }
        let report = new Report(reportId.toString(), targetMusicData.Id, musicName, difficulty, beforeOp, afterOp, score, comboStatus, imagePaths, ReportStatus.InProgress);
        let rawReport = report.toRawData();
        this.sheet.getRange(this.currentRow, 1, 1, rawReport.length).setValues([rawReport]);
        this.currentRow++;
        return report;
    }

    private static convertMusicName(musicName: string): string {
        let nameMap = {
            "セイクリッド ルイン": "セイクリッド　ルイン"
        };
        for (var key in nameMap) {
            if (musicName == key) {
                return nameMap[key];
            }
        }
        return musicName;
    }

    public getReport(reportId: string, cached: boolean = true): Report {
        if (cached && this.reportMap) {
            return this.reportMap[reportId] || null;
        }
        let reports = this.getReports(cached);
        this.reportMap = {};
        for (var i = 0; i < reports.length; i++) {
            let report = reports[i];
            this.reportMap[report.getReportId()] = report;
        }
        return this.reportMap[reportId] || null;
    }

    public getReports(cached: boolean = true): Report[] {
        if (cached && this.reports) {
            return this.reports;
        }
        let rawReports = this.sheet.getDataRange().getValues().slice(1);
        this.reports = rawReports.map(function (r) { return Report.createByRow(r); });
        this.reportMap = null;
        return this.reports;
    }

    public updateStatus(reportId: string, reportStatus: ReportStatus): void {
        let rawReports = this.sheet.getDataRange().getValues();
        for (var i = 0; i < rawReports.length; i++) {
            let row = rawReports[i];
            if (row[0] == reportId) {
                this.sheet.getRange(i + 1, 10, 1, 1).setValues([[reportStatus]]);
                break;
            }
        }
    }
}
