import * as DataManager from "../../DataManager";
import { VersionConfiguration } from "../Configuration";
import { Report } from "../Report";
import { ReportGroup } from "../ReportGroup";
import { ReportManager } from "../ReportManager";
import { DataManagerOperator } from "./DataManagerOperator";
import { Operator } from "./Operator";
import { Utility } from "../Utility";

export class ReportPostResult {
    private _report: Report = null;
    public get report(): Report {
        return this._report;
    }

    private _errorMessage: string = "";
    public get errorMessage(): string {
        return this._errorMessage;
    }

    public constructor(report: Report, errorMessage: string = "") {
        this._report = report;
        this._errorMessage = errorMessage;
    }
}

export class ReportOperator {
    private static reportManager: ReportManager = null;
    private static reportGroupMap: { [groupId: string]: ReportGroup } = null;
    private static reportGroups: ReportGroup[] = null;

    public static readonly REASON_NONE: number = 0;
    public static readonly REASON_DUPLICATED: number = 0;
    public static readonly REASON_INVALID_OP_DIFF: number = 0;

    public static reset(versionName: string): void {
        this.reportManager = null;
        this.reportGroupMap = null;
        this.reportGroups = null;
    }

    private static getReportManager(): ReportManager {
        if (this.reportManager) {
            return this.reportManager;
        }

        let musicDataTable: DataManager.MusicDataTable = DataManagerOperator.getTable();
        let versionConfig: VersionConfiguration = Operator.getTargetVersionConfiguration();
        if (!musicDataTable || !versionConfig) {
            let params = {
                musicDataTable: musicDataTable ? "DataManager.MusicDataTable" : null,
                versionConfig: versionConfig ? "VersionConfiguration" : null,
            };
            let message = "Either musicDataTable or versionConfig is an invalid value.\n"
                + JSON.stringify(params);
            throw new Error(message);
        }

        let reportSpreadSheetId = versionConfig.getProperty<string>("report_sheet_id", "");
        if (!reportSpreadSheetId) {
            throw new Error("ReportManager instantiation failed. report_sheet_id is not set.");
        }

        this.reportManager = new ReportManager(musicDataTable, reportSpreadSheetId);
        return this.reportManager;
    }

    private static getReportGroupMap(): { [groupId: string]: ReportGroup } {
        if (this.reportGroupMap) {
            return this.reportGroupMap;
        }

        let versionConfig: VersionConfiguration = Operator.getTargetVersionConfiguration();
        if (!versionConfig) {
            throw new Error("versionConfig is invalid value.");
        }

        this.reportGroupMap = ReportGroup.instantiateMapByConfiguration(versionConfig);
        let reports = this.getReports();
        for (let groupId in this.reportGroupMap) {
            this.reportGroupMap[groupId].setReports(reports);
        }
        return this.reportGroupMap;
    }

    public static getReport(reportId: string): Report {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return null;
        }
        return reportManager.getReport(reportId);
    }

    public static getReports(): Report[] {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return [];
        }
        return reportManager.getReports();
    }

    public static insertReport(formResponse: GoogleAppsScript.Forms.FormResponse): ReportPostResult {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return;
        }
        let table = DataManagerOperator.getTable();
        if (!table) {
            return null;
        }
        var report = reportManager.createReport(formResponse, table);
        if (report == null) {
            // レポート生成に失敗
            return new ReportPostResult(null, "Reportの生成に失敗");
        }

        // ここでチェックを入れる
        var targetMusicData = table.getMusicDataById(report.musicId);
        if (targetMusicData.getVerified(Utility.toDifficulty(report.difficulty))) {
            return new ReportPostResult(report, "既に検証済みの楽曲");
        }

        var diff = report.afterOp - report.beforeOp;
        if (diff <= 0 || diff > 100) {
            return new ReportPostResult(report, "OP変動値が範囲外");
        }

        reportManager.insertReport(report);
        return new ReportPostResult(report);
    }

    public static approve(reportId: string): void {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return;
        }
        reportManager.approve(reportId);
    }

    public static reject(reportId: string): void {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return;
        }
        reportManager.reject(reportId);
    }

    public static getReportGroup(groupId: string): ReportGroup {
        let reportGroupMap = this.getReportGroupMap();
        if (!reportGroupMap) {
            return null;
        }
        return reportGroupMap[groupId] || null;
    }

    public static getReportGroups(): ReportGroup[] {
        if (this.reportGroups) {
            return this.reportGroups;
        }

        let reportGroupMap = this.getReportGroupMap();
        this.reportGroups = [];
        for (let groupId in reportGroupMap) {
            this.reportGroups.push(reportGroupMap[groupId]);
        }
        return this.reportGroups;
    }
}