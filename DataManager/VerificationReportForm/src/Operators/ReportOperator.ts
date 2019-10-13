import * as DataManager from "../../DataManager";
import { ReportManager } from "../ReportManager";
import { VersionConfiguration } from "../Configuration";
import { Report, ReportStatus } from "../Report";
import { Operator } from "./Operator";
import { ReportGroup } from "../ReportGroup";
import { DataManagerOperator } from "./DataManagerOperator";

export class ReportOperator {
    private static reportManager: ReportManager = null;
    private static reportGroupMap: { [groupId: string]: ReportGroup } = null;
    private static reportGroups: ReportGroup[] = null;

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

    public static insertReport(formResponse: GoogleAppsScript.Forms.FormResponse): Report {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return;
        }
        let table = DataManagerOperator.getTable();
        if (!table) {
            return null;
        }
        return reportManager.insertReport(formResponse, table);
    }

    public static updateStatus(reportId: string, reportStatus: ReportStatus): void {
        let reportManager = this.getReportManager();
        if (!reportManager) {
            return;
        }
        reportManager.updateStatus(reportId, reportStatus);
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