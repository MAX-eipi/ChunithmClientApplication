import * as DataManager from "../DataManager";
import { VersionConfiguration } from "./Configuration";
import { Report, ReportStatus } from "./Report";
import { Utility } from "./Utility";

export interface ReportGroupMusic {
    musicId: number;
    difficulty: DataManager.Difficulty;
}

export class ReportGroup {
    public static instantiateByConfiguration(config: VersionConfiguration): ReportGroup[] {
        let reportGroupMap = this.instantiateMapByConfiguration(config);
        let reportGroupList: ReportGroup[] = [];
        for (let groupId in reportGroupMap) {
            reportGroupList.push(reportGroupMap[groupId]);
        }
        return reportGroupList;
    }

    public static instantiateMapByConfiguration(config: VersionConfiguration): { [key: string]: ReportGroup } {
        let reportGroupMap: { [key: string]: ReportGroup; } = {};
        let sheet = this.getReportGroupSheet(config);
        let table = sheet.getDataRange().getValues();
        for (var i = 1; i < table.length; i++) {
            let row = table[i];
            let groupId = row[0].toString();
            let musicId = row[1] as number;
            let difficulty = Utility.toDifficulty(row[2] as string);
            if (!reportGroupMap[groupId]) {
                reportGroupMap[groupId] = new ReportGroup(groupId);
            }
            reportGroupMap[groupId].add({
                musicId: musicId,
                difficulty: difficulty,
            });
        }
        return reportGroupMap;
    }

    private static getReportGroupSheet(config: VersionConfiguration): GoogleAppsScript.Spreadsheet.Sheet {
        let spreadsheetId = config.getProperty<string>("report_sheet_id");
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet is invalid. spreadsheetId: ${spreadsheetId}`);
        }
        let sheet = spreadsheet.getSheetByName("ReportGroup");
        if (!sheet) {
            throw new Error('ReportGroup sheet is invalid');
        }
        return sheet;
    }

    private groupId: string;
    private musics: ReportGroupMusic[];
    private verified: boolean;
    private boundReports: { music: ReportGroupMusic, report: Report }[];

    private constructor(groupId: string) {
        this.groupId = groupId;
        this.musics = [];
        this.verified = false;
        this.boundReports = [];
    }

    private add(music: ReportGroupMusic): void {
        this.musics.push(music);
    }

    public getGroupId(): string {
        return this.groupId;
    }

    public getMusics(): ReportGroupMusic[] {
        return this.musics;
    }

    public getVerified(): boolean {
        return this.verified;
    }

    public setReports(reports: Report[]): void {
        let map: { [key: string]: Report } = {};
        for (var i = 0; i < reports.length; i++) {
            let report = reports[i];
            let musicId = report.getMusicId();
            let diificulty = report.getDifficulty();
            let key = `${musicId}:${diificulty}`;
            map[key] = report;
        }

        this.boundReports.length = 0;
        var verified = true;
        for (var i = 0; i < this.musics.length; i++) {
            let music = this.musics[i];
            let musicId = music.musicId;
            let difficulty = music.difficulty;
            let key = `${musicId}:${Utility.toDifficultyText(difficulty)}`;
            let report = map[key];
            if (report && report.getReportStatus() != ReportStatus.Rejected) {
                this.boundReports.push({
                    music: music,
                    report: report,
                });

                if (report.getReportStatus() == ReportStatus.InProgress) {
                    verified = false;
                }
            } else {
                this.boundReports.push({
                    music: music,
                    report: null,
                });
                verified = false;
            }
        }
        this.verified = verified;
    }

    public getBoundReports(): { music: ReportGroupMusic, report: Report }[] {
        return this.boundReports;
    }
}
