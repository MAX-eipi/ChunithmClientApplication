import * as DataManager from "../DataManager";
import { Report, ReportStatus } from "./Report";

export class ReportManager {
    private sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private currentRow: number;

    private rawReports: Object[][] = null;
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

    public createReport(formResponse: GoogleAppsScript.Forms.FormResponse, musicDataTable: DataManager.MusicDataTable): Report {
        let itemResponses = formResponse.getItemResponses();
        let musicName = ReportManager.convertMusicName(itemResponses[1].getResponse().toString());
        let difficulty = itemResponses[2].getResponse().toString();
        let beforeOp = parseFloat(itemResponses[3].getResponse().toString());
        let afterOp = parseFloat(itemResponses[4].getResponse().toString());
        let score = parseInt(itemResponses[5].getResponse().toString());
        let comboStatus = itemResponses[6].getResponse().toString();

        var imagePaths = [];
        if (itemResponses[7]) {
            let responseImagePaths = itemResponses[7].getResponse().toString();
            if (responseImagePaths) {
                imagePaths = responseImagePaths.split(",");
            }
        }

        let targetMusicData = musicDataTable.getMusicDataByName(musicName);
        if (targetMusicData == null) {
            return null;
        }

        let report = new Report(
            Report.UNASSIGNED_REPORT_ID,
            targetMusicData.Id,
            musicName,
            difficulty,
            beforeOp,
            afterOp,
            score,
            comboStatus,
            imagePaths,
            ReportStatus.InProgress);
        return report;
    }

    public insertReport(report: Report) {
        if (this.currentRow < 0) {
            this.currentRow = this.sheet.getLastRow() + 1;
        }
        let reportId = this.currentRow - 1;
        report.reportId = reportId.toString();
        let rawReport = report.toRawData();
        this.sheet.getRange(this.currentRow, 1, 1, rawReport.length).setValues([rawReport]);
        this.currentRow++;
    }

    private static convertMusicName(musicName: string): string {
        let nameMap = {
            "チルノのパーフェクトさんすう教室 ⑨周年バージョン": "チルノのパーフェクトさんすう教室　⑨周年バージョン",
            "ってゐ！ ～えいえんてゐVer～": "ってゐ！　～えいえんてゐVer～",
            "少女幻葬戦慄曲 ～ Necro Fantasia": "少女幻葬戦慄曲　～　Necro Fantasia",
            "キュアリアス光吉古牌 －祭－": "キュアリアス光吉古牌　－祭－",
            "セイクリッド ルイン": "セイクリッド　ルイン",
            "オーケー？ オーライ！": "オーケー？　オーライ！",
            "ここで一席！ Oshama Scramble!": "ここで一席！　Oshama Scramble!",
            "札付きのワル ～マイケルのうた～": "札付きのワル　～マイケルのうた～",
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
        this.reports = this.getRawReports(cached).map(function (r) { return Report.createByRow(r); });
        this.reportMap = null;
        return this.reports;
    }

    public approve(reportId: string): void {
        let targetReport = this.getReport(reportId, false);
        let duplicatedReports = this.getReports().filter(function (r) {
            return r.getReportId() != targetReport.getReportId()
                && r.getMusicId() == targetReport.getMusicId()
                && r.getDifficulty() == targetReport.getDifficulty();
        });

        this.updateStatus(reportId, ReportStatus.Resolved);
        for (var i = 0; i < duplicatedReports.length; i++) {
            let report = duplicatedReports[i];
            this.updateStatus(report.getReportId(), ReportStatus.Rejected);
        }

        this.clearCache();
    }

    public reject(reportId: string): void {
        if (this.updateStatus(reportId, ReportStatus.Rejected, false)) {
            this.clearCache();
        }
    }

    private updateStatus(reportId: string, reportStatus: ReportStatus, cached: boolean = true): boolean {
        let rawReports = this.getRawReports(cached);
        for (var i = 0; i < rawReports.length; i++) {
            let row = rawReports[i];
            if (row[0] == reportId) {
                this.sheet.getRange(i + 1, 10, 1, 1).setValues([[reportStatus]]);
                return true;
            }
        }
        return false;
    }

    private getRawReports(cached: boolean = true): Object[][] {
        if (cached && this.rawReports) {
            return this.rawReports;
        }
        this.rawReports = this.sheet.getDataRange().getValues();
        return this.rawReports;
    }

    private clearCache(): void {
        this.rawReports = null;
        this.reports = null;
        this.reportMap = null;
    }
}
