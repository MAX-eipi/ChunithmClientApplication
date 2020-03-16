import { Difficulty } from "../../MusicDataTable/Difficulty";
import { Report, ReportStatus } from "./Report";
import { ReportSheet } from "./ReportSheet";

export interface ReportGroupUnitParameter {
    musicId: number;
    difficulty: Difficulty
}

export class LinkedReportGroupUnit {
    private _parameter: ReportGroupUnitParameter;
    public get parameter(): ReportGroupUnitParameter { return this._parameter; }

    private _report: Report;
    public get report(): Report { return this._report; };

    public constructor(parameter: ReportGroupUnitParameter, report: Report) {
        this._parameter = parameter;
        this._report = report;
    }
}

export class ReportGroup {
    private _groupId: string;
    private _units: LinkedReportGroupUnit[];
    private _verified: boolean = false;

    public constructor(groupId: string, parameters: ReportGroupUnitParameter[], reportSheet: ReportSheet) {
        this._groupId = groupId;
        this._units = this.getUntis(parameters, reportSheet);
        this._verified = this._units.every(u => u.report && u.report.reportStatus == ReportStatus.Resolved);
    }

    public get groupId(): string { return this._groupId; }
    public get units(): LinkedReportGroupUnit[] { return this._units; }
    public get verified(): boolean { return this._verified; }

    private getUntis(parameters: ReportGroupUnitParameter[], reportSheet: ReportSheet): LinkedReportGroupUnit[] {
        return parameters.map(p => new LinkedReportGroupUnit(p, this.getTypicalReport(p, reportSheet)));
    }

    private getTypicalReport(parameter: ReportGroupUnitParameter, reportSheet: ReportSheet): Report {
        let reports = this.getTargetReports(parameter, reportSheet);
        if (reports.length == 0) {
            return null;
        }
        var ret = this.findResolvedReport(reports);
        if (!ret) {
            ret = reports[reports.length - 1];
        }
        return ret;
    }

    private findResolvedReport(reports: Report[]): Report {
        for (let report of reports) {
            if (report.reportStatus == ReportStatus.Resolved) {
                return report;
            }
        }
        return null;
    }

    private getTargetReports(parameter: ReportGroupUnitParameter, reportSheet: ReportSheet): Report[] {
        return reportSheet.reports
            .filter(r => r.musicId == parameter.musicId && r.difficulty == parameter.difficulty && r.reportStatus != ReportStatus.Rejected);
    }
}